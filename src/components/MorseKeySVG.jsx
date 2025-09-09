import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import MorseKeySvg from '../assets/morsekey.svg?react';
import {Alphabet} from "./Alphabet.jsx";
import {getLogger} from "../logger";

const logger = getLogger('MorseKeySOS');
logger.setLevel(logger.levels.INFO);

/**
 * MorseKeySOS SVG React component (uses SVG as React component)
 * @param {string|number} width - SVG width (e.g. '480', '100%')
 * @param {string|number} height - SVG height (e.g. '260', '100%')
 * @param style The style object to apply to the SVG element
 * @param {boolean} animationEnabled - Enable/disable animation
 * @param autoStart - Automatically start animation on mount
 * @param onClick - If the component is clicked, it animates the Morse key for a single dot.
 * @param timings - Configurable durations for dot, dash, letter gap, and word gap.
 *        According to https://morsecode.world/international/timing/
 *        Dot: 1 unit, dash: 3 units, intra symbol gap: 1 unit, letter gap: 3 units, word gap: 7 units. The
 *        default values are: <pre>{'.': '100ms', '-': '300ms', gapSymbol:'100ms', gapLetter: '300ms', gapWord: '700ms'}
 *        </pre>
 *        Here an example for the word 'SOS SOS'. It converts to
 *        <pre>... --- ... / ... --- ...</pre>
 *        Calcaulated start timings are:
 *        <pre>
 *        Letter     S              O               S           (word gap) S               O                S
 *        Symbols    .    .    .      -    -    -      .    .    .           .    .    .      -    -    -      .    .    .
 *        Gaps       |200 |200 |  400 |400 |400 |  600 |200 |200 |    800    |200 |200 | 400  |400 |400 | 600  |200 |200 |   800
 *        Timestart  0    200  400    800  1200 1600   2200 2400 2600        3400 3600 3800   4200 4600 5000   5600 5800 6000
 *        </pre>
 * @param props - Other props
 * @param sentenceToAnimate A sentence of alphanumeric characters to be converted to morse code and animated. Example 'This is an SOS'
 * Words should be separated by space. Example: "SOS" converts to "... --- ..."
 */
