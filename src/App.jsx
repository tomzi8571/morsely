import {useEffect} from 'react'
import './App.css'

import {Sentence} from "./components/Sentence.jsx";
import {Examples, ExamplesPropType} from "./components/Examples.jsx";
import {Title} from "./components/Title.jsx";
import {Progression} from "./components/Progression.jsx";
import PropTypes from "prop-types";
import {ExerciseStatus} from "./components/ExcerciseStatus.jsx";
import {Viewport} from "./components/Viewport.jsx";
import {SessionMenu} from "./components/SessionMenu.jsx";
import {KeyboardCaptureInput} from "./components/KeyboardCaptureInput.jsx";
import {ExerciseStatusManager} from "./components/ExerciseStatusManager.jsx";
import {SettingsMenu} from "./components/SettingsMenu.jsx";
import {StreakIcon} from "./components/StreakIcon.jsx";
import {HighscoreIcon} from "./components/HighscoreIcon.jsx";
import {NavigationBar} from './components/NavigationBar.jsx';
import { useServiceWorkerUpdater } from './components/useServiceWorkerUpdater.jsx';

export function App({examples = Examples(), enabled: focusEnabled = true}) {
    const exerciseStatus = ExerciseStatus(examples);
    const viewport = Viewport(false);

    const exerciseStatusManager = ExerciseStatusManager(exerciseStatus, viewport);

    useEffect(() => {
        exerciseStatusManager.setKeyboard('');
    }, [exerciseStatusManager, exerciseStatusManager.setKeyboard]);

    useEffect(() => {
        document.documentElement.style.setProperty('--app-height', `${viewport.sizes.visualViewport.height}px`);
    }, [viewport.sizes.visualViewport.height]);

    useServiceWorkerUpdater({ interval: 60 * 60 * 1000 }); // Checks for updates every hour

    function addVersionInformation() {
        let version = `Version: ${import.meta.env.VITE_APP_VERSION || ''} Commit: ${import.meta.env.VITE_APP_COMMIT || ''} Built: ${import.meta.env.VITE_APP_BUILDTIME || ''}`;
        return typeof window !== 'undefined' && (
            <div dangerouslySetInnerHTML=
                     {{__html: `<!-- ${version} -->`}}/>
        );
    }

    return (
        <>
            {addVersionInformation()}
            <div className='app-container'>
                {viewport.ViewPortStatsComponent()}
                <div className='header'>
                    <div className="header-bar">
                        <SessionMenu examples={examples} onSelectSession={exerciseStatusManager.selectSession}/>
                        <SettingsMenu/>
                        <span className="header-bar-icons">
                            <StreakIcon value={exerciseStatusManager.statistics.streak}/>
                            <HighscoreIcon value={exerciseStatusManager.statistics.high}/>
                        </span>
                    </div>
                    <Title session={exerciseStatus}/>
                </div>
                <div className='main-container'>
                    <Sentence
                        text={exerciseStatus.example}
                        highlight={exerciseStatusManager.keyboard}
                        reveal={exerciseStatusManager.revealed}
                        wordSuccessFullyGuessed={exerciseStatusManager.wordSuccessfullyGuessed}
                    />
                    <KeyboardCaptureInput
                        value={exerciseStatusManager.keyboard}
                        onChange={exerciseStatusManager.onChange}
                        onKeyDown={exerciseStatusManager.onKeyDown}
                        maxLength={exerciseStatus.example.length}
                        enabled={focusEnabled}
                        allowFocusLossSelectors={['.theme-switcher', '.menu', '.menu-panel']}
                        className={'text-container float-bottom-right'}
                    />
                </div>
                <Progression status={exerciseStatus}/>
                <div className='footer'>
                    <NavigationBar
                        exerciseStatusManager={exerciseStatusManager}
                        exerciseStatus={exerciseStatus}
                    />
                </div>
            </div>
        </>
    )
}


App.propTypes = {
    examples: ExamplesPropType,
    enabled: PropTypes.bool
}