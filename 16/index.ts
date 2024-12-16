import fs from "fs";

let lines = fs.readFileSync("input.txt", "utf8").split("\n");
// lines = fs.readFileSync("example.txt", "utf8").split("\n");

const grid = lines.map((line) => line.split(""));

let start = [-1, -1];
let end = [-1, -1];

grid.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell === "S") start = [x, y];
    if (cell === "E") end = [x, y];
  });
});

const directions = [
  { dx: 1, dy: 0, name: "E" },
  { dx: 0, dy: 1, name: "S" },
  { dx: -1, dy: 0, name: "W" },
  { dx: 0, dy: -1, name: "N" },
] as const;

function getTurnCost(from: number, to: number) {
  const diff = Math.abs(from - to);
  const turns = Math.min(diff, 4 - diff);
  return turns * 1000;
}

type StateKey = `${number},${number},${number}`;
type Position = `${number},${number}`;
function findLowestScore() {
  const queue: { cost: number; x: number; y: number; dir: number }[] = [];
  const visited = new Set<StateKey>();

  queue.push({ cost: 0, x: start[0], y: start[1], dir: 0 });

  while (queue.length > 0) {
    const { cost, x, y, dir } = queue.shift()!;
    const key: StateKey = `${x},${y},${dir}`;

    if (x === end[0] && y === end[1]) {
      return cost;
    }

    if (visited.has(key)) continue;
    visited.add(key);

    directions.forEach((newDir, newDirIndex) => {
      const newX = x + newDir.dx;
      const newY = y + newDir.dy;

      if (newX < 0 || newY < 0 || newX >= grid[0].length || newY >= grid.length)
        return;
      if (grid[newY][newX] === "#") return;

      const moveCost = 1;
      const turnCost = getTurnCost(dir, newDirIndex);
      const totalCost = cost + moveCost + turnCost;

      queue.push({ cost: totalCost, x: newX, y: newY, dir: newDirIndex });
      queue.sort((a, b) => a.cost - b.cost);
    });
  }

  return Infinity;
}

function part1() {
  console.log("Part 1:", findLowestScore());
}

function part2() {
  const minEndCost = findLowestScore();

  const costs = new Map<StateKey, number>();
  const optimalPaths = new Set<Position>();
  const paths = new Map<StateKey, Position[]>();

  const queue: {
    cost: number;
    x: number;
    y: number;
    dir: number;
    path: Position[];
  }[] = [];

  queue.push({
    cost: 0,
    x: start[0],
    y: start[1],
    dir: 0,
    path: [`${start[0]},${start[1]}`],
  });

  while (queue.length > 0) {
    const { cost, x, y, dir, path } = queue.shift()!;
    const key: StateKey = `${x},${y},${dir}`;

    if (cost > minEndCost) continue;
    if (costs.has(key) && costs.get(key)! < cost) continue;

    costs.set(key, cost);
    paths.set(key, path);

    if (x === end[0] && y === end[1]) {
      path.forEach((pos) => optimalPaths.add(pos));
      continue;
    }

    directions.forEach((newDir, newDirIndex) => {
      const newX = x + newDir.dx;
      const newY = y + newDir.dy;

      if (newX < 0 || newY < 0 || newX >= grid[0].length || newY >= grid.length)
        return;
      if (grid[newY][newX] === "#") return;

      const moveCost = 1;
      const turnCost = getTurnCost(dir, newDirIndex);
      const totalCost = cost + moveCost + turnCost;
      const newPos: Position = `${newX},${newY}`;

      const newPath = [...path, newPos];
      const insertIndex = queue.findIndex(({ cost }) => cost > totalCost);
      if (insertIndex === -1) {
        queue.push({
          cost: totalCost,
          x: newX,
          y: newY,
          dir: newDirIndex,
          path: newPath,
        });
      } else {
        queue.splice(insertIndex, 0, {
          cost: totalCost,
          x: newX,
          y: newY,
          dir: newDirIndex,
          path: newPath,
        });
      }
    });
  }

  console.log("Part 2:", optimalPaths.size);
}

part1();
part2();
