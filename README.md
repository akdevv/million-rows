# Million Rows - React Virtualization Demo

A high-performance React application demonstrating how to efficiently render and interact with millions of rows of data using React virtualization techniques.

## 🚀 Project Overview

This project showcases the power of React virtualization by rendering a million rows of planetary scan data, prime numbers, and mock cyber threat data without performance degradation. It uses `react-window` to implement windowing/virtualization, ensuring smooth scrolling and minimal memory usage even with massive datasets.

## 📚 Learning Section: React Virtualization

### What is React Virtualization?

React virtualization (also known as "windowing") is a technique for efficiently rendering large lists by only rendering the items that are currently visible in the viewport, plus a small buffer. Instead of rendering all million rows at once (which would crash the browser), virtualization creates a "window" that shows only what's needed.

### How It Works

```
┌─────────────────────────────────────┐
│         Total Dataset               │
│      (1,000,000 rows)               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │   Viewport (Visible Area)   │    │  ← Only these ~11 rows
│  │   • Row 10,001              │    │    are visible (550px / 50px)
│  │   • Row 10,002              │    │    + 10 buffer rows (5 above, 5 below)
│  │   • Row 10,003              │    │    = ~21 DOM nodes total
│  │   • Row 10,004              │    │
│  │   • Row 10,005              │    │
│  └─────────────────────────────┘    │
│                                     │
│  [Data loaded in 1000-row chunks    │
│   as user scrolls]                  │
│                                     │
└─────────────────────────────────────┘
```

### The Magic Behind Million Rows

#### Traditional Approach (❌ Problems)

```javascript
// Without virtualization - DON'T DO THIS!
const TraditionalList = ({ data }) => {
	return (
		<div>
			{data.map((item) => (
				<div key={item.id}>{item.content}</div>
			))}
		</div>
	);
};
// Result: 1M DOM nodes = Browser crash/freeze
```

#### Virtualized Approach (✅ Solution)

```javascript
// With react-window virtualization (our implementation)
import { FixedSizeList } from "react-window";

const VirtualizedList = ({ data }) => {
	const Row = ({ index, style }) => (
		<div style={style}>{data[index].content}</div>
	);

	return (
		<FixedSizeList
			height={550} // Viewport height
			itemCount={data.length} // Currently loaded items
			itemSize={50} // Row height
			width="100%"
			overscanCount={5} // Buffer rows
		>
			{Row}
		</FixedSizeList>
	);
};
// Result: ~21 DOM nodes = Smooth performance
```

### Performance Comparison

```
┌───────────────────────────────────────────────────┐
│                 Performance Metrics               │
├────────────────┬───────────────┬──────────────────┤
│     Metric     │  Traditional  │   Virtualized    │
├────────────────┼───────────────┼──────────────────┤
│ DOM Nodes      │   1,000,000   │      ~21         │
│ Memory Usage   │    ~4-6 GB    │    ~50-100 MB    │
│ Initial Load   │   30-60 sec   │    ~100 ms       │
│ Chunk Size     │   All at once │    1000 rows     │
│ Scroll FPS     │     1-5       │      60          │
│ Interaction    │   Unusable    │    Instant       │
└────────────────┴───────────────┴──────────────────┘
```

### Key Concepts in This Implementation

#### 1. **Windowing**

Only renders visible items plus a small overscan (buffer) for smooth scrolling:

```javascript
// In our implementation
const ROW_HEIGHT = 50; // Fixed row height in pixels
const VIEWPORT_HEIGHT = 550; // Visible area height
const OVERSCAN_COUNT = 5; // Buffer rows above and below viewport
```

#### 2. **Virtual Scrolling**

Creates the illusion of scrolling through all data:

-   **Virtual Height**: Container has the full height (1M rows × row height)
-   **Transform**: Visible items are positioned using CSS transforms
-   **Scroll Events**: Calculate which items should be visible based on scroll position

#### 3. **Lazy Loading**

Data is fetched in chunks as needed:

```javascript
// Our chunking strategy
const CHUNK_SIZE = 1000; // Fetch 1000 rows at a time

// Load more when scrolled past 80% of loaded content
const scrollPercentage = scrollOffset / (itemCount * ROW_HEIGHT - VIEWPORT_HEIGHT);
if (scrollPercentage > 0.8 && hasMore && !isLoadingMore) {
	loadNextChunk();
}
```

### Memory Management Visualization

```
Without Virtualization:
┌──────────────────────────────────────┐
│ Memory: ████████████████████████████ │ 4GB+
│ Every row = DOM node + JS object     │
└──────────────────────────────────────┘

With Virtualization:
┌──────────────────────────────────────┐
│ Memory: ██░░░░░░░░░░░░░░░░░░░░░░░░░  │ 100MB
│ Only visible rows in DOM             │
└──────────────────────────────────────┘
```

### Advanced Techniques Used

1. **Request Management**: Singleton pattern prevents duplicate API calls
2. **Memoization**: Row components are memoized to prevent unnecessary re-renders
3. **Scroll-based Loading**: Loads next chunk when scrolled past 80% of content
4. **Response Caching**: 5-minute TTL cache for previously fetched data
5. **Loading States**: Visual feedback during chunk loading with spinners

## 🛠️ Tech Stack

-   **Next.js 15** - React framework with App Router
-   **React Window** - Virtualization library for efficient rendering
-   **TypeScript** - Type safety and better developer experience
-   **Prisma** - Database ORM with PostgreSQL
-   **Tailwind CSS** - Utility-first styling
-   **Supabase** - Database hosting and management

## 📦 Installation & Setup

### Prerequisites

-   Node.js 18+
-   npm/yarn/pnpm
-   PostgreSQL (or SQLite for development)

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/akdevv/million-rows.git
cd million-rows
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
# Edit .env.local with your database connection
```

4. **Set up the database**

```bash
bunx prisma migrate dev
bunx prisma generate
```

5. **Generate sample data**

```bash
bun scripts/generate-prime-numbers.js
bun scripts/generate-cyber-threats.js
bun scripts/generate-planetary-scans.js

# Then upload the data to Supabase
```

6. **Run the development server**

```bash
bun run dev
```

7. **Open in browser**

```
http://localhost:3000
```

## 🎮 Usage

1. Select a dataset from the dropdown
2. Watch as the table loads and renders efficiently
3. Scroll smoothly through millions of rows
4. Notice the performance metrics in the browser DevTools

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Further Reading

-   [React Window Documentation](https://react-window.vercel.app/)
-   [Virtualization Techniques](https://web.dev/virtualize-long-lists-react-window/)
-   [Performance Optimization in React](https://react.dev/learn/render-and-commit)
