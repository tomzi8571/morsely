import {ExamplesPropType} from "./Examples.jsx";
import {useEffect, useState} from "react";

export function ExerciseStatus(examples) {
    const [status, setStatus] = useState({session: 0, progression: 0, exercise: 0});
    // Normalize to an array for indexing logic
    const sessions = Array.isArray(examples) ? examples : Object.values(examples || {});
    const progressions =  sessions[status?.session]?.progressions || [];
    const currentProgression = progressions[status?.progression] || {words: []};
    const currentWords = currentProgression.words || [];

    // Load the status from local storage only the first time when the component is mounted
    useEffect(() => {
        let initialStatus = null
        try {
            initialStatus = JSON.parse(localStorage.getItem('exerciseStatus'))
            // console.log("Loading status from local storage", initialStatus);
        } catch (e) {
            console.error("Error parsing local storage", e);
        }
        if (initialStatus === null) {
            initialStatus = {session: 0, progression: 0, exercise: 0};
        }
        setStatus(initialStatus);
    }, []);

    // Update the local storage whenever the status changes
    useEffect(() => {
        // console.log("Saving status to local storage", status);
        localStorage.setItem('exerciseStatus', JSON.stringify(status));
    }, [status]);

    const previousSession = () => {
        setStatus(decrementSession());
    }

    const nextSession = () => {
        setStatus(incrementSession());
    };

    const previousProgression = () => {
        setStatus(decrementProgression());
    }

    const nextProgression = () => {
        setStatus(incrementProgression());
    };

    const previousExercise = () => {
        setStatus(decrementExercise());
    }

    const nextExercise = () => {
        setStatus(incrementExercise());
    };

    const decrementSession = () => {
        let newStatus;
        if (sessionStatus().isFirst) {
            newStatus = {...status};
        } else {
            const newSession = Math.max(status.session - 1, 0);
            newStatus = {session: newSession, progression: 0, exercise: 0};
        }
        return newStatus;
    }

    const incrementSession = () => {
        let newStatus;
        if (sessionStatus().isLast) {
            newStatus = {...status};
        } else {
            const last = Math.max(sessions.length - 1, 0);
            const newSession = Math.min(status.session + 1, last);
            newStatus = {session: newSession, progression: 0, exercise: 0};
        }
        return newStatus;
    };

    const decrementProgression = () => {
        let newStatus;
        if (progressionStatus().isFirst) {
            const newSessionStatus = decrementSession();
            newStatus = {...newSessionStatus};
        } else {
            const newProgression = Math.max(status.progression - 1, 0);
            newStatus = {...status, progression: newProgression, exercise: 0};
        }
        return newStatus;
    }

    const incrementProgression = () => {
        let newStatus;
        if (progressionStatus().isLast) {
            const newSessionStatus = incrementSession();
            newStatus = {...newSessionStatus};
        } else {
            const last = Math.max(progressions.length - 1, 0);
            const newProgression = Math.min(status.progression + 1, last);
            newStatus = {...status, progression: newProgression, exercise: 0};
        }
        return newStatus;
    };

    const decrementExercise = () => {
        let newStatus;
        if (exerciseStatus().isFirst) {
            const newProgStatus = decrementProgression();
            newStatus = {...newProgStatus};
        } else {
            const newExercise = Math.max(status.exercise - 1, 0);
            newStatus = {...status, exercise: newExercise};
        }
        return newStatus;
    }

    const incrementExercise = () => {
        let newStatus;
        if (exerciseStatus().isLast) {
            const newProgStatus = incrementProgression();
            newStatus = {...newProgStatus};
        } else {
            const last = Math.max(currentWords.length - 1, 0);
            const newExercise = Math.min(status.exercise + 1, last);
            newStatus = {...status, exercise: newExercise};
        }
        return newStatus;
    };

    const sessionStatus = () => {
        return {
            index: status.session,
            size: sessions.length,
            isFirst: status.session === 0,
            isLast: sessions.length === 0 ? true : status.session === sessions.length - 1
        }
    };

    const progressionStatus = () => ({
        index: status.progression,
        size: progressions.length,
        isLast: progressions.length === 0 ? true : status.progression === progressions.length - 1,
        isFirst: status.progression === 0
    });

    const exerciseStatus = () => ({
        index: status.exercise,
        size: currentWords.length,
        isLast: currentWords.length === 0 ? true : status.exercise === currentWords.length - 1,
        isFirst: status.exercise === 0
    });

    const selectSession = (session) => {
        setStatus({session: session, progression: 0, exercise: 0});
    }

    return {
        nextSession,
        previousSession,
        nextProgression,
        previousProgression,
        nextExercise,
        previousExercise,
        status,
        session: sessionStatus(),
        progression: progressionStatus(),
        exercise: exerciseStatus(),
        example: currentWords[status.exercise],
        introduced: currentProgression.introduced,
        description: sessions[status.session]?.description,
        subtitle: sessions[status.session]?.subtitle,
        selectSession
    };
}

ExerciseStatus.propTypes = {
    examples: ExamplesPropType
};