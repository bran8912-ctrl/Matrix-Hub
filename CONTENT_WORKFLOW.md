# Content Workflow Documentation

## Overview

The Matrix-Hub Content Workflow Script is a powerful content management tool designed to help with marketing, analytics, SEO optimization, and automated content updates. It provides fast content discovery, frontmatter parsing, analytics reporting, and public API feed generation.

## Features

- **Fast Content Discovery**: Uses `fast-glob` for efficient file scanning across multiple directories
- **Frontmatter Parsing**: Automatically extracts metadata from Markdown, MDX, and Astro files using `gray-matter`
- **Live File Watching**: Real-time content monitoring with `chokidar` for automatic feed updates
- **Comprehensive Error Logging**: All errors are logged to `content-workflow-errors.log` for debugging
- **Content Analytics**: Detailed statistics about your content (word counts, categories, tags, health metrics)
- **Public API Feed**: JSON feed generation for external consumption and integrations
- **Marketing & SEO Data**: Structured content data optimized for search engines and marketing tools

## Quick Start

### Installation

Dependencies are already included in the project. If you need to reinstall:

```bash
npm install
```

### Basic Usage

Run any of these npm scripts from the project root:

```bash
# Show help and available commands
npm run content:help

# Scan all content files
npm run content:scan

# Generate public JSON feed
npm run content:generate

# Generate analytics report
npm run content:analytics

# Watch for changes (live updates)
npm run content:watch
```

### Direct Usage

You can also run the script directly:

```bash
node content-workflow.js <command>
```

## Commands

### `scan` - Content Discovery and Indexing

Scans all configured content directories and indexes files with their metadata.

**Usage:**
```bash
npm run content:scan
# or
node content-workflow.js scan
```

**Output:**
- Console summary of files found
- List of failed files (if any)
- Error log at `content-workflow-errors.log`

**Example Output:**
```
🔍 Scanning content files...
✅ Found 86 content files
⚠️  6 file(s) failed to process. Check error log for details.
✅ Scan complete: 80 files processed
```

### `generate` - Public Feed Generation

Scans content and generates a public JSON feed for external consumption.

**Usage:**
```bash
npm run content:generate
# or
node content-workflow.js generate
```

**Output File:** `public/public-feed.json`

**Feed Structure:**
```json
{
  "generated": "2025-12-31T18:00:00.000Z",
  "totalFiles": 80,
  "categories": {
    "documentation": 25,
    "page": 15,
    "content": 40
  },
  "recentUpdates": [
    {
      "path": "docs/DEPLOYMENT.md",
      "title": "Deployment Guide",
      "modified": "2025-12-31T17:00:00.000Z"
    }
  ],
  "content": [...]
}
```

### `analytics` - Content Analytics Report

Generates detailed analytics about your content ecosystem.

**Usage:**
```bash
npm run content:analytics
# or
node content-workflow.js analytics
```

**Output File:** `public/content-analytics.json`

**Analytics Include:**
- Total files, words, and size
- Average words per file
- Category breakdown with word counts
- Tag cloud (frequency analysis)
- Content health metrics:
  - Files without titles
  - Files without descriptions
  - Files without tags

**Example Output:**
```
📊 Generating analytics...
✅ Analytics generated: public/content-analytics.json

📊 Summary:
   Total Files: 80
   Total Words: 45,230
   Avg Words/File: 565
   Total Size: 2,341.50 KB
```

### `watch` - Live File Monitoring

Watches content directories for changes and automatically updates feeds.

**Usage:**
```bash
npm run content:watch
# or
node content-workflow.js watch
```

**Behavior:**
- Monitors all configured directories
- Detects file additions, changes, and deletions
- Debounces updates (1 second delay)
- Automatically regenerates feeds on changes
- Graceful shutdown with Ctrl+C

**Example Output:**
```
👀 Starting file watcher...
   Watching directories: src/content, docs, src/pages
   Press Ctrl+C to stop

➕ File added: docs/NEW_GUIDE.md
📝 File changed: src/pages/index.astro

🔄 Changes detected, updating feeds...
🔍 Scanning content files...
✅ Found 81 content files
✅ Feeds updated successfully
```

