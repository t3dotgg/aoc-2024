import fs from "fs";

let chunks = fs.readFileSync("input.txt", "utf8").split("\n\n");
// chunks = fs.readFileSync("example.txt", "utf8").split("\n\n");

// Pairs of ints. Left number must always become before right number in a valid page
const rules = chunks[0].split("\n").map((line) => line.split("|").map(Number));

const pages = chunks[1].split("\n").map((line) => line.split(",").map(Number));

function a() {
  const validPages = pages.filter((page) => {
    // Check if page follows all rules
    return rules.every(([left, right]) => {
      // Find indices of both numbers in the page
      const leftIndex = page.indexOf(left);
      const rightIndex = page.indexOf(right);

      // Rule is satisfied if:
      // - If both numbers exist, left must come before right
      // - If only one or neither number exists, that's fine
      return leftIndex === -1 || rightIndex === -1 || leftIndex < rightIndex;
    });
  });

  // Take the middle values from each page and sum them
  const sum = validPages
    .map((page) => page[Math.floor(page.length / 2)])
    .reduce((a, b) => a + b, 0);

  console.log("part 1:", sum);
}

function b() {
  const invalidPages = pages.filter((page) => {
    // Check if page follows all rules
    return rules.some(([left, right]) => {
      // Find indices of both numbers in the page
      const leftIndex = page.indexOf(left);
      const rightIndex = page.indexOf(right);

      // Rule is satisfied if:
      // - If both numbers exist, left must come before right
      // - If only one or neither number exists, that's fine
      return !(leftIndex === -1 || rightIndex === -1 || leftIndex < rightIndex);
    });
  });

  // Reorder the invalid pages so they follow the rules
  const reorderedPages = invalidPages.map((page) => {
    // Keep track of numbers that must come before each number
    const mustComeBefore: Record<number, Set<number>> = {};

    // Initialize sets for each number in the page
    for (const num of page) {
      mustComeBefore[num] = new Set();
    }

    // Build dependencies based on rules
    for (const [left, right] of rules) {
      if (page.includes(left) && page.includes(right)) {
        mustComeBefore[right].add(left);
      }
    }

    // Repeatedly find numbers that can come next (have no dependencies)
    const result: number[] = [];
    const remaining = new Set(page);

    while (remaining.size > 0) {
      const available = Array.from(remaining).filter((num) =>
        Array.from(mustComeBefore[num]).every((dep) => !remaining.has(dep))
      );

      if (available.length === 0) {
        // If we get stuck, there must be a cycle - just take any remaining number
        const next = Array.from(remaining)[0];
        result.push(next);
        remaining.delete(next);
      } else {
        // Take the first available number
        const next = available[0];
        result.push(next);
        remaining.delete(next);
      }
    }

    return result;
  });

  // Take the middle values from each page and sum them
  const sum = reorderedPages
    .map((page) => page[Math.floor(page.length / 2)])
    .reduce((a, b) => a + b, 0);

  console.log("part 2:", sum);
}

a();
b();
