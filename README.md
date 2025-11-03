# Gignaati Workbench

Gignaati Workbench is a cross-platform Electron desktop application that helps you provision and
operate local AI agents by orchestrating n8n workflows and Ollama LLM runtimes. The stack is built
with Electron Forge, React, TypeScript, Tailwind CSS, and system hardware introspection powered by
[`systeminformation`](https://www.npmjs.com/package/systeminformation).

## Getting Started

```bash
cd gignaati-workbench
npm install
npm run dev
```

This launches Electron Forge in development mode with hot reloading for the renderer bundle.

## Project Highlights

- **Hardware awareness** ? Detects CPU, GPU, RAM, VRAM, and NPU information to verify the minimum
  16 GB RAM / 12 GB VRAM requirement.
- **Integration console** ? Embeds your local n8n instance and monitors Ollama availability.
- **Modern UI** ? React + Tailwind CSS design system optimized for AI operations dashboards.

## Directory Structure

- `src/electron`: Main process entry point and preload script.
- `src/renderer`: React renderer entry, global styles, and the root `App` component.
- `src/components`: Reusable UI building blocks.
- `src/screens`: High-level pages (currently the dashboard).
- `src/services`: Client services for system info, Ollama, and n8n.
- `src/utils`: Utility helpers (formatting, requirement checks).
- `src/types`: Shared TypeScript interfaces and global declarations.
- `src/assets`: Logos and static media.

## Tooling

- Linting with ESLint (`npm run lint`)
- Formatting with Prettier
- Type checking via `npm run typecheck`

## Packaging

Use Electron Forge targets to create distributables:

```bash
npm run make
```
