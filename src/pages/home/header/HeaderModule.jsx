import React from "react";
import scss from "./header.module.scss";
import logo from "../../../assets/OIP-removebg-preview.png"
import * as FaIcons from "react-icons/fa";
export default function Header({ obtenerSearch }) {
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
              onChange={(e) => obtenerSearch(e.target.value)}
            />
          </div>
        </div>
      </nav>
    );
  }
