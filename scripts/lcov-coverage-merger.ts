import fs from 'fs';
import path from 'path';

const coverageDirectory = 'coverage';
const lowFiles: string[] = [];

const findLowFiles = (dir: string): void => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stats = fs.lstatSync(fullPath);
        
        if (stats.isDirectory()) {
            findLowFiles(fullPath);
        } else if (file === 'low.info') {
            lowFiles.push(fullPath);
        }
    });
};

findLowFiles(coverageDirectory);

let mergedLcov = "";
lowFiles.forEach((lcovFile) => {
    const content = fs.readFileSync(lcovFile, 'utf8');
    mergedLcov += content + '\n';
});

const mergedLcovPath = path.join(coverageDirectory, 'lcov.info');
fs.writeFileSync(mergedLcovPath, mergedLcov);
console.log(`Merged coverage written to ${mergedLcovPath}`);