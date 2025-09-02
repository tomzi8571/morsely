import {HeaderMenu} from "./HeaderMenu.jsx";
import {ThemeMenu} from "./ThemeMenu.jsx";
import PropTypes from 'prop-types';

export function SettingsMenu({onSettingSelect, show = "icon"}) {
    const getVersion = () => `Version: ${import.meta.env.VITE_APP_VERSION || ''}`;

    const settings = [
        {label: <ThemeMenu/>, value: "theme"},
        {label: "About", value: "about"},
        {label: getVersion(), value: "version", disabled: true}
    ];

    function getOnClick(value) {
        return () => onSettingSelect && onSettingSelect(value);
    }

    // Classic cog SVG icon for settings
    const SettingsIcon = (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
            <circle cx="12" cy="12" r="3" strokeWidth="2"/>
            <path strokeWidth="2" strokeLinecap="round"
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
    );

    return (
        <HeaderMenu
            summaryLabel="Settings"
            summaryAriaLabel="Settings"
            summaryIcon={<SettingsIcon/>}
            defaultOpen={false}
            show={show}
            refocusOnClose={false}
            dropUp={true} // Render menu above trigger when in footer
        >
            {settings.map((item, idx) => (
                <button
                    type="button"
                    key={item.value}
                    onClick={getOnClick(item.value)}
                >
                    {item.label}
                </button>
            ))}
        </HeaderMenu>
    );
}

SettingsMenu.propTypes = {
    onSettingSelect: PropTypes.func,
    show: PropTypes.oneOf(['icon', 'label', 'icon_label']),
};
