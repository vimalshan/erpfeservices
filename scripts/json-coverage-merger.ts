import fs from 'fs';
import path from 'path';
import { createCoverageMap } from 'istanbul-lib-coverage';

const coverageDir = path.join(__dirname, '..', 'coverage');
const outputCoverageFile = path.join(coverageDir, 'merged-coverage.json');

function mergeCoverage(dir: string): void {
    const coverageMap = createCoverageMap();

    function walkDir(currentPath: string): void {
        fs.readdirSync(currentPath).forEach((file) => {
            const fullPath = path.join(currentPath, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                walkDir(fullPath);
            } else if (file.endsWith('coverage-final.json')) {
                const coverageData = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
                coverageMap.merge(coverageData);
            }
        });
    }

    walkDir(dir);
    fs.writeFileSync(outputCoverageFile, JSON.stringify(coverageMap, null, 2));
    console.log(`Merged coverage written to ${outputCoverageFile}`);
}

mergeCoverage(coverageDir);