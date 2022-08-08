const ROWS = 20;
const COLS = 12;

const I = [
  [0xF, 0x0, 0x0, 0x0],
  [0x1, 0x1, 0x1, 0x1],
  [0x0, 0x0, 0x0, 0xF],
  [0x8, 0x8, 0x8, 0x8],
];

const T = [
  [0x7, 0x2, 0x0],
  [0x2, 0x3, 0x2],
  [0x0, 0x2, 0x7],
  [0x1, 0x3, 0x1],
];

const L = [
  [0x7, 0x4, 0x0],
  [0x2, 0x2, 0x3],
  [0x3, 0x1, 0x1],
  [0x0, 0x1, 0x7]
];

const S = [
  [0x3, 0x3, 0x0],
];

const Z = [
  [0x3,0x6,0x0],
  [0x1, 0x3, 0x2],
  [0x6,0x3,0x0],
  [0x2, 0x3, 0x1],
];

const TETROID_SET = [I, T, L, S, Z];

const INITIAL = {
  tetroid: {
    pos: [0,0], // x and y coordinates
    shape: TETROID_SET[Math.floor(TETROID_SET.length * Math.random())]
  },
  board: [
    ...Array(ROWS).fill(0x1000),
    0xFFF,
  ],
};

function initialize() {
  let state = INITIAL;
  initBoard(state);
  render(transition(state));
  // BASED MODE
  document.addEventListener("keypress", e => {
    if (e.key === "h") state = transition(state, translateLeft);
    if (e.key === "l") state = transition(state, translateRight);
    if (e.key === "j") state = transition(state, translateDown);
    if (e.key === "k") state = transition(state, rotate);
    render(state);
  });
  // PLEB MODE
  document.addEventListener("keydown", e => {
    console.log(e);
    if (e.keyCode === 37) state = transition(state, translateLeft);
    if (e.keyCode === 39) state = transition(state, translateRight);
    if (e.keyCode === 40) state = transition(state, translateDown);
    if (e.keyCode === 38) state = transition(state, rotate);
    render(state);
  });
  setInterval(() => {
    state = transition(state, translateDown);
    render(state);
  }, 1000);
}

function embedTetroid(tetroid) {
  const [x,y] = tetroid.pos;
  return [
    ...Array(y).fill(0x000),
    ...tetroid.shape[0].map(s => (s << x)),
    ...Array((ROWS - (y+2)) < 0 ? 0 : ROWS - (y+2)).fill(0x000),
  ];
}

function isColliding(state) {
  let RETURN_VALUE = 0;
  embedTetroid(state.tetroid).forEach((s, r) => {
    if (s & state.board[r]) {
      RETURN_VALUE = 1; 
    }
  });
  return RETURN_VALUE;
}

function scanLines(state) {
  const filteredBoard = state.board.slice(0,ROWS).filter(line => {
      return !((line & 0xFFF) === 0xFFF);
  });
  const newBoard = [
    ...Array(ROWS - filteredBoard.length).fill(0x1000),
    ...filteredBoard,
    0xFFF
  ];
  return {
    ...state,
    board: newBoard
  };
}

const transition = (state, cb=s=>s) => {
  const newState = scanLines(cb(state));
  return {tetroid: newState.tetroid, board: newState.board};
};

function translateDown(state) {
  const candidateState = {
    ...state,
    tetroid: {
      ...state.tetroid,
      pos: [state.tetroid.pos[0], state.tetroid.pos[1]+1]
    }
  };
  if (isColliding(candidateState))  {
    const newBoard = embedTetroid(state.tetroid).map((s,r) => (s ^ state.board[r]));
    return {...state, board: newBoard, tetroid: {
      pos: [0,0],
      shape: TETROID_SET[Math.floor(TETROID_SET.length * Math.random())]
    }};
  }
  return candidateState;
}

function translateLeft(state) {
  const candidateState = {
    ...state,
    tetroid: {
      ...state.tetroid,
      pos: [state.tetroid.pos[0]-1 < 0
	    ? state.tetroid.pos[0]
	    : state.tetroid.pos[0] - 1,
	    state.tetroid.pos[1]]
    }
  };
  if (isColliding(candidateState)) console.log("left collision");
  return candidateState;
}

function translateRight(state) {
  const candidateState = {
    ...state,
    tetroid: {
      ...state.tetroid,
      pos: [state.tetroid.pos[0]+1, state.tetroid.pos[1]]
    }
  };
  if (isColliding(candidateState)) return state;
  return candidateState;
}

function rotate(state) {
  const [head, ...tail] = state.tetroid.shape;
  return {...state,
	  tetroid: {...state.tetroid, shape: [...tail, head]}};
}

function initBoard(state) {
  const board = document.getElementById("board");
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = document.createElement("div");
      if (!((state.board[y] >> x) & 1)) {
	cell.setAttribute("class", "free");
      } else {
	cell.setAttribute("class", "occupied");
      }
      cell.setAttribute("id", `${x}-${y}`);
      board.appendChild(cell);
    }
  }
}

function render(state) {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = document.getElementById(`${x}-${y}`);
      if (!((state.board[y] >> x) & 1) &&
	  !((embedTetroid(state.tetroid)[y] >> x) & 1)) {
	cell.setAttribute("class", "free");
      } else {
	cell.setAttribute("class", "occupied");
      }
    }
  }
}

window.onload = initialize;
