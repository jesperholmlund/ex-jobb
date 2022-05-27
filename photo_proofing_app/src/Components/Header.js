import { NavLink } from "react-router-dom";
import Logo from "../Images/logo.png";
import AuthContext from "../Store/auth-context";
import { useContext, useState } from "react";
import LogOutButton from "./LogOutButton";
import Menu from "../Images/menu.svg";

const Header = () => {
  const authContext = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(true);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header>
      <picture>
        <img src={Logo} alt="Logotype" />
      </picture>
      <div id="menuDiv">
        <button onClick={toggleMenu}>
          <img src={Menu} alt="Menu Icon" />
        </button>
      </div>
      {showMenu && (
        <>
          <nav style={{ display: showMenu ? "block" : "none" }}>
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
        </>
      )}
    </header>
  );
};
export default Header;
