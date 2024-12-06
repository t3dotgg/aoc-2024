import fs from "fs";

let lines = fs.readFileSync("input.txt", "utf8").split("\n");
// lines = fs.readFileSync("example.txt", "utf8").split("\n");

const grid = lines.map((line) => line.split(""));

const hashpoints = new Set<string>();

let start: [number, number] = [0, 0];

grid.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell === "#") hashpoints.add(`${x},${y}`);
    if (cell === "^") start = [x, y];
  });
});

const directions = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0],
} as const;

const turns = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
} as const;

type Direction = keyof typeof directions;

// Move in the current direction if nothing is in the way (edge or hashpoint). Otherwise turn right.
function getNextLocation(
  currentLocation: [number, number],
  currentDirection: Direction,
  extraPoint?: string
):
  | { outOfBounds: true }
  | {
      nextLocation: [number, number];
      nextDirection: Direction;
      outOfBounds: false;
    } {
  const nextX = currentLocation[0] + directions[currentDirection][0];
  const nextY = currentLocation[1] + directions[currentDirection][1];
  const nextPoint = `${nextX},${nextY}`;

  // Check if next position is in bounds
  const inBounds =
    nextX >= 0 && nextX < grid[0].length && nextY >= 0 && nextY < grid.length;

  if (!inBounds) {
    return {
      outOfBounds: true,
    };
  }

  // Check if next position hits a hashpoint
  if (hashpoints.has(`${nextX},${nextY}`) || extraPoint === nextPoint) {
    return {
      nextLocation: currentLocation,
      nextDirection: turns[currentDirection],
      outOfBounds: false,
    };
  }

  // Valid move
  return {
    nextLocation: [nextX, nextY],
    nextDirection: currentDirection,
    outOfBounds: false,
  };
}

function a() {
  // Set of visited points, include direction (N, S, E, W)
  const visitedPoints = new Set<string>();

  let currentLocation = start;
  let currentDirection = "N" as Direction;

  while (true) {
    visitedPoints.add(
      `${currentLocation[0]},${currentLocation[1]},${currentDirection}`
    );

    const next = getNextLocation(currentLocation, currentDirection);

    if (next.outOfBounds) break;

    currentLocation = next.nextLocation;
    currentDirection = next.nextDirection;
  }

  const pointsNoDirection = new Set<string>();

  visitedPoints.forEach((point) => {
    pointsNoDirection.add(point.split(",")[0] + "," + point.split(",")[1]);
  });

  console.log("Part 1:", pointsNoDirection.size);
}

function gridHasLoop(newHashPoint: [number, number]) {
  const turnPoints = new Set<string>();

  if (hashpoints.has(`${newHashPoint[0]},${newHashPoint[1]}`)) {
    return false;
  }

  const nhp = `${newHashPoint[0]},${newHashPoint[1]}`;

  let currentLocation = start;
  let currentDirection = "N" as Direction;

  while (true) {
    const next = getNextLocation(currentLocation, currentDirection, nhp);
    if (next.outOfBounds) return false;

    // Only track points where we turn
    if (next.nextDirection !== currentDirection) {
      const key = `${currentLocation[0]},${currentLocation[1]},${currentDirection}`;
      if (turnPoints.has(key)) {
        return true;
      }
      turnPoints.add(key);
    }

    currentLocation = next.nextLocation;
    currentDirection = next.nextDirection;
  }
}

function b() {
  let loopCount = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (gridHasLoop([x, y])) {
        loopCount++;
      }
    }
  }

  console.log("Part 2:", loopCount);
}

a();
b();
