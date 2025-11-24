# Responsive Design Quick Reference

## Breakpoints
```css
Mobile:   < 640px
Tablet:   640px - 1024px
Laptop:   1024px - 1440px
Desktop:  > 1440px
```

## Utility Classes

### Display Utilities
```html
<!-- Hide on mobile -->
<div className="mobile-hide">Hidden on mobile</div>

<!-- Show only on mobile -->
<div className="mobile-show">Visible only on mobile</div>

<!-- Hide on tablet -->
<div className="tablet-hide">Hidden on tablet</div>

<!-- Show only on tablet -->
<div className="tablet-show">Visible only on tablet</div>

<!-- Hide on desktop -->
<div className="desktop-hide">Hidden on desktop</div>

<!-- Show only on desktop -->
<div className="desktop-show">Visible only on desktop</div>
```

### Responsive Display (Tailwind-style)
```html
<!-- Hidden by default, block on small screens and up -->
<div className="sm:block">Visible on 640px+</div>

<!-- Hidden by default, flex on medium screens and up -->
<div className="md:flex">Flex on 768px+</div>

<!-- Hidden by default, grid on large screens and up -->
<div className="lg:grid">Grid on 1024px+</div>

<!-- Hidden on medium screens and up -->
<div className="md:hidden">Hidden on 768px+</div>
```

### Fluid Typography
```html
<p className="text-xs">Extra small text</p>
<p className="text-sm">Small text</p>
<p className="text-base">Base text</p>
<p className="text-lg">Large text</p>
<p className="text-xl">Extra large text</p>
<p className="text-2xl">2X large text</p>
<p className="text-3xl">3X large text</p>
```

### Fluid Spacing
```html
<div className="spacing-xs">Extra small padding</div>
<div className="spacing-sm">Small padding</div>
<div className="spacing-md">Medium padding</div>
<div className="spacing-lg">Large padding</div>
<div className="spacing-xl">Extra large padding</div>
```

### Fluid Gaps
```html
<div className="gap-responsive-sm">Small gap</div>
<div className="gap-responsive-md">Medium gap</div>
<div className="gap-responsive-lg">Large gap</div>
```

### Container
```html
<!-- Responsive container with max-width -->
<div className="container-responsive">
  Content here
</div>
```

### Aspect Ratios
```html
<div className="aspect-square">1:1 ratio</div>
<div className="aspect-video">16:9 ratio</div>
<div className="aspect-portrait">3:4 ratio</div>
```

### Responsive Images
```html
<img className="img-responsive" src="..." alt="..." />
<img className="img-cover" src="..." alt="..." />
<img className="img-contain" src="..." alt="..." />
```

## Inline Responsive Styles

### Using window.innerWidth
```jsx
// Font size
style={{
  fontSize: window.innerWidth <= 640 ? '0.875rem' : '1rem'
}}

// Padding
style={{
  padding: window.innerWidth <= 640 ? '0.75rem' : 
           window.innerWidth <= 1024 ? '1rem' : '1.25rem'
}}

// Width
style={{
  width: window.innerWidth <= 640 ? '40px' : 
         window.innerWidth <= 1024 ? '44px' : '48px'
}}
```

## Common Patterns

### Responsive Grid
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 
                       window.innerWidth <= 1024 ? '1fr 1.5fr' : '1fr 2fr',
  gap: window.innerWidth <= 640 ? '0.5rem' : '1rem'
}}>
  {/* Content */}
</div>
```

### Responsive Flex
```jsx
<div style={{
  display: 'flex',
  flexDirection: window.innerWidth <= 640 ? 'column' : 'row',
  gap: window.innerWidth <= 640 ? '0.5rem' : '1rem'
}}>
  {/* Content */}
</div>
```

### Conditional Rendering
```jsx
{window.innerWidth <= 768 && (
  <MobileComponent />
)}

{window.innerWidth > 768 && (
  <DesktopComponent />
)}
```

### Touch-Friendly Buttons
```jsx
<button style={{
  minWidth: '44px',
  minHeight: '44px',
  padding: window.innerWidth <= 640 ? '0.625rem' : '0.75rem'
}}>
  Click me
</button>
```

## CSS Media Queries

### Mobile First
```css
/* Base styles (mobile) */
.element {
  font-size: 0.875rem;
  padding: 0.5rem;
}

/* Tablet and up */
@media (min-width: 640px) {
  .element {
    font-size: 1rem;
    padding: 0.75rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element {
    font-size: 1.125rem;
    padding: 1rem;
  }
}
```

### Desktop First
```css
/* Base styles (desktop) */
.element {
  font-size: 1.125rem;
  padding: 1rem;
}

/* Tablet and down */
@media (max-width: 1023px) {
  .element {
    font-size: 1rem;
    padding: 0.75rem;
  }
}

/* Mobile and down */
@media (max-width: 639px) {
  .element {
    font-size: 0.875rem;
    padding: 0.5rem;
  }
}
```

## Best Practices

### 1. Touch Targets
- Minimum 44px x 44px on mobile
- Minimum 48px x 48px on touch-only devices
- Add adequate spacing between interactive elements

### 2. Font Sizes
- Use `clamp()` for fluid typography when possible
- Ensure text remains readable at all sizes
- Test with browser zoom at 200%

### 3. Spacing
- Use relative units (rem, em) instead of px
- Scale spacing proportionally with screen size
- Maintain consistent spacing ratios

### 4. Images
- Use responsive images with `srcset`
- Implement lazy loading for better performance
- Always include `alt` text for accessibility

### 5. Testing
- Test on real devices when possible
- Use browser DevTools device emulation
- Test both portrait and landscape orientations
- Test with slow network connections

### 6. Performance
- Minimize JavaScript-based responsive logic
- Use CSS media queries when possible
- Avoid layout shifts during resize
- Optimize images for different screen sizes

## Common Issues and Solutions

### Issue: Layout breaks on specific screen size
**Solution**: Add a specific media query for that breakpoint

### Issue: Text too small on mobile
**Solution**: Use fluid typography with `clamp()` or increase base font size

### Issue: Buttons too small to tap on mobile
**Solution**: Ensure minimum 44px touch targets

### Issue: Horizontal scrolling on mobile
**Solution**: Add `overflow-x: hidden` and check for fixed widths

### Issue: Images not scaling properly
**Solution**: Use `max-width: 100%` and `height: auto`

### Issue: Content cramped on small screens
**Solution**: Reduce padding, margins, and font sizes on mobile

## Resources
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev: Responsive Web Design Basics](https://web.dev/responsive-web-design-basics/)
- [CSS Tricks: A Complete Guide to CSS Media Queries](https://css-tricks.com/a-complete-guide-to-css-media-queries/)
