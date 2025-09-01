import React, {useCallback, useEffect, useId, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './HeaderMenu.module.css';

export function HeaderMenu({
                               summaryLabel = 'Menu',
                               defaultOpen = false,
                               onOpenChange,
                               children,
                               summaryProps = {},
                               panelProps = {},
                               closeOnSelect = true, // Close when an item is selected
                               refocusOnClose = true, // Automatically refocus a target on close
                               refocusSelector = '.text-container', // Selector to focus on close (matches your hidden input)
                               summaryIcon,          // Custom icon node provided by parent
                               summaryAriaLabel,     // Optional accessible label override
                               show = "icon_label", // Show icon and/or label "icon", "label, "icon_label"
                           }) {
    const [open, setOpen] = useState(!!defaultOpen);
    const detailsRef = useRef(null);
    const summaryRef = useRef(null);
    const panelId = useId();

    const refocusTarget = useCallback(() => {
        if (!refocusOnClose) return;
        const el = document.querySelector(refocusSelector);
        el?.focus?.({preventScroll: true});
    }, [refocusOnClose, refocusSelector]);

    // Sync with native <details> toggle
    const handleToggle = (e) => {
        const isOpen = e.currentTarget.open;
        setOpen(isOpen);
        onOpenChange?.(isOpen);
        if (!isOpen) {
            refocusTarget();
        }
    };

    // Close on outside click
    useEffect(() => {
        const onDocMouseDown = (ev) => {
            const ref = detailsRef.current;
            if (!ref) return;
            if (!ref.contains(ev.target) && open) {
                setOpen(false);
                onOpenChange?.(false);
                refocusTarget();
            }
        };
        document.addEventListener('mousedown', onDocMouseDown);
        return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, [open, onOpenChange, refocusTarget]);

    // Close on Escape
    const onKeyDown = (e) => {
        if (e.key === 'Escape' && open) {
            e.stopPropagation();
            setOpen(false);
            onOpenChange?.(false);
            refocusTarget();
        }
    };

    // Close when a panel item is clicked (buttons/links or anything marked data-menu-close)
    const onPanelClick = (e) => {
        if (!closeOnSelect) return;

        const target = e.target;
        const isInteractive =
            target.closest('button, a, [role="menuitem"], [data-menu-close]');

        if (isInteractive && open) {
            // Let the item's own onClick run first in the same tick
            // then close the menu and refocus the input
            setTimeout(() => {
                setOpen(false);
                onOpenChange?.(false);
                refocusTarget();
            }, 0);
        }
    };

    const showIconAndOrLabel = () => <>
        {(show === "icon" || show === "icon_label") && summaryIcon && (
            <>
                {summaryIcon}
                <span className={styles.visuallyHidden}>{summaryAriaLabel || summaryLabel}</span>
            </>
        )}
        {(show === "label" || show === "icon_label" || !summaryIcon) && (
            <span className={styles.menuSummaryLabel}>{summaryLabel}</span>
        )}
    </>;

    return (
        <details
            ref={detailsRef}
            className={styles.menu}
            open={open}
            onToggle={handleToggle}
            onKeyDown={onKeyDown}
        >
            <summary
                className={styles.menuHeader}
                ref={summaryRef}
                role="button"
                aria-expanded={open}
                aria-controls={panelId}
                aria-label={summaryAriaLabel || summaryLabel}
                title={summaryAriaLabel || summaryLabel}
                tabIndex={0}
                {...summaryProps}
            >
                {showIconAndOrLabel()}
            </summary>
            <nav
                id={panelId}
                className={styles.menuPanel}
                onClick={onPanelClick}
                {...panelProps}
            >
                {children}
            </nav>
        </details>
    );
}

HeaderMenu.propTypes = {
    summaryLabel: PropTypes.string,
    defaultOpen: PropTypes.bool,
    onOpenChange: PropTypes.func,
    children: PropTypes.node,
    summaryProps: PropTypes.object,
    panelProps: PropTypes.object,
    closeOnSelect: PropTypes.bool,
    refocusOnClose: PropTypes.bool,
    refocusSelector: PropTypes.string,
    summaryIcon: PropTypes.node,
    summaryAriaLabel: PropTypes.string,
    show: PropTypes.oneOf(['icon', 'label', 'icon_label']),
};
