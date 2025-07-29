import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi, getOrderByNumberApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderState = {
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  orderRequest: boolean;
  isLoadingUserOrders: boolean;
  isLoadingOrderInfo: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  userOrders: [],
  currentOrder: null,
  orderRequest: false,
  isLoadingUserOrders: false,
  isLoadingOrderInfo: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrdersApi();
      return data;
    } catch (error: any) {
      const message = error?.message || 'Ошибка загрузки заказов пользователя';
      return rejectWithValue(message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (error: any) {
      const message = error?.message || 'Ошибка при создании заказа';
      return rejectWithValue(message);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      if (!response.orders.length) {
        throw new Error('Заказ не найден');
      }
      return response.orders[0];
    } catch (error: any) {
      const message = error?.message || 'Ошибка при получении заказа';
      return rejectWithValue(message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    }
  },
  selectors: {
    userOrders: (state) => state.userOrders,
    currentOrder: (state) => state.currentOrder,
    orderRequest: (state) => state.orderRequest,
    isLoadingUserOrders: (state) => state.isLoadingUserOrders,
    isLoadingOrderInfo: (state) => state.isLoadingOrderInfo,
    error: (state) => state.error
  },
  extraReducers(builder) {
    builder
      // USER ORDERS
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoadingUserOrders = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoadingUserOrders = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoadingUserOrders = false;
        state.error = action.payload as string;
      })
      // CREATE ORDER
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      })
      // FETCH ORDER BY NUMBER
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoadingOrderInfo = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoadingOrderInfo = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoadingOrderInfo = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
export const {
  userOrders,
  currentOrder,
  orderRequest,
  isLoadingUserOrders,
  isLoadingOrderInfo,
  error
} = orderSlice.selectors;
