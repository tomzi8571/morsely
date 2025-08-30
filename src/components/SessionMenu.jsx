import HeaderMenu from "./HeaderMenu.jsx";

export function SessionMenu({examples, onSelectSession}) {
    function getOnClick(idx) {
        return () => onSelectSession(idx);
    }

    const MenuIcon = (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
            <path strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
    );

    return <HeaderMenu
        summaryLabel="Menu"
        summaryAriaLabel="Menu"
        summaryIcon={<MenuIcon/>}
        defaultOpen={false}
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