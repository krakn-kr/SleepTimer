# Screen Time Tracker Dashboard - Design Guidelines

## Design Approach

**Selected System:** Material Design 3 with data visualization focus  
**Justification:** Material Design provides excellent patterns for data-dense dashboards, familiar to Android users, with strong card-based layouts and clear visual hierarchy for metrics and analytics.

**Key Principles:**
- Data clarity above all else - charts and metrics must be immediately readable
- Card-based organization for distinct data modules
- Responsive grid system that works seamlessly on mobile and desktop
- Elevation and shadows to create depth and hierarchy

---

## Core Design Elements

### Typography

**Font Family:** Inter (primary), Roboto (fallback)

**Hierarchy:**
- Dashboard Title: text-3xl font-bold (36px)
- Section Headers: text-xl font-semibold (24px)
- Metric Values: text-4xl font-bold (48px) for primary stats
- Metric Labels: text-sm font-medium uppercase tracking-wide (14px)
- Chart Labels: text-xs font-medium (12px)
- Body Text: text-base (16px)

### Layout System

**Spacing Primitives:** Tailwind units of 4, 6, and 8  
Common patterns: p-6, gap-4, mb-8, mt-4

**Grid Structure:**
- Desktop: 12-column grid with max-w-7xl container
- Tablet: 8-column grid, cards stack to 2 columns
- Mobile: Single column, full-width cards with p-4

**Card Spacing:**
- Internal padding: p-6
- Card gaps: gap-6 on desktop, gap-4 on mobile
- Section spacing: mb-8 between major sections

---

## Component Library

### Dashboard Layout Structure

**Header Section:**
- App title with icon on left
- Date range selector (dropdown or date picker) on right
- Total screen time today as prominent metric below header
- Sticky positioning on scroll

**Stats Overview Cards (Top Row):**
- Grid of 3-4 metric cards displaying: Total Lock Time Today, Average Lock Duration, Total Unlocks Today, Longest Lock Session
- Each card: Large number (metric value) + small label below
- Light background with subtle shadow

### Data Visualization Components

**Bar Chart - Top 10 Longest Lock Durations:**
- Horizontal bar chart showing duration (x-axis) vs session rank (y-axis)
- Bars in descending order (longest at top)
- Each bar shows duration label at end
- Color gradient from darkest (longest) to lighter (shortest) within same hue
- Responsive: Chart adjusts height based on screen size

**Daily Timeline View:**
- Optional supplementary visualization showing lock/unlock events throughout the day
- Timeline with alternating lock/unlock periods
- Color-coded segments

**Chart Card Structure:**
- Card header: Chart title (text-xl font-semibold) + optional filter dropdown
- Chart container: Adequate padding (p-6) around visualization
- Legend/key below chart if needed

### UI Elements

**Buttons:**
- Primary: Rounded corners (rounded-lg), medium padding (px-6 py-3)
- Filter buttons: Pill shape (rounded-full), smaller (px-4 py-2)
- Icon buttons: Circular (rounded-full), p-2

**Dropdowns/Selectors:**
- Date range picker with calendar icon
- Period selectors (Day/Week/Month tabs or dropdown)
- Minimal borders, clear focus states

**Empty States:**
- Centered content with icon, message, and subtle CTA
- "No data yet" placeholder when dashboard first loads

### Cards & Containers

**Standard Card:**
- Background: elevated surface
- Border radius: rounded-xl
- Shadow: subtle drop shadow (shadow-sm to shadow-md)
- Hover: subtle lift effect (optional enhance on desktop)

**Metric Cards:**
- Centered content alignment
- Icon at top (optional)
- Large metric value (text-4xl font-bold)
- Small label below (text-sm text-gray-600)

---

## Data Visualization Specifications

### Bar Chart Design:
- Bar height: 32px per bar
- Bar spacing: 8px gap between bars
- Bar corners: Rounded on right side (rounded-r)
- Gridlines: Light vertical lines for duration markers
- Labels: Duration on right side of each bar, session identifier on left

### Color Strategy for Charts:
- Primary data: Single hue with varying saturation (e.g., blue-600 to blue-300)
- Emphasized data: Accent color for current day or record values
- Background grid: Very light gray (gray-100)

---

## Page Structure

**Dashboard Layout (Single Page Application):**

1. **Header Bar** (h-16 to h-20)
   - Title, date selector, quick stats

2. **Stats Grid** (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
   - 4 metric cards showing key statistics

3. **Main Chart Section**
   - Full-width card containing "Top 10 Longest Lock Sessions" bar chart
   - Chart takes up most vertical space with generous padding

4. **Secondary Insights** (grid-cols-1 lg:grid-cols-2)
   - Additional smaller charts or data tables showing patterns
   - "Top 10 Shortest Sessions" companion chart

5. **Footer**
   - Minimal: Data update timestamp, settings link

**Viewport Strategy:**
- No forced 100vh sections
- Natural content flow with consistent py-8 section spacing
- Charts scale responsively but maintain readability

---

## Mock Data Guidance

**Sample Dataset Structure:**
- 20-30 lock/unlock sessions with timestamps
- Duration range: 30 seconds to 8 hours
- Realistic patterns: Longer locks at night, shorter during day
- Include edge cases: Very short locks (<1 min), very long locks (>4 hours)

**Chart Population:**
- Top 10 chart shows sessions ranging from ~6 hours down to ~2 hours
- Ensure varied durations for visual interest in bars

---

## Accessibility & Quality

- High contrast ratios for all text (WCAG AA minimum)
- Chart colors distinguishable for color-blind users
- All interactive elements have min 44px touch targets
- ARIA labels for charts and data visualizations
- Keyboard navigation for all filters and controls

---

## Final Notes

This is a data-focused prototype dashboard requiring clean, professional presentation. Prioritize readability of metrics and charts over decorative elements. The dashboard should feel like a modern analytics tool - functional, clear, and trustworthy.