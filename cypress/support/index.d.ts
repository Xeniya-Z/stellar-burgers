declare global {
  namespace Cypress {
    interface Chainable {
      // Загрузка ингредиентов и  ожидание завершения запроса
      loadIngredients(): Chainable<void>;

      // Добавление ингредиента в конструктор
      addIngredient(type: 'bun' | 'main' | 'sauce'): Chainable<void>;

      // Открытие модального окна ингредиента
      openIngredientModal(type: 'bun' | 'main' | 'sauce'): Chainable<void>;

      // Закрытие модального окна по кнопке
      closeModal(): Chainable<void>;

      // Закрытие модального окна по клику на оверлей
      closeModalByOverlay(): Chainable<void>;
    }
  }
}

export {};
