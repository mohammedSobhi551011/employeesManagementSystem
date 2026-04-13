import type {
  Employee,
  AttendanceRecord,
  AttendanceFilter,
  OvertimeRecord,
} from "../types";

// Tauri-aware storage adapter with localStorage fallback
const isTauri =
  typeof window !== "undefined" &&
  !!(window as unknown as { __TAURI__?: unknown }).__TAURI__;

let _tauriInvoke: ((cmd: string, args: unknown) => Promise<unknown>) | null =
  null;

const getInvoke = async (): Promise<
  ((cmd: string, args: unknown) => Promise<unknown>) | null
> => {
  if (!isTauri) return null;
  if (_tauriInvoke) return _tauriInvoke;
  try {
    const modulePath = "@tauri-apps/api/" + "tauri";
    const mod = await import(/* @vite-ignore */ modulePath);
    _tauriInvoke = mod.invoke as (
      cmd: string,
      args: unknown,
    ) => Promise<unknown>;
    return _tauriInvoke;
  } catch (e) {
    console.warn("@tauri-apps/api not available:", e);
    return null;
  }
};

// Employees
export const getEmployees = async (): Promise<Employee[]> => {
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        return (await invoke("get_employees", {})) as Promise<Employee[]>;
      } catch (e) {
        console.error("Tauri get_employees error:", e);
        return [];
      }
    }
  }
  try {
    const employees = localStorage.getItem("employees");
    return employees ? (JSON.parse(employees) as Employee[]) : [];
  } catch (error) {
    console.error("Error getting employees:", error);
    return [];
  }
};

export const saveEmployees = async (employees: Employee[]): Promise<void> => {
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        await invoke("migrate_from_local", {
          employees_json: JSON.stringify(employees),
          attendance_json: "[]",
        });
      } catch (e) {
        console.error("Tauri saveEmployees error:", e);
      }
    }
    return;
  }
  try {
    localStorage.setItem("employees", JSON.stringify(employees));
  } catch (error) {
    console.error("Error saving employees:", error);
  }
};

export const addEmployee = async (
  employee: Omit<Employee, "id">,
): Promise<Employee> => {
  const newEmployee: Employee = { id: Date.now().toString(), ...employee };
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        return (await invoke("add_employee", {
          emp: newEmployee,
        })) as Promise<Employee>;
      } catch (e) {
        console.error("Tauri add_employee error:", e);
        return newEmployee;
      }
    }
  }
  const employees = await getEmployees();
  employees.push(newEmployee);
  await saveEmployees(employees);
  return newEmployee;
};

export const updateEmployee = async (
  id: string,
  updatedData: Partial<Employee>,
): Promise<Employee | null> => {
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        return (await invoke("update_employee", {
          id,
          updated: updatedData,
        })) as Promise<Employee>;
      } catch (e) {
        console.error("Tauri update_employee error:", e);
        return null;
      }
    }
  }
  const employees = await getEmployees();
  const index = employees.findIndex((emp) => emp.id === id);
  if (index > -1) {
    employees[index] = { ...employees[index], ...updatedData };
    await saveEmployees(employees);
    return employees[index];
  }
  return null;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        await invoke("delete_employee", { id });
        return;
      } catch (e) {
        console.error("Tauri delete_employee error:", e);
        return;
      }
    }
  }
  const employees = await getEmployees();
  const filtered = employees.filter((emp) => emp.id !== id);
  await saveEmployees(filtered);
};

export const getEmployeeById = async (
  id: string,
): Promise<Employee | undefined> => {
  const employees = await getEmployees();
  return employees.find((emp) => emp.id === id);
};

// Attendance
export const getAttendance = async (): Promise<AttendanceRecord[]> => {
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        return (await invoke("get_attendance", {})) as Promise<
          AttendanceRecord[]
        >;
      } catch (e) {
        console.error("Tauri get_attendance error:", e);
        return [];
      }
    }
  }
  try {
    const attendance = localStorage.getItem("attendance");
    return attendance ? (JSON.parse(attendance) as AttendanceRecord[]) : [];
  } catch (error) {
    console.error("Error getting attendance:", error);
    return [];
  }
};

export const saveAttendance = async (
  attendance: AttendanceRecord[],
): Promise<void> => {
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        await invoke("migrate_from_local", {
          employees_json: "[]",
          attendance_json: JSON.stringify(attendance),
        });
      } catch (e) {
        console.error("Tauri saveAttendance error:", e);
      }
    }
    return;
  }
  try {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  } catch (error) {
    console.error("Error saving attendance:", error);
  }
};

export const addAttendanceRecord = async (
  record: Omit<AttendanceRecord, "id">,
): Promise<AttendanceRecord> => {
  const newRecord: AttendanceRecord = { id: Date.now().toString(), ...record };
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        return (await invoke("add_attendance", {
          rec: newRecord,
        })) as Promise<AttendanceRecord>;
      } catch (e) {
        console.error("Tauri add_attendance error:", e);
        return newRecord;
      }
    }
  }
  const attendance = await getAttendance();
  attendance.push(newRecord);
  await saveAttendance(attendance);
  return newRecord;
};

