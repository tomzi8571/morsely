import {useEffect, useState} from "react";
import { getLogger } from '../logger';

export function Letter({letter, alphabet, highlightKey, highlight, reveal = false}) {
    const logger = getLogger('Letter');

    const [match, setMatch] = useState();
    const [genHighlightKey, setGenHighlightKey] = useState();

    useEffect(() => {
        if (!letter) return null;
        const {letters} = alphabet;
        const matcher = letters.find(
            ({text}) => text.toUpperCase() === String(letter).toUpperCase()
        );
        setMatch(() => matcher);
        let genKey = String(highlightKey).replace(/ /g, '-').toLowerCase();
        setGenHighlightKey(() => genKey)
        logger.debug(genKey)
    })

    const currentHighlightKey = String(highlight).replace(/ /g, '-').toLowerCase();
    const highlightLetter = String(currentHighlightKey).startsWith(String(genHighlightKey));
        logger.debug({progression: letter, highlight, genHighlightKey, currentHighlightKey, highlightLetter});

    return (
        <span className='letter'>
            {String(letter).trim() === '' ? <span className="word-seperator"/> : ''}
            <span style={{color: highlightLetter ? 'lightgreen' : 'white'}}>
                <span className='morse'>{match ? match.morse : ''}</span>
                <span className='reveal'>{reveal || highlightLetter ? letter : ''}</span>
            </span>
        </span>
    );
}
