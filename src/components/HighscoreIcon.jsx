import React from 'react';
import PropTypes from 'prop-types';
import HighscoreSvg from '../assets/highscore.svg?react';

export function HighscoreIcon({value, size = 18, ...iconProps}) {
    return (
        <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.4em'}}>
      <HighscoreSvg width={size} height={size} aria-label="Highscore"
                    style={{display: 'inline-block'}} {...iconProps} />
      <span>{value}</span>
    </span>
    );
}

HighscoreIcon.propTypes = {
    value: PropTypes.number.isRequired,
    size: PropTypes.number,
};


