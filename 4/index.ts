import fs from "fs";

let lines = fs.readFileSync("input.txt", "utf8").split("\n");
// lines = fs.readFileSync("example.txt", "utf8").split("\n");

const grid = lines.map((line) => line.split(""));

function printGrid(grid: string[][]) {
  for (const row of grid) {
    console.log(row.join(""));
  }
}

function checkXmasFromCoordinate(x: number, y: number): number {
  let count = 0;

  // Check right
  if (x <= grid[0].length - 4) {
    if (
      grid[y][x] === "X" &&
      grid[y][x + 1] === "M" &&
      grid[y][x + 2] === "A" &&
      grid[y][x + 3] === "S"
    ) {
      count++;
    }
  }

  // Check left
  if (x >= 3) {
    if (
      grid[y][x] === "X" &&
      grid[y][x - 1] === "M" &&
      grid[y][x - 2] === "A" &&
      grid[y][x - 3] === "S"
    ) {
      count++;
    }
  }

  // Check down
  if (y <= grid.length - 4) {
    if (
      grid[y][x] === "X" &&
      grid[y + 1][x] === "M" &&
      grid[y + 2][x] === "A" &&
      grid[y + 3][x] === "S"
    ) {
      count++;
    }
  }

  // Check up
  if (y >= 3) {
    if (
      grid[y][x] === "X" &&
      grid[y - 1][x] === "M" &&
      grid[y - 2][x] === "A" &&
      grid[y - 3][x] === "S"
    ) {
      count++;
    }
  }

  // Check diagonal down-right
  if (x <= grid[0].length - 4 && y <= grid.length - 4) {
    if (
      grid[y][x] === "X" &&
      grid[y + 1][x + 1] === "M" &&
      grid[y + 2][x + 2] === "A" &&
      grid[y + 3][x + 3] === "S"
    ) {
      count++;
    }
  }

  // Check diagonal down-left
  if (x >= 3 && y <= grid.length - 4) {
    if (
      grid[y][x] === "X" &&
      grid[y + 1][x - 1] === "M" &&
      grid[y + 2][x - 2] === "A" &&
      grid[y + 3][x - 3] === "S"
    ) {
      count++;
    }
  }

  // Check diagonal up-right
  if (x <= grid[0].length - 4 && y >= 3) {
    if (
      grid[y][x] === "X" &&
      grid[y - 1][x + 1] === "M" &&
      grid[y - 2][x + 2] === "A" &&
      grid[y - 3][x + 3] === "S"
    ) {
      count++;
    }
  }

  // Check diagonal up-left
  if (x >= 3 && y >= 3) {
    if (
      grid[y][x] === "X" &&
      grid[y - 1][x - 1] === "M" &&
      grid[y - 2][x - 2] === "A" &&
      grid[y - 3][x - 3] === "S"
    ) {
      count++;
    }
  }

  return count;
}

function a() {
  let total = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      total += checkXmasFromCoordinate(x, y);
    }
  }
  console.log("Total XMAS sequences:", total);
}

function checkMasPattern(x: number, y: number): boolean {
  // Check if center is A
  if (grid[y][x] !== "A") {
    return false;
  }

  const topLeft = grid[y - 1]?.[x - 1];
  const topRight = grid[y - 1]?.[x + 1];
  const bottomLeft = grid[y + 1]?.[x - 1];
  const bottomRight = grid[y + 1]?.[x + 1];

  console.log(x, y);
  // Log this 3x3 grid
  console.log(topLeft, grid[y - 1]?.[x], topRight);
  console.log(grid[y]?.[x - 1], grid[y]?.[x], grid[y]?.[x + 1]);
  console.log(bottomLeft, grid[y + 1]?.[x], bottomRight);
  console.log("---");

  const first = topLeft + bottomRight;
  const second = bottomLeft + topRight;

  if (["MS", "SM"].includes(first) && ["MS", "SM"].includes(second)) {
    // console.log(x, y, first, second);
    return true;
  }

  return false;
}

function b() {
  let total = 0;
  for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < grid[0].length - 1; x++) {
      if (checkMasPattern(x, y)) {
        total++;
      }
    }
  }
  console.log("Total MAS patterns:", total);
}

a();
b();
