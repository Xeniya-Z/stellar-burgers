import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  getUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData
} from '@api';
import { storeTokens, clearTokens } from '../../../utils/auth';

export const registerUserThunk = createAsyncThunk(
  'users/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      storeTokens(response.refreshToken, response.accessToken);

      return response.user;
    } catch (error: any) {
      const message = error?.message || 'Ошибка при регистрации';
      return rejectWithValue(message);
    }
  }
);

export const loginUserThunk = createAsyncThunk(
  'users/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      storeTokens(response.refreshToken, response.accessToken);

      return response.user;
    } catch (error: any) {
      const message = error?.message || 'Ошибка при авторизации';
      return rejectWithValue(message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'users/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      clearTokens();
      return;
    } catch (error: any) {
      const message = error?.message || 'Ошибка при выходе из аккаунта';
      return rejectWithValue(message);
    }
  }
);

export const getUserThunk = createAsyncThunk(
  'users/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: any) {
      const message =
        error?.message || 'Ошибка при получении данных пользователя';
      return rejectWithValue(message);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (error: any) {
      const message =
        error?.message || 'Ошибка при обновлении данных пользователя';
      return rejectWithValue(message);
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'users/forgotPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi(data);
      return response;
    } catch (error: any) {
      const message =
        error?.message || 'Ошибка при запросе восстановления пароля';
      return rejectWithValue(message);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'users/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordApi(data);
      return response;
    } catch (error: any) {
      const message = error?.message || 'Ошибка при сбросе пароля';
      return rejectWithValue(message);
    }
  }
);
