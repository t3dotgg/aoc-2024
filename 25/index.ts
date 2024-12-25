import fs from "fs";

const chunks = fs
  .readFileSync("input.txt", "utf8")
  .split("\n\n")
  .map((c) => c.split("\n"));

function parseHeights(schematic: string[]) {
  const heights = [0, 0, 0, 0, 0];
  for (let col = 0; col < 5; col++) {
    for (let row = 1; row <= 5; row++) {
      if (schematic[row][col] === "#") heights[col]++;
    }
  }
  return heights;
}

const locks: number[][] = [];
const keys: number[][] = [];

chunks.forEach((chunk) => {
  const top = chunk[0];
  const bottom = chunk[6];

  if (top === "#####") {
    locks.push(parseHeights(chunk));
  } else if (bottom === "#####") {
    keys.push(parseHeights(chunk));
  } else {
    throw new Error("Unknown schematic type");
  }
});

let validPairs = 0;

locks.forEach((lockHeights) => {
  keys.forEach((keyHeights) => {
    let fits = true;
    for (let c = 0; c < 5; c++) {
      if (lockHeights[c] + keyHeights[c] > 5) {
        fits = false;
        break;
      }
    }
    if (fits) validPairs++;
  });
});

console.log(validPairs);
