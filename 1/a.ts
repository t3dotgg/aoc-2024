import fs from "fs";

const lines = fs
  .readFileSync("input.txt", "utf8")
  .split("\n")
  .map((r) => r.split("   ").map((n) => parseInt(n, 10)));

console.log(lines);

const list1 = lines.map(([a, b]) => a);
const list2 = lines.map(([a, b]) => b);

const sorted1 = list1.sort((a, b) => a - b);
const sorted2 = list2.sort((a, b) => a - b);

const diffs = sorted1.map((n, i) => Math.abs(sorted2[i] - n));

const sum = diffs.reduce((acc, curr) => acc + curr, 0);
console.log(sum);
