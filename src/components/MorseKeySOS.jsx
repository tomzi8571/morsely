import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import MorseKeySOSSvg from '../assets/morsekey SOS.svg?react';

/**
 * MorseKeySOS SVG React component (uses SVG as React component)
 * @param {string} animationSpeed - Animation duration (e.g. '2s', '6.8s')
 * @param {string|number} width - SVG width (e.g. '480', '100%')
 * @param {string|number} height - SVG height (e.g. '260', '100%')
 * @param {boolean} animationEnabled - Enable/disable animation
 * @param {string|number} animationRepeatCount - How many times animation should run ('indefinite' or a number)
 */
const MorseKeySOS = ({
  animationSpeed = '6.8s',
  width = 480,
  height = 260,
  style = {},
  animationEnabled = true,
  animationRepeatCount = '5',
  ...props
}) => {
  const svgRef = useRef(null);
  const mergedStyle = {
    ...style,
    '--animation-speed': animationSpeed,
    cursor: 'pointer',
  };

  useEffect(() => {
    if (svgRef.current) {
      const svg = svgRef.current;
      const anims = svg.querySelectorAll('animate, animateTransform');
      anims.forEach(el => {
        el.setAttribute('dur', animationSpeed);
        el.setAttribute('repeatCount', animationEnabled ? animationRepeatCount : '0');
      });
      handleClick()
    }
  }, [animationSpeed, animationRepeatCount, animationEnabled, width, height, style]);

  const handleClick = () => {
    if (!animationEnabled) return;
    if (svgRef.current) {
      const svg = svgRef.current;
      const anims = svg.querySelectorAll('animate, animateTransform');
      anims.forEach(el => {
        if (typeof el.beginElement === 'function') {
          el.beginElement();
        }
      });
    }
    if (props.onClick) props.onClick();
  };

  return (
    <span
      style={{ display: 'inline-block', ...mergedStyle }}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label="Start MorseKeySOS animation"
    >
      <MorseKeySOSSvg
        ref={svgRef}
        width={width}
        height={height}
        style={{ display: 'block', width, height }}
        data-animation-speed={animationSpeed}
        {...props}
      />
    </span>
  );
};

MorseKeySOS.propTypes = {
  animationSpeed: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  animationEnabled: PropTypes.bool,
  animationRepeatCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
};

export default MorseKeySOS;
