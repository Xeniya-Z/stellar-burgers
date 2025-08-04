import { userReducer, initialState } from './userSlice';
import {
  registerUserThunk,
  loginUserThunk,
  logoutThunk,
  updateUserThunk,
  getUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk
} from './userThunks';

const mockRegisterData = {
  email: 'test@test.ru',
  name: 'test',
  password: 'test1234'
};

const mockUserData = {
  email: 'test@test.ru',
  name: 'test'
};

const mockLoginData = {
  email: 'test@test.ru',
  password: 'test1234'
};

describe('userSlice reducer', () => {
  // ===== REGISTER =====
  describe('отправка запроса на регистрацию: registerUser', () => {
    test('pending: устанавливает isLoading в true', () => {
      const state = userReducer(
        initialState,
        registerUserThunk.pending('RequestId', mockRegisterData)
      );

      expect(state).toEqual({
        user: null,
        isInit: false,
        isAuthenticated: false,
        isLoading: true,
        error: null
      });
    });

    test('fulfilled: сохраняет пользователя и обновляет флаги', () => {
      const state = userReducer(
        initialState,
        registerUserThunk.fulfilled(mockUserData, 'RequestId', mockRegisterData)
      );

      expect(state).toEqual({
        user: mockUserData,
        isInit: true,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    });

    test('rejected: устанавливает ошибку и сбрасывает isLoading', () => {
      const error = new Error('errorMessage');

      const state = userReducer(
        initialState,
        registerUserThunk.rejected(
          error,
          'RequestId',
          mockRegisterData,
          error.message
        )
      );

      expect(state).toEqual({
        user: null,
        isInit: true,
        isAuthenticated: false,
        isLoading: false,
        error: error.message
      });
    });
  });

  // ===== LOGIN =====
  describe('отправка запроса на авторизацию: loginUser', () => {
    test('pending: устанавливает isLoading в true', () => {
      const state = userReducer(
        initialState,
        loginUserThunk.pending('RequestId', mockLoginData)
      );

      expect(state).toEqual({
        user: null,
        isInit: false,
        isAuthenticated: false,
        isLoading: true,
        error: null
      });
    });

    test('fulfilled: сохраняет пользователя и обновляет флаги', () => {
      const state = userReducer(
        initialState,
        loginUserThunk.fulfilled(mockUserData, 'RequestId', mockLoginData)
      );

      expect(state).toEqual({
        user: mockUserData,
        isInit: true,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    });

    test('rejected: устанавливает ошибку и сбрасывает isLoading', () => {
      const error = new Error('errorMessage');

      const state = userReducer(
        initialState,
        loginUserThunk.rejected(
          error,
          'RequestId',
          mockLoginData,
          error.message
        )
      );

      expect(state).toEqual({
        user: null,
        isInit: true,
        isAuthenticated: false,
        isLoading: false,
        error: error.message
      });
    });
  });

  // ===== LOGOUT =====
  describe('отправка запроса на выход из системы: logoutUser', () => {
    const loggedInState = {
      ...initialState,
      user: mockUserData,
      isInit: false,
      isAuthenticated: true,
      isLoading: false,
      error: null
    };

    test('fulfilled: очищает данные пользователя и обновляет флаги', () => {
      const state = userReducer(
        loggedInState,
        logoutThunk.fulfilled(undefined, 'RequestId')
      );

      expect(state).toEqual({
        user: null,
        isInit: true,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    });

    test('rejected: устанавливает ошибку и сбрасывает isLoading', () => {
      const error = new Error('errorMessage');

      const state = userReducer(
        loggedInState,
        logoutThunk.rejected(error, 'RequestId', undefined, error.message)
      );

      expect(state).toEqual({
        user: mockUserData,
        isInit: false,
        isAuthenticated: true,
        isLoading: false,
        error: error.message
      });
    });
  });

  // ===== GET USER =====
  describe('отправка запроса на получение данных пользователя: getUser', () => {
    test('pending: устанавливает isLoading в true', () => {
      const state = userReducer(
        initialState,
        getUserThunk.pending('RequestId')
      );

      expect(state).toEqual({
        user: null,
        isInit: false,
        isAuthenticated: false,
        isLoading: true,
        error: null
      });
    });

    test('fulfilled: сохраняет пользователя и обновляет флаги', () => {
      const state = userReducer(
        initialState,
        getUserThunk.fulfilled(mockUserData, 'RequestId')
      );

      expect(state).toEqual({
        user: mockUserData,
        isInit: true,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    });

    test('rejected: сохраняет ошибку и сбрасывает isLoading', () => {
      const error = new Error('errorMessage');

      const state = userReducer(
        initialState,
        getUserThunk.rejected(error, 'RequestId', undefined, error.message)
      );

      expect(state).toEqual({
        user: null,
        isInit: true,
        isAuthenticated: false,
        isLoading: false,
        error: error.message
      });
    });
  });

  // ===== UPDATE USER =====
  describe('отправка запроса на обновление данных пользователя: updateUser', () => {
    const prevUserState = {
      ...initialState,
      user: mockUserData,
      isInit: false,
      isAuthenticated: true,
      isLoading: false,
      error: null
    };

    test('pending: устанавливает isLoading в true', () => {
      const state = userReducer(
        prevUserState,
        updateUserThunk.pending('RequestId', mockRegisterData)
      );

      expect(state).toEqual({
        user: mockUserData,
        isInit: false,
        isAuthenticated: true,
        isLoading: true,
        error: null
      });
    });

    test('fulfilled: обновляет пользователя и сбрасывает isLoading', () => {
      const newUserData = {
        email: 'test@test.ru',
        name: 'testNew'
      };

      const state = userReducer(
        prevUserState,
        updateUserThunk.fulfilled(newUserData, 'RequestId', mockRegisterData)
      );

      expect(state).toEqual({
        user: newUserData,
        isInit: false,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    });

    test('rejected: сохраняет ошибку и сбрасывает isLoading', () => {
      const error = new Error('errorMessage');

      const state = userReducer(
        prevUserState,
        updateUserThunk.rejected(
          error,
          'RequestId',
          mockRegisterData,
          error.message
        )
      );

      expect(state).toEqual({
        user: mockUserData,
        isInit: false,
        isAuthenticated: true,
        isLoading: false,
        error: error.message
      });
    });
  });

  // ===== FORGOT PASSWORD =====
  describe('отправка запроса на восстановление пароля: forgotPassword', () => {
    const mockUserEmail = {
      email: 'test@test.ru'
    };

    test('pending: устанавливает isLoading в true', () => {
      const state = userReducer(
        initialState,
        forgotPasswordThunk.pending('RequestId', mockUserEmail)
      );

      expect(state).toEqual({
        user: null,
        isInit: false,
        isAuthenticated: false,
        isLoading: true,
        error: null
      });
    });

    test('fulfilled: успешно возвращает { success: true } при корректном email', () => {
      const mockResponse = { success: true };

      const state = userReducer(
        initialState,
        forgotPasswordThunk.fulfilled(mockResponse, 'RequestId', mockUserEmail)
      );

      expect(state).toEqual({
        user: null,
        isInit: false,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    });

    test('rejected: сохраняет ошибку и сбрасывает isLoading', () => {
      const error = new Error('errorMessage');

      const state = userReducer(
        initialState,
        forgotPasswordThunk.rejected(
          error,
          'RequestId',
          mockUserEmail,
          error.message
        )
      );

      expect(state).toEqual({
        user: null,
        isInit: false,
        isAuthenticated: false,
        isLoading: false,
        error: error.message
      });
    });
  });

  // ===== RESET PASSWORD =====
  describe('отправка запроса на сброс пароля: resetPassword', () => {
    const mockRequestArgs = {
      password: 'newPassword123',
      token: 'reset-token-123'
    };

    test('pending: устанавливает isLoading в true', () => {
      const state = userReducer(
        initialState,
        resetPasswordThunk.pending('RequestId', mockRequestArgs)
      );

      expect(state).toEqual({
        user: null,
        isInit: false,
        isAuthenticated: false,
        isLoading: true,
        error: null
      });
    });

    test('fulfilled: успешно возвращает { success: true } при корректном пароле и токене', () => {
      const mockResponse = { success: true };

      const state = userReducer(
        initialState,
        resetPasswordThunk.fulfilled(mockResponse, 'RequestId', mockRequestArgs)
      );

      expect(state).toEqual({
        user: null,
        isInit: false,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    });

    test('rejected: сохраняет ошибку и сбрасывает isLoading', () => {
      const error = new Error('errorMessage');

      const state = userReducer(
        initialState,
        resetPasswordThunk.rejected(
          error,
          'RequestId',
          mockRequestArgs,
          error.message
        )
      );

      expect(state).toEqual({
        user: null,
        isInit: false,
        isAuthenticated: false,
        isLoading: false,
        error: error.message
      });
    });
  });
});
