import React from "react";
import scss from "./header.module.scss";
import logo from "../../../assets/OIP-removebg-preview.png";
import * as FaIcons from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';

const HeaderModule = ({obtenerSearch}) => {
  const userName = localStorage.getItem('userName'); // Obtiene el nombre de usuario del almacenamiento local
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar el almacenamiento local al hacer logout
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userName');
    
    // Redirigir al usuario a la página de login después del logout
    navigate('/login');
  };

  return (
    <nav className={scss.header}>
      <div className={scss.div_header}>
        <div className={scss.div_logo}>
          <img src={logo} alt="logo" />
        </div> 
        <div className={scss.div_search}>
          <div>
            <FaIcons.FaSearch />
          </div>
          <input
            type="search"
            placeholder={userName ? `Buscar` : 'Buscar'}
             onChange={(e) => obtenerSearch(e.target.value)} // Ajusta esto según tu implementación
          />
        </div>
        <div className={scss.navContainer}>
          <ul className={scss.navList}>
            <li className={scss.listItem}>
              <NavLink className={scss.link} to="/" style={{ textDecoration: 'none' }}>Home</NavLink>
            </li>
            {userName ? (
              <>
                <li className={scss.listItem}>
                  <NavLink className={scss.link} to="/carrito" style={{ textDecoration: 'none' }}>Carrito</NavLink>
                </li>
                <li className={scss.listItem}>
                  <NavLink className={scss.link} to="/historial" style={{ textDecoration: 'none' }}>Historial</NavLink>
                </li>
                <li className={scss.listItem}>
                  <span className={scss.userName}>{`Bienvenido, ${userName}`}</span>
                </li>
                <li className={scss.listItem}>
                  <button className={scss.logoutButton} onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className={scss.listItem}>
                  <NavLink className={scss.link} to="/login" style={{ textDecoration: 'none' }}>Login</NavLink>
                </li>
                <li className={scss.listItem}>
                  <NavLink className={scss.link} to="/register" style={{ textDecoration: 'none' }}>Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
        
        
      </div>
    </nav>
  );
}

export default HeaderModule;
