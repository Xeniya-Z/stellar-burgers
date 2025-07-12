import { setCookie, deleteCookie } from './cookie';

export const storeTokens = (refreshToken: string, accessToken: string) => {
  setCookie('accessToken', accessToken, { expires: 1200 });
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};
