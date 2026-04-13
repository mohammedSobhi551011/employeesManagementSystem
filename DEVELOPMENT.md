# Development Guidelines

## Code Standards & Best Practices

### Component Guidelines

#### 1. Functional Components Only

✅ **DO:**

```jsx
export const Button = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

❌ **DON'T:**

```jsx
class Button extends React.Component {
  render() {
    return <button>{this.props.children}</button>;
  }
}
```

#### 2. Destructure Props

✅ **DO:**

```jsx
export const Input = ({ label, value, onChange, error }) => {
  return (
    <div>
      <label>{label}</label>
      <input value={value} onChange={onChange} />
      {error && <span>{error}</span>}
    </div>
  );
};
```

❌ **DON'T:**

```jsx
export const Input = (props) => {
  return (
    <div>
      <label>{props.label}</label>
      <input value={props.value} onChange={props.onChange} />
    </div>
  );
};
```

#### 3. Use Custom Hooks for Logic

✅ **DO:**

```jsx
// Custom hook
export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);

  const addEmployee = (emp) => {
    // Logic here
  };

  return { employees, addEmployee };
};

// Component
export const Employees = () => {
  const { employees, addEmployee } = useEmployees();

  return (
    // JSX here
  );
};
```

❌ **DON'T:**

```jsx
export const Employees = () => {
  const [employees, setEmployees] = useState([]);

  // Complex logic mixed with JSX
  // Multiple concerns in one component
};
```

#### 4. Memoize Expensive Calculations

✅ **DO:**

```jsx
const filteredData = useMemo(() => {
  return data.filter((item) => item.name.includes(search));
}, [data, search]);
```

❌ **DON'T:**

```jsx
// Recalculates on every render
const filteredData = data.filter((item) => item.name.includes(search));
```

### File Organization

#### Component Files

```jsx
// src/components/Button.jsx

import React from "react";

// Component definition
export const Button = ({ children, variant = "primary", ...props }) => {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
};
```

**Rules:**

- Export component with `export const`
- One component per file
- Import React at top
- Keep components small and focused

#### Page Files

```jsx
// src/pages/Home.jsx

import { useEmployees } from "../hooks/useEmployees";
import { Table } from "../components/Table";
import { Input } from "../components/Input";

export const Home = () => {
  const { employees } = useEmployees();

  return <div className="container">{/* Page content */}</div>;
};
```

**Rules:**

- Import hooks from `../hooks/`
- Import components from `../components/`
- Organize imports by location
- Keep pages as layout containers

#### Hook Files

```jsx
// src/hooks/useEmployees.js

import { useState, useEffect } from "react";
import { getEmployees, saveEmployees } from "../utils/storage";

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Load initial data
  }, []);

  const addEmployee = (emp) => {
    // Business logic
  };

  return { employees, addEmployee };
};
```

**Rules:**

- Hooks are pure JS, no JSX
- Export with `export const`
- Return object with all needed functions
- Handle side effects with useEffect

#### Utility Files

```jsx
// src/utils/storage.js

export const getEmployees = () => {
  try {
    const data = localStorage.getItem("employees");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const saveEmployees = (employees) => {
  try {
    localStorage.setItem("employees", JSON.stringify(employees));
  } catch (error) {
    console.error("Error:", error);
  }
};
```

**Rules:**

- Pure functions only
- Handle errors gracefully
- Return sensible defaults
- No side effects outside of intended purpose

### Styling Guidelines

#### TailwindCSS Classes

✅ **DO:**

```jsx
<div className="max-w-7xl mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold text-gray-900 mb-4">Title</h1>
  <p className="text-gray-600">Description</p>
</div>
```

❌ **DON'T:**

```jsx
// Avoid custom CSS in components
<div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem" }}>
  <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Title</h1>
</div>
```

#### Responsive Design

✅ **DO:**

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

#### Color Consistency

Use consistent color palette:

- Primary: `bg-blue-600`, `text-blue-600`
- Danger: `bg-red-600`, `text-red-600`
- Success: `bg-green-600`, `text-green-600`
- Warning: `bg-yellow-600`, `text-yellow-600`
- Neutral: `bg-gray-100`, `text-gray-700`

### Form Handling

#### react-hook-form Usage

✅ **DO:**

```jsx
const {
  register,
  handleSubmit,
  watch,
  reset,
  formState: { errors },
} = useForm({
  defaultValues: {
    name: "",
    email: "",
  },
});

const onSubmit = (data) => {
  // Handle submission
  reset(); // Clear form after submit
};

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Input
      {...register("name", {
        required: "Name is required",
        minLength: { value: 2, message: "Min 2 chars" },
      })}
      error={errors.name?.message}
    />
    <button type="submit">Submit</button>
  </form>
);
```

#### Form Validation

```jsx
{...register('email', {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email'
  }
})}
```

### State Management

#### When to Use Each State Type

```
Local UI State (useState)
└─ isModalOpen, expandedRow, etc.
   → Component-level only

Form State (react-hook-form)
└─ Form inputs, errors
   → Form-specific

Persistent Data (Custom Hooks)
└─ Employees, Attendance
   → Shared across components

Computed State (useMemo)
└─ Filtered/sorted data
   → Depends on other state
```

#### useState Examples

```jsx
// UI state
const [isOpen, setIsOpen] = useState(false);
const [activeTab, setActiveTab] = useState("overview");

