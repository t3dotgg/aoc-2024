import fs from "fs";

const lines = fs.readFileSync("input.txt", "utf8").trim().split("\n");
// const lines = fs.readFileSync("example.txt", "utf8").trim().split("\n");
const grid = lines.map((line) => line.split(""));

const height = grid.length;
const width = grid[0].length;

function inBounds(x: number, y: number) {
  return x >= 0 && x < width && y >= 0 && y < height;
}

const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const visited = Array.from({ length: height }, () => Array(width).fill(false));
const regions: { cells: { x: number; y: number }[]; char: string }[] = [];

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (!visited[y][x]) {
      visited[y][x] = true;
      const character = grid[y][x];
      const cells = [{ x, y }];
      const queue = [{ x, y }];

      while (queue.length) {
        const { x: cx, y: cy } = queue.shift()!;
        directions.forEach(([dx, dy]) => {
          const nx = cx + dx;
          const ny = cy + dy;
          if (
            inBounds(nx, ny) &&
            !visited[ny][nx] &&
            grid[ny][nx] === character
          ) {
            visited[ny][nx] = true;
            cells.push({ x: nx, y: ny });
            queue.push({ x: nx, y: ny });
          }
        });
      }

      regions.push({ cells, char: character });
    }
  }
}

function computePerimeter(region: { cells: { x: number; y: number }[] }) {
  const cellSet = new Set(region.cells.map((c) => `${c.x},${c.y}`));
  let perimeter = 0;
  region.cells.forEach(({ x, y }) => {
    directions.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (!inBounds(nx, ny) || !cellSet.has(`${nx},${ny}`)) perimeter++;
    });
  });
  return perimeter;
}

function createUnionFind(elements: string[]) {
  const parent: Record<string, string> = {};
  const size: Record<string, number> = {};
  elements.forEach((e) => {
    parent[e] = e;
    size[e] = 1;
  });

  function find(element: string) {
    let p = element;
    while (p !== parent[p]) {
      parent[p] = parent[parent[p]];
      p = parent[p];
    }
    return p;
  }

  function union(a: string, b: string) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) {
      if (size[rootA] < size[rootB]) {
        parent[rootA] = rootB;
        size[rootB] += size[rootA];
      } else {
        parent[rootB] = rootA;
        size[rootA] += size[rootB];
      }
    }
  }

  function countComponents() {
    const roots = elements.map(find);
    return new Set(roots).size;
  }

  return { union, countComponents };
}

function computeSides(region: { cells: { x: number; y: number }[] }) {
  const cellSet = new Set(region.cells.map((c) => `${c.x},${c.y}`));

  const leftEdges: string[] = [];
  const rightEdges: string[] = [];
  const topEdges: string[] = [];
  const bottomEdges: string[] = [];

  region.cells.forEach(({ x, y }) => {
    const key = `${x},${y}`;
    if (!cellSet.has(`${x - 1},${y}`)) leftEdges.push(key);
    if (!cellSet.has(`${x + 1},${y}`)) rightEdges.push(key);
    if (!cellSet.has(`${x},${y - 1}`)) topEdges.push(key);
    if (!cellSet.has(`${x},${y + 1}`)) bottomEdges.push(key);
  });

  function parseKey(k: string) {
    const [X, Y] = k.split(",").map(Number);
    return [X, Y] as [number, number];
  }

  function unionLineSegments(elements: string[], vertical: boolean) {
    if (!elements.length) return 0;
    const uf = createUnionFind(elements);
    const positions = new Set(elements);
    elements.forEach((element) => {
      const [X, Y] = parseKey(element);
      if (vertical) {
        const up = `${X},${Y - 1}`;
        const down = `${X},${Y + 1}`;
        if (positions.has(up)) uf.union(element, up);
        if (positions.has(down)) uf.union(element, down);
      } else {
        const left = `${X - 1},${Y}`;
        const right = `${X + 1},${Y}`;
        if (positions.has(left)) uf.union(element, left);
        if (positions.has(right)) uf.union(element, right);
      }
    });
    return uf.countComponents();
  }

  return (
    unionLineSegments(leftEdges, true) +
    unionLineSegments(rightEdges, true) +
    unionLineSegments(topEdges, false) +
    unionLineSegments(bottomEdges, false)
  );
}

function part1() {
  let total = 0;
  regions.forEach((region) => {
    const area = region.cells.length;
    total += area * computePerimeter(region);
  });
  console.log("Part 1:", total);
}

function part2() {
  let total = 0;
  regions.forEach((region) => {
    const area = region.cells.length;
    total += area * computeSides(region);
  });
  console.log("Part 2:", total);
}

part1();
part2();
