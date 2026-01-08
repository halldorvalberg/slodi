# Design Token Naming Standards & Best Practices

A comprehensive guide based on industry standards from leading design systems including Material Design, IBM Carbon, Salesforce Lightning, U.S. Web Design System, and others.

## 📚 Table of Contents

1. [What Are Design Tokens?](#what-are-design-tokens)
2. [Three-Tier Token Architecture](#three-tier-token-architecture)
3. [Naming Convention Structure](#naming-convention-structure)
4. [Token Categories](#token-categories)
5. [Case Conventions](#case-conventions)
6. [Naming Best Practices](#naming-best-practices)
7. [Token Organization](#token-organization)
8. [Real-World Examples](#real-world-examples)

---

## What Are Design Tokens?

Design tokens are the atomic building blocks of a design system that store foundational style values like color, spacing, typography, and motion in a platform-agnostic format shared by both design tools and codebases.

### Key Principles

- **Single Source of Truth**: One place to update design decisions
- **Platform Agnostic**: Works across web, iOS, Android, etc.
- **Semantic Naming**: Names describe purpose, not value
- **Scalable**: Organized hierarchically for growth

---

## Three-Tier Token Architecture

Most mature systems like IBM's Carbon Design System follow a three-tier model: global (primitive), semantic (alias), and component tokens.

### Tier 1: Primitive/Global Tokens

**Purpose**: Raw, context-agnostic values  
**Usage**: Referenced by other tokens, not used directly  
**Characteristics**:
- Platform-agnostic
- No semantic meaning
- Foundation for all other tokens

```css
/* Color primitives */
--blue-50: #eff6ff;
--blue-100: #dbeafe;
--blue-500: #3b82f6;
--blue-900: #1e3a8a;

/* Spacing primitives */
--space-1: 0.25rem;
--space-4: 1rem;
--space-8: 2rem;

/* Typography primitives */
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-xl: 1.25rem;
```

### Tier 2: Semantic/Alias Tokens

**Purpose**: Context-aware tokens with meaning  
**Usage**: Applied in designs and code  
**Characteristics**:
- Describe purpose and usage
- Reference primitive tokens
- Enable theming

```css
/* Semantic color tokens */
--color-primary: var(--blue-500);
--color-text-primary: var(--gray-900);
--color-background: var(--white);
--color-border: var(--gray-200);

/* Semantic spacing tokens */
--spacing-sm: var(--space-2);
--spacing-md: var(--space-4);
--spacing-lg: var(--space-8);

/* Semantic typography tokens */
--text-body: var(--font-size-base);
--text-heading: var(--font-size-xl);
```

### Tier 3: Component Tokens

**Purpose**: Component-specific values  
**Usage**: Used within specific components  
**Characteristics**:
- Most specific layer
- References semantic or primitive tokens
- Enables fine-grained control

```css
/* Button component tokens */
--button-bg: var(--color-primary);
--button-text: var(--color-text-inverse);
--button-padding: var(--spacing-md);
--button-radius: var(--radius-base);

/* Card component tokens */
--card-bg: var(--color-surface);
--card-border: var(--color-border);
--card-shadow: var(--shadow-base);
--card-padding: var(--spacing-lg);
```

---

## Naming Convention Structure

Design token names may include terms that define the context, object, and modifier, for example: [group].[component].[variant/category].[element].[position].[relationship].[property].[type].[scale].[state].

### Common Naming Patterns

Nord Design System uses the structure: {prefix}-{category}-{subcategory}-{name}, where prefix ensures naming doesn't conflict with other systems.

#### Pattern 1: Category-Based (WHAT)

```
{prefix}-{category}-{property}-{variant}-{state}
```

**Examples**:
- `color-primary`
- `color-primary-hover`
- `font-body-bold`
- `spacing-section-large`
- `shadow-card-subtle`

#### Pattern 2: Component-Based (WHERE)

```
{component}-{element}-{property}-{variant}-{state}
```

**Examples**:
- `button-primary-background`
- `button-primary-background-hover`
- `card-header-title`
- `input-border-error`
- `navigation-link-active`

#### Pattern 3: Semantic Role-Based (HOW)

```
{property}-{role}-{modifier}-{state}
```

**Examples**:
- `color-text-primary`
- `color-text-secondary`
- `color-background-surface`
- `color-border-strong`
- `spacing-component-padding`

---

## Token Categories

### Core Token Types

Based on industry standards, primary types include color, typography, spacing, sizing, border radius, shadows, and timing.

#### 1. Color Tokens

```css
/* Primitive Colors */
--blue-50: #eff6ff;
--blue-500: #3b82f6;
--blue-900: #1e3a8a;

/* Semantic Colors */
--color-primary: var(--blue-500);
--color-secondary: var(--purple-500);
--color-accent: var(--green-500);

/* Feedback Colors */
--color-success: var(--green-600);
--color-warning: var(--orange-500);
--color-error: var(--red-600);
--color-info: var(--blue-600);

/* Surface Colors */
--color-background: #ffffff;
--color-surface: var(--gray-50);
--color-surface-hover: var(--gray-100);

/* Border Colors */
--color-border: var(--gray-200);
--color-border-hover: var(--gray-300);
--color-border-focus: var(--color-primary);

/* Text Colors */
--color-text-primary: var(--gray-900);
--color-text-secondary: var(--gray-700);
--color-text-tertiary: var(--gray-500);
--color-text-disabled: var(--gray-400);
--color-text-inverse: #ffffff;
```

#### 2. Typography Tokens

```css
/* Font Family */
--font-family-sans: "Inter", system-ui, sans-serif;
--font-family-serif: Georgia, serif;
--font-family-mono: "Fira Code", monospace;

/* Font Size Scale */
--font-size-xs: 0.75rem;      /* 12px */
--font-size-sm: 0.875rem;     /* 14px */
--font-size-base: 1rem;       /* 16px */
--font-size-lg: 1.125rem;     /* 18px */
--font-size-xl: 1.25rem;      /* 20px */
--font-size-2xl: 1.5rem;      /* 24px */
--font-size-3xl: 1.875rem;    /* 30px */
--font-size-4xl: 2.25rem;     /* 36px */
--font-size-5xl: 3rem;        /* 48px */

/* Font Weight */
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Line Height */
--line-height-tight: 1.25;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
--line-height-loose: 2;

/* Letter Spacing */
--letter-spacing-tight: -0.05em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.05em;

/* Semantic Typography */
--text-heading-1: var(--font-size-5xl);
--text-heading-2: var(--font-size-4xl);
--text-heading-3: var(--font-size-3xl);
--text-body: var(--font-size-base);
--text-caption: var(--font-size-sm);
```

#### 3. Spacing Tokens

```css
/* Primitive Spacing (4px base scale) */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */

/* Semantic Spacing */
--spacing-section: var(--space-24);
--spacing-component: var(--space-6);
--spacing-element: var(--space-4);
--spacing-inline: var(--space-2);

/* Inset Spacing (padding) */
--inset-xs: var(--space-2);
--inset-sm: var(--space-3);
--inset-md: var(--space-4);
--inset-lg: var(--space-6);
--inset-xl: var(--space-8);

/* Stack Spacing (margin/gap) */
--stack-xs: var(--space-2);
--stack-sm: var(--space-3);
--stack-md: var(--space-4);
--stack-lg: var(--space-6);
--stack-xl: var(--space-8);
```

#### 4. Sizing Tokens

```css
/* Width Scale */
--width-xs: 20rem;    /* 320px */
--width-sm: 24rem;    /* 384px */
--width-md: 28rem;    /* 448px */
--width-lg: 32rem;    /* 512px */
--width-xl: 36rem;    /* 576px */
--width-2xl: 42rem;   /* 672px */
--width-3xl: 48rem;   /* 768px */
--width-4xl: 56rem;   /* 896px */
--width-full: 100%;

/* Height Scale */
--height-xs: 1.5rem;
--height-sm: 2rem;
--height-md: 2.5rem;
--height-lg: 3rem;
--height-xl: 3.5rem;

/* Icon Sizes */
--icon-xs: 1rem;      /* 16px */
--icon-sm: 1.25rem;   /* 20px */
--icon-md: 1.5rem;    /* 24px */
--icon-lg: 2rem;      /* 32px */
--icon-xl: 3rem;      /* 48px */

/* Component Sizing */
--button-height-sm: var(--height-sm);
--button-height-md: var(--height-md);
--button-height-lg: var(--height-lg);
--input-height: var(--height-md);
```

#### 5. Border Radius Tokens

```css
/* Primitive Radius */
--radius-none: 0;
--radius-xs: 0.125rem;    /* 2px */
--radius-sm: 0.25rem;     /* 4px */
--radius-base: 0.375rem;  /* 6px */
--radius-md: 0.5rem;      /* 8px */
--radius-lg: 0.75rem;     /* 12px */
--radius-xl: 1rem;        /* 16px */
--radius-2xl: 1.5rem;     /* 24px */
--radius-full: 9999px;

/* Semantic Radius */
--radius-button: var(--radius-md);
--radius-input: var(--radius-md);
--radius-card: var(--radius-lg);
--radius-modal: var(--radius-xl);
--radius-badge: var(--radius-full);
--radius-avatar: var(--radius-full);
```

#### 6. Shadow Tokens

```css
/* Elevation Shadows */
--shadow-none: none;
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 
             0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-base: 0 4px 6px -1px rgb(0 0 0 / 0.1), 
               0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1), 
             0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1), 
             0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Semantic Shadows */
--shadow-card: var(--shadow-sm);
--shadow-card-hover: var(--shadow-md);
--shadow-modal: var(--shadow-xl);
--shadow-dropdown: var(--shadow-lg);
```

#### 7. Timing/Duration Tokens

```css
/* Animation Duration */
--duration-instant: 0ms;
--duration-fast: 150ms;
--duration-base: 250ms;
--duration-slow: 350ms;
--duration-slower: 500ms;

/* Easing Functions */
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Semantic Transitions */
--transition-fast: var(--duration-fast) var(--ease-out);
--transition-base: var(--duration-base) var(--ease-in-out);
--transition-slow: var(--duration-slow) var(--ease-in-out);
```

#### 8. Z-Index Tokens

```css
/* Z-Index Scale */
--z-0: 0;
--z-10: 10;
--z-20: 20;
--z-30: 30;
--z-40: 40;
--z-50: 50;

/* Semantic Z-Index */
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
--z-toast: 1080;
```

#### 9. Opacity Tokens

```css
/* Opacity Scale */
--opacity-0: 0;
--opacity-5: 0.05;
--opacity-10: 0.1;
--opacity-20: 0.2;
--opacity-30: 0.3;
--opacity-40: 0.4;
--opacity-50: 0.5;
--opacity-60: 0.6;
--opacity-70: 0.7;
--opacity-80: 0.8;
--opacity-90: 0.9;
--opacity-100: 1;

/* Semantic Opacity */
--opacity-disabled: var(--opacity-50);
--opacity-hover: var(--opacity-80);
--opacity-overlay: var(--opacity-70);
```

---

## Case Conventions

When naming design tokens, you need to decide on a consistent case convention, including PascalCase, camelCase, snake_case, and kebab-case.

### Option 1: kebab-case (Recommended for CSS)

**Format**: `primary-color`, `font-size-large`, `spacing-section`

**Pros**:
- Most common in CSS
- Easy to read
- URL-friendly
- Works with CSS custom properties

**Cons**:
- Not valid in some programming languages

**Use Cases**: CSS variables, HTML attributes, URLs

```css
--color-primary: #3b82f6;
--font-size-large: 1.5rem;
--spacing-section: 3rem;
```

### Option 2: camelCase

**Format**: `primaryColor`, `fontSizeLarge`, `spacingSection`

**Pros**:
- Common in JavaScript
- Less visually heavy than PascalCase
- Familiar to developers

**Cons**:
- Can be perceived as technical
- Not as readable for non-developers

**Use Cases**: JavaScript, TypeScript, JSON

```javascript
const tokens = {
  colorPrimary: '#3b82f6',
  fontSizeLarge: '1.5rem',
  spacingSection: '3rem'
};
```

### Option 3: snake_case

**Format**: `primary_color`, `font_size_large`, `spacing_section`

**Pros**:
- Used in some design tools
- Clear word separation

**Cons**:
- Less common in modern design systems
- Can appear visually cluttered

**Use Cases**: Python, Ruby, some databases

```python
tokens = {
  'primary_color': '#3b82f6',
  'font_size_large': '1.5rem',
  'spacing_section': '3rem'
}
```

### Option 4: dot.notation

**Format**: `color.primary`, `font.size.large`, `spacing.section`

**Pros**:
- Hierarchical structure
- Easy to organize
- Good for JSON

**Cons**:
- May conflict with object notation
- Not valid in CSS directly

**Use Cases**: JSON, configuration files, Figma Variables

```json
{
  "color": {
    "primary": "#3b82f6"
  },
  "font": {
    "size": {
      "large": "1.5rem"
    }
  }
}
```

### Recommendation

**For CSS**: Use `kebab-case` (most standard)  
**For JavaScript**: Use `camelCase` or `dot.notation`  
**For Design Tools**: Use `dot.notation` (Figma) or `kebab-case`  
**Be Consistent**: Choose one and stick with it across your system

---

## Naming Best Practices

### 1. Use Semantic, Not Literal Names

A good name has a logical structure, is short, meaningful, known by everyone, and not related to visual properties.

❌ **Bad (Literal)**:
```css
--blue-color: #3b82f6;
--large-spacing: 2rem;
--heavy-font: 700;
```

✅ **Good (Semantic)**:
```css
--color-primary: #3b82f6;
--spacing-section: 2rem;
--font-weight-bold: 700;
```

### 2. Name by Purpose, Not Value

❌ **Bad**:
```css
--20px-space: 1.25rem;
--red-500: #ef4444;
```

✅ **Good**:
```css
--spacing-component: 1.25rem;
--color-error: #ef4444;
```

### 3. Be Descriptive and Specific

❌ **Bad (Too Generic)**:
```css
--color1: #3b82f6;
--spacing2: 1rem;
--size-big: 2rem;
```

✅ **Good (Specific)**:
```css
--color-primary: #3b82f6;
--spacing-element: 1rem;
--font-size-heading: 2rem;
```

### 4. Follow a Consistent Pattern

```css
/* Pattern: {category}-{role}-{modifier}-{state} */

/* Colors */
--color-text-primary
--color-text-secondary
--color-background-primary
--color-background-secondary

/* Spacing */
--spacing-component-small
--spacing-component-medium
--spacing-component-large

/* Typography */
--font-size-heading-large
--font-size-heading-medium
--font-size-body-large
```

### 5. Use T-Shirt Sizing

Nord defines sizing using T-shirt sizes (xs, s, m, l, xl), making it possible for anyone, technical or non-technical, to understand differences.

```css
/* T-shirt sizing */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
--spacing-2xl: 3rem;

/* Numeric scale (alternative) */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
```

### 6. Include Modifiers for States

```css
/* Base states */
--button-background: var(--color-primary);
--button-text: var(--color-text-inverse);

/* Interactive states */
--button-background-hover: var(--color-primary-hover);
--button-background-active: var(--color-primary-active);
--button-background-disabled: var(--color-disabled);

/* Focus states */
--button-border-focus: var(--color-focus);
--button-shadow-focus: 0 0 0 3px var(--color-focus-ring);
```

### 7. Document Your Naming System

Create a naming guide that includes:
- Pattern structure
- Categories and subcategories
- Modifiers and states
- Examples for each token type
- Dos and don'ts

---

## Token Organization

### By File Structure

```
tokens/
├── primitives/
│   ├── colors.css
│   ├── spacing.css
│   ├── typography.css
│   └── sizing.css
├── semantic/
│   ├── colors.css
│   ├── spacing.css
│   └── typography.css
└── components/
    ├── button.css
    ├── card.css
    └── input.css
```

### By Token Type

```css
/* ===== PRIMITIVES ===== */

/* Colors */
:root {
  --blue-50: #eff6ff;
  --blue-500: #3b82f6;
  /* ... */
}

/* Spacing */
:root {
  --space-1: 0.25rem;
  --space-4: 1rem;
  /* ... */
}

/* ===== SEMANTICS ===== */

/* Brand */
:root {
  --color-primary: var(--blue-500);
  --spacing-component: var(--space-4);
  /* ... */
}

/* ===== COMPONENTS ===== */

/* Button */
:root {
  --button-bg: var(--color-primary);
  --button-padding: var(--spacing-component);
  /* ... */
}
```

---

## Real-World Examples

### Material Design 3

```css
/* MD3 uses sys- prefix with clear roles */
--md-sys-color-primary: #6750A4;
--md-sys-color-on-primary: #FFFFFF;
--md-sys-color-surface: #FFFBFE;
--md-sys-typescale-body-large: 1rem;
```

### IBM Carbon

```css
/* Carbon uses category-role-scale pattern */
--cds-text-primary: #161616;
--cds-background: #ffffff;
--cds-spacing-05: 1rem;
--cds-type-body-short-01: 0.875rem;
```

### Salesforce Lightning

```css
/* Lightning uses var-category-role pattern */
--lwc-colorTextDefault: #181818;
--lwc-spacingSmall: 0.75rem;
--lwc-borderRadiusMedium: 0.25rem;
```

### Tailwind CSS

```css
/* Tailwind uses numeric scales */
--color-blue-500: #3b82f6;
--spacing-4: 1rem;
--text-base: 1rem;
```

### Nord Design System

```css
/* Nord uses prefix-category-role pattern */
--n-color-accent: #0072CE;
--n-space-xl: 2rem;
--n-font-family-body: "Open Sans";
```

---

## Summary Checklist

✅ **Three-Tier Architecture**: Primitive → Semantic → Component  
✅ **Semantic Naming**: Name by purpose, not value  
✅ **Consistent Pattern**: Choose and stick to one naming structure  
✅ **Case Convention**: Prefer kebab-case for CSS  
✅ **T-Shirt Sizing**: Use xs/sm/md/lg/xl for scales  
✅ **State Modifiers**: Include hover, active, disabled, focus  
✅ **Documentation**: Clearly document your system  
✅ **Prefix**: Use namespace prefix to avoid conflicts  
✅ **Scalability**: Design for growth and theming  
✅ **Team Alignment**: Ensure designers and developers agree

---

## Additional Resources

- W3C Design Tokens Community Group
- Design Tokens Format Specification
- Nathan Curtis - "Naming Tokens in Design Systems"
- Jina Anne - Salesforce Design Tokens
- Brad Frost - CSS Architecture for Design Systems
- Figma Design Tokens Plugin

---

**Remember**: Naming design tokens isn't just a one-time task—it's an ongoing process that helps build a design system that's effective, scalable, and user-friendly.
