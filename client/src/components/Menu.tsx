import React, { FC } from 'react';
import './App.css';

interface MenuProps {
  setOpen: (open: boolean) => void;
}

const COOKIE_SELECTED_LANG = 'selectedLang';

const Menu: FC<MenuProps> = ({ setOpen }) => {
  return (
    <nav className='navbar'>
      <ul className='navbar-list'>
        <li key='main' className='navbar-item'>
          <a href='/' className='navbar-link'>
            <i className='fas fa-cat navbar-icon'></i>
            <span className='navbar-text'>Main</span>
          </a>
        </li>
        <li key='properties' className='navbar-item'>
          <a href='/languages' className='navbar-link'>
            <i className='fas fa-puzzle-piece navbar-icon'></i>
            <span className='navbar-text'>Properties</span>
          </a>
        </li>
        <li key='languages' className='navbar-item'>
          <a onClick={() => setOpen(true)} className='navbar-link'>
            <i className='fas fa-globe-europe'></i>
            <span className='navbar-text'>Language</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
