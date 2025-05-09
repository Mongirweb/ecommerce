// utils/guestCartCookie.ts
import Cookies from "js-cookie";
export const GUEST_TOKEN_KEY = "guest_token";

export const getGuestToken = () => Cookies.get(GUEST_TOKEN_KEY);
export const setGuestToken = (token) =>
  Cookies.set(GUEST_TOKEN_KEY, token, { expires: 1 }); // 1 day
export const clearGuestToken = () => Cookies.remove(GUEST_TOKEN_KEY);
