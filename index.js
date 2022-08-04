const ROWS = 20;
const COLS = 12;

const I = [
  [0xF, 0x0, 0x0, 0x0],
  [0x1, 0x1, 0x1, 0x1],
  [0x0, 0x0, 0x0, 0xF],
  [0x8, 0x8, 0x8, 0x8],
];

const T = [
  [0xE, 0x4, 0x0],
  [0x2, 0x3, 0x2],
  [0x0, 0x4, 0xE],
  [0x1, 0x3, 0x1],
];

const INITIAL = {
  tetroid: {
    pos: [0,0], // x and y coordinates
    shape: T, // rotate me
  },
  board: new Array(ROWS).fill(0x000),
};

// REMEMBER ENDIANNESS
// We can simply use HEX to represent tetroids.
// 0x8, 1000
// 0x8, 1000
// 0xc, 1100
// which can be further condensed as:
// 0x88c, where each hex place represents a row
// For other orientations, we apply the same strategy.
// 0x0017
// 0000
// 0001
// 0111
// 0x311
// 0011
// 0001
// 0001
// 0xE80
// 1110
// 1000
// 0000

// 0000
// 0001
// 0011
// 0001

function initialize() {
  let state = INITIAL;
  initBoard(state);
  render(transition(state));
  document.addEventListener("keypress", e => {
    if (e.key === "h") state = transition(state, translateLeft);
    if (e.key === "l") state = transition(state, translateRight);
    if (e.key === "j") state = transition(state, translateDown);
    if (e.key === "k") state = transition(state, rotate);
    render(state);
  });
}

function embedTetroid(tetroid) {
  const [x,y] = tetroid.pos;
  return [
    ...Array(y).fill(0x000),
    ...tetroid.shape[0].map(s => s << x),
    ...Array(ROWS - (y)).fill(0x000),
  ];
}

function transition(state, cb=s=>s) {
  state = cb(state);
  // const newBoard = state.tetroid.map((s,r) => (s ^ board[r]));
  const newBoard = embedTetroid(state.tetroid).map((s,r) => (s ^ board[r]));
  return {
    tetroid: state.tetroid,
    board: newBoard,
  };
}

function translateDown(state) {
  return {...state,
	  tetroid: {...state.tetroid,
		    pos: [state.tetroid.pos[0], state.tetroid.pos[1] + 1]}};
}

function translateLeft(state) {
  return {...state,
	  tetroid: {...state.tetroid,
		    pos: [state.tetroid.pos[0] - 1, state.tetroid.pos[1]]}};
}

function translateRight(state) {
  return {...state,
	  tetroid: {...state.tetroid,
		    pos: [state.tetroid.pos[0] + 1, state.tetroid.pos[1]]}};
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
      if (!((state.board[y] >> x) & 1)) {
	cell.setAttribute("class", "free");
      } else {
	cell.setAttribute("class", "occupied");
      }
    }
  }
}

window.onload = initialize;
