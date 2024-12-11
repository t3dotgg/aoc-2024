import fs from "fs";

let line = fs.readFileSync("input.txt", "utf8").trim();
// line = fs.readFileSync("example.txt", "utf8").trim();

const startingStones: StoneCount = {};
for (const stone of line.split(" ")) {
  const num = parseInt(stone, 10);
  startingStones[num] = (startingStones[num] || 0) + 1;
}

function transformStone(stone: number) {
  const stoneStr = stone.toString();
  if (stone === 0) {
    return [1];
  }
  if (stoneStr.length % 2 === 0) {
    const mid = stoneStr.length / 2;
    return [parseInt(stoneStr.slice(0, mid)), parseInt(stoneStr.slice(mid))];
  }

  return [stone * 2024];
}

type StoneCount = { [key: number]: number };

function blink(stones: StoneCount) {
  const nextStones: StoneCount = {};

  for (const [stone, count] of Object.entries(stones)) {
    const stoneNum = parseInt(stone, 10);
    const transformed = transformStone(stoneNum);

    transformed.forEach((newStone) => {
      nextStones[newStone] = (nextStones[newStone] || 0) + count;
    });
  }

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
  const result = countStonesAfterBlinks(25);
  console.log("Part 1:", result);
}

function part2() {
  const result = countStonesAfterBlinks(75);
  console.log("Part 2:", result);
}

part1();
part2();
