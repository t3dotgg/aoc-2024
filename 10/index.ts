import fs from "fs";

const lines = fs.readFileSync("input.txt", "utf8").trim().split("\n");
// const lines = fs.readFileSync("example.txt", "utf8").trim().split("\n");

const grid = lines.map((line) => line.split("").map(Number));
const rows = grid.length;
const cols = grid[0].length;

const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function getTrailheads(): [number, number][] {
  const trailheads: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0) {
        trailheads.push([r, c]);
      }
    }
  }
  return trailheads;
}

function part1() {
  function countReachableNines(r0: number, c0: number): number {
    const visited = new Set<string>();
    const queue: [number, number][] = [[r0, c0]];
    visited.add(`${r0},${c0}`);
    const nines = new Set<string>();

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const h = grid[r][c];
      if (h === 9) {
        nines.add(`${r},${c}`);
        continue;
      }
      for (const [dr, dc] of directions) {
        const nr = r + dr,
          nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (grid[nr][nc] === h + 1 && !visited.has(`${nr},${nc}`)) {
          visited.add(`${nr},${nc}`);
          queue.push([nr, nc]);
        }
      }
    }

    return nines.size;
  }

  const trailheads = getTrailheads();
  let sum = 0;
  for (const [r, c] of trailheads) sum += countReachableNines(r, c);
  console.log("Part 1:", sum);
}

function part2() {
  const memo = new Map<string, number>();

  function key(r: number, c: number): string {
    return `${r},${c}`;
  }

  function ways(r: number, c: number): number {
    const k = key(r, c);
    if (memo.has(k)) return memo.get(k)!;
    const h = grid[r][c];
    if (h === 9) {
      memo.set(k, 1);
      return 1;
    }
    let total = 0;
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (grid[nr][nc] === h + 1) total += ways(nr, nc);
    }
    memo.set(k, total);
    return total;
  }

  const trailheads = getTrailheads();
  let sum = 0;
  for (const [r, c] of trailheads) sum += ways(r, c);
  console.log("Part 2:", sum);
}

part1();
part2();
