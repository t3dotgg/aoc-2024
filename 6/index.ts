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
  hp2?: Set<string>
): {
  nextLocation: [number, number];
  nextDirection: Direction;
  outOfBounds: boolean;
} {
  const [x, y] = currentLocation;
  const [dx, dy] = directions[currentDirection];
  const nextX = x + dx;
  const nextY = y + dy;

  const hp = hp2 || hashpoints;

  // Check if next position is in bounds
  const inBounds =
    nextX >= 0 && nextX < grid[0].length && nextY >= 0 && nextY < grid.length;

  if (!inBounds) {
    return {
      nextLocation: currentLocation,
      nextDirection: currentDirection,
      outOfBounds: true,
    };
  }

  // Check if next position hits a hashpoint
  if (hp.has(`${nextX},${nextY}`)) {
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
  let outOfBounds = false;

  while (
    !outOfBounds &&
    !visitedPoints.has(
      `${currentLocation[0]},${currentLocation[1]},${currentDirection}`
    )
  ) {
    visitedPoints.add(
      `${currentLocation[0]},${currentLocation[1]},${currentDirection}`
    );

    const next = getNextLocation(currentLocation, currentDirection);
    currentLocation = next.nextLocation;
    currentDirection = next.nextDirection;
    outOfBounds = next.outOfBounds;
  }

  const pointsNoDirection = new Set<string>();

  visitedPoints.forEach((point) => {
    pointsNoDirection.add(point.split(",")[0] + "," + point.split(",")[1]);
  });

  console.log("Part 1:", pointsNoDirection.size);
}

function gridHasLoop(newHashPoint: [number, number]) {
  const visitedPoints = new Set<string>();

  if (hashpoints.has(`${newHashPoint[0]},${newHashPoint[1]}`)) {
    return false;
  }

  const hp = new Set(hashpoints);
  hp.add(`${newHashPoint[0]},${newHashPoint[1]}`);

  let currentLocation = start;
  let currentDirection = "N" as Direction;
  let outOfBounds = false;

  while (!outOfBounds) {
    if (
      visitedPoints.has(
        `${currentLocation[0]},${currentLocation[1]},${currentDirection}`
      )
    ) {
      return true;
    }

    visitedPoints.add(
      `${currentLocation[0]},${currentLocation[1]},${currentDirection}`
    );

    const next = getNextLocation(currentLocation, currentDirection, hp);
    currentLocation = next.nextLocation;
    currentDirection = next.nextDirection;
    outOfBounds = next.outOfBounds;
  }

  return !outOfBounds;
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
