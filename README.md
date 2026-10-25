# Task. — Task management

Task. is a responsive, local-first task management app built with React, TypeScript, and Vite. Tasks are stored in your browser; no account, backend, or API credentials are required.

## Getting started

```bash
npm install
npm run dev
```

Vite prints the local development URL after it starts.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run strict TypeScript checks and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the Vitest test suite |
| `npm run test:watch` | Run Vitest in watch mode |

## Features

- Dashboard statistics derived from the live task collection, including overdue count and completion rate.
- Create, view, edit, delete, and change the status of tasks.
- Todo, In Progress, and Done workflow with Low, Medium, High, and Critical priorities.
- Search by title or description; combine it with status, priority, and category filters.
- Sort by creation date or due date, and view tasks in a list or Kanban board.
- LocalStorage persistence, first-run sample tasks, and settings to restore sample data or clear the task list.
- Light and dark themes, responsive navigation, accessible form labels, and keyboard focus states.

## Project architecture

- `src/types` contains shared application and task types.
- `src/utils` contains task validation, persistence parsing, filtering, sorting, and derived statistics.
- `src/hooks` owns task state and LocalStorage synchronization.
- `src/components/layout` contains the app shell, navigation, and global header.
- `src/components/tasks` contains shared task badges, forms, and list presentation.
- `src/pages` contains the dashboard, task list, detail, board, settings, and not-found routes.
- `src/styles` contains design tokens and responsive global styles.
- `src/**/*.test.ts(x)` contains focused utility and state/persistence tests.

All task data is saved in the browser's `localStorage` under `orbit.tasks.v1` to preserve tasks from earlier versions. Clearing browser site data also removes saved tasks.

For a detailed explanation of the routes, data flow, persistence, styling, tests, and common changes, see the [Project guide](./PROJECT_GUIDE.md).
