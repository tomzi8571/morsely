import * as PropTypes from "prop-types";

export function Progression({status}) {

    const lessons = () => {
        const numberOfLessonsToGo = status.exercise.size - status.exercise.index - 1;
        const isLastLesson = numberOfLessonsToGo === 0;
        return isLastLesson === true ? 'Awesome - your last one :)' : `Only ${numberOfLessonsToGo} more to go`;
    }

    return <div className='progression'>
        <h2>{lessons()}</h2>
    </div>;
}

Progression.propTypes = {
    progression: PropTypes.shape({introduced: PropTypes.string}),
};
