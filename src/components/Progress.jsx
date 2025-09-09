import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getLogger} from "../logger.js";

const logger = getLogger('Progress');
logger.setLevel('info');

export function Progress({
                             value = {size: 0, percent: 0},
                             height = 8,
                             style = {}
                         }) {

    const [percent, setPercent] = useState(value)

    useEffect(() => {
        setPercent(Math.max(0, Math.min(100, value.percent)));
        logger.debug({value, percent})
    }, [value])

    function getDots() {
        const dots = [];
        for (let i = 0; i < value.size; i++) {
            dots.push(
                <span
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `calc(${Math.round(height / 2)}px + ${Math.round(i * (100 / value.size))}%)`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: height,
                        height: height,
                        borderRadius: '50%',
                        color: 'var(--accent, #4A90E2)',
                        background: 'var(--accent, #4A90E2)',
                        border: `2px solid var(--accent, #4A90E2)`,
                        boxSizing: 'border-box',
                        zIndex: 2,
                        transition: 'background 0.2s, border-color 0.2s',
                    }}
                />
            );
        }
        return dots;
    }

    return (
        <div style={{
            width: '100%',
            background: 'var(--accent-bg, #e0e0e0)',
            borderRadius: height / 2,
            height,
            margin: '0 0',
            position: 'relative',
            ...style
        }}>
            <div style={{
                width: `calc(${Math.round(height / 2)}px + ${percent}%)`,
                background: 'var(--accent, #4A90E2)',
                height: '100%',
                borderRadius: height / 2,
                transition: 'width 0.3s cubic-bezier(.4,1.4,.6,1)',
                position: 'absolute',
                top: 0,
                zIndex: 2,
                paddingLeft: `${Math.round(height / 2)}px`
            }}/>
            {getDots()}
        </div>
    );
}

Progress.propTypes = {
    value: PropTypes.shape({
        size: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired,
    }).isRequired,
    height: PropTypes.number,
    color: PropTypes.string,
    background: PropTypes.string,
    style: PropTypes.object,
};
