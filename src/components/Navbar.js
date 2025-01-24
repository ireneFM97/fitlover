import React, { useState, useEffect, useRef } from 'react';
import '../assets/styles/Navbar.css';
import logo from '../assets/images/logo.png';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const userMenuRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };

    // Cierra el menú si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (menuRef.current && !menuRef.current.contains(event.target)) &&
                (userMenuRef.current && !userMenuRef.current.contains(event.target))
            ) {
                setMenuOpen(false);
                setUserMenuOpen(false);
            }
        };

        // Agregar el event listener solo cuando el menú está abierto
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup al desmontar
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen, userMenuOpen]);

    return (
        <nav className="navbar">
            <img src={logo} alt="Logo del gimnasio" className="navbar-logo" />

            <div className="navbar-menu-icon" onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </div>

            <ul
                ref={menuRef}
                className={`navbar-links ${menuOpen ? 'navbar-links--active' : ''}`}
            >
                <li className="navbar-link"><a href="/">Home</a></li>
                <li className="navbar-link"><a href="/ejercicios">Ejercicios</a></li>
                <li className="navbar-link"><a href="/rutinas">Rutinas</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
