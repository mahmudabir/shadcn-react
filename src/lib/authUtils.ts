import { navigateFn } from "@/app/core/api/base-axios.ts";


export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export const USERNAME_KEY = "username";
const PASSWORD_KEY = "password";

const GRANT_TYPE_KEY = "grant_type";

export const TOKEN_CHANGE_EVENT = 'accessTokenChange';

const CLIENT_ID_KEY = "clientId";
const CLIENT_SECRET_KEY = "clientSecret";

const CLIENT_ID = "Softoverse";
const CLIENT_SECRET = "CqrsKit";

export function getLoginFormData(username: string, password: string): FormData {
  const formData = new FormData();
  formData.append(USERNAME_KEY, username);
  formData.append(PASSWORD_KEY, password);
  formData.append(GRANT_TYPE_KEY, PASSWORD_KEY);
  formData.append(CLIENT_ID_KEY, CLIENT_ID);
  formData.append(CLIENT_SECRET_KEY, CLIENT_SECRET);
  return formData;
}

export function getRefreshTokenFormData(refreshToken: string, username?: string): FormData {
  const formData = new FormData();
  formData.append(USERNAME_KEY, username);
  formData.append(GRANT_TYPE_KEY, REFRESH_TOKEN_KEY);
  formData.append(REFRESH_TOKEN_KEY, refreshToken);
  return formData;
}

export function logout() {
  removeAccessToken();
  removeRefreshToken();
  localStorage.removeItem(USERNAME_KEY);

  if (navigateFn) {
    navigateFn("/login");
  } else {
    window.location.href = "/login"; // Fallback
  }
}

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
};

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};


export function setLoginData(accessToken?: string, refreshToken?: string) {
  if (!accessToken || !refreshToken) {
    throw new Error("Invalid login data");
  }
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
}