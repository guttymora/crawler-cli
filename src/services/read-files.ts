const fs = require('fs').promises;
const path = require('path');

// Asynchronous function to read file contents from a directory
async function readFilesContent(directoryPath: string): Promise<string[]> {
  // Get the list of items in the directory
  const items = await fs.readdir(directoryPath);
  const contents: string[] = [];

  // Process each item and check if it's a file
  for (const item of items) {
    const filePath = path.join(directoryPath, item);
    const stat = await fs.stat(filePath);
    if (stat.isFile()) {
      // Read file content as a UTF-8 string
      const fileContent = await fs.readFile(filePath, 'utf8');
      contents.push(fileContent);
    }
  }

  return contents;
}

export { readFilesContent };
