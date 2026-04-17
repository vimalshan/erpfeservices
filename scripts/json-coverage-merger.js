"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const istanbul_lib_coverage_1 = require("istanbul-lib-coverage");
const coverageDir = path_1.default.join(__dirname, '..', 'coverage');
const outputCoverageFile = path_1.default.join(coverageDir, 'merged-coverage.json');
function mergeCoverage(dir) {
    const coverageMap = (0, istanbul_lib_coverage_1.createCoverageMap)();
    function walkDir(currentPath) {
        fs_1.default.readdirSync(currentPath).forEach((file) => {
            const fullPath = path_1.default.join(currentPath, file);
            const stat = fs_1.default.statSync(fullPath);
            if (stat.isDirectory()) {
                walkDir(fullPath);
            }
            else if (file.endsWith('coverage-final.json')) {
                const coverageData = JSON.parse(fs_1.default.readFileSync(fullPath, 'utf-8'));
                coverageMap.merge(coverageData);
            }
        });
    }
    walkDir(dir);
    fs_1.default.writeFileSync(outputCoverageFile, JSON.stringify(coverageMap, null, 2));
    console.log(`Merged coverage written to ${outputCoverageFile}`);
}
mergeCoverage(coverageDir);
//# sourceMappingURL=json-coverage-merger.js.map