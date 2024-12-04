import fs from "fs";

let lines = fs.readFileSync("input.txt", "utf8").split("\n");
// lines = fs.readFileSync("example.txt", "utf8").split("\n");

function a() {
  console.log(lines.length);
}
function b() {
  console.log(lines.length);
}

a();
// b();
