import {
  burgerConstructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './burgerConstructorSlice';
import { TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const main: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const sauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0943',
  name: 'Соус фирменный Space Sauce',
  type: 'sauce',
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  price: 80,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
};

describe('burgerConstructorReducer', () => {
  describe('добавление ингредиентов: addIngredient', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };

    test('добавление булки', () => {
      const newState = burgerConstructorReducer(
        initialState,
        addIngredient(bun)
      );
      expect(newState).toEqual({
        bun: expect.objectContaining(bun),
        ingredients: []
      });
    });

    test('добавление основного ингредиента', () => {
      const newState = burgerConstructorReducer(
        initialState,
        addIngredient(main)
      );
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(expect.objectContaining(main));
      expect(newState.bun).toBeNull();
    });

    test('добавление соуса', () => {
      const newState = burgerConstructorReducer(
        initialState,
        addIngredient(sauce)
      );
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(expect.objectContaining(sauce));
      expect(newState.bun).toBeNull();
    });
  });

  describe('удаление ингредиента: removeIngredient', () => {
    test('удаление ингредиента по id', () => {
      const initialState = {
        bun: bun,
        ingredients: [
          { ...main, id: 'main-id' },
          { ...sauce, id: 'sauce-id' }
        ]
      };

      const newState = burgerConstructorReducer(
        initialState,
        removeIngredient('main-id')
      );

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(expect.objectContaining(sauce));
    });

    test('удаление ингредиента из пустого конструктора: состояние не меняется', () => {
      const initialState = {
        bun: null,
        ingredients: []
      };

      const newState = burgerConstructorReducer(
        initialState,
        removeIngredient('main-id')
      );

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toEqual(initialState.ingredients);
    });

    test('удаление ингредиента по несуществующему id: состояние не меняется', () => {
      const initialState = {
        bun: bun,
        ingredients: [
          { ...main, id: 'main-id' },
          { ...sauce, id: 'sauce-id' }
        ]
      };

      const newState = burgerConstructorReducer(
        initialState,
        removeIngredient('invalid-id')
      );

      expect(newState.ingredients).toEqual(initialState.ingredients);
    });
  });

  describe('изменение порядка ингредиентов: moveIngredient', () => {
    const initialState = {
      bun: bun,
      ingredients: [
        { ...main, id: 'main-1' },
        { ...main, id: 'main-2' },
        { ...sauce, id: 'sauce-id' }
      ]
    };

    test('передвинуть вверх', () => {
      const newState = burgerConstructorReducer(
        initialState,
        moveIngredient({ fromIndex: 2, toIndex: 1 })
      );

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0]).toEqual({ ...main, id: 'main-1' });
      expect(newState.ingredients[1]).toEqual({ ...sauce, id: 'sauce-id' });
      expect(newState.ingredients[2]).toEqual({ ...main, id: 'main-2' });
      expect(newState.bun).toEqual(bun);
    });

    test('передвинуть вниз', () => {
      const newState = burgerConstructorReducer(
        initialState,
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0]).toEqual({ ...main, id: 'main-2' });
      expect(newState.ingredients[1]).toEqual({ ...main, id: 'main-1' });
      expect(newState.ingredients[2]).toEqual({ ...sauce, id: 'sauce-id' });
      expect(newState.bun).toEqual(bun);
    });

    test('перемещение с индексами вне границ массива не изменяет порядок', () => {
      const newState = burgerConstructorReducer(
        initialState,
        moveIngredient({ fromIndex: -1, toIndex: 10 })
      );

      expect(newState.ingredients).toEqual(initialState.ingredients);
      expect(newState.bun).toEqual(bun);
    });
  });

  test('очистка конструктора: clearConstructor', () => {
    const initialState = {
      bun: bun,
      ingredients: [
        { ...main, id: 'main-id' },
        { ...sauce, id: 'sauce-id' }
      ]
    };

    const newState = burgerConstructorReducer(initialState, clearConstructor());

    expect(newState.ingredients).toHaveLength(0);
    expect(newState.bun).toBeNull();
  });
});
