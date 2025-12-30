/**
 * generateNav.ts - Build-time navigation generator for Matrix-Hub
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
 * NAVIGATION STRUCTURE:
 * - Pages in subdirectories (e.g., src/pages/docs/) are grouped into dropdown tabs
 * - Top-level pages (e.g., src/pages/wallet.astro) get their own individual tabs
 * - Single-page tabs render as direct links; multi-page tabs render as dropdowns
 * - The root index.astro is always placed in the "Home" category
 * 
 * CUSTOMIZATION TIPS:
 * - To exclude additional folders, add them to EXCLUDED_PATHS
 * - To customize tab order, modify the sortTabs() function
 * - To change how titles are extracted, update extractPageMetadata()
 * - Use 'navCategory' in frontmatter to override a page's category
 * - To group multiple top-level pages: add 'navCategory: "tools"' to their frontmatter
 *   or move them into a subdirectory (e.g., src/pages/tools/)
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
  '**/_*.astro',      // Astro files starting with underscore
  '**/_*.md',         // Markdown files starting with underscore
];

interface PageMetadata {
  title: string;
  navCategory: string | null;
}

interface NavigationPage {
  title: string;
  path: string;
  isIndex: boolean;
}

interface NavigationTab {
  id: string;
  label: string;
  pages: NavigationPage[];
}

/**
 * Extract title and navCategory from frontmatter or generate from filename
 * This combines reading operations to avoid duplicate file I/O
 * @param filePath - Path to the file
 * @returns Page metadata including title and custom category
 */
function extractPageMetadata(filePath: string): PageMetadata {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Parse frontmatter
    const { data } = matter(content);
    
    // Extract title from frontmatter or generate from filename
    let title: string;
    if (data.title) {
      title = data.title;
    } else {
      // Fallback: generate title from filename
      const fileName = path.basename(filePath, path.extname(filePath));
      
      // Special case for index files
      if (fileName === 'index') {
        title = 'Overview';
      } else {
        // Convert kebab-case or snake_case to Title Case
        title = fileName
          .replace(/[-_]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
    
    // Extract custom category if present
    const navCategory = data.navCategory || null;
    
    return { title, navCategory };
  } catch (error) {
    console.warn(`Warning: Could not extract metadata from ${filePath}:`, (error as Error).message);
    // Fallback to filename
    const fileName = path.basename(filePath, path.extname(filePath));
    return {
      title: fileName.charAt(0).toUpperCase() + fileName.slice(1),
      navCategory: null
    };
  }
}

/**
 * Convert file path to URL path
 * @param filePath - File path relative to src/pages
 * @returns URL path
 */
function filePathToUrlPath(filePath: string): string {
  // Remove file extension
  let urlPath = filePath.replace(/\.(astro|md|mdx)$/, '');
  
  // Remove 'index' from end of path (handles nested index files like games/casino/index.astro)
  urlPath = urlPath.replace(/\/index$/, '') || '/';
  
  // Ensure leading slash
  if (!urlPath.startsWith('/')) {
    urlPath = '/' + urlPath;
  }
  
  return urlPath;
}

/**
 * Sort tabs in a specific order
 * @param tabs - Array of tab objects
 * @returns Sorted tabs
 */
function sortTabs(tabs: NavigationTab[]): NavigationTab[] {
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
 * @returns Navigation structure
 */
export async function generateNavigation(): Promise<NavigationTab[]> {
  const pagesDir = path.resolve(__dirname, '../pages');
  
  // Find all page files, excluding specified paths
  const pattern = '**/*.{astro,md,mdx}';
  const files = await fg(pattern, {
    cwd: pagesDir,
    ignore: EXCLUDED_PATHS,
  });
  
  // Build navigation structure
  const navMap = new Map<string, NavigationTab>();
  
  for (const file of files) {
    const fullPath = path.join(pagesDir, file);
    const { title, navCategory } = extractPageMetadata(fullPath);
    const urlPath = filePathToUrlPath(file);
    
    // Determine category
    let category: string;
    
    if (navCategory) {
      // Use custom category from frontmatter
      category = navCategory;
    } else if (file === 'index.astro') {
      // Root index is home
      category = 'home';
    } else if (file.includes('/')) {
      // Get top-level directory as category
      category = file.split('/')[0];
    } else {
      // Top-level pages (not in a folder) go to their own category
      // e.g., wallet.astro -> 'wallet' category, buy-mtx.astro -> 'buy-mtx' category
      // 
      // DESIGN NOTE: Each top-level page gets its own tab/category. While this creates
      // single-page tabs (which render as direct links rather than dropdowns), it provides
      // clear, prominent navigation for important standalone pages like Wallet, Buy MTX, etc.
      // 
      // CUSTOMIZATION: To group multiple top-level pages together, you can either:
      // 1. Move pages into a subdirectory (e.g., create src/pages/tools/ folder)
      // 2. Add 'navCategory: "tools"' to the frontmatter of pages you want grouped
      // 
      // Example frontmatter to group pages:
      // ---
      // title: "My Page"
      // navCategory: "tools"  # This page will appear in a "Tools" dropdown
      // ---
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
    // Check for index files with all supported extensions
    const isIndexFile = file.endsWith('index.astro') || 
                       file.endsWith('index.md') || 
                       file.endsWith('index.mdx') || 
                       file === 'index.astro';
    
    navMap.get(category)!.pages.push({
      title,
      path: urlPath,
      isIndex: isIndexFile
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
 * This function directly delegates to generateNavigation without caching.
 * During static site generation, Astro handles caching appropriately.
 */
export async function getNavigation(): Promise<NavigationTab[]> {
  return generateNavigation();
}
