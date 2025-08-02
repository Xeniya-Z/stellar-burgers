import userMock from '../fixtures/user.json';
import orderMock from '../fixtures/order.json';

describe('Добавление ингредиента из списка в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Добавляет булку и начинку в конструктор', () => {
    // Проверяем, что в списке ингредиентов есть булки, начинки, соусы
    cy.get('[data-cy="ingredient-bun"]').should('have.length.at.least', 1);
    cy.get('[data-cy="ingredient-main"]').should('have.length.at.least', 1);
    cy.get('[data-cy="ingredient-sauce"]').should('have.length.at.least', 1);

    // Кликаем по кнопкам "Добавить" для булки и начинки
    cy.get('[data-cy="ingredient-bun"]').first().contains('Добавить').click();
    cy.get('[data-cy="ingredient-main"]').first().contains('Добавить').click();

    // Проверяем, что булки и начинка добавились в конструктор
    cy.get('[data-cy="constructor-ingredient-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-ingredient-bun-bottom"]').should('exist');
    cy.get('[data-cy="constructor-ingredient-main"]').should('have.length', 1);
  });
});

describe('Работа модальных окон', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients' }).as(
      'getIngredients'
    );
    cy.wait('@getIngredients');
  });

  it('Открывает модальное окно с описанием ингридиента', () => {
    // Кликаем на первый ингредиент, чтобы открыть модальное окно
    cy.get('[data-cy="ingredient-bun"]').first().click();

    // Проверяем, что модалка открылась и содержит правильное название
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal"]').contains('Краторная булка N-200i');
  });

  it('Закрывает модальное окно по кнопке', () => {
    // Открываем модалку
    cy.get('[data-cy="ingredient-bun"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');

    // Кликаем по кнопке закрытия модалки и проверяем что она закрылась
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Закрывает модальное окно по клику на оверлей', () => {
    // Открываем модалку
    cy.get('[data-cy="ingredient-bun"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');

    // Кликаем по оверлею и проверяем что модалка закрылась
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'TEST_ACCESS_TOKEN');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'TEST_REFRESH_TOKEN');
    });

    cy.intercept('GET', '/api/auth/user', userMock).as('getUser');
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients' }).as(
      'getIngredients'
    );
    cy.intercept('POST', '/api/orders', orderMock).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  it('Собирает бургер, оформляет заказ и проверяет номер заказа', () => {
    // Добавляем булку и начинку в конструктор
    cy.get('[data-cy="ingredient-bun"]').first().contains('Добавить').click();
    cy.get('[data-cy="ingredient-main"]').first().contains('Добавить').click();

    // Кликаем на кнопку оформления заказа
    cy.get('button').contains('Оформить заказ').should('be.enabled').click();

    // Проверяем, что открылось модальное окно с номером заказа
    cy.get('[data-cy="modal"]').should('be.visible');

    // Ждем успешного ответа на запрос создания заказа
    cy.wait('@createOrder');

    // Проверяем, что номер заказа соответствует моковым данным
    cy.fixture('order.json').then((order) => {
      cy.get('[data-cy="order-number"]').should(
        'contain.text',
        order.order.number
      );
    });

    // Закрываем модальное окно
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // Проверяем, что конструктор очистился после оформления заказа
    cy.get('[data-cy="constructor-ingredient-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-ingredient-bun-bottom"]').should('not.exist');
    cy.get('[data-cy="constructor-ingredient-main"]').should('not.exist');
  });
});
