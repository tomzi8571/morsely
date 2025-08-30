import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export function KeyboardCaptureInput({
  value,
  onChange,
  onKeyDown,
  maxLength,
  enabled = true,
  className = 'text-container float-bottom-right',
  allowFocusLossSelectors = ['.theme-switcher', '.menu', '.menu-panel'],
  autoFocus = true,
  ariaHidden = true,
}) {
  const inputRef = useRef(null);

  // Initial focus when enabled
  useEffect(() => {
    if (!enabled || !autoFocus) return;
    inputRef.current?.focus({ preventScroll: true });
  }, [enabled, autoFocus]);

  // Restore focus on blur unless leaving to allowed UI
  const onBlur = (e) => {
    if (!enabled) return;

    const next = e?.relatedTarget || document.activeElement;
    const isAllowedTarget =
      next &&
      typeof next.closest === 'function' &&
      allowFocusLossSelectors.some((sel) => next.closest?.(sel));

    if (isAllowedTarget) return;

    // Restore focus
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      maxLength={maxLength}
      onBlur={onBlur}
      ref={inputRef}
      className={className}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      aria-hidden={ariaHidden}
    />
  );
}

KeyboardCaptureInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  maxLength: PropTypes.number,
  enabled: PropTypes.bool,
  className: PropTypes.string,
  allowFocusLossSelectors: PropTypes.arrayOf(PropTypes.string),
  autoFocus: PropTypes.bool,
  ariaHidden: PropTypes.bool,
};