export const addMultipleAttendanceRecords = async (
  records: Omit<AttendanceRecord, "id">[],
): Promise<AttendanceRecord[]> => {
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      const added: AttendanceRecord[] = [];
      for (const r of records) {
        const rec: AttendanceRecord = {
          id: Date.now().toString() + Math.random(),
          ...r,
        };
        try {
          const res = (await invoke("add_attendance", {
            rec,
          })) as AttendanceRecord;
          added.push(res);
        } catch (e) {
          console.error("Tauri add_attendance error:", e);
          added.push(rec);
        }
      }
      return added;
    }
  }
  const attendance = await getAttendance();
  const newRecords: AttendanceRecord[] = records.map((record) => ({
    id: Date.now().toString() + Math.random(),
    ...record,
  }));
  attendance.push(...newRecords);
  await saveAttendance(attendance);
  return newRecords;
};

export const updateAttendanceRecord = async (
  id: string,
  updatedData: Partial<AttendanceRecord>,
): Promise<AttendanceRecord | null> => {
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        const updated = { id, ...updatedData };
        return (await invoke("update_attendance", {
          id,
          updated,
        })) as Promise<AttendanceRecord>;
      } catch (e) {
        console.error("Tauri update_attendance error:", e);
        return null;
      }
    }
  }
  const attendance = await getAttendance();
  const index = attendance.findIndex((record) => record.id === id);
  if (index > -1) {
    attendance[index] = { ...attendance[index], ...updatedData };
    await saveAttendance(attendance);
    return attendance[index];
  }
  return null;
};

export const deleteAttendanceRecord = async (id: string): Promise<void> => {
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        await invoke("delete_attendance", { id });
        return;
      } catch (e) {
        console.error("Tauri delete_attendance error:", e);
        return;
      }
    }
  }
  const attendance = await getAttendance();
  const filtered = attendance.filter((record) => record.id !== id);
  await saveAttendance(filtered);
};

export const deleteAttendanceRecordsByEmployeeId = async (
  employeeId: string,
): Promise<void> => {
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        await invoke("delete_attendance_by_employee_id", { id: employeeId });
        return;
      } catch (e) {
        console.error("Tauri delete_attendance error:", e);
        return;
      }
    }
  }
  const attendance = await getAttendance();
  const filtered = attendance.filter(
    (record) => record.employeeId !== employeeId,
  );
  await saveAttendance(filtered);
};

export const getAttendanceByDate = async (
  date: string,
): Promise<AttendanceRecord[]> => {
  const attendance = await getAttendance();
  return attendance.filter((record) => record.date === date);
};

export const getAttendanceByEmployeeId = async (
  employeeId: string,
): Promise<AttendanceRecord[]> => {
  const attendance = await getAttendance();
  return attendance.filter((record) => record.employeeId === employeeId);
};

export const getAttendanceByDateAndEmployee = async (
  date: string,
  employeeId: string,
): Promise<AttendanceRecord | undefined> => {
  const attendance = await getAttendance();
  return attendance.find(
    (record) => record.date === date && record.employeeId === employeeId,
  );
};

export const getAttendanceFiltered = async (
  filters: AttendanceFilter,
): Promise<AttendanceRecord[]> => {
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        return (await invoke("get_attendance_filtered", filters)) as Promise<
          AttendanceRecord[]
        >;
      } catch (e) {
        console.error("Tauri get_attendance_filtered error:", e);
        return [];
      }
    }
  }
  // Fallback for localStorage
  let attendance = await getAttendance();

  if (filters.employee_id) {
    attendance = attendance.filter((r) => r.employeeId === filters.employee_id);
  }
  if (filters.from_date) {
    attendance = attendance.filter(
      (r) => r.date >= (filters.from_date as string),
    );
  }
  if (filters.to_date) {
    attendance = attendance.filter(
      (r) => r.date <= (filters.to_date as string),
    );
  }
  if (filters.status) {
    attendance = attendance.filter((r) => r.status === filters.status);
  }

  return attendance.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

export const getOvertimeByDateRange = async (
  fromDate: string,
  toDate: string,
): Promise<OvertimeRecord[]> => {
  if (isTauri) {
    const invoke = await getInvoke();
    if (invoke) {
      try {
        return (await invoke("get_overtime_by_date_range", {
          from_date: fromDate,
          to_date: toDate,
        })) as Promise<OvertimeRecord[]>;
      } catch (e) {
        console.error("Tauri get_overtime_by_date_range error:", e);
        return [];
      }
    }
  }
  // Fallback for localStorage
  const attendance = await getAttendance();
  const employees = await getEmployees();

  const overtimeMap = new Map<string, OvertimeRecord>();

  // Initialize all employees with 0 overtime
  employees.forEach((emp) => {
    overtimeMap.set(emp.id, [emp.id, emp.name || "", 0]);
  });

  // Sum overtime hours
  attendance.forEach((record) => {
    if (
      record.date >= fromDate &&
      record.date <= toDate &&
      record.overtimeHours
    ) {
      const existing = overtimeMap.get(record.employeeId);
      if (existing) {
        existing[2] += record.overtimeHours;
      }
    }
  });

  return Array.from(overtimeMap.values()).sort((a, b) =>
    a[1].localeCompare(b[1]),
  );
};
