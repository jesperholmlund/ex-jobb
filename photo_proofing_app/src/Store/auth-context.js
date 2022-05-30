import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  tokenTimeOver: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  //Sätter state till token från localStorage
  //Detta håller en inloggad även vid refresh och dylikt
  const [token, setToken] = useState(localStorage.getItem("token"));
  const isLoggedIn = !!token;
  const [tokenTimeOver, setTokenTimeOver] = useState(false);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
  };
  const tokenTimeout = () => {
    setTokenTimeOver(true);
    logout();
  };

  const login = (token) => {
    setTokenTimeOver(false);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expiryTime", Date.now() + 3600000); //1 timme
    setTimeout(tokenTimeout, localStorage.getItem("expiryTime") - Date.now()); //Logout om token är över en timme gammal
  };

  const contextValue = {
    token: token,
    isLoggedIn: isLoggedIn,
    login: login,
    logout: logout,
    tokenTimeout: tokenTimeout,
    tokenTimeOver: tokenTimeOver,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
