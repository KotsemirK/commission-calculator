const fs = require('fs').promises;
const path = require('path');
const { commissionCalculator } = require('./commissionCalculator');

const inputFilePath = process.argv[2];

// Function to read and parse the input JSON file asynchronously
const readInputFile = async (filePath) => {
  try {
    const absolutePath = path.resolve(__dirname, '../', filePath);
    const fileContent = await fs.readFile(absolutePath, 'utf-8');

    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading input file:', error);
    process.exit(1);
  }
};

// Function to process the commission calculations for all operations recursively
const processCommissions = async (operations, index = 0) => {
  if (index >= operations.length) {
    return;
  }

  try {
    const result = await commissionCalculator(operations[index]);
    console.log(result);
    await processCommissions(operations, index + 1);
  } catch (error) {
    console.error('Error calculating commissions:', error);
  }
};

(async () => {
  const inputData = await readInputFile(inputFilePath);
  await processCommissions(inputData);
})();
