import fs from "fs";

let lines = fs.readFileSync("input.txt", "utf8").split("\n");
// lines = fs.readFileSync("example.txt", "utf8").split("\n");

const pairings = lines.map((line) => {
  const [left, right] = line.split(": ");
  return { target: parseInt(left), values: right.split(" ").map(Number) };
});

function evaluateExpression(values: number[], operators: string[]): number {
  let result = values[0];
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === "+") {
      result += values[i + 1];
    } else if (operators[i] === "*") {
      result *= values[i + 1];
    } else if (operators[i] === "||") {
      result = parseInt(result.toString() + values[i + 1].toString());
    }
  }
  return result;
}

function findValidOperators(
  target: number,
  values: number[],
  possibleOperators: string[]
): boolean {
  // Generate all possible combinations of operators
  const operatorCount = values.length - 1;

  const allowedOperators = possibleOperators.length;

  // Try all possible combinations of operators
  for (let i = 0; i < Math.pow(allowedOperators, operatorCount); i++) {
    const operators: string[] = [];
    let n = i;
    for (let j = 0; j < operatorCount; j++) {
      operators.push(possibleOperators[n % allowedOperators]);
      n = Math.floor(n / allowedOperators);
    }

    const result = evaluateExpression(values, operators);
    if (result === target) {
      return true;
    }
  }

  return false;
}

function part1() {
  const validPairings = pairings.filter((pairing) => {
    return findValidOperators(pairing.target, pairing.values, ["+", "*"]);
  });

  const sum = validPairings.reduce((acc, curr) => acc + curr.target, 0);
  console.log("Part 1:", sum);
}

function part2() {
  const validPairings = pairings.filter((pairing) => {
    return findValidOperators(pairing.target, pairing.values, ["+", "*", "||"]);
  });

  const sum = validPairings.reduce((acc, curr) => acc + curr.target, 0);
  console.log("Part 2:", sum);
}

part1();
part2();
