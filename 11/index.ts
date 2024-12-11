import fs from "fs";

let line = fs.readFileSync("input.txt", "utf8").trim();
// line = fs.readFileSync("example.txt", "utf8").trim();

const startingStones: Record<number, number> = {};
line.split(" ").forEach((stone) => {
  const num = Number(stone);
  startingStones[num] = (startingStones[num] || 0) + 1;
});

function transformStone(stone: number): number[] {
  if (stone === 0) return [1];

  const stoneStr = stone.toString();
  if (stoneStr.length % 2 === 0) {
    const mid = stoneStr.length / 2;
    return [Number(stoneStr.slice(0, mid)), Number(stoneStr.slice(mid))];
  }

  return [stone * 2024];
}

function blink(stones: Record<number, number>) {
  const nextStones: Record<number, number> = {};
  Object.entries(stones).forEach(([stone, count]) => {
    transformStone(+stone).forEach((newStone) => {
      nextStones[newStone] = (nextStones[newStone] || 0) + count;
    });
  });
  return nextStones;
}

function countStonesAfterBlinks(numBlinks: number) {
  let stones = { ...startingStones };
  for (let i = 0; i < numBlinks; i++) {
    stones = blink(stones);
  }
  return Object.values(stones).reduce((sum, count) => sum + count, 0);
}

function part1() {
  console.log("Part 1:", countStonesAfterBlinks(25));
}

function part2() {
  console.log("Part 2:", countStonesAfterBlinks(75));
}

part1();
part2();
