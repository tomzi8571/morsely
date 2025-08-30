import {useCallback, useEffect, useRef, useState} from 'react'
import './App.css'

import {Sentence} from "./Sentence.jsx";
import {Examples, ExamplesPropType} from "./Examples.jsx";
import {Title} from "./Title.jsx";
import {Progression} from "./Progression.jsx";
import PropTypes from "prop-types";
import {ExerciseStatus} from "./ExcerciseStatus.jsx";
import {Viewport} from "./Viewport.jsx";


function App({examples = Examples(), enabled: focusEnabled = true}) {
    const [revealed, setRevealed] = useState(false);
    const [keyboard, setKeyboard] = useState()
    const inputRef = useRef(null);
    const menuRef = useRef()
    const exerciseStatus = ExerciseStatus(examples);
    const [height, setHeight] = useState(window.innerHeight);
    const [wordSuccessfullyGuessed, setWordSuccessfullyGuessed] = useState(false)
    const [statistics, setStatistics] = useState({streak: 0, high: 0});

    const viewport = Viewport(false);

    function resizeWindow() {
        setHeight(window.innerHeight);

    }

    useEffect(() => {
        const handleResize = () => resizeWindow();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const onKeyDown = (e) => {
        // console.log("Typing: ", e.type, e.target.value, e.altKey, e.key, e.code,  exerciseStatus.example, keyboard)
        if (e.type === 'keydown' && e.key === 'Enter' && e.target.value.length > 0) {
            e.preventDefault();
            nextExercise();
        } else if (e.altKey && (e.key === 'v')) {
            e.preventDefault();
            viewport.setEnabled(!viewport.enabled)
        } else if (e.altKey && (e.key === 'ArrowLeft')) {
            e.preventDefault();
            prevExercise();
        } else if (e.altKey && (e.key === 'ArrowRight')) {
            e.preventDefault();
            nextExercise();
        } else if (e.ctrlKey) {
            e.preventDefault();
            setRevealed(!revealed)
        }
    }

    const onChange = (e) => {
        // Ignore IME composition intermediate input
        if (e.nativeEvent?.isComposing) return;

        const value = e.target.value ?? '';
        if (exerciseStatus.example.toUpperCase().startsWith(e.target.value.toUpperCase())) {
            setKeyboard(value)
            setStatistics({
                streak: statistics.streak = statistics.streak + 1,
                ...statistics
            });
            if (value.length === exerciseStatus.example.length) {
                setWordSuccessfullyGuessed(true);
                setTimeout(() => {
                    setWordSuccessfullyGuessed(false);
                    nextExercise();
                }, 1000);
            }
        } else {
            setStatistics({
                streak: 0,
                high: Math.max(statistics.high, statistics.streak)
            });
        }
    }

    const handleFocus = useCallback(() => {
        // console.log("Focus enabled:", focusEnabled);
        if (!focusEnabled) return;
        setTimeout(() => inputRef.current?.focus({preventScroll: true}), 0);
    }, [focusEnabled]);

    useEffect(() => {
        if (focusEnabled) {
            inputRef.current?.focus({preventScroll: true});
        }
    }, [focusEnabled]);

    useEffect(() => {
        setKeyboard('')
    }, [])

    const prevProgression = () => {
        exerciseStatus.previousProgression();
        setKeyboard('')
    };

    const prevExercise = () => {
        exerciseStatus.previousExercise();
        setKeyboard('')
    };

    const prevSession = () => {
        exerciseStatus.previousSession();
        setKeyboard('')
    }

    const nextSession = () => {
        exerciseStatus.nextSession();
        setKeyboard('')
    }

    const nextProgression = () => {
        exerciseStatus.nextProgression()
        setKeyboard('')
    };

    const nextExercise = () => {
        exerciseStatus.nextExercise()
        setKeyboard('')
    };

    // console.log(exerciseStatus.exercise.index, exerciseStatus.progression.index, exerciseStatus.session.index);

    const selectSession = (session) => {
        exerciseStatus.selectSession(session);
        setKeyboard('')
    };
    return (
        // <div style={{height: `${height}px`}}>

        <div className='app-container' style={{height: `${viewport.sizes.visualViewport.height}px`}}>
            {viewport.ViewPortStatsComponent()}
            <div className='header'>
                <details className="menu" open={true}>
                    <summary className="menu-header">&nbsp;</summary>
                    <nav className="menu-panel" ref={menuRef}>
                        {Object.entries(examples).map((session, idx) => {
                            return <button type={"button"} key={idx}
                                           onClick={() => selectSession(idx)}>{session[1].description}</button>
                        })}

                    </nav>
                </details>
                <Title session={exerciseStatus}/>
                <Progression status={exerciseStatus}/>
            </div>
            <div className='main-container'>
                <Sentence text={exerciseStatus.example} highlight={keyboard} reveal={revealed}
                          wordSuccessFullyGuessed={wordSuccessfullyGuessed}/>
                <input type="text" placeholder="" value={keyboard} onChange={onChange} onKeyDown={onKeyDown}
                       ref={inputRef} maxLength={exerciseStatus.example.length}
                       onBlur={handleFocus} className='text-container float-bottom-right'
                       autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                       aria-hidden="true"
                />
            </div>
            <div className='footer'>
                <div className='navigation'
                     onMouseDown={(e) => e.preventDefault()}
                     onTouchStart={(e) => e.preventDefault()}
                >
                    <button type={"button"} onClick={prevSession}
                            disabled={exerciseStatus.session.isFirst}>&lt;&lt;&lt;</button>
                    <button type={"button"} onClick={prevProgression}
                            disabled={exerciseStatus.progression.isFirst && exerciseStatus.session.isFirst}>&lt;&lt;</button>
                    <button type={"button"} onClick={prevExercise}
                            disabled={exerciseStatus.exercise.isFirst && exerciseStatus.progression.isFirst && exerciseStatus.session.isFirst}>&lt;</button>
                    <button type={"button"} onClick={nextExercise}
                            disabled={exerciseStatus.exercise.isLast && exerciseStatus.progression.isLast && exerciseStatus.session.isLast}>&gt;</button>
                    <button type={"button"} onClick={nextProgression}
                            disabled={exerciseStatus.progression.isLast && exerciseStatus.session.isLast}>&gt;&gt;</button>
                    <button type={"button"} onClick={nextSession}
                            disabled={exerciseStatus.session.isLast}>&gt;&gt;&gt;</button>
                    <div className='game-stats'>Streak {statistics.streak} High {statistics.high}</div>
                </div>
            </div>
        </div>
    )
}

export default App

App.propTypes = {
    examples: ExamplesPropType,
    enabled: PropTypes.bool
}