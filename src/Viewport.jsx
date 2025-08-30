import React, {useEffect, useMemo, useState} from 'react';

export function Viewport(viewPortEnabled = false) {
    const [sizes, setSizes] = useState(() => computeSizes());
    const [enabled, setEnabled] = useState(viewPortEnabled);

    useEffect(() => {
        const update = () => setSizes(computeSizes());

        // Respond to window resizes and orientation changes
        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);

        // visualViewport captures changes from URL bar collapsing/expanding and keyboard
        const vv = window.visualViewport;
        if (vv) {
            vv.addEventListener('resize', update);
            vv.addEventListener('scroll', update); // offsetTop/Left can change
        }

        // Initial sync (in case hydration timing differs)
        update();

        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('orientationchange', update);
            if (vv) {
                vv.removeEventListener('resize', update);
                vv.removeEventListener('scroll', update);
            }
        };
    }, []);

    const {
        layoutViewport,
        screenSize,
        visualViewport,
        keyboardHeight,
        notes,
    } = sizes;

    const fmt = useMemo(
        () => (w, h) => `${Math.round(w)} × ${Math.round(h)} px`,
        []
    );

    const getViewport = () => <section
        style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            maxWidth: 270,
            maxHeight: 100,
            overflow: 'auto',
            scrollBar: 'none',
            margin: '0 auto 1rem',
            padding: '0.75rem 1rem',
            border: '1px solid #ddd',
            borderRadius: 8,
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#757474',
            fontSize: 10,
            alignItems: 'left',
            zIndex: 2000,
            fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        }}
    >
        <h2 style={{marginTop: 0, fontSize: 10}}>
            Viewport diagnostics
        </h2>
        <ul style={{listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.6}}>
            <li>
                <strong>Excluding address bar (layout viewport):</strong>{' '}
                {fmt(layoutViewport.width, layoutViewport.height)}
            </li>
            <li>
                <strong>Including address bar (screen size):</strong>{' '}
                {fmt(screenSize.width, screenSize.height)}
            </li>
            <li>
                <strong>Including keyboard (visual viewport):</strong>{' '}
                {fmt(visualViewport.width, visualViewport.height)}
            </li>
            <li>
                <strong>Estimated keyboard overlap:</strong>{' '}
                {Math.round(keyboardHeight)} px
            </li>
        </ul>
        <p style={{color: '#666', marginTop: 8, fontSize: 8}}>
            {notes}
        </p>
    </section>;

    const getViewportIfEnabled = () => {
        return enabled === true ? getViewport() : null;
    }

    return {
        ViewPortStatsComponent: getViewportIfEnabled,
        sizes,
        enabled:
        enabled,
        setEnabled: (e) => setEnabled(e),
        fmt
    }
}

function computeSizes() {
    const d = document.documentElement;

    // Layout viewport: excludes browser chrome like address bar, but not the on-screen keyboard.
    const layoutViewport = {
        width: d.clientWidth || window.innerWidth,
        height: d.clientHeight || window.innerHeight,
    };

    // Full screen including browser UI (address bar, toolbars) in CSS pixels.
    const screenSize = {
        width: window.screen?.width ?? layoutViewport.width,
        height: window.screen?.height ?? layoutViewport.height,
    };

    // Visual viewport: area actually visible; shrinks when URL bar collapses/expands and when keyboard shows.
    const vv = window.visualViewport;
    const visualViewport = {
        width: vv?.width ?? window.innerWidth,
        height: vv?.height ?? window.innerHeight,
        offsetTop: vv?.offsetTop ?? 0,
        offsetLeft: vv?.offsetLeft ?? 0,
        scale: vv?.scale ?? 1,
    };

    // Estimate keyboard height as the difference between layout and visual viewport.
    // On mobile when the keyboard is open, visualViewport.height is smaller.
    const keyboardHeight = Math.max(
        0,
        (layoutViewport.height - visualViewport.height) - (visualViewport.offsetTop || 0)
    );

    const notes =
        'Numbers are in CSS pixels. Visual viewport changes with URL bar and keyboard. ' +
        'Keyboard height is estimated from layout vs visual viewport and may vary by browser.';

    return {
        layoutViewport,
        screenSize,
        visualViewport,
        keyboardHeight,
        notes,
    };
}

