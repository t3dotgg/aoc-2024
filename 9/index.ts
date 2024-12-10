import fs from "fs";

const input = fs.readFileSync("input.txt", "utf8").split("\n");
// input = fs.readFileSync("example.txt", "utf8").split("\n");

const diskMap = input[0];

function parseDiskMap(diskMapString: string) {
  let fileId = 0;
  const disk: number[] = [];
  for (let i = 0; i < diskMapString.length; i++) {
    const length = parseInt(diskMapString[i], 10);
    if (i % 2 === 0) {
      for (let j = 0; j < length; j++) disk.push(fileId);
      fileId++;
    } else {
      for (let j = 0; j < length; j++) disk.push(-1);
    }
  }
  return { disk, fileCount: fileId };
}

function compactBlockByBlock(disk: number[]) {
  while (true) {
    const leftFreeIndex = disk.indexOf(-1);
    if (leftFreeIndex < 0) break;
    let fileFoundRight = false;
    for (let i = leftFreeIndex + 1; i < disk.length; i++) {
      if (disk[i] !== -1) {
        fileFoundRight = true;
        break;
      }
    }
    if (!fileFoundRight) break;
    let rightFileIndex = -1;
    for (let i = disk.length - 1; i >= 0; i--) {
      if (disk[i] !== -1) {
        rightFileIndex = i;
        break;
      }
    }
    disk[leftFreeIndex] = disk[rightFileIndex];
    disk[rightFileIndex] = -1;
  }
}

function findFreeSpanLeft(
  disk: number[],
  maxEnd: number,
  lengthNeeded: number
) {
  const limit = maxEnd - 1;
  if (limit < 0) return null;
  let spanStart = -1,
    currentSpanLength = 0;
  for (let i = 0; i <= limit; i++) {
    if (disk[i] === -1) {
      if (spanStart < 0) spanStart = i;
      currentSpanLength++;
      if (currentSpanLength >= lengthNeeded) return spanStart;
    } else {
      spanStart = -1;
      currentSpanLength = 0;
    }
  }
  return null;
}

function compactWholeFiles(disk: number[], fileCount: number) {
  for (let currentFileId = fileCount - 1; currentFileId >= 0; currentFileId--) {
    let start = -1,
      end = -1;
    for (let i = 0; i < disk.length; i++) {
      if (disk[i] === currentFileId) {
        if (start < 0) start = i;
        end = i;
      }
    }
    if (start < 0) continue;
    const fileLength = end - start + 1;
    const freeSpanStart = findFreeSpanLeft(disk, start, fileLength);
    if (freeSpanStart == null) continue;
    for (let i = 0; i < fileLength; i++)
      disk[freeSpanStart + i] = currentFileId;
    for (let i = start; i <= end; i++) disk[i] = -1;
  }
}

function checksum(disk: number[]) {
  let sum = 0;
  for (let i = 0; i < disk.length; i++) if (disk[i] !== -1) sum += i * disk[i];
  return sum;
}

function part1() {
  const { disk } = parseDiskMap(diskMap);
  compactBlockByBlock(disk);
  return checksum(disk);
}

function part2() {
  const { disk, fileCount } = parseDiskMap(diskMap);
  compactWholeFiles(disk, fileCount);
  return checksum(disk);
}

console.log(part1());
console.log(part2());
