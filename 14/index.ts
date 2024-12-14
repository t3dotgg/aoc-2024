import fs from "fs";

// Real input
const lines = fs.readFileSync("input.txt", "utf8").split("\n");
const WIDTH = 101;
const HEIGHT = 103;

// Example input
// const lines = fs.readFileSync('example.txt', 'utf8').split('\n');
// const WIDTH = 11;
// const HEIGHT = 7;

const robots = lines.map((line) => {
  const [pos, vel] = line.split(" ");
  const [px, py] = pos.replace("p=", "").split(",").map(Number);
  const [vx, vy] = vel.replace("v=", "").split(",").map(Number);
  return {
    pos: [px, py],
    vel: [vx, vy],
  };
});

type Robot = (typeof robots)[number];

function moveRobots(robots: Robot[], steps: number) {
  return robots.map((robot) => {
    const x = robot.pos[0] + robot.vel[0] * steps;
    const y = robot.pos[1] + robot.vel[1] * steps;
    return {
      pos: [((x % WIDTH) + WIDTH) % WIDTH, ((y % HEIGHT) + HEIGHT) % HEIGHT],
      vel: robot.vel,
    };
  });
}

function part1() {
  const SIMULATION_TIME = 100;
  function getQuadrantCounts(robots: Robot[]) {
    const quadrants = [0, 0, 0, 0];
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    robots.forEach((robot) => {
      const [x, y] = robot.pos;
      // Skip robots on center lines
      if (x === midX || y === midY) return;

      if (x < midX) {
        if (y < midY) quadrants[0]++;
        else quadrants[2]++;
      } else {
        if (y < midY) quadrants[1]++;
        else quadrants[3]++;
      }
    });

    return quadrants;
  }

  const finalPositions = moveRobots(robots, SIMULATION_TIME);
  const quadrantCounts = getQuadrantCounts(finalPositions);

  return quadrantCounts.reduce((acc, count) => acc * count);
}

function part2() {
  function visualizeGrid(positions: Robot[]) {
    const grid = Array.from({ length: HEIGHT }, () =>
      Array.from({ length: WIDTH }, () => ".")
    );

    positions.forEach((robot) => {
      const [x, y] = robot.pos;
      grid[y][x] = "#";
    });

    return grid.map((row) => row.join("")).join("\n");
  }

  let seconds = 0;

  while (true) {
    const positions = moveRobots(robots, seconds);

    // Count adjacent robots (robots that have neighbors)
    const robotsWithNeighbors = positions.filter((robot) => {
      const [x, y] = robot.pos;
      return positions.some((other) => {
        if (other === robot) return false;
        const [ox, oy] = other.pos;
        const dx = Math.abs(x - ox);
        const dy = Math.abs(y - oy);
        return dx <= 1 && dy <= 1; // Adjacent including diagonals
      });
    }).length;

    // If most robots have neighbors, they might be forming a pattern
    if (robotsWithNeighbors > positions.length * 0.7) {
      console.log(
        `\nPotential message found at second ${seconds} (${robotsWithNeighbors}/${positions.length} robots clustered):`
      );
      console.log(visualizeGrid(positions));
      return seconds;
    }

    seconds++;
  }
}

console.log("part 1:", part1());
console.log("part 2:", part2());