// Don't store computed data
// Wrong: const [filteredList, setFilteredList] = useState([]);
// Right: const filteredList = useMemo(() => {...}, [list, filter]);
```

### Error Handling

#### Try-Catch Pattern

```jsx
try {
  const result = await fetchData();
  setData(result);
} catch (error) {
  console.error("Error fetching data:", error);
  addToast("Failed to load data", "error");
  // Return sensible default
}
```

#### Optional Chaining

```jsx
// Safe access to nested properties
const name = employee?.name || "Unknown";
const email = user?.profile?.email ?? "N/A";
```

#### Error Boundaries (Optional)

For future enhancement:

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}
```

### Performance Tips

#### 1. Avoid Unnecessary Renders

```jsx
// Memoize components that receive same props frequently
export const MemoButton = React.memo(({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
});
```

#### 2. Optimize Dependencies

```jsx
// Good: Minimal dependencies
useEffect(() => {
  loadData();
}, [loadData]); // Only functions that change

// Bad: Too many dependencies
useEffect(() => {
  loadData();
}, [data, user, settings, filter, sort]); // Excessive
```

#### 3. Use Callbacks Wisely

```jsx
// Memoize callbacks that are passed as dependencies
const handleDelete = useCallback(
  (id) => {
    deleteEmployee(id);
  },
  [deleteEmployee],
);
```

### Naming Conventions

#### Components

```jsx
// PascalCase for components
export const Home = () => {};
export const EmployeeList = () => {};
export const Button = () => {};
```

#### Hooks

```jsx
// camelCase, prefix with 'use'
export const useEmployees = () => {};
export const useAttendance = () => {};
export const useToast = () => {};
```

#### Variables/Functions

```jsx
// camelCase for variables and functions
const employeeCount = 10;
const handleSubmit = () => {};
const filteredData = [];
```

#### Constants

```jsx
// UPPER_SNAKE_CASE for constants
const MAX_EMPLOYEES = 100;
const ATTENDANCE_STATUSES = [
  "Present",
  "Absent",
  "Late",
  "Leave",
  "Morning",
  "Night",
  "Errand",
  "Overtime",
];
const API_URL = "http://api.example.com";
```

### Comments & Documentation

#### Good Comments

```jsx
// Explain WHY, not WHAT
// We filter by date to ensure reports show only current month data
const filteredRecords = records.filter((r) => r.date >= monthStart);

// Explain complex logic
// Sort by date descending, then by status alphabetically
const sorted = data.sort((a, b) => {
  if (a.date !== b.date) return b.date - a.date;
  return a.status.localeCompare(b.status);
});
```

#### Bad Comments

```jsx
// Don't comment obvious code
const name = employee.name; // Get employee name ❌

// Don't write novels
const result = data.filter(...); // This filters the data array to include only... ❌
```

#### JSDoc for Functions

```jsx
/**
 * Filters attendance records by date and status
 * @param {Array} records - Array of attendance records
 * @param {string} date - ISO date format (YYYY-MM-DD)
 * @param {string} status - Attendance status
 * @returns {Array} Filtered records
 */
export const filterAttendance = (records, date, status) => {
  return records.filter((r) => r.date === date && r.status === status);
};
```

### Testing Tips (For Future)

#### Unit Testing Examples

```javascript
// __tests__/storage.test.js
import { addEmployee, getEmployees } from "../utils/storage";

test("addEmployee adds new employee", () => {
  const emp = { name: "John", jobNumber: "EMP001" };
  addEmployee(emp);
  const employees = getEmployees();

  expect(employees).toHaveLength(1);
  expect(employees[0].name).toBe("John");
});
```

### Accessibility Guidelines

#### Semantic HTML

```jsx
// Good
<button onClick={handleDelete}>Delete</button>
<label htmlFor="name">Name:</label>
<input id="name" type="text" />

// Bad
<div onClick={handleDelete}>Delete</div>
<div>Name:</div>
<input type="text" />
```

#### ARIA Labels

```jsx
<button aria-label="Close modal" onClick={onClose}>
  ×
</button>

<form aria-label="Add employee form">
  {/* Form fields */}
</form>
```

### Common Mistakes to Avoid

1. **Don't use index as key**

   ```jsx
   // Bad
   {
     items.map((item, i) => <div key={i}>{item}</div>);
   }

   // Good
   {
     items.map((item) => <div key={item.id}>{item}</div>);
   }
   ```

2. **Don't mutate state directly**

   ```jsx
   // Bad
   employees[0].name = "New Name";

   // Good
   setEmployees((prev) =>
     prev.map((emp, i) => (i === 0 ? { ...emp, name: "New Name" } : emp)),
   );
   ```

3. **Don't forget dependencies in useEffect**

   ```jsx
   // Bad - infinite loop
   useEffect(() => {
     loadData();
   });

   // Good
   useEffect(() => {
     loadData();
   }, []);
   ```

4. **Don't call hooks conditionally**

   ```jsx
   // Bad
   if (condition) {
     const [state, setState] = useState(false);
   }

   // Good
   const [state, setState] = useState(false);
   if (condition) {
     // Use state
   }
   ```

---

## Code Review Checklist

Before committing, check:

- [ ] Component is functional, not class-based
- [ ] Props are destructured
- [ ] Complex logic is in custom hooks
- [ ] TailwindCSS classes used for styling
- [ ] Error handling implemented
- [ ] No console errors
- [ ] Responsive design verified
- [ ] Accessibility checked
- [ ] Code is readable and documented
- [ ] No unused imports or variables
- [ ] File structure follows conventions
- [ ] No mutations of state

---

## Useful Links

- [React Best Practices](https://react.dev/learn)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [react-hook-form Guide](https://react-hook-form.com/)
- [React Router Documentation](https://reactrouter.com/)

---

**Follow these guidelines to keep the codebase clean, maintainable, and scalable!**
