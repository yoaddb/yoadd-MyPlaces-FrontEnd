import { useState, useEffect, useCallback } from "react";
let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState();
  const [uid, setUid] = useState();
  const [tokenExpDate, setTokenExpDate] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUid(uid);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // current time + 1h

    setTokenExpDate(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() // expiration date is in the future means token is still valid
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpDate(null);
    setUid(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpDate) {
      const remainingTime = tokenExpDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpDate]);

  return { token, login, logout, uid };
};
