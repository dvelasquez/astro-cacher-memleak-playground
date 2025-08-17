# React Complex Components

This directory contains a set of modular React components that work together to create a complex, render-intensive fixture display system. These components mirror the functionality of the Astro components but are built using React and TypeScript.

## Component Structure

### Main Component
- **`ComplexComponent.tsx`** - The main orchestrator component that combines all sub-components

### Sub-Components
- **`FixtureHeader.tsx`** - Displays the main fixture title, avatar, badges, and creation date
- **`FixtureDescription.tsx`** - Shows the description with word-based tags
- **`FixtureMetadata.tsx`** - Displays creation/update dates and children count in a grid
- **`FixtureChildren.tsx`** - Manages the children section with grid layout and empty state
- **`ChildCard.tsx`** - Individual child item display with hover effects

### Utilities
- **`utils.ts`** - Shared utility functions for date formatting and color generation

## Usage

```tsx
import { ComplexComponent } from '../components/withReact';
import type { FixtureType } from '../data/fixtureType';

const fixture: FixtureType = { /* your fixture data */ };

function App() {
  return <ComplexComponent fixture={fixture} />;
}
```

## Component Hierarchy

```
ComplexComponent
├── FixtureHeader
├── FixtureDescription
├── FixtureMetadata
└── FixtureChildren
    └── ChildCard (multiple instances)
```

## Key Features

1. **TypeScript Support**: Full type safety with proper interfaces
2. **React Hooks Ready**: Components are functional and can easily integrate with React hooks
3. **Tailwind CSS**: Same styling approach as Astro components
4. **Modular Design**: Each component has a single responsibility
5. **Performance Optimized**: Components are designed for high rendering complexity

## Benefits of This Structure

1. **Modularity**: Each component has a single, clear responsibility
2. **Reusability**: Components can be used independently in other parts of the application
3. **Maintainability**: Much easier to update individual sections without affecting others
4. **Code Organization**: Clear separation of concerns and better file structure
5. **Testing**: Each component can be tested in isolation
6. **Performance**: Individual components can be optimized separately

## Rendering Complexity

Each component contributes to the overall rendering complexity:
- **FixtureHeader**: 15+ HTML elements with gradients and hover effects
- **FixtureDescription**: Dynamic word tags with random colors
- **FixtureMetadata**: Grid layout with icons and formatted dates
- **FixtureChildren**: Responsive grid with conditional rendering
- **ChildCard**: Hover effects, transitions, and dynamic styling

The combined effect creates a component that takes significant time to render, making it ideal for testing React's rendering performance.

## Differences from Astro Version

- Uses `className` instead of `class`
- Uses `strokeWidth` instead of `stroke-width` for SVG attributes
- Includes proper React keys for mapped elements
- Exports named components for better tree-shaking
- Ready for React hooks and state management integration
