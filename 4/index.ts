import fs from "fs";

let lines = fs.readFileSync("input.txt", "utf8").split("\n");
lines = fs.readFileSync("example.txt", "utf8").split("\n");

const grid = lines.map((line) => line.split(""));

function gp(x: number, y: number) {
  return grid[y]?.[x];
}

function a() {
  function generateAllDirsForPoint(x: number, y: number) {
    return [
      gp(x, y) + gp(x + 1, y) + gp(x + 2, y) + gp(x + 3, y),
      gp(x, y) + gp(x - 1, y) + gp(x - 2, y) + gp(x - 3, y),
      gp(x, y) + gp(x, y + 1) + gp(x, y + 2) + gp(x, y + 3),
      gp(x, y) + gp(x, y - 1) + gp(x, y - 2) + gp(x, y - 3),
      gp(x, y) + gp(x + 1, y + 1) + gp(x + 2, y + 2) + gp(x + 3, y + 3),
      gp(x, y) + gp(x - 1, y + 1) + gp(x - 2, y + 2) + gp(x - 3, y + 3),
      gp(x, y) + gp(x + 1, y - 1) + gp(x + 2, y - 2) + gp(x + 3, y - 3),
      gp(x, y) + gp(x - 1, y - 1) + gp(x - 2, y - 2) + gp(x - 3, y - 3),
    ];
  }

  function checkXmasFromCoordinate(x: number, y: number): number {
    if (gp(x, y) !== "X") return 0;

    return generateAllDirsForPoint(x, y).filter((dir) => dir === "XMAS").length;
  }

  let total = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      total += checkXmasFromCoordinate(x, y);
    }
  }
  console.log("Part 1:", total);
}

function b() {
  function generateDiagonalsForPoint(x: number, y: number) {
    return [
      gp(x - 1, y - 1) + gp(x, y) + gp(x + 1, y + 1),
      gp(x - 1, y + 1) + gp(x, y) + gp(x + 1, y - 1),
    ];
  }

  function checkMasPattern(x: number, y: number): boolean {
    return generateDiagonalsForPoint(x, y).every(
      (dir) => dir === "MAS" || dir === "SAM"
    );
  }

  let total = 0;
  for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < grid[0].length - 1; x++) {
      if (checkMasPattern(x, y)) {
        total++;
      }
    }
  }
  console.log("Part 2:", total);
}

a();
b();
