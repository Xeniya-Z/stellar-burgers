import userMock from '../fixtures/user.json';
import orderMock from '../fixtures/order.json';
import {
  INGREDIENT_BUN,
  INGREDIENT_MAIN,
  INGREDIENT_SAUCE,
  CONSTRUCTOR_BUN_TOP,
  CONSTRUCTOR_BUN_BOTTOM,
  CONSTRUCTOR_MAIN,
  MODAL,
  ORDER_NUMBER
} from '../support/selectors';

// Очистка cookies и localStorage после каждого теста
afterEach(() => {
  cy.clearCookies();
  cy.window().then((win) => win.localStorage.clear());
});

describe('Добавление ингредиента из списка в конструктор', () => {
  beforeEach(() => {
    cy.loadIngredients();
  });

  it('Добавляет булку и начинку в конструктор', () => {
    // Проверяем, что в списке ингредиентов есть булки, начинки, соусы
    cy.get(INGREDIENT_BUN).should('have.length.at.least', 1);
    cy.get(INGREDIENT_MAIN).should('have.length.at.least', 1);
    cy.get(INGREDIENT_SAUCE).should('have.length.at.least', 1);

    // Кликаем по кнопкам "Добавить" для булки и начинки
    cy.addIngredient('bun');
    cy.addIngredient('main');

    // Проверяем, что булки и начинка добавились в конструктор
    cy.get(CONSTRUCTOR_BUN_TOP).should('exist');
    cy.get(CONSTRUCTOR_BUN_BOTTOM).should('exist');
    cy.get(CONSTRUCTOR_MAIN).should('have.length', 1);
  });
});

describe('Работа модальных окон', () => {
  beforeEach(() => {
    cy.loadIngredients();
  });

  it('Открывает модальное окно с описанием ингридиента', () => {
    // Кликаем на первый ингредиент, чтобы открыть модальное окно и проверяем, что модалка открылась
    cy.openIngredientModal('bun');

    // Проверяем, что модалка содержит правильное название
    cy.get(MODAL).contains('Краторная булка N-200i');
  });

  it('Закрывает модальное окно по кнопке', () => {
    // Открываем модалку
    cy.openIngredientModal('bun');

    // Кликаем по кнопке закрытия модалки и проверяем что она закрылась
    cy.closeModal();
  });

  it('Закрывает модальное окно по клику на оверлей', () => {
    // Открываем модалку
    cy.openIngredientModal('bun');

    // Кликаем по оверлею и проверяем что модалка закрылась
    cy.closeModalByOverlay();
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    // Устанавливаем куки и localStorage с токенами
    cy.setCookie('accessToken', 'TEST_ACCESS_TOKEN');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'TEST_REFRESH_TOKEN');
    });

    // Мокаем API-запросы
    cy.intercept('GET', '/api/auth/user', userMock).as('getUser');
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients' }).as(
      'getIngredients'
    );
    cy.intercept('POST', '/api/orders', orderMock).as('createOrder');

    // Загружаем страницу и ждем необходимых запросов
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  it('Собирает бургер, оформляет заказ и проверяет номер заказа', () => {
    // Добавляем булку и начинку в конструктор
    cy.addIngredient('bun');
    cy.addIngredient('main');

    // Кликаем на кнопку оформления заказа
    cy.get('button').contains('Оформить заказ').should('be.enabled').click();

    // Проверяем, что открылось модальное окно с номером заказа
    cy.get(MODAL).should('be.visible');

    // Ждем успешного ответа на запрос создания заказа
    cy.wait('@createOrder');

    // Проверяем, что номер заказа соответствует моковым данным
    cy.fixture('order.json').then((order) => {
      cy.get(ORDER_NUMBER).should('contain.text', order.order.number);
    });

    // Закрываем модальное окно
    cy.closeModal();

    // Проверяем, что конструктор очистился после оформления заказа
    cy.get(CONSTRUCTOR_BUN_TOP).should('not.exist');
    cy.get(CONSTRUCTOR_BUN_BOTTOM).should('not.exist');
    cy.get(CONSTRUCTOR_MAIN).should('not.exist');
  });
});
