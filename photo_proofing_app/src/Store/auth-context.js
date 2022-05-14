import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  //Sätter state till token från localStorage
  //Detta håller en inloggad även vid refresh och dylikt
  const [token, setToken] = useState(localStorage.getItem("token"));
  const isLoggedIn = !!token;

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
  };

  const login = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expiryTime", Date.now() + 3600000);
    setTimeout(logout, localStorage.getItem("expiryTime") - Date.now()); //Logout om token är över en timme
  };

  const contextValue = {
    token: token,
    isLoggedIn: isLoggedIn,
    login: login,
    logout: logout,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
