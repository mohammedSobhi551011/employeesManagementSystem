# Employee Attendance Management System

A complete React application for managing employee attendance records with a clean, modern UI built with TailwindCSS.

## Features

✨ **Core Features:**

- 📋 **Home Page** - View and search attendance records with filters
- ✅ **Mark Attendance** - Bulk mark attendance for multiple employees
- 👥 **Employee Management** - Full CRUD operations for employees
- 💾 **LocalStorage Persistence** - All data is saved locally in the browser
- 🎨 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔔 **Toast Notifications** - User feedback for all actions
- ⚠️ **Confirmation Dialogs** - Safety confirmation before deletions

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM v6** - Client-side routing
- **TailwindCSS v3** - Utility-first CSS framework
- **React Hook Form** - Efficient form handling
- **LocalStorage API** - Client-side data persistence

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.jsx       # Customizable button component
│   ├── Input.jsx        # Form input component
│   ├── Table.jsx        # Data table component
│   ├── Modal.jsx        # Modal dialog component
│   ├── Toast.jsx        # Toast notification component
│   └── Navbar.jsx       # Navigation bar component
│
├── pages/               # Page components
│   ├── Home.jsx        # Search & filter attendance records
│   ├── Attendance.jsx  # Mark attendance for employees
│   └── Employees.jsx   # Employee CRUD operations
│
├── hooks/              # Custom React hooks
│   ├── useEmployees.js # Hook for employee management
│   └── useAttendance.js # Hook for attendance management
│
├── utils/              # Utility functions
│   └── storage.js      # LocalStorage operations
│
├── App.jsx             # Main app with routing
├── main.jsx            # Entry point
└── index.css           # TailwindCSS styles
```

## Page Details

### 1. **Home Page** (/)

- Search attendance records by employee name
- Filter by date and attendance status (Present, Absent, Late, Leave)
- Display results in a clean table format
- Shows employee name, date, and status
- Status badges with color coding for quick visual reference

### 2. **Attendance Page** (/attendance)

- Select date for marking attendance
- Multi-select employee list with checkboxes
- Choose attendance status for selected employees
- Bulk save attendance records
- Form validation and error handling
- Toast notifications for success/error feedback

### 3. **Employees Page** (/employees)

- Display all employees in a table
- Add new employees with name and job number
- Edit existing employee information
- Delete employees with confirmation dialog
- Form validation for required fields
- Toast notifications for all actions

## Data Structure

### Employee

```javascript
{
  id: "1234567890",
  name: "John Doe",
  jobNumber: "EMP001"
}
```

### Attendance Record

```javascript
{
  id: "1234567890",
  employeeId: "1234567890",
  date: "2025-03-30",
  status: "Present" // "Present" | "Absent" | "Late" | "Leave"
}
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Steps

1. **Clone or navigate to the project:**

   ```bash
   cd /path/to/attendance
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

4. **Build for production:**

   ```bash
   npm run build
   ```

   Output will be in the `dist/` folder

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code (if configured)
npm run lint
```

## Component Documentation

### Button

```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

**Props:**

- `variant`: "primary" | "secondary" | "danger" | "success" | "ghost"
- `size`: "sm" | "md" | "lg"
- `disabled`: boolean
- `className`: string (additional Tailwind classes)

### Input

```jsx
<Input
  label="Name"
  type="text"
  placeholder="Enter name"
  error={errorMessage}
  {...register("name")}
/>
```

**Props:**

- `label`: string
- `type`: HTML input type
- `placeholder`: string
- `error`: string (error message)
- Supports all standard HTML input props

### Table

```jsx
<Table
  columns={[
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
  ]}
  data={records}
  loading={false}
  onRowClick={handleRowClick}
/>
```

**Props:**

- `columns`: Array of column definitions
- `data`: Array of row data
- `loading`: boolean
- `onRowClick`: callback function

### Modal

```jsx
<Modal
  isOpen={true}
  title="Confirm Action"
  onClose={handleClose}
  actions={[
    { label: "Cancel", onClick: handleClose },
    { label: "Confirm", variant: "primary", onClick: handleConfirm },
  ]}
>
  Modal content here
</Modal>
```

### Toast

```jsx
const { toasts, addToast, removeToast } = useToast();

addToast("Success message", "success"); // 'success' | 'error' | 'info' | 'warning'

