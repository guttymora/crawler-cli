import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Recursively retrieves all Python (.py) files from the given directory.
 * @param dir The directory path to search.
 * @returns A promise that resolves with an array of file paths.
 */
async function getPythonFiles(dir: string): Promise<string[]> {
  let pythonFiles: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pythonFiles = pythonFiles.concat(await getPythonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.py')) {
      pythonFiles.push(fullPath);
    }
  }
  return pythonFiles;
}

/**
 * Generates a Markdown string that embeds all Python files from the specified folder.
 * Each file is listed with its relative path as a header and its content in a Python code block.
 * If the folder path is invalid, null, or not a directory, an empty string is returned.
 *
 * @param folderPath The path to the folder containing Python code.
 * @returns A Promise that resolves to the generated Markdown string or an empty string if invalid.
 */
export async function buildPythonContextMarkdown(folderPath: string): Promise<string> {
  // Validate the folder path input.
  if (!folderPath) {
    return '';
  }

  try {
    const folderStats = await fs.stat(folderPath);
    if (!folderStats.isDirectory()) {
      return '';
    }
  } catch (error) {
    // If an error occurs (e.g., folder doesn't exist), return an empty result.
    return '';
  }

  const pythonFiles = await getPythonFiles(folderPath);
  let markdownContent = '# Code Context\n\n';

  for (const filePath of pythonFiles) {
    const relativePath = path.relative(folderPath, filePath);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    markdownContent += `## File: ${relativePath}\n\n`;
    markdownContent += "```python\n";
    markdownContent += fileContent;
    markdownContent += "\n```\n\n";
  }

  return markdownContent;
}

export default buildPythonContextMarkdown;
