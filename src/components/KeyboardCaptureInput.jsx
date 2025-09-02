import React, {useEffect, useRef, forwardRef, useImperativeHandle} from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../logger';

const KeyboardCaptureInput = forwardRef(({
                                         value,
                                         onChange,
                                         onKeyDown,
                                         maxLength,
                                         enabled = false,
                                         className = 'text-container float-bottom-right',
                                         allowFocusLossSelectors = ['.theme-switcher', '.menu', '.menu-panel', '.allowClick'],
                                         autoFocus = false,
                                         ariaHidden = true,
                                     }, ref) => {
    const inputRef = useRef(null);
    const logger = getLogger('KeyboardCaptureInput');

    useImperativeHandle(ref, () => ({
        focusInput: (options = {preventScroll: true}) => {
            logger.debug("Focus input");
            inputRef.current?.focus(options);
        }
    }));

// Initial focus when enabled
    useEffect(() => {
        if (!enabled || !autoFocus) return;
        inputRef.current?.focus({preventScroll: true});
    }, [enabled, autoFocus]);

    // Restore focus on blur unless leaving to allowed UI
    const onBlur = (e) => {
        if (!enabled) return;

        const next = e?.relatedTarget || document.activeElement;
        const isAllowedTarget =
            next &&
            typeof next.closest === 'function' &&
            allowFocusLossSelectors.some((sel) =>
                next.matches?.(sel) || next.closest?.(sel)
            );

        logger.debug({
            isAllowedTarget,
            next,
            selectors: allowFocusLossSelectors,
            matches: allowFocusLossSelectors.map(sel => next.matches?.(sel)),
            closest: allowFocusLossSelectors.map(sel => next.closest?.(sel))
        });

        if (isAllowedTarget) return;

        // Restore focus
        if (autoFocus) {
            logger.debug("Restoring focus");
            setTimeout(() => inputRef.current?.focus({preventScroll: true}), 0);
        }
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
            inputMode="text"         // Prevents keyboard suggestions
            autoComplete="off"       // Disables autofill (passwords, cards, etc.)
            autoCorrect="off"        // Disables autocorrect
            autoCapitalize="none"    // Prevents automatic capitalization
            spellCheck={false}       // Disables spell checking
            name="nohint"            // Avoids triggering autofill heuristics
            aria-hidden={ariaHidden} // Optional: hides from screen readers
        />
    );
});

KeyboardCaptureInput.PropTypes = {
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

export {KeyboardCaptureInput};
