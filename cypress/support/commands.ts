import {
  INGREDIENT_BUN,
  INGREDIENT_MAIN,
  INGREDIENT_SAUCE,
  MODAL,
  MODAL_CLOSE_BUTTON,
  MODAL_OVERLAY
} from './selectors';

const ingredientsSelectors = {
  bun: INGREDIENT_BUN,
  main: INGREDIENT_MAIN,
  sauce: INGREDIENT_SAUCE
};

// Загрузка ингредиентов и  ожидание завершения запроса
Cypress.Commands.add('loadIngredients', () => {
  cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients' }).as(
    'getIngredients'
  );
  cy.visit('/');
  cy.wait('@getIngredients');
});

// Добавление ингредиента по его типу
Cypress.Commands.add('addIngredient', (type: 'bun' | 'main' | 'sauce') => {
  cy.get(ingredientsSelectors[type]).first().contains('Добавить').click();
});

// Открытие модалки ингредиента
Cypress.Commands.add(
  'openIngredientModal',
  (type: 'bun' | 'main' | 'sauce') => {
    cy.get(ingredientsSelectors[type]).first().click();
    cy.get(MODAL).should('be.visible');
  }
);

// Закрытие модалки по кнопке
Cypress.Commands.add('closeModal', () => {
  cy.get(MODAL_CLOSE_BUTTON).click();
  cy.get(MODAL).should('not.exist');
});

// Закрытие модального окна по клику на оверлей
Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get(MODAL_OVERLAY).click({ force: true });
  cy.get(MODAL).should('not.exist');
});
