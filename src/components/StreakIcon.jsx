import React from 'react';
import PropTypes from 'prop-types';
import StreakSvg from '../assets/streak.svg?react';

export function StreakIcon({value, size = 18, ...iconProps}) {
    return (
        <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.4em'}}>
      <StreakSvg width={size} height={size} aria-label="Streak" style={{display: 'inline-block'}} {...iconProps} />
      <span>{value}</span>
    </span>
    );
}

StreakIcon.propTypes = {
    value: PropTypes.number.isRequired,
    size: PropTypes.number,
};


