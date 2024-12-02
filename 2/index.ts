import fs from "fs";

const lines = fs.readFileSync("input.txt", "utf8").split("\n");

// Check that all numbers increase or decrease by 1-3
function safeLine(numlist: number[]) {
  const diffs = numlist.map((n, i) => n - numlist[i - 1]);
  diffs.shift();
  return (
    diffs.every((d) => d >= -3 && d < 0) || diffs.every((d) => d <= 3 && d > 0)
  );
}

function a() {
  const nums = lines.map((r) => r.split(" ").map((n) => parseInt(n, 10)));
  return nums.filter((numlist) => safeLine(numlist));
}

function b() {
  const nums = lines.map((r) => r.split(" ").map((n) => parseInt(n, 10)));

  return nums.filter((numlist) => {
    if (safeLine(numlist)) return true;

    for (let i = 0; i < numlist.length; i++) {
      if (safeLine(numlist.toSpliced(i, 1))) return true;
    }
  });
}

console.log(a().length);
console.log(b().length);
