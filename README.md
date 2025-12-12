# TypeScript Website Project

A modern TypeScript website project with live development server and build tools.

## Features

- TypeScript compilation
- Live development server with auto-reload
- Modern CSS styling
- Interactive DOM manipulation
- Type-safe development

## Project Structure

```
├── src/                 # TypeScript source files
│   └── index.ts        # Main application file
├── public/             # Static assets
│   ├── index.html      # Main HTML file
│   └── styles.css      # CSS styles
├── dist/               # Compiled output (generated)
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Serve production build:
   ```bash
   npm start
   ```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Start development server with auto-reload
- `npm start` - Serve the built application
- `npm run clean` - Remove compiled files

## Development

The project uses TypeScript for type-safe development. The main application logic is in `src/index.ts`, which demonstrates:

- Class-based TypeScript development
- DOM manipulation with type safety
- Event handling
- Interactive UI updates

## Dependencies

- **TypeScript**: For type-safe JavaScript development
- **live-server**: Development server with auto-reload
- **concurrently**: Run multiple npm scripts simultaneously
- **rimraf**: Cross-platform file removal