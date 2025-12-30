/**
 * generateNav.js - Build-time navigation generator for Matrix-Hub
 * 
 * This utility scans the src/pages directory and builds a navigation structure
 * based on the folder hierarchy. It extracts page titles from frontmatter when available.
 * 
 * DEPENDENCIES:
 * Install with: npm install fast-glob gray-matter
 * 
 * USAGE:
 * import { generateNavigation } from '../utils/generateNav.js';
 * const navData = await generateNavigation();
 * 
 * CUSTOMIZATION TIPS:
 * - To exclude additional folders, add them to EXCLUDED_PATHS
 * - To customize tab order, modify the sortTabs() function
 * - To change how titles are extracted, update extractTitle()
 * - Use 'navCategory' in frontmatter to override a page's category
 */

import fg from 'fast-glob';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths and files to exclude from navigation
const EXCLUDED_PATHS = [
  '**/api/**',        // API routes
  '**/_*.{astro,jsx,tsx}', // Files starting with underscore
  '**/_*.md',         // Markdown files starting with underscore
];

/**
 * Extract title from frontmatter or generate from filename
 * @param {string} filePath - Path to the file
 * @returns {string} - Page title
 */
function extractTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Parse frontmatter
    const { data } = matter(content);
    
    // Check for title in frontmatter
    if (data.title) {
      return data.title;
    }
    
    // Fallback: generate title from filename
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Special case for index files
    if (fileName === 'index') {
      return 'Overview';
    }
    
    // Convert kebab-case or snake_case to Title Case
    return fileName
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch (error) {
    console.warn(`Warning: Could not extract title from ${filePath}:`, error.message);
    // Fallback to filename
    const fileName = path.basename(filePath, path.extname(filePath));
    return fileName.charAt(0).toUpperCase() + fileName.slice(1);
  }
}

/**
 * Extract navCategory from frontmatter if present
 * @param {string} filePath - Path to the file
 * @returns {string|null} - Custom category or null
 */
function extractNavCategory(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    return data.navCategory || null;
  } catch (error) {
    return null;
  }
}

/**
 * Convert file path to URL path
 * @param {string} filePath - File path relative to src/pages
 * @returns {string} - URL path
 */
function filePathToUrlPath(filePath) {
  // Remove file extension
  let urlPath = filePath.replace(/\.(astro|md|mdx)$/, '');
  
  // Remove 'index' from end of path
  urlPath = urlPath.replace(/\/index$/, '') || '/';
  
  // Ensure leading slash
  if (!urlPath.startsWith('/')) {
    urlPath = '/' + urlPath;
  }
  
  return urlPath;
}

/**
 * Sort tabs in a specific order
 * @param {Array} tabs - Array of tab objects
 * @returns {Array} - Sorted tabs
 */
function sortTabs(tabs) {
  // Define preferred order
  const order = ['home', 'games', 'docs', 'wallet', 'buy-mtx', 'casino'];
  
  return tabs.sort((a, b) => {
    const aIndex = order.indexOf(a.id.toLowerCase());
    const bIndex = order.indexOf(b.id.toLowerCase());
    
    // If both are in order list, sort by order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only a is in order list, it comes first
    if (aIndex !== -1) return -1;
    
    // If only b is in order list, it comes first
    if (bIndex !== -1) return 1;
    
    // Otherwise, sort alphabetically
    return a.label.localeCompare(b.label);
  });
}

/**
 * Generate navigation structure from pages directory
 * @returns {Promise<Array>} - Navigation structure
 */
export async function generateNavigation() {
  const pagesDir = path.resolve(__dirname, '../pages');
  
  // Find all page files, excluding specified paths
  const pattern = '**/*.{astro,md,mdx}';
  const files = await fg(pattern, {
    cwd: pagesDir,
    ignore: EXCLUDED_PATHS,
  });
  
  // Build navigation structure
  const navMap = new Map();
  
  for (const file of files) {
    const fullPath = path.join(pagesDir, file);
    const title = extractTitle(fullPath);
    const customCategory = extractNavCategory(fullPath);
    const urlPath = filePathToUrlPath(file);
    
    // Determine category
    let category = 'home';
    
    if (customCategory) {
      // Use custom category from frontmatter
      category = customCategory;
    } else if (file === 'index.astro') {
      // Root index is home
      category = 'home';
    } else if (file.includes('/')) {
      // Get top-level directory as category
      category = file.split('/')[0];
    } else {
      // Top-level pages (not in a folder) go to their own category
      // e.g., wallet.astro -> wallet category
      const fileName = path.basename(file, path.extname(file));
      category = fileName;
    }
    
    // Initialize category if not exists
    if (!navMap.has(category)) {
      navMap.set(category, {
        id: category,
        label: category === 'home' ? 'Home' : 
               category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        pages: []
      });
    }
    
    // Add page to category
    navMap.get(category).pages.push({
      title,
      path: urlPath,
      isIndex: file.endsWith('index.astro') || file === 'index.astro'
    });
  }
  
  // Convert map to array and sort
  const tabs = Array.from(navMap.values());
  
  // Sort pages within each tab (index first, then alphabetically)
  tabs.forEach(tab => {
    tab.pages.sort((a, b) => {
      if (a.isIndex && !b.isIndex) return -1;
      if (!a.isIndex && b.isIndex) return 1;
      return a.title.localeCompare(b.title);
    });
  });
  
  // Sort tabs
  return sortTabs(tabs);
}

/**
 * Get navigation data (for use in Astro components)
 * This function caches the result to avoid multiple filesystem scans
 */
let cachedNav = null;

export async function getNavigation() {
  if (!cachedNav) {
    cachedNav = await generateNavigation();
  }
  return cachedNav;
}