{
  toasts.map((toast) => (
    <Toast
      key={toast.id}
      message={toast.message}
      type={toast.type}
      onClose={() => removeToast(toast.id)}
    />
  ));
}
```

## Custom Hooks

### useEmployees()

```javascript
const {
  employees, // Array of employees
  loading, // Boolean
  addEmployee, // Function
  updateEmployee, // Function
  deleteEmployee, // Function
  searchEmployees, // Function
} = useEmployees();
```

### useAttendance()

```javascript
const {
  attendance, // Array of records
  loading, // Boolean
  addAttendanceRecord, // Function
  addMultipleRecords, // Function
  updateAttendanceRecord, // Function
  deleteAttendanceRecord, // Function
  getByDate, // Function
  getByEmployeeId, // Function
  filterAttendance, // Function
} = useAttendance();
```

## LocalStorage Utilities

All utilities are in `src/utils/storage.js`:

**Employees:**

- `getEmployees()` - Retrieve all employees
- `saveEmployees(employees)` - Save employees
- `addEmployee(employee)` - Add single employee
- `updateEmployee(id, data)` - Update employee
- `deleteEmployee(id)` - Delete employee
- `getEmployeeById(id)` - Get single employee

**Attendance:**

- `getAttendance()` - Retrieve all records
- `saveAttendance(attendance)` - Save records
- `addAttendanceRecord(record)` - Add single record
- `addMultipleAttendanceRecords(records)` - Add multiple records
- `updateAttendanceRecord(id, data)` - Update record
- `deleteAttendanceRecord(id)` - Delete record
- `getAttendanceByDate(date)` - Filter by date
- `getAttendanceByEmployeeId(id)` - Filter by employee
- `getAttendanceByDateAndEmployee(date, id)` - Get specific record

## Styling

This project uses **TailwindCSS v3** for all styling. Key features:

- **Responsive Design** - Mobile-first approach with `md:` breakpoints
- **Color System** - Professional blue color scheme with status badges
- **Spacing & Sizing** - Consistent padding and margins throughout
- **Hover States** - Interactive feedback on buttons and links
- **Focus States** - Accessibility with focus rings

### Customizing Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: "#your-color";
    }
  }
}
```

## Best Practices Implemented

✅ **Code Quality:**

- Functional components only
- Custom hooks for state management
- Proper error handling
- Form validation with react-hook-form
- Modular and reusable components
- Clean separation of concerns

✅ **Performance:**

- useMemo for filtered data
- Lazy component imports (optional)
- Efficient re-renders
- Optimized bundle size

✅ **User Experience:**

- Toast notifications for feedback
- Confirmation dialogs for destructive actions
- Loading states
- Error messages
- Responsive design
- Smooth transitions

## Common Tasks

### Add a new Employee

1. Navigate to the Employees page
2. Click "+ Add Employee"
3. Fill in name and job number
4. Click "Add"

### Mark Attendance

1. Go to Mark Attendance page
2. Select date
3. Check employees in the list
4. Select status
5. Click "Mark Attendance"

### Filter Attendance Records

1. On Home page, use the search and filter inputs
2. Search by employee name
3. Filter by date
4. Filter by status
5. Click "Clear Filters" to reset

### Edit Employee

1. Go to Employees page
2. Click "Edit" on employee row
3. Update information
4. Click "Update"

### Delete Employee

1. Go to Employees page
2. Click "Delete" on employee row
3. Confirm deletion
4. Employee and associated records are deleted

## Troubleshooting

### Data not persisting?

- Check browser's localStorage is enabled
- Clear browser cache and refresh
- Check browser console for errors

### Styles not loading?

- Ensure TailwindCSS is installed: `npm install tailwindcss`
- Check `tailwind.config.js` is in project root
- Restart dev server after changes

### Port already in use?

```bash
# Use a different port
npm run dev -- --port 3000
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Future Enhancements

- 📊 Dashboard with attendance statistics
- 📅 Calendar view for attendance
- 📊 Reports and analytics
- 🔐 User authentication
- 📱 Mobile app
- 🔄 Sync with backend API
- 📧 Email notifications
- 📤 Export to Excel/PDF

## License

MIT

## Support

For issues or questions, check the code comments or the component documentation above.

---

**Built with ❤️ using React, Vite, and TailwindCSS**
