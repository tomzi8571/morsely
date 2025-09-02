import {HeaderMenu} from "./HeaderMenu.jsx";
import PropTypes from 'prop-types';

export function SessionMenu({examples, onSelectSession, show = "icon"}) {
    function getOnClick(idx) {
        return () => onSelectSession(idx);
    }

    const MenuIcon = (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
            <path strokeWidth="2" strokeLinecap="round" d="M4 5h18M4 12h18M4 19h18"/>
        </svg>
    );

    return <HeaderMenu
        summaryLabel="Menu"
        summaryAriaLabel="Menu"
        summaryIcon={<MenuIcon/>}
        show={show}
    >
        {Object.entries(examples).map((session, idx) => (
            <button
                type="button"
                key={idx}
                onClick={getOnClick(idx)}
            >
                {session[1].description}
            </button>
        ))}
    </HeaderMenu>
}

SessionMenu.propTypes = {
    examples: PropTypes.object.isRequired,
    onSelectSession: PropTypes.func.isRequired,
    show: PropTypes.oneOf(['icon', 'label', 'icon_label']),
};