const MorseKeySVG = ({
                         width = 480,
                         height = 260,
                         style = {},
                         animationEnabled = true,
                         autoStart = true,
                         onClick,
                         sentenceToAnimate = null,
                         // New: optional Morse pattern string, words separated by '/', letters separated by space
                         timings = {'.': '100ms', '-': '300ms', gapSymbol:'100ms', gapLetter: '300ms', gapWord: '700ms'}, // New configurable durations
                         ...props
                     }) => {
    const morseKeySvgRef = useRef(null);
    const timersRef = useRef([]);
    const isCurrentlyPlaying = useRef(false);

    useEffect(() => {
        logger.debug("useEffect(): ", {sentenceToAnimate})
        if (autoStart) {
            if (sentenceToAnimate) scheduleSequence();
        }
        return () => clearTimers();
    }, [autoStart, sentenceToAnimate, timings]);

    /** Convert duration to milliseconds. Converts 2000 -> '2000ms', '2000ms' -> '2000ms', '2s' -> '2000ms' */
    const normalizeDurationToString = (duration) => {
        if (duration == null) return toMillis(timings['.']);
        return `${toMillis(duration)}ms`;
    };


    /** Convert duration to milliseconds. Converts 2000 -> 2000, '2000ms' -> '2000, '2s' -> 2000 */
    function toMillis(val) {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
            const v = val.trim();
            if (v.endsWith('ms')) return parseFloat(v);
            if (v.endsWith('s')) return parseFloat(v) * 1000;
            const num = parseFloat(v);
            if (!isNaN(num)) return num * 1000;
        }
        return 0; // fallback
    }

    // Internal only single click
    const animateMorseKeyTap = (durationOverride) => {
        logger.debug("animateMorseKeyTap(): Animating morseKey with duration", {durationOverride, animationEnabled});
        if (!animationEnabled || !morseKeySvgRef.current) return;
        const duration = normalizeDurationToString(durationOverride);
        const leverAnim = morseKeySvgRef.current.querySelector('animateTransform[href="#lever"]');
        leverAnim.setAttribute('dur', duration);
        leverAnim.beginElement();
    };

    const clearTimers = () => {
        timersRef.current.forEach(id => clearTimeout(id));
        timersRef.current = [];
    };

    const scheduleSequence = () => {
        logger.debug("scheduleSequence(): Scheduling Morse sequence animation", {
            sentenceToAnimate,
            timings,
            animationEnabled
        });
        if (!sentenceToAnimate) return;
        let morseSentence = Alphabet().sentenceToMorse(sentenceToAnimate, {skipUnknown: true});
        logger.debug("scheduleSequence(): Converted sentence into morse code:", {morseSentence});

        clearTimers();
        isCurrentlyPlaying.current = true;
        let startTime = 0; // ms timeline

        const dotDur = toMillis(timings['.']);
        const dashDur = toMillis(timings['-']);
        const gapLetter = toMillis(timings.gapLetter);
        const gapWord = toMillis(timings.gapWord);
        const gapSymbol = toMillis(timings.gapSymbol);

        const words = morseSentence.split('/').map(w => w.trim()).filter(Boolean);

        words.forEach((word, wIdx) => {
            logger.debug("scheduleSequence(): word", {word, wIdx})
            const letters = word.split(' ').map(l => l.trim()).filter(Boolean);
            letters.forEach((letter, lIdx) => {
                const symbols = letter.split('').filter(ch => ch === '.' || ch === '-');
                symbols.forEach(((sym, sIdx) => {
                    timersRef.current.push(setTimeout((symArg, tArg) => {
                        logger.debug("scheduleSequence(): animateMorseKeyTap called from scheduleSequence ", {sym: symArg, t: tArg});
                        animateMorseKeyTap(symArg === '.' ? dotDur : dashDur);
                    }, startTime, sym, startTime));

                    logger.debug("scheduleSequence(): startTime", {sym, t: startTime});
                    startTime += sym === '.' ? dotDur : dashDur;
                    // symbol gap (unless last symbol in letter)
                    if (sIdx !== symbols.length -1) startTime += gapSymbol;
                }));
                // letter gap (unless last letter in word)
                if (lIdx !== letters.length - 1) startTime += gapLetter;
            });
            // word gap (unless last word)
            if (wIdx !== words.length - 1) startTime += gapWord;
        });

        // End marker to reset playing flag
        timersRef.current.push(setTimeout(() => {
            isCurrentlyPlaying.current = false;
        }, startTime));
        logger.debug("scheduleSequence(): Scheduled Morse sequence animation", {timersRef: timersRef.current, t: startTime, duration: startTime})
    };

    const handleClick = () => {
        logger.debug("handleClick")
        if (onClick) onClick();
        sentenceToAnimate = "e";
        scheduleSequence();
    };

    return (
        <span
            style={style}
            onClick={handleClick}
            tabIndex={0}
            role="button"
            aria-label={sentenceToAnimate ? 'Play Morse sequence' : 'Play telegraph key press'}
        >
      <MorseKeySvg
          ref={morseKeySvgRef}
          width={width}
          height={height}
          style={{display: 'block', width, height}}
          data-animation-speed={timings['.']}
          {...props}
      />
    </span>
    )
};

MorseKeySVG.displayName = 'MorseKeySOS';

MorseKeySVG.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    animationEnabled: PropTypes.bool,
    autoStart: PropTypes.bool,
    onClick: PropTypes.func,
    sentenceToAnimate: PropTypes.string,
    timings: PropTypes.shape({
        '.': PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        '-': PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        gapSymbol: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        gapLetter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        gapWord: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
};

export default MorseKeySVG;
