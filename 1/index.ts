import fs from "fs";

const lines = fs
  .readFileSync("input.txt", "utf8")
  .split("\n")
  .map((line) => line.split("   "));

const leftList = lines.map(([left, _]) => parseInt(left, 10)).sort();
const rightList = lines.map(([_, right]) => parseInt(right, 10)).sort();

function sum(list: number[]) {
  return list.reduce((acc, curr) => acc + curr, 0);
}

const sumDifferences = sum(
  leftList.map((leftNum, index) => Math.abs(leftNum - rightList[index]))
);

const sumOccurences = sum(
  leftList.map(
    (leftNum) =>
      leftNum * rightList.filter((rightNum) => rightNum === leftNum).length
  )
);

console.log("part 1:", sumDifferences);
console.log("part 2:", sumOccurences);
