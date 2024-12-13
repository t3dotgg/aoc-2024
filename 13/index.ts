import fs from "fs";

const chunks = fs.readFileSync("input.txt", "utf8").trim().split("\n\n");
// const chunks = fs.readFileSync("example.txt", "utf8").trim().split("\n\n");

const groups = chunks.map((chunk) => {
  const [buttonA, buttonB, prize] = chunk.split("\n");
  const [x1, y1] = buttonA.split("X+")[1].split(", Y+");
  const [x2, y2] = buttonB.split("X+")[1].split(", Y+");
  const [px, py] = prize.split("X=")[1].split(", Y=");
  return {
    buttonA: [Number(x1), Number(y1)],
    buttonB: [Number(x2), Number(y2)],
    prize: [Number(px), Number(py)],
  };
});

// Cursor helped me write this comment and then wrote the function
// We want to find a combination of A and B presses (A_count, B_count) for each machine
// such that:
//   A_count * ax + B_count * bx = px
//   A_count * ay + B_count * by = py
//
// This forms a system of linear equations that we can solve algebraically:
//   ax*A + bx*B = px  ... (1)
//   ay*A + by*B = py  ... (2)
//
// Multiply (1) by by and (2) by bx:
//   ax*by*A + bx*by*B = px*by
//   ay*bx*A + by*bx*B = py*bx
//
// Subtract to eliminate B:
//   ax*by*A - ay*bx*A = px*by - py*bx
//   A*(ax*by - ay*bx) = px*by - py*bx
//   A = (px*by - py*bx)/(ax*by - ay*bx)
//
// Similarly for B:
//   B = (px*ay - py*ax)/(bx*ay - by*ax)
function solveMachine(group: (typeof groups)[number], prizeBonus: number = 0) {
  // Calculate determinant to check if system is solvable
  const det =
    group.buttonA[0] * group.buttonB[1] - group.buttonA[1] * group.buttonB[0];
  if (det === 0) return null;

  const px = group.prize[0] + prizeBonus;
  const py = group.prize[1] + prizeBonus;

  // Solve for A and B
  const A_count = (px * group.buttonB[1] - py * group.buttonB[0]) / det;
  const B_count = (px * group.buttonA[1] - py * group.buttonA[0]) / -det;

  // Check if solution is valid (non-negative integers)
  if (
    A_count < 0 ||
    B_count < 0 ||
    !Number.isInteger(A_count) ||
    !Number.isInteger(B_count)
  ) {
    return null;
  }

  return 3 * A_count + B_count;
}

function part1() {
  const costs = groups.map(solveMachine).filter((c) => c !== null) as number[];

  console.log(
    "Part 1:",
    costs.reduce((a, b) => a + b, 0)
  );
}

function part2() {
  const costs = groups
    .map((group) => solveMachine(group, 10000000000000))
    .filter((c) => c !== null) as number[];

  console.log(
    "Part 2:",
    costs.reduce((a, b) => a + b, 0)
  );
}

part1();
part2();
