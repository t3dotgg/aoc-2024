import fs from "fs";

// Parse input numbers
const stones = fs
  .readFileSync("input.txt", "utf8")
  .trim()
  .split(/\s+/)
  .map(Number);

function transformStone(n: number): number[] {
  // Rule 1: If stone is 0, replace with 1
  if (n === 0) return [1];

  // Rule 2: If even number of digits, split into two stones
  const numStr = n.toString();
  if (numStr.length % 2 === 0) {
    const mid = Math.floor(numStr.length / 2);
    const left = parseInt(numStr.slice(0, mid));
    const right = parseInt(numStr.slice(mid));
    return [left, right];
  }

  // Rule 3: Multiply by 2024
  return [n * 2024];
}

function simulateBlink(stones: number[]): number[] {
  const result: number[] = [];

  for (const stone of stones) {
    result.push(...transformStone(stone));
  }

  return result;
}

function part1() {
  let currentStones = stones;
  for (let i = 0; i < 25; i++) {
    currentStones = simulateBlink(currentStones);
  }

  console.log("Part 1:", currentStones.length);
}

part1();
