import { createContext } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  uid: null,
  token: null,
  login: () => {},
  logout: () => {}
});

export default AuthContext;
