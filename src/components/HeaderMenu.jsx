import React, {useEffect, useId, useRef, useState} from 'react';
import PropTypes from 'prop-types';

function HeaderMenu({
                        summaryLabel = 'Menu',
                        defaultOpen = false,
                        onOpenChange,
                        children,
                        summaryProps = {},
                        panelProps = {},
  closeOnSelect = true, // NEW: close when an item is selected
  refocusOnClose = true, // NEW: automatically refocus a target on close
  refocusSelector = '.text-container', // NEW: selector to focus on close (matches your hidden input)
  summaryIcon,          // NEW: custom icon node provided by parent
  summaryAriaLabel,     // NEW: optional accessible label override
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const detailsRef = useRef(null);
  const summaryRef = useRef(null);
  const panelId = useId();

  const refocusTarget = () => {
    if (!refocusOnClose) return;
    const el = document.querySelector(refocusSelector);
    el?.focus?.({ preventScroll: true });
  };

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
  }, [open, onOpenChange]);

  // Close on Escape
  const onKeyDown = (e) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setOpen(false);
      onOpenChange?.(false);
      refocusTarget();
      // Optionally keep focus on summary: summaryRef.current?.focus({ preventScroll: true });
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

  return (
    <details
      ref={detailsRef}
      className="menu"
      open={open}
      onToggle={handleToggle}
      onKeyDown={onKeyDown}
    >
      <summary
        className="menu-header"
        ref={summaryRef}
        role="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={summaryAriaLabel || summaryLabel}
        title={summaryAriaLabel || summaryLabel}
        tabIndex={0}
        {...summaryProps}
      >
        {summaryIcon ? (
          <>
            {summaryIcon}
            <span className="visually-hidden">{summaryAriaLabel || summaryLabel}</span>
          </>
        ) : (
          summaryLabel
        )}
      </summary>
      <nav
        id={panelId}
        className="menu-panel"
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
  summaryIcon: PropTypes.node,       // NEW
  summaryAriaLabel: PropTypes.string // NEW
};

export default HeaderMenu;
