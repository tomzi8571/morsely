// ThemeMenu.jsx
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import HeaderMenu from "./HeaderMenu.jsx";

const ThemeIcon = (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
        <path strokeWidth="2" strokeLinecap="round"
              d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95l-1.414 1.414"/>
        <circle cx="12" cy="12" r="4" strokeWidth="2"/>
    </svg>
);

export function ThemeMenu({themes = ['system', 'light', 'dark', 'ocean', 'forest', 'grape']}) {
    const [theme, setTheme] = useState('system');

    // Use LocalStorage to persist the theme choice when page reloades...
    const applyTheme = (value) => {
        setTheme(value);
        localStorage.setItem('theme', value);
        const root = document.documentElement;
        if (value === 'system') {
            root.removeAttribute('data-theme'); // fall back to prefers-color-scheme
        } else {
            root.setAttribute('data-theme', value);
        }
    };

    useEffect(() => {
        let initial = localStorage.getItem('theme') || 'system';
        applyTheme(initial);
    }, []);

    return (
        <HeaderMenu
            summaryLabel="Theme"
            summaryAriaLabel="Theme"
            summaryIcon={<ThemeIcon/>}
            defaultOpen={false}
        >
            {themes.map((theme) => (
                <button
                    type="button"
                    key={theme}
                    onClick={() => applyTheme(theme)}
                >
                    {theme}
                </button>
            ))}
        </HeaderMenu>
    );
}

ThemeMenu.propTypes = {
    themes: PropTypes.arrayOf(PropTypes.string),
};

