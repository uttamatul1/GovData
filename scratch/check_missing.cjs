const fs = require('fs');
const path = require('path');

// Read states
const statesFile = fs.readFileSync(path.join(__dirname, '../src/data/states.data.ts'), 'utf8');
const stateMatches = [...statesFile.matchAll(/code:\s*'(IN-[A-Z]+)',\s*name:\s*'([^']+)'/g)];
const states = stateMatches.map(m => ({ code: m[1], name: m[2] }));

const metricsFiles = {
  population: 'src/data/metrics/population.data.ts',
  health: 'src/data/metrics/health.data.ts',
  education: 'src/data/metrics/education.data.ts',
  economy: 'src/data/metrics/economy.data.ts',
  labour: 'src/data/metrics/labour.data.ts',
};

const result = {};

for (const [sector, relPath] of Object.entries(metricsFiles)) {
  const content = fs.readFileSync(path.join(__dirname, '../', relPath), 'utf8');
  
  // Find each metric definition
  const metricBlocks = content.split(/export const /).slice(1);
  
  result[sector] = {};

  metricBlocks.forEach(block => {
    const labelMatch = block.match(/label:\s*'([^']+)'/);
    if (!labelMatch) return;
    const label = labelMatch[1];
    
    // Find all stateCode: 'IN-XX' in block
    const presentStateCodes = new Set([...block.matchAll(/stateCode:\s*'(IN-[A-Z]+)'/g)].map(m => m[1]));
    
    const missingStates = states.filter(s => !presentStateCodes.has(s.code)).map(s => s.name);
    result[sector][label] = {
      presentCount: presentStateCodes.size,
      missingCount: missingStates.length,
      missingStates
    };
  });
}

console.log(JSON.stringify(result, null, 2));
