# Architecture Documentation

## Employee Attendance Management System - Complete Architecture Guide

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Data Flow](#data-flow)
4. [Component Hierarchy](#component-hierarchy)
5. [State Management](#state-management)
6. [Routing Structure](#routing-structure)
7. [File Organization](#file-organization)
8. [Key Design Patterns](#key-design-patterns)

---

## System Overview

### What is this application?

The Employee Attendance Management System is a **client-side only** React application that allows organizations to:

- Manage employee records (CRUD operations)
- Track attendance records with different statuses
- Search and filter attendance data
- Persist all data locally using browser's LocalStorage

### Technology Stack

```
┌─────────────────────────────────────┐
│        Presentation Layer           │
│   React 18 + React Router v6        │
│   TailwindCSS for Styling           │
└────────────────────┬────────────────┘
                     │
┌────────────────────v────────────────┐
│        State Management             │
│   React Hooks + Custom Hooks        │
│   (useEmployees, useAttendance)     │
└────────────────────┬────────────────┘
                     │
┌────────────────────v────────────────┐
│        Data Persistence             │
│   LocalStorage API                  │
│   (storage.js utilities)            │
└────────────────────┬────────────────┘
                     │
┌────────────────────v────────────────┐
│     Browser LocalStorage             │
│   (Client-side only, no backend)    │
└─────────────────────────────────────┘
```

---

## Architecture Layers

### Layer 1: Presentation Layer (Components)

**Location:** `src/components/` and `src/pages/`

**Responsibility:** UI rendering and user interaction

**Components:**

```
components/
├── Button.jsx          → Reusable button with variants
├── Input.jsx           → Form input field component
├── Table.jsx           → Data table with sorting hints
├── Modal.jsx           → Dialog component for forms/confirmations
├── Toast.jsx           → Toast notifications & useToast hook
└── Navbar.jsx          → Navigation component

pages/
├── Home.jsx            → Attendance search & filter
├── Attendance.jsx      → Bulk attendance marking
└── Employees.jsx       → Employee CRUD operations
```

**Key Principle:** Components are dumb (presentation-only) and receive data via props or custom hooks.

### Layer 2: Logic Layer (Custom Hooks)

**Location:** `src/hooks/`

**Responsibility:** Business logic and state management

**Hooks:**

```
hooks/
├── useEmployees.js     → Employee management logic
│   └─ Manages: Add, Update, Delete, Search employees
│
└── useAttendance.js    → Attendance management logic
    └─ Manages: Add, Update, Delete, Filter attendance records
```

**Pattern:** Hooks encapsulate complex logic and provide a clean API to components.

### Layer 3: Data Layer (Utilities)

**Location:** `src/utils/`

**Responsibility:** Data persistence and retrieval

**Functions:**

```
utils/
└── storage.js          → LocalStorage CRUD operations
    ├─ Employee utilities (get, save, add, update, delete)
    └─ Attendance utilities (get, save, add, update, delete, filter)
```

**Pattern:** Pure functions that interact with LocalStorage, no side effects.

---

## Data Flow

### Unidirectional Data Flow

```
User Action (Click, Type, Submit)
    ↓
Component Event Handler
    ↓
Custom Hook Function Called
    ↓
Storage Utility Function Called
    ↓
LocalStorage Updated
    ↓
Hook State Updated (setEmployees, etc.)
    ↓
Component Re-renders with New State
    ↓
UI Updated
```

### Example: Adding an Employee

```javascript
// 1. User clicks "Add Employee" button
// 2. Modal opens with form

// 3. User fills form and clicks "Add"
<form onSubmit={handleSubmit(onSubmit)}>// Form inputs...</form>;

// 4. Form submission handler
const onSubmit = (data) => {
  // 5. Call hook function
  addEmployee({ name: data.name, jobNumber: data.jobNumber });
  // Hook internally:
  //   - Calls storage.addEmployee()
  //   - Updates LocalStorage
  //   - Updates React state
  //   - Triggers re-render
};

// 6. Toast notification appears
addToast("Employee added successfully", "success");
```

### Example: Filtering Attendance

```javascript
// User types in search input
<Input value={searchName} onChange={(e) => setSearchName(e.target.value)} />;

// Component re-renders with new search value

// useMemo recalculates filtered data
const filteredAttendance = useMemo(() => {
  let filtered = attendance;
  if (searchName) {
    filtered = filtered.filter((record) =>
      employeesMap[record.employeeId]
        .toLowerCase()
        .includes(searchName.toLowerCase()),
    );
  }
  return filtered;
}, [attendance, searchName, employeesMap]);

// Table re-renders with filtered data
<Table columns={columns} data={filteredAttendance} />;
```

---

## Component Hierarchy

### Overall App Structure

```
<App>
  ├─ <Router>
  │  ├─ <Navbar />
  │  └─ <Routes>
  │     ├─ <Route path="/" element={<Home />} />
  │     ├─ <Route path="/attendance" element={<Attendance />} />
  │     └─ <Route path="/employees" element={<Employees />} />
  └─ Toasts (rendered at top level)
```

### Home Page Component Tree

```
<Home>
  ├─ <Input /> (search by name)
  ├─ <Input /> (date filter)
  ├─ <select /> (status filter)
  ├─ <Button /> (clear filters)
  └─ <Table>
     └─ Rows with status badges
```

### Attendance Page Component Tree

```
<Attendance>
  ├─ <form>
  │  ├─ <input type="date" /> (via react-hook-form)
  │  ├─ <select /> (status)
  │  └─ Employee checkboxes
  └─ <Button /> (submit)
```

### Employees Page Component Tree

```
<Employees>
  ├─ <Button /> (add employee)
  ├─ <Table>
  │  └─ Rows with Edit/Delete buttons
  ├─ <Modal isOpen={isModalOpen}>
  │  ├─ <Input /> (name)
  │  ├─ <Input /> (job number)
  │  └─ Action buttons
  └─ <Modal isOpen={deleteConfirmId !== null}>
     └─ Confirmation message
```

---

## State Management

### State Types Used

#### 1. **Component Local State** (useState)

Used for UI interactions that don't need persistence.

```javascript
// Employees.jsx
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingId, setEditingId] = useState(null);
const [deleteConfirmId, setDeleteConfirmId] = useState(null);
```

#### 2. **Form State** (react-hook-form)

Manages form inputs with validation.

```javascript
const {
  register,
  handleSubmit,
  watch,
  reset,
  formState: { errors },
} = useForm({
  defaultValues: {
    name: "",
    jobNumber: "",
  },
});
```

#### 3. **Persistent State** (Custom Hooks)

Manages data that persists in LocalStorage.

```javascript
const { employees, addEmployee, updateEmployee, deleteEmployee } =
  useEmployees();
const { attendance, addMultipleRecords } = useAttendance();
```

#### 4. **Computed State** (useMemo)

Recalculates based on dependencies to optimize performance.

```javascript
const filteredAttendance = useMemo(() => {
  // Filter logic
}, [attendance, searchName, filterDate, filterStatus, employeesMap]);
```

### State Flow Diagram

```
┌─────────────────────────────────────┐
│   Custom Hook State (Persistent)    │
│   - employees[]                     │
│   - attendance[]                    │
└──────────┬──────────────────────────┘
           │
           ├──→ Component Local State ────→ UI Behavior
           │    (isModalOpen, editingId)
           │
           └──→ Computed State (useMemo) ──→ Filtered/Transformed Data
                (filteredAttendance)
```

---

## Routing Structure

### React Router Configuration

```
App.jsx
└─ <BrowserRouter>
   └─ <Routes>
      ├─ <Route path="/" element={<Home />} />
      │  Purpose: View and search attendance
      │  Features: Search, filter by date/status
      │
      ├─ <Route path="/attendance" element={<Attendance />} />
      │  Purpose: Mark attendance
      │  Features: Date picker, employee selection, bulk marking
      │
      └─ <Route path="/employees" element={<Employees />} />
         Purpose: Manage employees
         Features: CRUD operations, validation
```

### Navigation Flow

```
Navbar (sticky, on all pages)
├─ Link to "/"              → Home
├─ Link to "/attendance"    → Mark Attendance
└─ Link to "/employees"     → Employees

User can navigate between pages while maintaining app state
(data doesn't reset when switching pages)
```

---

## File Organization

### Complete Directory Structure

```
attendance/
├── src/
│   ├── components/
│   │   ├── Button.jsx          # Button with variants
│   │   ├── Input.jsx           # Form input field
│   │   ├── Table.jsx           # Data table display
│   │   ├── Modal.jsx           # Modal dialog
│   │   ├── Toast.jsx           # Toast notifications
│   │   └── Navbar.jsx          # Navigation bar
│   │
│   ├── pages/
│   │   ├── Home.jsx            # Attendance search & filter
│   │   ├── Attendance.jsx      # Mark attendance
│   │   └── Employees.jsx       # Employee management
│   │
│   ├── hooks/
│   │   ├── useEmployees.js     # Employee state management
│   │   └── useAttendance.js    # Attendance state management
│   │
│   ├── utils/
│   │   └── storage.js          # LocalStorage operations
│   │
│   ├── App.jsx                 # Main app component with routing
│   ├── App.css                 # App styles (minimal)
│   ├── main.jsx                # Entry point
│   └── index.css               # TailwindCSS directives
│
├── index.html                  # HTML template
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # TailwindCSS configuration
├── postcss.config.js           # PostCSS configuration
├── README.md                   # User documentation
└── ARCHITECTURE.md             # This file
```

### Code Organization Principles

1. **Components** - Presentational, reusable UI pieces
2. **Pages** - Full-page components using multiple smaller components
3. **Hooks** - Business logic and state management
4. **Utils** - Pure utility functions (storage operations)

---

## Key Design Patterns

### 1. **Custom Hooks Pattern**

Encapsulates business logic in reusable hooks.

```javascript
// useEmployees.js
export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);

  const addEmployee = (employee) => {
    // Logic to add employee
  };

  return { employees, addEmployee, updateEmployee, deleteEmployee };
};

// Usage in component
const { employees, addEmployee } = useEmployees();
```

**Benefit:** Logic is separated from UI, easily testable, reusable.

### 2. **Composition Pattern**

Reusable components composed together.

```javascript
// Modal uses Button component
<Modal actions={[
  { label: 'Cancel', onClick: handleClose },
  { label: 'Confirm', variant: 'primary', onClick: handleConfirm }
]} />

// Button is self-contained
<Button variant="primary" size="md">Click</Button>
```

**Benefit:** Consistency, maintainability, easy customization.

### 3. **Controlled Components**

Form inputs controlled by React state.

```javascript
<Input value={searchName} onChange={(e) => setSearchName(e.target.value)} />

// Data flows: state → input → state
```

**Benefit:** Single source of truth, easy to validate and filter.

### 4. **Unidirectional Data Flow**

Data flows from parent to child only.

```
useEmployees (hook)
    ↓
Page Component
    ↓
Child Components
    ↓ (via props)
Table
```

**Benefit:** Predictable, easy to debug, clear data dependencies.

### 5. **Separation of Concerns**

Each file/function has single responsibility.

```
storage.js    → Data persistence
useEmployees  → Business logic
Employees.jsx → UI rendering
```

**Benefit:** Modular, testable, maintainable.

---

## Data Structures

### Employee Object

```javascript
{
  id: "1234567890",              // Timestamp-based unique ID
  name: "John Doe",              // Employee full name
  jobNumber: "EMP001"            // Unique job identifier
}
```

### Attendance Record

```javascript
{
  id: "1234567890",              // Unique record ID
  employeeId: "1234567890",      // References Employee.id
  date: "2025-03-30",            // ISO date format
  status: "Present"              // "Present" | "Absent" | "Late" | "Leave"
}
```

### LocalStorage Schema

```javascript
// "employees" key stores
[
  { id, name, jobNumber },
  { id, name, jobNumber },
  ...
]

// "attendance" key stores
[
  { id, employeeId, date, status },
  { id, employeeId, date, status },
  ...
]
```

---

## Key Features Implementation

### Search & Filter Logic

```javascript
// Home.jsx
const filteredAttendance = useMemo(() => {
  let filtered = attendance;

  // Filter by search name
  if (searchName) {
    filtered = filtered.filter((record) =>
      employeesMap[record.employeeId]
        .toLowerCase()
        .includes(searchName.toLowerCase()),
    );
  }

  // Filter by date
  if (filterDate) {
    filtered = filtered.filter((record) => record.date === filterDate);
  }

  // Filter by status
  if (filterStatus) {
    filtered = filtered.filter((record) => record.status === filterStatus);
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
}, [attendance, searchName, filterDate, filterStatus, employeesMap]);
```

### Bulk Attendance Marking

```javascript
// Attendance.jsx
const onSubmit = (data) => {
  // Map selected employees to attendance records
  const records = Array.from(selectedEmployees).map((employeeId) => ({
    employeeId,
    date: watchDate,
    status: watchStatus,
  }));

  // Save all records at once
  addMultipleRecords(records);

  // Reset form
  setSelectedEmployees(new Set());
  reset();
};
```

### Employee CRUD Operations

```javascript
// Employees.jsx
const handleEdit = (employee) => {
  // Populate form with existing data
  reset({
    name: employee.name,
    jobNumber: employee.jobNumber,
  });
  setEditingId(employee.id);
};

const onSubmit = (data) => {
  if (editingId) {
    updateEmployee(editingId, data); // Update
  } else {
    addEmployee(data); // Create
  }
};

const handleDelete = (id) => {
  deleteEmployee(id); // Delete
};
```

---

## Performance Optimizations

1. **useMemo for Filtering**
   - Prevents unnecessary recalculations
   - Only recalculates when dependencies change

2. **Component Composition**
   - Reusable components avoid code duplication
   - Smaller components are easier to optimize

3. **Form Optimization with react-hook-form**
   - Only re-renders changed fields
   - Reduces unnecessary renders

4. **LocalStorage Efficiency**
   - Single JSON parse/stringify per operation
   - Minimal data structure overhead

---

## Error Handling

### Data Validation

```javascript
// Input validation
<Input
  {...register("name", {
    required: "Name is required",
    minLength: { value: 2, message: "Minimum 2 characters" },
  })}
  error={errors.name?.message}
/>
```

### Try-Catch Blocks

```javascript
export const getEmployees = () => {
  try {
    const employees = localStorage.getItem("employees");
    return employees ? JSON.parse(employees) : [];
  } catch (error) {
    console.error("Error getting employees:", error);
    return []; // Fallback to empty array
  }
};
```

### User Feedback

```javascript
try {
  addEmployee(data);
  addToast("Employee added successfully", "success");
} catch (error) {
  addToast("Error saving employee", "error");
}
```

---

## Conclusion

This architecture provides:

- ✅ Clear separation of concerns
- ✅ Reusable components
- ✅ Scalable state management
- ✅ Easy maintenance and testing
- ✅ Optimal performance
- ✅ Good user experience

The modular design allows easy extension and modification without breaking existing functionality.
