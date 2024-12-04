async function getInput(year: number, day: number) {
  const url = `https://adventofcode.com/${year}/day/${day}/input`;
  const response = await fetch(url, {
    headers: {
      Cookie: `session=${process.env.AOC_SESSION_ID}`,
    },
  });
  return response.text();
}

import fs from "fs";

async function getOrWriteInput(day: number) {
  const input = await getInput(2024, day);
  fs.writeFileSync(`${day}/input.txt`, input);
}

function getDay() {
  return new Date().getDate() + 1;
}

console.log(getDay());

getOrWriteInput(getDay());
