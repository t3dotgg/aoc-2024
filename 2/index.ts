import fs from "fs";

const lines = fs.readFileSync("input.txt", "utf8").split("\n");

function a() {
  console.log(lines.length);

  const nums = lines.map((r) => r.split(" ").map((n) => parseInt(n, 10)));

  const safe = nums.filter((numlist) => {
    const allIncrease = numlist.every((n, i) => i === 0 || n > numlist[i - 1]);
    const allDecrease = numlist.every((n, i) => i === 0 || n < numlist[i - 1]);
    return allIncrease || allDecrease;
  });

  safe.forEach((numlist) => {
    console.log(numlist.join(" "));
  });

  const safe2 = safe.filter((numlist) => {
    // make sure every increase/decrease is 1-3 numbers apart
    const diffs = numlist.map((n, i) => n - numlist[i - 1]);
    diffs.shift();
    console.log(
      "comparing",
      numlist,
      diffs,
      diffs.every((d) => d >= -3 && d <= 3)
    );
    return diffs.every((d) => d >= -3 && d <= 3);
  });

  console.log(safe2.length);
}

// Check that all numbers increase or decrease by 1-3
function safeLine(numlist: number[]) {
  const diffs = numlist.map((n, i) => n - numlist[i - 1]);
  diffs.shift();
  return (
    diffs.every((d) => d >= -3 && d < 0) || diffs.every((d) => d <= 3 && d > 0)
  );
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
