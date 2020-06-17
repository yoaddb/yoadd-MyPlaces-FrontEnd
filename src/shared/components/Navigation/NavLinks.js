import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = () => {
  const { isLoggedIn, logout, uid } = useContext(AuthContext);
  const history = useHistory();

  const onLogoutHandler = () => {
    logout();
    history.push("/auth");
  };

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to={`/${uid}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <button onClick={onLogoutHandler}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
