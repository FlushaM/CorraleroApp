import React from "react";
import "./Header.css";

const Header = ({ logo, user }) => {
  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="header-title">CorraleroApp</h1>
      </div>
      <div className="header-user">
        <p>Bienvenido, <strong>{user}</strong></p>
      </div>
    </header>
  );
};

export default Header;
