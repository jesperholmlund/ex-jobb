import { useContext, useState, useEffect } from "react";
import AuthContext from "../Store/auth-context";

const LogOutButton = () => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState(localStorage.getItem("email"));

  useEffect(() => {
    if (authContext.login) {
      setEmail(localStorage.getItem("email"));
    }
  }, [email, authContext.login]);
  return (
    <>
      <div>
        <span>{localStorage.getItem("email")}</span>
      </div>
      <div>
        <button
          onClick={() => {
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            authContext.logout();
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default LogOutButton;
