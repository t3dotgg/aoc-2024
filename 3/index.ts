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
// Match do() with regex
const doRegex = /do\(\)/g;
// match don't() with regex
const dontRegex = /don't\(\)/g;

function b() {
  const allLinesCombined = lines.join("");

  // Get all matches for each regex
  const doMatches = [...allLinesCombined.matchAll(doRegex)];
  const dontMatches = [...allLinesCombined.matchAll(dontRegex)];
  const mulMatches = [...allLinesCombined.matchAll(mulRegex)];

  // Combine all matches with their indices to sort by position
  const allMatches = [
    ...doMatches.map((m) => ({ type: "do", index: m.index })),
    ...dontMatches.map((m) => ({ type: "dont", index: m.index })),
    ...mulMatches.map((m) => ({
      type: "mul",
      index: m.index,
      x: parseInt(m[1], 10),
      y: parseInt(m[2], 10),
    })),
  ];

  // Sort by index to get instructions in order
  const sortedInstructions = allMatches.sort((a, b) => a.index - b.index);

  let doo = true;
  let sum = 0;

  for (const instruction of sortedInstructions) {
    if (instruction.type === "do") {
      doo = true;
    } else if (instruction.type === "dont") {
      doo = false;
    } else if (instruction.type === "mul") {
      if (doo) {
        sum += instruction.x * instruction.y;
      }
    }
  }

  console.log(sum);
}

a();
b();
