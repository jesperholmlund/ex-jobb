import { NavLink } from "react-router-dom";
import Logo from "../Images/jpg.png";
import AuthContext from "../Store/auth-context";
import { useContext } from "react";
import LogOutButton from "./LogOutButton";

const Header = () => {
  const authContext = useContext(AuthContext);

  return (
    <header>
      <picture>
        <img src={Logo} alt="Logotype" />
      </picture>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {authContext.isLoggedIn && (
            <li>
              <NavLink to="/Profile">Profile</NavLink>
            </li>
          )}
          {!authContext.isLoggedIn ? ( //Om vi inte är inloggade visa
            <>
              <li>
                <NavLink to="/Login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/Register">Register</NavLink>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
      <div id="loggedInDiv">
        {authContext.isLoggedIn ? <LogOutButton /> : null}
      </div>
    </header>
  );
};
export default Header;
