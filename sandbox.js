const L = [
  // 1110
  // 1000
  // 0000
  // 0000
  0xE,
  0x8,
  0x0,
  0x0,
];

const printTetroid = t => t
      .forEach(r => console.log(`0x${r.toString(16).toUpperCase()}`));

L.forEach(r => r << 2);
printTetroid(L);

console.log(0xF, 0x0F0);
console.log((0xF << 4).toString(16));

// [0xE, 0x8, 0x0, 0x0] => [0x8, 0x8, 0xC, 0x0]

const myArr = [
  ['a'],
  ['b'],
  ['c'],
  ['d'],
];

function rotate(arr) {
  const [head, ...tail] = arr;
  return [...tail, head];
}

console.log(rotate(rotate(rotate(myArr))));

