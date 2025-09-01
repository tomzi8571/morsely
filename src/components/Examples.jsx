import PropTypes from "prop-types";

export const ProgressionPropType = PropTypes.shape({
    introduced: PropTypes.string.isRequired,
    words: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    sentences: PropTypes.arrayOf(PropTypes.string.isRequired)
});

export const SessionPropType = PropTypes.shape({
    description: PropTypes.string.isRequired, progressions: PropTypes.arrayOf(ProgressionPropType.isRequired).isRequired
});

// The top-level Examples() return value: keys like "1", "2", ... mapping to sessions
export const ExamplesPropType = PropTypes.objectOf(SessionPropType);

export function Examples() {
    return {
        "1": {
            "description": "Foundations (single + symmetric)",
            "subtitle": "E, T, I, M, A, N",
            "progressions": [
                {
                    "introduced": "E + T",
                    "words": ["E", "T", "TE", "ET", "TEE", "TET"],
                    "sentences": [
                        "Teetee.",
                        "Tee.",
                        "Tet.",
                        "Et.",
                        "Tee tee.",
                        "Tet tee.",
                        "Ett.",
                        "Tee et.",
                        "Tet et.",
                        "Et tee.",
                        "Tee tet.",
                        "Tet tee et."
                    ]
                },
                {
                    "introduced": "I",
                    "words": ["I", "IT", "TI", "TIE", "ITE", "TEI", "ETI"],
                    "sentences": [
                        "I tie it.",
                        "It tie.",
                        "Tie it.",
                        "Tie tee.",
                        "Tee tie.",
                        "I tie tee.",
                        "Tie it tee.",
                        "Tee it tie.",
                        "It tee tie.",
                        "Tie it, tee it.",
                        "I tie it, tee it.",
                        "Tie tee, it tie."
                    ]
                },
                {
                    "introduced": "M",
                    "words": ["M", "ME", "EM", "MET", "TIME", "EMIT", "ITEM", "MIT"],
                    "sentences": [
                        "I met it.",
                        "Me time.",
                        "Emit it.",
                        "Time me.",
                        "Meet it.",
                        "It met me.",
                        "Me emit it.",
                        "Mit time.",
                        "Item time.",
                        "Time item.",
                        "Emit time.",
                        "Met it, me time."
                    ]
                },
                {
                    "introduced": "A",
                    "words": ["A", "AM", "MA", "ATE", "EAT", "TEA", "MEAT", "MATE", "TAME", "TEAM", "META"],
                    "sentences": [
                        "I am at a tea.",
                        "Eat at a tea.",
                        "A mate ate meat.",
                        "Team ate meat.",
                        "Mate ate.",
                        "Am at a team.",
                        "Tea mate.",
                        "Meat ate.",
                        "Ate meat.",
                        "Team ate tea.",
                        "Ate tea.",
                        "Mate ate tea."
                    ]
                },
                {
                    "introduced": "N",
                    "words": ["N", "AN", "NA", "ANT", "TAN", "TEN", "NET", "NEAT", "ANTE", "MEAN", "MAN", "MINE", "MAIN"],
                    "sentences": [
                        "Ten men eat meat.",
                        "A neat man ate at ten.",
                        "Man met mate.",
                        "Mean man ate meat.",
                        "Main man ate meat.",
                        "Mine meat.",
                        "Net meat.",
                        "Ant ate meat.",
                        "Tan man ate meat.",
                        "Ten ate meat.",
                        "Man ate at ten.",
                        "Neat man ate meat."
                    ]
                }
            ]
        },
        "2": {
            "description": "2–3 symbol core families",
            "subtitle": "S, O, R, D",
            "progressions": [
                {
                    "introduced": "S",
                    "words": ["S", "AS", "SA", "SAT", "SET", "SIT", "SANE", "SEAT", "SENT"],
                    "sentences": [
                        "I sit.",
                        "Set a seat.",
                        "Seat is sent.",
                        "Sane seat is set.",
                        "Sit as seat is set.",
                        "Sent seat is sane.",
                        "As seat is set.",
                        "Sit at seat.",
                        "Seat is as sane.",
                        "Sane sit is set.",
                        "Set seat as sane.",
                        "Sit seat as sent."
                    ]
                },
                {
                    "introduced": "O",
                    "words": ["O", "TO", "ON", "ONE", "SOS", "TONE", "NOTE", "MOON", "STONE", "SOME"],
                    "sentences": [
                        "One note to one.",
                        "Moon is on one.",
                        "Note is on stone.",
                        "Stone is on moon.",
                        "Some note is on one.",
                        "Tone is on moon.",
                        "One moon is on note.",
                        "Note is on tone.",
                        "Moon is on stone.",
                        "Stone is on note.",
                        "One stone is on moon.",
                        "Note is on some moon."
                    ]
                },
                {
                    "introduced": "R",
                    "words": ["R", "AR", "RA", "EAR", "ERA", "EARN", "NEAR", "ORATE"],
                    "sentences": [
                        "Rose is near.",
                        "Rare ear is near.",
                        "Earn is near.",
                        "Area is near.",
                        "Near ear is rare.",
                        "Ear is near area.",
                        "Rare area is near.",
                        "Earn rare ear.",
                        "Area is rare.",
                        "Near area is rare.",
                        "Ear is rare area.",
                        "Rare earn is near."
                    ]
                },
                {
                    "introduced": "D",
                    "words": ["D", "AD", "DA", "DEAR", "READ", "TREAD", "SENDER"],
                    "sentences": [
                        "Read a note.",
                        "Sender read note.",
                        "Dear sender read.",
                        "Tread on road.",
                        "Road is read.",
                        "Sender is dear.",
                        "Read and send note.",
                        "Sender is on road.",
                        "Dear road is read.",
                        "Read sender note.",
                        "Sender is read.",
                        "Road is dear sender."
                    ]
                }
            ]
        },
        "3": {
            "description": "A-family (.- prefix)",
            "subtitle": "L, W, J, P",
            "progressions": [
                {
                    "introduced": "L",
                    "words": ["L", "AL", "LA", "LATE", "TALE", "LEARN", "LANE", "LEAN", "LEND", "ALONE"],
                    "sentences": [
                        "Learn a tale.",
                        "Lane is near wall.",
                        "Lean on lane.",
                        "Late lane is alone.",
                        "Tale is late.",
                        "Lean lane is late.",
                        "Alone lane is lean.",
                        "Wall is late.",
                        "Tale is lean.",
                        "Lane is tale.",
                        "Lean tale is late.",
                        "Late wall is lean."
                    ]
                },
                {
                    "introduced": "W",
                    "words": ["W", "AW", "WA", "WET", "WANE", "WEAR", "WORN", "WATER"],
                    "sentences": [
                        "Wear a warm wrap.",
                        "Wet wall is worn.",
                        "Water lane as walk.",
                        "Write a note.",
                        "Warm wall is wet.",
                        "Wane is near wall.",
                        "Wrap is warm.",
                        "Wall is water.",
                        "Walk is near wall.",
                        "Wall is walk.",
                        "Wet wrap is warm.",
                        "Water is near wall."
                    ]
                },
                {
                    "introduced": "J",
                    "words": ["J", "JA", "JO", "JET", "JOT", "JAM", "JAR", "JANET"],
                    "sentences": [
                        "Janet jots a note.",
                        "Jo and Jan jot.",
                        "Jam is in jar.",
                        "Jet is near wall.",
                        "Jot a note.",
                        "Jar is near lane.",
                        "Janet joins Jo.",
                        "Janet is near wall.",
                        "Jo is near lane.",
                        "Janet is in jar.",
                        "Jo jams a note.",
                        "Janet jets a note."
                    ]
                },
                {
                    "introduced": "P",
                    "words": ["P", "PA", "AP", "PEAR", "PEARL", "LEAP", "TAPE", "SPARE", "PARSE", "PROSE"],
                    "sentences": [
                        "Plan a step.",
                        "Tape a page.",
                        "Prep a plan.",
                        "Leap at lane.",
                        "Pearl is near wall.",
                        "Page is spare.",
                        "Parse a note.",
                        "Prose is neat.",
                        "Page is at lane.",
                        "Pear is at wall.",
                        "Spare tape is neat.",
                        "Leap is at lane."
                    ]
                }
            ]
        },
        "4": {
            "description": "N/K-family (-. prefix)",
            "subtitle": "K, X, C, Y",
            "progressions": [
                {
                    "introduced": "K",
                    "words": ["K", "AK", "KA", "AKE", "TAKE", "MAKER", "TOKEN", "OAKEN", "WORK", "YOKE"],
                    "sentences": [
                        "Oak trees can live for centuries.",
                        "Tokens mark rare events.",
                        "Work on a new task.",
                        "Take a seat near a stone.",
                        "Maker sets a neat token.",
                        "Yoke joins two oxen.",
                        "Kite soars on a windy day.",
                        "Kangaroo can leap far.",
                        "Keen minds make new work.",
                        "Oaken wood is strong.",
                        "Kids take notes in class."
                    ]
                },
                {
                    "introduced": "X",
                    "words": ["X", "AX", "OX", "TAX", "AXE", "AXON", "ANNEX", "EXTRA"],
                    "sentences": [
                        "Axon sends a note.",
                        "Annex is next to a zone.",
                        "Tax on an ox is rare.",
                        "Extra time means more.",
                        "Axe is on a stone.",
                        "Xenon is a rare gas.",
                        "Exact time is key.",
                        "Oxen work on a farm.",
                        "Axis marks a point.",
                        "Exam is next week."
                    ]
                },
                {
                    "introduced": "C",
                    "words": ["C", "AC", "CA", "ACE", "CONE", "CANE", "CAME", "CRANE", "SCAR", "SCONE", "CORN"],
                    "sentences": [
                        "Cane is a neat tool.",
                        "Corn is a main crop.",
                        "Crane can move a stone.",
                        "Scar on a cone is rare.",
                        "Scone is a treat.",
                        "Cats can act fast.",
                        "Came across a rare coin.",
                        "Crane lifts a heavy load.",
                        "Cane sugar is sweet.",
                        "Cone marks a lane."
                    ]
                },
                {
                    "introduced": "Y",
                    "words": ["Y", "AY", "YA", "YEA", "YORE", "YEAR", "YARN", "YEARN", "YOKE", "YON"],
                    "sentences": [
                        "Yarn is made of wool.",
                        "Year marks a new start.",
                        "Yoke joins a team.",
                        "Yon is far away.",
                        "Yea means yes.",
                        "Young stars shine bright.",
                        "Yawn at dawn.",
                        "Yore means long ago.",
                        "Yard is neat and open.",
                        "Yaks roam on a plain."
                    ]
                }
            ]
        },
        "5": {
            "description": "M/G/O-family (-- prefix)",
            "subtitle": "G, Z, Q (O review)",
            "progressions": [
                {
                    "introduced": "G",
                    "words": ["G", "AG", "GA", "AGE", "GORE", "GEAR", "ORGAN", "ARGON"],
                    "sentences": [
                        "Gear moves a gate.",
                        "Organ is a rare item.",
                        "Age marks a stage.",
                        "Argon is a gas.",
                        "Gore is on a mat.",
                        "Goat climbs a steep rock.",
                        "Gale winds are strong.",
                        "Gears turn in a clock.",
                        "Game is set to start.",
                        "Gold is a soft metal."
                    ]
                },
                {
                    "introduced": "Z",
                    "words": ["Z", "AZ", "ZA", "ZOO", "ZONA", "ZING", "ZONER", "AMAZE"],
                    "sentences": [
                        "Zone is near a gate.",
                        "Zing adds energy.",
                        "Maze is a test.",
                        "Zoner sets a mark.",
                        "Gaze at a star.",
                        "Zero marks the start.",
                        "Zebra runs fast.",
                        "Zinc is a useful metal.",
                        "Zest adds flavor.",
                        "Zoom in on a map."
                    ]
                },
                {
                    "introduced": "Q",
                    "words": ["Q", "QA", "QAT", "QANAT"],
                    "sentences": [
                        "Qat is a rare plant.",
                        "Qanat is an ancient tunnel.",
                        "Quota sets a mark.",
                        "Quest means a test.",
                        "Quake shakes the land.",
                        "Quick action saves time.",
                        "Queen leads a team.",
                        "Quotient is a math term.",
                        "Quail is a small bird."
                    ]
                }
            ]
        },
        "6": {
            "description": "S/H/V/F-family (dot-heavy)",
            "subtitle": "H, V, F (S review)",
            "progressions": [
                {
                    "introduced": "H",
                    "words": ["H", "AH", "HA", "HEAT", "HATE", "HINT", "HORN", "HONOR", "HEART"],
                    "sentences": [
                        "Heat rises at noon.",
                        "Horn marks a start.",
                        "Honor means respect.",
                        "Heart is a vital organ.",
                        "Hate is rare.",
                        "Hill stands tall.",
                        "Hawk soars high.",
                        "Halt at the gate.",
                        "Herd moves as one.",
                        "Hero acts with honor."
                    ]
                },
                {
                    "introduced": "V",
                    "words": ["V", "AV", "VA", "VIA", "VINE", "VEIN", "OVEN", "RIVEN", "NERVE", "RIVET"],
                    "sentences": [
                        "Vine grows on stone.",
                        "Oven bakes a treat.",
                        "Vein runs in meat.",
                        "Nerve sends a note.",
                        "Save a rare vase.",
                        "Vast area is open.",
                        "Vivid colors shine.",
                        "Vane turns in wind.",
                        "Vast view from hill.",
                        "Vast veins in leaf."
                    ]
                },
                {
                    "introduced": "F",
                    "words": ["F", "AF", "FA", "FAN", "FAR", "FINE", "FATE", "FAIR", "FAVOR"],
                    "sentences": [
                        "Fan moves air.",
                        "Fate means a set path.",
                        "Favor is a rare act.",
                        "Fair means even.",
                        "Fine art is neat.",
                        "Farm grows food.",
                        "Fast train runs far.",
                        "Faint star is seen.",
                        "Fame is hard to earn.",
                        "Ferns grow in shade."
                    ]
                }
            ]
        },
        "7": {
            "description": "I/U-family + singles review",
            "subtitle": "U (I review)",
            "progressions": [
                {
                    "introduced": "U",
                    "words": ["U", "AU", "UA", "UT", "TUN", "TUNE", "UNIT", "AUNT", "UNDO"],
                    "sentences": [
                        "Unit tests are vital.",
                        "Aunt is at a tune.",
                        "Undo a neat item.",
                        "Tune is set at noon.",
                        "Utah is a state.",
                        "Unique ideas win.",
                        "Unite for a cause.",
                        "Usual time is noon.",
                        "Ultra sound is used.",
                        "Under a unit is a nut."
                    ]
                }
            ]
        },
        "8": {
            "description": "Tricky contrasts",
            "subtitle": "B",
            "progressions": [
                {
                    "introduced": "B",
                    "words": ["B", "AB", "BA", "BAN", "BEAN", "BEAR", "BARN", "BAND", "BOARD", "ABROAD", "BRAND"],
                    "sentences": [
                        "Bean is a main crop.",
                        "Band sets a new record.",
                        "Board is on a stand.",
                        "Brand marks a name.",
                        "Barn stores oats.",
                        "Boat sails on a bay.",
                        "Brave bear stands tall.",
                        "Bread is baked fresh.",
                        "Blue barn is rare.",
                        "Big band plays music."
                    ]
                }
            ]
        }

    };
}

// Koch method improvement stub:
// To fully implement the Koch method, add logic to track user accuracy for the current set of letters.
// Only unlock the next progression when mastery (e.g., 90% accuracy) is achieved.
// Practice should always be at full target speed.
