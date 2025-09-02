import React from 'react';
import PropTypes from 'prop-types';
import styles from './NavigationBar.module.css';

const Icon = ({children, label}) => (
    <span role="img" aria-label={label}
          style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
    {children}
  </span>
);

export function NavigationBar({exerciseStatusManager, exerciseStatus}) {
    return (
        <nav className={styles.navigationBar + " allowClick"}>
            <button
                type="button"
                onClick={exerciseStatusManager.prevSession}
                disabled={exerciseStatus.session.isFirst}
                aria-label="Previous Session"
                className={styles.navBtn}
            >
                <Icon label="Previous Session">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 3L7 9L13 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M10 3L4 9L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </Icon>
            </button>
            <button
                type="button"
                onClick={exerciseStatusManager.prevProgression}
                disabled={exerciseStatus.progression.isFirst && exerciseStatus.session.isFirst}
                aria-label="Previous Progression"
                className={styles.navBtn}
            >
                <Icon label="Previous Progression">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3L6 9L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </Icon>
            </button>
            <button
                type="button"
                onClick={exerciseStatusManager.prevExercise}
                disabled={exerciseStatus.exercise.isFirst && exerciseStatus.progression.isFirst && exerciseStatus.session.isFirst}
                aria-label="Previous Exercise"
                className={styles.navBtn}
            >
                <Icon label="Previous Exercise">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4L7 9L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </Icon>
            </button>
            <button
                type="button"
                onClick={exerciseStatusManager.nextExercise}
                disabled={exerciseStatus.exercise.isLast && exerciseStatus.progression.isLast && exerciseStatus.session.isLast}
                aria-label="Next Exercise"
                className={styles.navBtn}
            >
                <Icon label="Next Exercise">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 4L11 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </Icon>
            </button>
            <button
                type="button"
                onClick={exerciseStatusManager.nextProgression}
                disabled={exerciseStatus.progression.isLast && exerciseStatus.session.isLast}
                aria-label="Next Progression"
                className={styles.navBtn}
            >
                <Icon label="Next Progression">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 3L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </Icon>
            </button>
            <button
                type="button"
                onClick={exerciseStatusManager.nextSession}
                disabled={exerciseStatus.session.isLast}
                aria-label="Next Session"
                className={styles.navBtn}
            >
                <Icon label="Next Session">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 3L11 9L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M8 3L14 9L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </Icon>
            </button>
        </nav>
    );
}

NavigationBar.propTypes = {
    exerciseStatusManager: PropTypes.object.isRequired,
    exerciseStatus: PropTypes.object.isRequired,
};


