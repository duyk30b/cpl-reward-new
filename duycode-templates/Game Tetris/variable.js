window.onbeforeunload = function (example) {
    example = example || window.event;
    if (example) {
        example.returnValue = 'Are you sure you want to close the Tab?';
    }
    return 'Are you sure you want to close the Tab?';
};

const BASIC_COLOR = '#d9e7e7';
const BRICK_COLOR_SPREADBOMB = '#e3046b';
const BRICK_COLOR_ZERO = '#5e6b85';
const BRICK_COLOR_ONE = '#641dff';
const BRICK_COLOR_TWO = '#09ce5f';
const BRICK_COLOR_THREE = '#16c4c3';
const BRICK_COLOR_FOUR = '#becc03';
const BRICK_COLOR_FIVE = '#d905c6';
const BRICK_COLOR_SIX = '#ff7004';
const BRICK_COLOR_SEVEN = '#e3046b';

//setup canvas
let main = document.getElementById("main");
let DOT_WIDTH = main.offsetWidth / 15;
let DOT_HEIGHT = main.offsetHeight / 20;
let DOT_SIZE = DOT_WIDTH > DOT_HEIGHT ? DOT_HEIGHT : DOT_WIDTH;
let canvasWidth = DOT_SIZE*15;
let canvasHeight = DOT_SIZE*20;

let NUM_ROWS = 24;
let NUM_COLS = 10;
let preview_col = 10.5;

//setup type game
let addBehindRow = document.getElementById("addBehindRow");
let moreWeapon = document.getElementById("moreWeapon");
let moreBrick = document.getElementById("moreBrick");

//setup game board
let gameBoard = document.getElementsByClassName("gameBoard")[0];
let footer = document.getElementById("footer");
gameBoard.style.bottom = footer.offsetHeight + 10 + "px";
gameBoard.style.right = (main.offsetWidth - canvasWidth)/2 + 10 + "px";
gameBoard.style.height = canvasHeight * 0.75 + "px";
gameBoard.style.width = canvasWidth * 0.30 + "px";


const _ = null;
let baseBrick = [
    [
        [_,_,_,_],
        [1,1,1,1],
        [_,_,_,_],
    ],
    [
        [2,2,2],
        [2,_,_]
    ],
    [
        [3,3,3],
        [_,3,_]
    ],
    [
        [4,4,4],
        [_,_,4]
    ],
    [
        [5,5,_],
        [_,5,5]
    ],
    [
        [_,6,6],
        [6,6,_]
    ],
    [
        [7,7],
        [7,7]
    ]
];
let baseGun = [
    [
        ["shadow"],
        ["shadow"],
        ["gun"]
    ],
    [
        [0],
        [0],
        ["gun"]
    ]
];
let advanceBrick = [
    [
        [8]
    ],
    [
        [9,9]
    ],
    [
        [_,_,_],
        [10,10,10],
        [_,_,_]
    ],
    [
        [11,11],
        [11,_]
    ],
    [
        [_,_,_,_,],
        [12,12,12,12],
        [12,_,_,_,]
    ],
    [
        [_,_,_,_,],
        [13,13,13,13],
        [_,13,_,_,]
    ],
    [
        [_,_,_,_,],
        [14,14,14,14],
        [_,_,14,_,]
    ],
    [
        [_,_,_,_,],
        [15,15,15,15],
        [_,_,_,15]
    ],
    [
        [16,16,16],
        [_,16,16]
    ],
    [
        [17,17,17],
        [17,17,_]
    ],
    [
        [18,18,18],
        [18,_,18]
    ],
    [
        [19,19,19],
        [_,19,_],
        [_,19,_]
    ],
    [
        [20,20,20],
        [20,_,_],
        [20,_,_]
    ],

    [
        [_,21,_],
        [21,21,21],
        [_,21,_]
    ]
];
