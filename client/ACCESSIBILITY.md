# Accessibility Guidelines

This document outlines the accessibility guidelines for the Aqua-Stark project. Following these guidelines ensures our application remains accessible to all users, including those using assistive technologies.

## Core Principles

1. **Keyboard Navigation**
   - All interactive elements must be keyboard accessible
   - Focus states must be clearly visible
   - No keyboard traps
   - Use logical tab order
   - Support arrow key navigation in complex widgets (grids, menus)

2. **Screen Reader Support**
   - Provide meaningful alt text for images
   - Use semantic HTML elements
   - Include proper ARIA labels and roles when needed
   - Ensure proper heading hierarchy
   - Hide decorative elements from screen readers

3. **Visual Design**
   - Maintain sufficient color contrast (WCAG AA minimum)
   - Don't rely on color alone to convey information
   - Ensure text is readable at different zoom levels
   - Support high contrast modes

## Component Guidelines

### Buttons and Interactive Elements
```tsx
// Do this:
<button 
  onClick={handleClick}
  aria-label="Add to aquarium"
  className="focus:ring-2 focus:ring-blue-400 focus:outline-none"
>
  <PlusIcon aria-hidden="true" />
</button>

// Don't do this:
<div onClick={handleClick}>Add</div>
```

### Images and Icons
```tsx
// Do this:
<img src="fish.png" alt="Golden Guppy fish" />
<img src="decorative-bubble.png" alt="" aria-hidden="true" />

// Don't do this:
<img src="fish.png" /> // Missing alt
<img src="fish.png" alt="image" /> // Meaningless alt
```

### Forms and Inputs
```tsx
// Do this:
<div>
  <label htmlFor="fishName">Fish Name</label>
  <input 
    id="fishName"
    type="text"
    aria-describedby="nameHint"
  />
  <p id="nameHint">Enter the species name</p>
</div>

// Don't do this:
<input placeholder="Fish Name" />
```

### Modal Dialogs
```tsx
// Do this:
<dialog
  role="dialog"
  aria-labelledby="dialogTitle"
  aria-modal="true"
>
  <h2 id="dialogTitle">Add New Fish</h2>
  <button 
    onClick={closeDialog}
    aria-label="Close dialog"
  >×</button>
</dialog>
```

### Grid and List Views
```tsx
// Do this:
<div 
  role="grid" 
  aria-label="Fish catalog"
>
  <div role="gridcell" tabIndex={0}>
    {/* Content */}
  </div>
</div>
```

## Testing Guidelines

1. **Keyboard Testing**
   - Tab through the entire interface
   - Ensure all interactive elements are reachable
   - Verify focus indicators are visible
   - Test keyboard shortcuts and navigation patterns

2. **Screen Reader Testing**
   - Test with VoiceOver (Mac) or NVDA (Windows)
   - Verify meaningful announcements
   - Check heading structure
   - Ensure proper reading order

3. **Automated Testing**
   - Use eslint-plugin-jsx-a11y
   - Run lighthouse accessibility audits
   - Fix all WCAG violations

## ESLint Configuration

We use `eslint-plugin-jsx-a11y` with strict settings. Key rules:

```js
{
  "jsx-a11y/alt-text": "error",
  "jsx-a11y/aria-role": "error",
  "jsx-a11y/role-has-required-aria-props": "error",
  "jsx-a11y/role-supports-aria-props": "error",
  "jsx-a11y/tabindex-no-positive": "error",
  "jsx-a11y/no-noninteractive-element-interactions": "error"
}
```

## Resources

- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [React Accessibility Docs](https://reactjs.org/docs/accessibility.html)

## Development Process

1. **Planning**
   - Consider accessibility from the start
   - Include accessibility requirements in specs
   - Plan keyboard navigation patterns

2. **Implementation**
   - Use semantic HTML
   - Implement ARIA patterns when needed
   - Add keyboard support
   - Test with screen readers

3. **Review**
   - Include accessibility in code reviews
   - Test with keyboard and screen reader
   - Run automated checks
   - Document any known issues

## Reporting Issues

If you find accessibility issues:

1. Check if it's already reported in Issues
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected accessible behavior
   - Impact on users
   - Screenshots/videos if relevant

## Checklist

Before submitting PRs, ensure:

- [ ] All interactive elements are keyboard accessible
- [ ] Focus management is implemented
- [ ] ARIA attributes are used correctly
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader testing completed
- [ ] ESLint accessibility rules pass
- [ ] Documentation updated
