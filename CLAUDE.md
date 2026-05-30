# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Hugo-based personal blog (amemiya02.github.io) using the **FixIt** theme. Content is primarily LeetCode algorithm solutions written in Chinese with Python code blocks. Deployed to GitHub Pages via GitHub Actions.

## Commands

```bash
# Local development server (live reload)
hugo server -D

# Build for production (output to ./public)
hugo --minify

# Create a new post from the default archetype
hugo new content posts/YYYY-MM-DD-slug.md

# Create a new post bundle (for posts with images/resources)
hugo new content posts/YYYY-MM-DD-slug/index.md
```

Hugo extended edition is required (used in CI via `peaceiris/actions-hugo@v3`).

## Architecture

### Configuration (split config pattern)

All site config lives in `config/_default/` as YAML files, with a legacy `hugo.toml` at root that also sets params. Hugo merges both — be aware of potential overrides between them.

| File | Purpose |
|---|---|
| `hugo.yaml` | Default language, CJK settings |
| `params.yaml` | Theme params: search, header, profile, footer, CDN |
| `languages.yaml` | Language-specific overrides (zh-CN title, subtitle, CJK detection) |
| `menus.yaml` | Navigation menu items (home, posts, categories, tags) |
| `outputs.yaml` | Output formats per section (home: html+rss+json, page: html+markdown) |
| `author.yaml` | Author metadata |
| `hugo.toml` (root) | Base URL, pagination, markup/math config, inline params |

### Content Structure

- `content/posts/` — All blog posts as flat markdown files (38 total)
- Post naming convention: `YYYY-MM-DD-topic.md` (e.g., `2026-03-25-binary-search.md`)
- Posts cover LeetCode topics: array, binary search, backtracking, DP, graph, greedy, hash, heap, linked list, matrix, sliding window, stack, substring, trick, two-pointer, binary tree

### Post Front Matter

Standard front matter fields used in posts:

```yaml
---
title: "[Python] LeetCode 热题 100 - 二分查找"
date: 2026-03-25T15:30:20+09:00
categories: [算法, LeetCode]
tags: [Python, 二分查找, 题解]
draft: false
author:
  name: Amemiya
  avatar: avatar.png
---
```

The `post-bundle` archetype (`archetypes/post-bundle/index.md`) provides a fuller template with subtitle, slug, description, keywords, weight, resources, and other FixIt-specific front matter options.

### Math Rendering

MathJax is configured for LaTeX math. Two partial overrides exist:

- `layouts/_partials/math.html` — MathJax 3 (used conditionally via `params.math`)
- `layouts/_partials/extend_head.html` — MathJax 4 (always loaded)

**Note:** `extend_head.html` unconditionally loads MathJax 4, while `math.html` conditionally loads MathJax 3. The `hugo.toml` enables `math.enable = true` globally. This creates a potential conflict — MathJax may load twice. If fixing, consolidate to one version in `extend_head.html` and remove or guard `math.html`.

### Theme

The FixIt theme lives in `themes/FixIt/` (managed as a git submodule). The `jsconfig.json` in `assets/` maps asset paths to the theme directory for Hugo Pipes resolution.

Custom SCSS overrides are in `assets/css/_custom.scss` (avatar styling).

### Deployment

Pushes to `main` trigger `.github/workflows/hugo.yml`:
1. Checkout with recursive submodules
2. Install Hugo extended (latest)
3. Build with `hugo --minify`
4. Upload `./public` to GitHub Pages

### Math/Goldmark Passthrough

`hugo.toml` enables goldmark passthrough delimiters for MathJax: block `\[...\]` / `$$...$$`, inline `\(...\)` / `$...$`. This allows LaTeX in markdown content without raw HTML escapes.