## Configuration

### Environment Variables

You can customize the script's behavior using environment variables:

```bash
# Content directories to scan (comma-separated)
CONTENT_DIRS="src/content,docs,src/pages"

# Output directory for generated files
OUTPUT_DIR="public"

# Public feed output file
PUBLIC_FEED_FILE="public/public-feed.json"

# Analytics output file
ANALYTICS_FILE="public/content-analytics.json"

# Error log file location
ERROR_LOG_FILE="content-workflow-errors.log"

# File patterns to scan (comma-separated)
CONTENT_PATTERNS="**/*.md,**/*.mdx,**/*.astro"

# Patterns to exclude (comma-separated)
EXCLUDE_PATTERNS="**/node_modules/**,**/dist/**,**/.git/**,**/src/components/**,**/src/casino/**,**/src/utils/**,**/src/layouts/**"
```

**Example with custom directories:**
```bash
CONTENT_DIRS="src/content,docs" npm run content:scan
```

### Default Configuration

The script uses the following defaults if no environment variables are set:

- **Content Directories:** `src/content`, `docs`, `src/pages`
- **Output Directory:** `public`
- **File Patterns:** `**/*.md`, `**/*.mdx`, `**/*.astro`
- **Excluded Patterns:** `**/node_modules/**`, `**/dist/**`, `**/.git/**`, `**/src/components/**`, `**/src/casino/**`, `**/src/utils/**`, `**/src/layouts/**`

These defaults are optimized for the Matrix-Hub project structure and exclude component, utility, and layout files which contain TypeScript interfaces rather than content.

## Common Use Cases

### 1. Pre-Build Content Validation

Check content health before building your site:

```bash
npm run content:scan
# Review the output for errors
```

### 2. CI/CD Integration

Add to your CI pipeline to catch content issues early:

```bash
# In .github/workflows/content-check.yml
- name: Validate Content
  run: npm run content:scan
```

### 3. Marketing Analytics

Generate periodic reports for content strategy:

```bash
npm run content:analytics
# Review public/content-analytics.json for insights
```

### 4. Public API for Content Discovery

Generate feeds for external tools and integrations:

```bash
npm run content:generate
# Serve public/public-feed.json via your API
```

### 5. Development Workflow

Keep feeds updated while developing:

```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Watch for content changes
npm run content:watch
```

## Troubleshooting

### Issue: Script fails with "Cannot find package"

**Solution:** Install dependencies
```bash
npm install
```

### Issue: Files not being detected

**Possible Causes:**
1. Files are in excluded directories (`node_modules`, `dist`, `.git`)
2. File extensions don't match patterns (`.md`, `.mdx`, `.astro`)
3. Custom `CONTENT_DIRS` doesn't include the file location

**Solution:** Check configuration and file locations
```bash
# List configured directories
node content-workflow.js help | grep "Watching"
```

### Issue: Parsing errors in error log

**Common Causes:**
- TypeScript type definition files (`.d.ts`) being parsed as content
- Files with frontmatter syntax errors
- Non-content files matching the patterns

**Solution:** Review `content-workflow-errors.log` for details
```bash
# Check the error log
cat content-workflow-errors.log

# Exclude problematic directories
EXCLUDE_PATTERNS="**/node_modules/**,**/dist/**,**/.git/**,**/*.d.ts" npm run content:scan
```

### Issue: Watch mode not detecting changes

**Solution:** Ensure file paths match configured patterns
```bash
# Check if file matches patterns
echo "src/pages/new-page.astro" | grep -E "\.(md|mdx|astro)$"
```

### Issue: Generated files not appearing

**Possible Causes:**
1. Output directory doesn't exist
2. Permissions issue
3. Files are gitignored

**Solution:** Check output directory
```bash
# Verify output directory exists
ls -la public/

# Check if files are generated
ls -la public/*.json
```

### Issue: High memory usage with watch mode

**Solution:** Reduce the scope of watched directories
```bash
CONTENT_DIRS="src/content" npm run content:watch
```

## Best Practices

