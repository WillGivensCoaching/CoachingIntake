# Will Givens Poker Coaching Website - AI Coding Instructions

## Project Overview
Static website for poker coaching services hosted at willgivens.com (GitHub Pages). Features a landing page with course catalog and three detailed course curriculum pages (101, 102, 103), all using custom HTML/CSS with no build step or framework dependencies.

## Architecture & Design System

### Visual Theme
- **Dark mode aesthetic**: Black background (#000000/#1a1a1a) with light text (#e0e0e0/#f5f5f5)
- **Course-specific accent colors**:
  - Course 101 (Fundamentals): `#e54c4c` (red)
  - Course 102 (Advanced): `#4c8de5` (blue)  
  - Course 103 (Exploitation): `#e54c8d` (magenta/pink)
  - Landing page: `#e74c3c` (red accent)
- **Typography**: Montserrat for landing, Inter for courses; bold headers with Poppins logo font

### Component Patterns

**Sticky headers** with course branding:
```html
<header class="sticky top-0 z-50 bg-card shadow-lg">
  <h1 class="text-3xl font-black text-white">Course Title</h1>
  <span class="text-accent">COURSE TAGLINE</span>
</header>
```

**Module sections** with accent borders:
```css
.module-header {
    border-bottom: 3px solid [accent-color];
    padding-bottom: 0.75rem;
}
```

**Themed boxes** for callouts (consistent across all courses):
- `.tip-box`: Yellow border (#fcd34d)
- `.definition-box`: Green border (#34d399)
- `.fun-fact-box`: Red border (#ef4444)

## File Structure & Conventions

- **[index.html](index.html)**: Landing page with hero, course grid, application form, testimonials
- **[course101.html](course101.html)**: Fundamentals course (uses TailwindCSS CDN)
- **[course102.html](course102.html)**: Advanced post-flop (includes KaTeX for math formulas)
- **[course103.html](course103.html)**: Exploitative play (similar structure to 102)
- **[CNAME](CNAME)**: Contains `willgivens.com` for GitHub Pages custom domain

### Styling Approach
- Landing page: Embedded CSS with custom grid layouts and responsive breakpoints
- Course pages: TailwindCSS CDN + extensive custom CSS overrides
- No external stylesheet files - all styles embedded in `<style>` tags

## Development Workflows

**Testing changes**: Open HTML files directly in browser (no build process)

**Deployment**: Push to main branch → GitHub Pages auto-deploys to willgivens.com

**Adding new courses**: Follow course10X.html pattern:
1. Copy existing course file structure
2. Update accent color in all CSS classes (`.text-accent`, `.module-header`, etc.)
3. Maintain module section structure with `<section class="bg-card">` wrappers
4. Add course card to [index.html](index.html) `.course-grid` with Stripe payment link

## Critical Conventions

**Responsive design**:
- Mobile breakpoint: `@media (max-width: 768px)`
- Grid switches to single column on mobile
- Landing page hides nav menu on mobile (consider adding hamburger menu if requested)

**CTA buttons** always follow this pattern:
```css
.cta-button {
    background-color: [accent-color];
    padding: 15px 40px;
    border-radius: 5px;
    text-transform: uppercase;
}
```

**Form integration**: Application form uses Google Forms iframe/action URL (see [index.html](index.html) lines 600+)

**Content emphasis**: Use `.content-bold` class for highlighting key terms in course content

## External Dependencies
- **TailwindCSS**: Loaded via CDN (`<script src="https://cdn.tailwindcss.com">`)
- **KaTeX**: Used in course102.html for mathematical formula rendering
- **Google Fonts**: Montserrat, Poppins, Inter (loaded via Google Fonts API)
- **Stripe**: Payment links for course enrollment

## Common Tasks

**Updating course pricing**: Modify `.price` spans in [index.html](index.html) course cards

**Adding testimonials**: Add to `.testimonial-grid` in [index.html](index.html#testimonials)

**Editing course content**: Modules use semantic `<section>` with `<h3>` for module titles, `<h4>` for subsections

**Style consistency check**: Ensure all new course pages maintain dark theme with appropriate accent color and use standard box components for tips/definitions
