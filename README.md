# NCI Data Sharing Hub 

[![Coverage Status](https://coveralls.io/repos/github/CBIIT/ccdi-ods-ui/badge.svg)](https://coveralls.io/github/CBIIT/ccdi-ods-ui)

The NCI Data Sharing Hub is a modern, user-friendly web application built to provide comprehensive documentation and resources for the Childhood Cancer Data Initiative (CCDI) Open Data Sharing (ODS) platform. This portal serves as a central hub for users to access documentation, guidance, and resources related to CCDI data sharing.

## Project Overview

This documentation portal is built using modern web technologies and follows best practices for accessibility, performance, and user experience. The application features:

- 📱 Responsive design that works across desktop, tablet, and mobile devices
- 🔍 Advanced search functionality for documentation
- 📚 Dynamic content management for documentation and resources
- 🎨 Modern, accessible UI components
- 🚀 Fast page loads and optimized performance

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) - React framework for production
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - Styled Components for component-specific styling
- **Content Processing**:
  - Gray Matter for front matter parsing
  - React Markdown for rendering markdown content
  - Rehype/Remark plugins for markdown extensions
- **Search**: Fuse.js for fuzzy searching
- **UI Components**: Custom components built for optimal user experience
- **Performance Optimization**:
  - Next.js Image optimization
  - Dynamic imports
  - Route pre-fetching

## System Design

The application follows a modular architecture:

```
src/
├── app/           # Next.js app router and pages
├── components/    # Reusable UI components
│   ├── Header    # Navigation and search components
│   ├── Footer    # Site footer components
│   └── LandingPage # Landing page specific components
├── config/       # Global configuration and data
└── ...
```

### Key Features

1. **Dynamic Documentation Pages**
   - Markdown-based content
   - Auto-generated navigation
   - Code syntax highlighting

2. **Search System**
   - Full-text search across documentation
   - Real-time search suggestions
   - Filter by categories

3. **Responsive Layout**
   - Desktop, tablet, and mobile optimized views
   - Adaptive navigation patterns
   - Flexible content layouts

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Deployment

The application is configured for deployment on various platforms:

- **GitHub Pages**: Uses gh-pages for deployment
- **Custom Server**: Traditional build and serve

For deployment instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