### 1. Use Frontmatter for Metadata

Always include frontmatter in your content files:

```markdown
---
title: "Your Page Title"
description: "A concise description for SEO"
tags: ["tag1", "tag2", "tag3"]
category: "documentation"
---

Your content here...
```

### 2. Run Analytics Regularly

Monitor content health with periodic analytics runs:

```bash
# Weekly content audit
npm run content:analytics
```

### 3. Include in Pre-Commit Hooks

Catch content issues before committing:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run content:scan"
    }
  }
}
```

### 4. Use Watch Mode During Development

Keep feeds updated while writing content:

```bash
npm run content:watch
```

### 5. Version Control Generated Files

Add generated files to `.gitignore` if they're build artifacts:

```gitignore
public/public-feed.json
public/content-analytics.json
content-workflow-errors.log
```

These are already configured in the project's `.gitignore`.

### 6. Document Custom Categories

If using custom categories in frontmatter, document them:

```markdown
Available categories:
- documentation
- page
- content
- casino
- games
- other (default)
```

## Integration with CI/CD

The content workflow is designed to integrate seamlessly with GitHub Actions and other CI/CD platforms.

## Advanced Usage

### Programmatic Usage

You can import and use the script functions in your own tools:

```javascript
import { scanContent, generatePublicFeed, generateAnalytics } from './content-workflow.js';

// Custom workflow
const content = await scanContent();
const feed = await generatePublicFeed(content);
const analytics = await generateAnalytics(content);

console.log(`Processed ${content.length} files`);
```

### Custom Processing Pipeline

Chain commands for custom workflows:

```bash
# Scan, generate, and analyze in one go
npm run content:scan && npm run content:generate && npm run content:analytics
```

### Conditional Processing

Use exit codes for conditional logic:

```bash
# Only build if content is valid
npm run content:scan && npm run build || echo "Content validation failed"
```

## File Output Specifications

### public/public-feed.json

Public-facing JSON feed for external consumption.

**Purpose:** API endpoint for content discovery, RSS feed generation, search indexing

**Structure:**
- `generated`: ISO timestamp of feed generation
- `totalFiles`: Total number of content files
- `categories`: Object with category counts
- `recentUpdates`: Array of 10 most recently updated files
- `content`: Array of all content items with metadata

### public/content-analytics.json

Internal analytics report for content strategy.

**Purpose:** Content health monitoring, editorial planning, SEO optimization

**Structure:**
- `generated`: ISO timestamp of report generation
- `summary`: Overall statistics (files, words, size, averages)
- `categories`: Per-category statistics and word counts
- `tagCloud`: Tag frequency map
- `contentHealth`: Quality metrics (missing titles, descriptions, tags)

### content-workflow-errors.log

Error log for debugging content issues.

**Purpose:** Troubleshooting parsing errors, file issues, and script problems

**Format:**
```
[2025-12-31T18:00:00.000Z] [Processing file: src/example.md] Error message
Stack trace...
```

## Performance Considerations

- **Scan Speed:** ~100-200 files/second on average hardware
- **Memory Usage:** ~50-100MB for typical projects (1000+ files)
- **Watch Mode:** Low CPU usage when idle, spikes briefly on file changes
- **Debouncing:** 1-second delay prevents excessive updates during rapid changes

## Related Documentation

- [MATRIX-HUB-TOOLS.md](MATRIX-HUB-TOOLS.md) - Overview of Matrix-Hub tools
- [README.md](README.md) - Main project documentation
- [GitHub Actions Workflow](.github/workflows/content-validation.yml) - CI integration

## Support

If you encounter issues:

1. Check the error log: `cat content-workflow-errors.log`
2. Review this documentation
3. Check [GitHub Issues](https://github.com/bran8912-ctrl/Matrix-Hub.org/issues)
4. Ask in the Matrix-Hub community

## Contributing

Improvements to the content workflow are welcome! Please open an issue or pull request on GitHub with your proposed changes.

---

**Last Updated:** 2025-12-31

**Script Version:** 1.0.0

**Maintained By:** Matrix-Hub Core Team
