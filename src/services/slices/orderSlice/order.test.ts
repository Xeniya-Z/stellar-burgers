import {
  orderReducer,
  fetchUserOrders,
  createOrder,
  fetchOrderByNumber,
  initialState
} from './orderSlice';

const mockOrder = {
  createdAt: '2025-07-30T16:23:53.476Z',
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093c'
  ],
  name: 'Краторный space био-марсианский бургер',
  number: 85400,
  owner: {
    name: 'test1234',
    email: 'test@te.kz',
    createdAt: '2025-07-09T15:07:54.517Z',
    updatedAt: '2025-07-12T16:58:09.581Z'
  },
  price: 2934,
  status: 'done',
  updatedAt: '2025-07-30T16:23:54.236Z',
  _id: '688a4719d5ca30001cffc9d4'
};

describe('orderSlice reducer', () => {
  describe('отправка запроса на получение заказов пользователя: fetchUserOrders', () => {
    test('pending: устанавливает isLoadingUserOrders в true', () => {
      const state = orderReducer(
        initialState,
        fetchUserOrders.pending('RequestId')
      );

      expect(state).toEqual({
        userOrders: [],
        currentOrder: null,
        orderRequest: false,
        isLoadingUserOrders: true,
        isLoadingOrderInfo: false,
        error: null
      });
    });

    test('fulfilled: сохраняет заказы пользователя', () => {
      const state = orderReducer(
        initialState,
        fetchUserOrders.fulfilled([mockOrder], 'RequestId')
      );

      expect(state).toEqual({
        userOrders: [mockOrder],
        currentOrder: null,
        orderRequest: false,
        isLoadingUserOrders: false,
        isLoadingOrderInfo: false,
        error: null
      });
    });

    test('rejected: сохраняет ошибку и сбрасывает isLoadingUserOrders', () => {
      const error = new Error('errorMessage');
      const state = orderReducer(
        initialState,
        fetchUserOrders.rejected(error, 'RequestId', undefined, error.message)
      );

      expect(state).toEqual({
        userOrders: [],
        currentOrder: null,
        orderRequest: false,
        isLoadingUserOrders: false,
        isLoadingOrderInfo: false,
        error: error.message
      });
    });
  });

  describe('отправка запроса на создание заказа: createOrder', () => {
    test('pending: устанавливает orderRequest в true', () => {
      const state = orderReducer(
        initialState,
        createOrder.pending('RequestId', mockOrder.ingredients)
      );

      expect(state).toEqual({
        userOrders: [],
        currentOrder: null,
        orderRequest: true,
        isLoadingUserOrders: false,
        isLoadingOrderInfo: false,
        error: null
      });
    });

    test('fulfilled: сохраняет заказ пользователя', () => {
      const state = orderReducer(
        initialState,
        createOrder.fulfilled(mockOrder, 'RequestId', mockOrder.ingredients)
      );

      expect(state).toEqual({
        userOrders: [],
        currentOrder: mockOrder,
        orderRequest: false,
        isLoadingUserOrders: false,
        isLoadingOrderInfo: false,
        error: null
      });
    });

    test('rejected: сохраняет ошибку и сбрасывает orderRequest', () => {
      const error = new Error('errorMessage');

      const state = orderReducer(
        initialState,
        createOrder.rejected(
          error,
          'RequestId',
          mockOrder.ingredients,
          error.message
        )
      );

      expect(state).toEqual({
        userOrders: [],
        currentOrder: null,
        orderRequest: false,
        isLoadingUserOrders: false,
        isLoadingOrderInfo: false,
        error: error.message
      });
    });
  });

  describe('отправка запроса на получение заказа по номеру: fetchOrderByNumber', () => {
    test('pending: устанавливает isLoadingOrderInfo в true', () => {
      const state = orderReducer(
        initialState,
        fetchOrderByNumber.pending('RequestId', mockOrder.number)
      );

      expect(state).toEqual({
        userOrders: [],
        currentOrder: null,
        orderRequest: false,
        isLoadingUserOrders: false,
        isLoadingOrderInfo: true,
        error: null
      });
    });

    test('fulfilled: сохраняет заказ по номеру', () => {
      const state = orderReducer(
        initialState,
        fetchOrderByNumber.fulfilled(mockOrder, 'RequestId', mockOrder.number)
      );

      expect(state).toEqual({
        userOrders: [],
        currentOrder: mockOrder,
        orderRequest: false,
        isLoadingUserOrders: false,
        isLoadingOrderInfo: false,
        error: null
      });
    });

    test('rejected: сохраняет ошибку и сбрасывает isLoadingOrderInfo', () => {
      const error = new Error('errorMessage');

      const state = orderReducer(
        initialState,
        fetchOrderByNumber.rejected(
          error,
          'RequestId',
          mockOrder.number,
          error.message
        )
      );

      expect(state).toEqual({
        userOrders: [],
        currentOrder: null,
        orderRequest: false,
        isLoadingUserOrders: false,
        isLoadingOrderInfo: false,
        error: error.message
      });
    });
  });
});
