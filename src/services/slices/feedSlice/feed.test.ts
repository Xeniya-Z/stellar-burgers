import { feedReducer, fetchFeed, initialState } from './feedSlice';

export const mockFeedResponse = {
  success: true,
  orders: [
    {
      _id: '688bb2a4d5ca30001cffccd2',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Традиционный-галактический бургер',
      createdAt: '2025-07-31T18:15:00.968Z',
      updatedAt: '2025-07-31T18:15:10.000Z',
      number: 12345
    }
  ],
  total: 85130,
  totalToday: 87
};

describe('feedSlice reducer', () => {
  test('pending: устанавливает isLoading в true', () => {
    const state = feedReducer(initialState, fetchFeed.pending('RequestId'));

    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: true,
      error: null
    });
  });

  test('fulfilled: сохраняет заказы и сбрасывает isLoading', () => {
    const state = feedReducer(
      initialState,
      fetchFeed.fulfilled(mockFeedResponse, 'RequestId')
    );

    expect(state).toEqual({
      orders: mockFeedResponse.orders,
      total: mockFeedResponse.total,
      totalToday: mockFeedResponse.totalToday,
      isLoading: false,
      error: null
    });
  });

  test('rejected: сохраняет ошибку и сбрасывает isLoading', () => {
    const error = new Error('errorMessage');

    const state = feedReducer(
      initialState,
      fetchFeed.rejected(error, 'RequestId', undefined, error.message)
    );

    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: error.message
    });
  });
});
