# 🚀 Quick Start Guide

## Get Started in 5 Minutes

### Prerequisites

- Node.js 16+ installed
- npm or yarn

### Installation

```bash
# 1. Navigate to project directory
cd /path/to/attendance

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Visit: http://localhost:5173
```

**That's it! The app is now running.**

---

## First Steps

### 1. Add Some Employees

1. Click **"Employees"** in the navigation
2. Click **"+ Add Employee"** button
3. Fill in:
   - **Employee Name**: John Doe
   - **Job Number**: EMP001
4. Click **"Add"**
5. Repeat for 2-3 more employees

### 2. Mark Attendance

1. Click **"Mark Attendance"** in the navigation
2. **Select Date**: Pick today's date
3. **Select Status**: Choose "Present"
4. **Check Employees**: Select John Doe and others
5. Click **"Mark Attendance"**
6. See success notification ✅

### 3. View Attendance Records

1. Click **"Home"** in the navigation
2. See all attendance records in a table
3. Try the filters:
   - Search by employee name
   - Filter by date
   - Filter by status
4. Click "Clear Filters" to reset

---

## Available Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Key Features

### 📋 Home Page

- Search attendance by employee name
- Filter by date
- Filter by status (Present, Absent, Late, Leave)
- Sort results automatically

### ✅ Mark Attendance

- Select date for attendance
- Multi-select employees
- Set attendance status for all at once
- Bulk save with one click

### 👥 Employees

- Add new employees
- Edit employee details
- Delete employees with confirmation
- Validated form inputs

---

## Tips & Tricks

💡 **Bulk Operations:**
Mark all employees present at once:

1. Select date
2. Click "Select all" (if available) or manually check all
3. Set status to "Present"
4. Submit

💡 **Search Tips:**

- Case-insensitive search
- Partial name matching works
- Search as you type

💡 **Filtering:**

- Combine multiple filters
- Results update in real-time
- Click "Clear Filters" to see all records

💡 **Data Persistence:**

- All data saved locally in browser
- Works offline
- Data persists across sessions
- Clear browser cache to reset

---

## Troubleshooting

### Port 5173 already in use?

```bash
npm run dev -- --port 3000
```

### Data disappeared?

- Check if localStorage is enabled in browser
- Clear browser cache and refresh
- Check browser console for errors

### Styles look weird?

- Hard refresh the page (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on Mac)
- Restart dev server: `npm run dev`

### Form not working?

- Check browser console for errors
- Make sure all required fields are filled
- Try refreshing the page

---

## Project Structure

```
src/
├── pages/               # Full pages
│   ├── Home.jsx
│   ├── Attendance.jsx
│   └── Employees.jsx
├── components/         # Reusable components
├── hooks/              # Custom React hooks
├── utils/              # Helper functions
└── App.jsx             # Main routing
```

---

## File Locations

📄 **Configuration Files:**

- `vite.config.js` - Vite settings
- `tailwind.config.js` - TailwindCSS settings
- `postcss.config.js` - PostCSS settings
- `package.json` - Dependencies

📄 **Main Files:**

- `src/App.jsx` - Main app with routing
- `src/main.jsx` - Entry point
- `src/index.css` - Global styles

---

## Next Steps

### To Understand the Code

1. Read [README.md](./README.md) for full documentation
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for design patterns
3. Explore `src/hooks/` to understand state management
4. Explore `src/components/` to see reusable components

### To Extend the App

1. Add new pages by creating files in `src/pages/`
2. Add new components in `src/components/`
3. Add utilities in `src/utils/`
4. Update routing in `src/App.jsx`

### To Deploy

```bash
# Build for production
npm run build

# The dist/ folder contains production files
# Upload dist/ contents to your web server
```

---

## Common Tasks

### Add a new page

1. Create `src/pages/NewPage.jsx`
2. Import in `src/App.jsx`
3. Add route: `<Route path="/newpage" element={<NewPage />} />`
4. Add link in `Navbar.jsx`

### Create a new component

1. Create `src/components/NewComponent.jsx`
2. Export component: `export const NewComponent = () => { ... }`
3. Import where needed: `import { NewComponent } from '../components/NewComponent'`

### Add a new field to employees

1. Update `Employees.jsx` form
2. Update `useEmployees` hook if needed
3. Update `storage.js` functions if needed

---

## Need Help?

### Check Documentation

- [Full README](./README.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)

### Debug Tips

- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab to see data flow
- Use React DevTools extension for component inspection

---

## Version Info

- React: 18.x
- Vite: 8.x
- React Router: 6.x
- TailwindCSS: 3.x
- react-hook-form: latest

---

**Happy coding! 🎉**

Questions? Check the full documentation files in the project root.
