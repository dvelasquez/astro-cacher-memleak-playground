# Astro Complex Components

This directory contains a set of modular components that work together to create a complex, render-intensive fixture display system.

## Component Structure

### Main Component
- **`ComplexComponent.astro`** - The main orchestrator component that combines all sub-components

### Sub-Components
- **`FixtureHeader.astro`** - Displays the main fixture title, avatar, badges, and creation date
- **`FixtureDescription.astro`** - Shows the description with word-based tags
- **`FixtureMetadata.astro`** - Displays creation/update dates and children count in a grid
- **`FixtureChildren.astro`** - Manages the children section with grid layout and empty state
- **`ChildCard.astro`** - Individual child item display with hover effects

### Utilities
- **`utils.ts`** - Shared utility functions for date formatting and color generation

## Usage

```astro
---
import ComplexComponent from '../components/withAstro/ComplexComponent.astro';
import type { FixtureType } from '../data/fixtureType';

const fixture: FixtureType = { /* your fixture data */ };
---

<ComplexComponent fixture={fixture} />
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

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be used independently
3. **Maintainability**: Easier to update individual sections
4. **Testing**: Each component can be tested in isolation
5. **Performance**: Components can be optimized individually
6. **Code Organization**: Clear separation of concerns

## Rendering Complexity

Each component contributes to the overall rendering complexity:
- **FixtureHeader**: 15+ HTML elements with gradients and hover effects
- **FixtureDescription**: Dynamic word tags with random colors
- **FixtureMetadata**: Grid layout with icons and formatted dates
- **FixtureChildren**: Responsive grid with conditional rendering
- **ChildCard**: Hover effects, transitions, and dynamic styling

The combined effect creates a component that takes significant time to render, making it ideal for testing Astro's rendering performance.
