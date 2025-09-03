import React, {useEffect, useRef} from 'react';
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
import {useServiceWorkerUpdater} from './components/useServiceWorkerUpdater.jsx';
import {getLogger} from './logger';
import MorseKeyIcon from './components/MorseKeySOS';

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

function hasHardwareKeyboard() {
    return !window.matchMedia('(pointer: coarse)').matches && navigator.maxTouchPoints === 0;
}

function shouldAutoFocusInput() {
    return hasHardwareKeyboard() || !isMobileDevice();
}

export function App({examples = Examples()}) {
    const exerciseStatus = ExerciseStatus(examples);
    const viewport = Viewport(false);
    let pwaUpdateCheckEvery = 1 * 60 * 1000; // 1 minute

    const exerciseStatusManager = ExerciseStatusManager(exerciseStatus, viewport);

    useEffect(() => {
        exerciseStatusManager.setKeyboard('');
    }, [exerciseStatusManager.setKeyboard]);

    useEffect(() => {
        if ("virtualKeyboard" in navigator) {
            navigator.virtualKeyboard.overlaysContent = true;
        }
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty('--app-height', `${viewport.sizes.visualViewport.height}px`);
    }, [viewport.sizes.visualViewport.height]);
    useServiceWorkerUpdater({interval: pwaUpdateCheckEvery}); // Checks for updates every minute

    function addVersionInformation() {
        let version = `Version: ${import.meta.env.VITE_APP_VERSION || ''} Commit: ${import.meta.env.VITE_APP_COMMIT || ''} Built: ${import.meta.env.VITE_APP_BUILDTIME || ''}`;
        return typeof window !== 'undefined' && (
            <div dangerouslySetInnerHTML=
                     {{__html: `<!-- ${version} -->`}}/>
        );
    }

    const keyboardCaptureRef = useRef(null);
    const shouldAutoFocus = shouldAutoFocusInput();
    const logger = getLogger('App');

    // Handler for focusing input on non-hardware keyboard devices when clicking main-container
    const handleMainContainerClick = (e) => {
        logger.debug('handleMainContainerClick', e);
        if (!shouldAutoFocus && keyboardCaptureRef.current) {
            keyboardCaptureRef.current.focusInput({preventScroll: true});
        }
        if (exerciseStatusManager.onClick) {
            exerciseStatusManager.onClick(e);
        }
    };

    // Add a handler to trigger MorseKeyIcon animation
    const handleMorseKeySOSClick = () => {
        // You can add any custom logic here if needed
        console.log('MorseKeyIcon icon clicked! Animation triggered.');
    };

    return (
        <>
            {addVersionInformation()}
            <div className='app-container'>
                {viewport.ViewPortStatsComponent()}
                <div className='header allowClick'>
                    <div className="header-bar">
                        <SessionMenu examples={examples}
                                     onSelectSession={exerciseStatusManager.selectSession}
                                     refocusOnClose={shouldAutoFocus}/>
                        <SettingsMenu refocusOnClose={shouldAutoFocus}/>
                        <span className="header-bar-icons">
                            <StreakIcon value={exerciseStatusManager.statistics.streak}/>
                            <HighscoreIcon value={exerciseStatusManager.statistics.high}/>
                            <MorseKeyIcon
                                width={32}
                                height={18}
                                animationSpeed="2s"
                                animationRepeatCount={1}
                                animationEnabled={true}
                                style={{marginLeft: 8, marginRight: 8, verticalAlign: 'middle'}}
                                onClick={handleMorseKeySOSClick}
                            />
                        </span>
                    </div>
                    <Title session={exerciseStatus}/>
                </div>
                <div className='main-container' onClick={handleMainContainerClick}>
                    <Sentence
                        text={exerciseStatus.example}
                        highlight={exerciseStatusManager.keyboard}
                        reveal={exerciseStatusManager.revealed}
                        wordSuccessFullyGuessed={exerciseStatusManager.wordSuccessfullyGuessed}
                    />
                    <KeyboardCaptureInput
                        ref={keyboardCaptureRef}
                        value={exerciseStatusManager.keyboard}
                        onChange={exerciseStatusManager.onChange}
                        onKeyDown={exerciseStatusManager.onKeyDown}
                        maxLength={exerciseStatus.example.length}
                        enabled={shouldAutoFocus}
                        autoFocus={shouldAutoFocus}
                        allowFocusLossSelectors={['.theme-switcher', '.menu', '.menu-panel', '.allowClick']}
                    />
                </div>
                <Progression status={exerciseStatus}/>
                <div className='footer'>
                    <NavigationBar
                        exerciseStatusManager={exerciseStatusManager}
                        exerciseStatus={exerciseStatus}
                        refocusAfterClick={shouldAutoFocus}
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