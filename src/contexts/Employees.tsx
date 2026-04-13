import { createContext, useContext, useEffect, useState } from "react";
import { Employee } from "../types";
import {
  getEmployees,
  addEmployee as addEmployeeStorage,
  updateEmployee as updateEmployeeStorage,
  deleteEmployee as deleteEmployeeStorage,
  deleteAttendanceRecordsByEmployeeId,
} from "../utils/storage";

interface IEmployeesContext {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, "id">) => Promise<Employee>;
  updateEmployee: (
    id: string,
    updatedData: Partial<Employee>,
  ) => Promise<Employee | null>;
  deleteEmployee: (id: string) => Promise<void>;
  searchEmployees: (query: string) => Employee[];
}

const EmployeesContext = createContext<IEmployeesContext | null>(null);

export default function EmployeesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async (): Promise<void> => {
      try {
        const data = await getEmployees();
        if (mounted) setEmployees(data || []);
      } catch (e) {
        console.error("Failed to load employees:", e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const addEmployee = async (employee: Omit<Employee, "id">) => {
    const newEmployee = await addEmployeeStorage(employee);
    setEmployees((prev) => [...prev, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = async (id: string, updatedData: Partial<Employee>) => {
    const updated = await updateEmployeeStorage(id, updatedData);
    if (updated) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? updated : emp)),
      );
    }
    return updated;
  };

  const deleteEmployee = async (id: string) => {
    await deleteEmployeeStorage(id);
    await deleteAttendanceRecordsByEmployeeId(id);
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const searchEmployees = (query: string): Employee[] => {
    return employees.filter((emp) =>
      (emp.name || "").toLowerCase().includes(query.toLowerCase()),
    );
  };

  return (
    <EmployeesContext
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        searchEmployees,
      }}
    >
      {children}
    </EmployeesContext>
  );
}

export const useEmployees = () => {
  const context = useContext(EmployeesContext);
  if (!context) {
    throw new Error("useEmployees must be used within EmployeesProvider");
  }
  return context;
};
