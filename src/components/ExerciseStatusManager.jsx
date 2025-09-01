import {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";

export function ExerciseStatusManager(exerciseStatus, viewport) {
    const [revealed, setRevealed] = useState(false);
    const [keyboard, setKeyboard] = useState("");
    const [wordSuccessfullyGuessed, setWordSuccessfullyGuessed] = useState(false);
    const [statistics, setStatistics] = useState({streak: 0, high: 0});

    useEffect(() => {
        let initialStats = null
        try {
            initialStats = JSON.parse(localStorage.getItem('exerciseStatistics'))
            // console.log("Loading statisitcs from local storage", initialStats);
        } catch (e) {
            console.error("Error parsing local storage", e);
        }
        if (initialStats === null) {
            initialStats = {streak: 0, high: 0};
        }
        setStatistics(initialStats);
    }, []);

    useEffect(() => {
        localStorage.setItem('exerciseStatistics', JSON.stringify(statistics));
        // console.log("Saving statisitcs", statistics);
    }, [statistics]);

    const resetForNext = useCallback(() => {
        setKeyboard("");
    }, []);

    const prevProgression = useCallback(() => {
        exerciseStatus.previousProgression();
        resetForNext();
    }, [exerciseStatus, resetForNext]);

    const prevExercise = useCallback(() => {
        exerciseStatus.previousExercise();
        resetForNext();
    }, [exerciseStatus, resetForNext]);

    const prevSession = useCallback(() => {
        exerciseStatus.previousSession();
        resetForNext();
    }, [exerciseStatus, resetForNext]);

    const nextSession = useCallback(() => {
        exerciseStatus.nextSession();
        resetForNext();
    }, [exerciseStatus, resetForNext]);

    const nextProgression = useCallback(() => {
        exerciseStatus.nextProgression();
        resetForNext();
    }, [exerciseStatus, resetForNext]);

    const nextExercise = useCallback(() => {
        exerciseStatus.nextExercise();
        resetForNext();
    }, [exerciseStatus, resetForNext]);

    const selectSession = useCallback(
        (session) => {
            exerciseStatus.selectSession(session);
            resetForNext();
        },
        [exerciseStatus, resetForNext]
    );

    const onKeyDown = useCallback(
        (e) => {
            if (e.type === "keydown" && e.key === "Enter" && e.target.value.length > 0) {
                e.preventDefault();
                nextExercise();
            } else if (e.altKey && e.key === "v") {
                e.preventDefault();
                viewport.setEnabled(!viewport.enabled);
            } else if (e.altKey && e.key === "ArrowLeft") {
                e.preventDefault();
                prevExercise();
            } else if (e.altKey && e.key === "ArrowRight") {
                e.preventDefault();
                nextExercise();
            } else if (e.ctrlKey) {
                e.preventDefault();
                setRevealed((r) => !r);
            }
        },
        [nextExercise, prevExercise, viewport]
    );

    const onChange = useCallback(
        (e) => {
            if (e.nativeEvent?.isComposing) return;

            const value = e.target.value ?? "";
            const target = exerciseStatus.example ?? "";

            if (target.toUpperCase().startsWith(value.toUpperCase())) {
                setKeyboard(value);
                setStatistics((s) => {
                    const nextStreak = s.streak + 1;
                    return {...s, streak: nextStreak};
                });

                if (value.length === target.length && target.length > 0) {
                    setWordSuccessfullyGuessed(true);
                    setTimeout(() => {
                        setWordSuccessfullyGuessed(false);
                        nextExercise();
                    }, 1000);
                }
            } else {
                setStatistics((s) => ({
                    streak: 0,
                    high: Math.max(s.high, s.streak),
                }));
            }
        },
        [exerciseStatus.example, nextExercise]
    );

    return {
        // state
        revealed,
        keyboard,
        wordSuccessfullyGuessed,
        statistics,

        // handlers
        onKeyDown,
        onChange,

        // navigation
        prevProgression,
        prevExercise,
        prevSession,
        nextExercise,
        nextProgression,
        nextSession,
        selectSession,

        // setters if needed externally
        setRevealed,
        setKeyboard,
        setStatistics: setStatistics,
    };
}

ExerciseStatusManager.propTypes = {
    exerciseStatus: PropTypes.object.isRequired,
    viewport: PropTypes.object
};
