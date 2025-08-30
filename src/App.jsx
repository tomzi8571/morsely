import {useEffect} from 'react'
import './App.css'

import {Sentence} from "./components/Sentence.jsx";
import {Examples, ExamplesPropType} from "./components/Examples.jsx";
import {Title} from "./components/Title.jsx";
import {Progression} from "./components/Progression.jsx";
import PropTypes from "prop-types";
import {ExerciseStatus} from "./components/ExcerciseStatus.jsx";
import {Viewport} from "./components/Viewport.jsx";
import {ThemeMenu} from "./components/ThemeMenu.jsx";
import {SessionMenu} from "./components/SessionMenu.jsx";
import {KeyboardCaptureInput} from "./components/KeyboardCaptureInput.jsx";
import {ExerciseStatusManager} from "./components/ExerciseStatusManager.jsx";

function App({examples = Examples(), enabled: focusEnabled = true}) {
    const exerciseStatus = ExerciseStatus(examples);
    const viewport = Viewport(false);

    const {
        revealed,
        keyboard,
        wordSuccessfullyGuessed,
        statistics,
        onKeyDown,
        onChange,
        prevProgression,
        prevExercise,
        prevSession,
        nextExercise,
        nextProgression,
        nextSession,
        selectSession,
        setKeyboard // used to clear on mount
    } = ExerciseStatusManager(exerciseStatus, viewport);

    useEffect(() => {
        setKeyboard('');
    }, [setKeyboard]);

    return (
        <div className='app-container' style={{height: `${viewport.sizes.visualViewport.height}px`}}>
            {viewport.ViewPortStatsComponent()}
            <div className='header'>
                <div className="header-bar">
                    <SessionMenu examples={examples} onSelectSession={selectSession}/>
                    <ThemeMenu/>
                </div>

                <Title session={exerciseStatus}/>
            </div>
            <div className='main-container'>
                <Sentence
                    text={exerciseStatus.example}
                    highlight={keyboard}
                    reveal={revealed}
                    wordSuccessFullyGuessed={wordSuccessfullyGuessed}
                />
                <KeyboardCaptureInput
                    value={keyboard}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    maxLength={exerciseStatus.example.length}
                    enabled={focusEnabled}
                    allowFocusLossSelectors={['.theme-switcher', '.menu', '.menu-panel']}
                    className={'text-container float-bottom-right'}
                />
            </div>
            <Progression status={exerciseStatus}/>
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