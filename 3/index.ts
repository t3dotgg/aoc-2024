import fs from "fs";

let lines = fs.readFileSync("input.txt", "utf8").split("\n");
// lines = fs.readFileSync("example.txt", "utf8").split("\n");

// Regex that grabs all instances of mul(x,y) where x and y are numbers
const mulRegex = /mul\((\d+),(\d+)\)/g;

function a() {
  const allLinesCombined = lines.join("");

  const matches = allLinesCombined.match(mulRegex)!;

  const pairs = matches.map((m) => m.match(/\d+/g));

  const products = pairs.map((p) => p!.map((n) => parseInt(n, 10)));

  const sum = products.reduce((acc, p) => acc + p[0] * p[1], 0);

  console.log(sum);
}

// Match do(), don't(), and mul(x,y) with a single regex
const instructionRegex = /do\(\)|don't\(\)|mul\((\d+),(\d+)\)/g;

function b() {
  const allLinesCombined = lines.join("");

  // Get all matches with a single regex
  const matches = [...allLinesCombined.matchAll(instructionRegex)];

  let doo = true;
  let sum = 0;

  for (const match of matches) {
    const instruction = match[0];
    if (instruction === "do()") {
      doo = true;
    } else if (instruction === "don't()") {
      doo = false;
    } else if (instruction.startsWith("mul")) {
      if (doo) {
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        sum += x * y;
      }
    }
  }

  console.log(sum);
}

a();
b();
