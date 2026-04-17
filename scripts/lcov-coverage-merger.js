"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const coverageDirectory = 'coverage';
const lowFiles = [];
const findLowFiles = (dir) => {
    const files = fs_1.default.readdirSync(dir);
    files.forEach((file) => {
        const fullPath = path_1.default.join(dir, file);
        const stats = fs_1.default.lstatSync(fullPath);
        if (stats.isDirectory()) {
            findLowFiles(fullPath);
        }
        else if (file === 'low.info') {
            lowFiles.push(fullPath);
        }
    });
};
findLowFiles(coverageDirectory);
let mergedLcov = "";
lowFiles.forEach((lcovFile) => {
    const content = fs_1.default.readFileSync(lcovFile, 'utf8');
    mergedLcov += content + '\n';
});
const mergedLcovPath = path_1.default.join(coverageDirectory, 'lcov.info');
fs_1.default.writeFileSync(mergedLcovPath, mergedLcov);
console.log(`Merged coverage written to ${mergedLcovPath}`);
//# sourceMappingURL=lcov-coverage-merger.js.map