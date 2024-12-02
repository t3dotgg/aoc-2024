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

  const safe = nums.filter((numlist) => safeLine(numlist));

  console.log(safe.length);
}

function b() {
  const nums = lines.map((r) => r.split(" ").map((n) => parseInt(n, 10)));

  const res = nums.filter((numlist) => {
    if (safeLine(numlist)) return true;

    // Check with 1 removed
    for (let i = 0; i < numlist.length; i++) {
      const newList = [...numlist];
      newList.splice(i, 1);
      if (safeLine(newList)) return true;
    }
  });

  console.log(res.length);
}

a();
b();
