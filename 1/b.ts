import fs from "fs";

const lines = fs
  .readFileSync("input.txt", "utf8")
  .split("\n")
  .map((r) => r.split("   ").map((n) => parseInt(n, 10)));

console.log(lines);

const list1 = lines.map(([a, b]) => a);
const list2 = lines.map(([a, b]) => b);

const occurences = list1.map((n) => n * list2.filter((m) => m === n).length);

console.log(occurences);

const sum = occurences.reduce((acc, curr) => acc + curr, 0);

console.log(sum);
