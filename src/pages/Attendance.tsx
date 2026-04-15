import { useState, useEffect } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { useAttendance } from "../hooks/useAttendance";
import { Button } from "../components/ui/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AttendanceFormData,
  AttendanceFormSchema,
} from "../utils/forms-schemas";
import {
  AttendanceRecord,
  AttendanceStatuses,
  Employee,
  TAttendanceStatus,
} from "../types";
import { getAttendanceFiltered } from "../utils/storage";
import { Input } from "../components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEmployees } from "../contexts/Employees";

import { motion } from "framer-motion";

export const Attendance = () => {
  const now = new Date();
  const form = useForm<AttendanceFormData>({
    defaultValues: {
      date: now.toISOString().split("T")[0],
      status: "Present",
      overtimeHours: "",
      employees: [],
    },
    resolver: zodResolver(AttendanceFormSchema),
  });
  const navigate = useNavigate();

  const { employees } = useEmployees();
  const { addMultipleRecords } = useAttendance();
  const [todayAttendanceEmployees, setTodayAttendanceEmployees] = useState<
    string[]
  >([]);

  const { t } = useTranslation();

  const status = form.watch("status");
  const watchedEmployees = form.watch("employees");
  const watchedDate = form.watch("date");
  const watchedOvertimeHours = form.watch("overtimeHours");

  const handleEmployeeToggle = (employeeId: string) => {
    const employees = form.getValues("employees");
    const exists = employees.find((emp) => emp.id === employeeId);

    if (exists) {
      form.setValue(
        "employees",
        employees.filter((emp) => emp.id !== employeeId),
      );
    } else {
      form.setValue("employees", [
        ...employees,
        {
          id: employeeId,
          status,
          hoursLate: "",
          overtimeHours: "",
        },
      ]);
    }
  };

  // Set all selected employees' status
  useEffect(() => {
    const currentEmployees = watchedEmployees;
    form.setValue(
      "employees",
      currentEmployees.map((emp) => ({
        ...emp,
        status,
        overtimeHours:
          status === "Absent" || status === "Leave" ? "" : emp.overtimeHours,
      })),
    );
    form.clearErrors("employees");
    if (status === "Absent" || status === "Leave")
      form.setValue("overtimeHours", "");
  }, [status]);

  useEffect(() => {
    getAttendanceFiltered({
      from_date: watchedDate,
      to_date: watchedDate,
      employee_id: null,
      status: null,
    }).then((records) =>
      setTodayAttendanceEmployees(records.map((record) => record.employeeId)),
    );
  }, [watchedDate]);

  useEffect(() => {
    form.setValue(
      "employees",
      watchedEmployees.map((emp) => ({
        ...emp,
        overtimeHours: watchedOvertimeHours,
      })),
    );
  }, [watchedOvertimeHours]);

  const onSubmit = (data: AttendanceFormData) => {
    if (data.employees.length === 0) {
      toast.error(
        t
          ? t("attendance.selectEmployeesWarning")
          : "Please select at least one employee",
      );
      return;
    }

    const records = data.employees.map((emp, index) => {
      const record: AttendanceRecord = {
        employeeId: emp.id,
        date: data.date,
        status: emp.status.toString(),
        hoursLate: emp.hoursLate ? Number(emp.hoursLate) : null,
        overtimeHours: emp.overtimeHours ? Number(emp.overtimeHours) : null,
        id: (Date.now() + Math.random()).toString(), // simple unique ID generation
        jobNumber: null,
        note: null,
      };

      if (emp.status === "Late") {
        if (emp.hoursLate.length === 0)
          form.setError(`employees.${index}.hoursLate`, {
            message: t("attendance.hoursLateRequired"),
          });

        record.hoursLate = parseFloat(emp.hoursLate);
      }

      if (emp.status === "Overtime") {
        if (emp.overtimeHours.length === 0)
          form.setError(`employees.${index}.overtimeHours`, {
            message: t("attendance.overtimeHoursRequired"),
          });

        record.overtimeHours = parseFloat(emp.overtimeHours);
      }
      return record;
    });

    try {
      if (!form.formState.errors.employees) {
        addMultipleRecords(records);
        toast.success(
          t
            ? t("attendance.markedSuccess", { count: data.employees.length })
            : `Attendance marked for ${data.employees.length} employee(s)`,
        );
        form.reset();
        navigate("/");
      } else {
        toast.error(t("general.unkownError"));
      }
    } catch (error) {
      toast.error(
        t ? t("attendance.errorMarking") : "Error marking attendance",
      );
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:py-8 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t ? t("attendance.title") : "Mark Attendance"}
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            {t
              ? t("attendance.description")
              : "Select employees and mark their attendance status"}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t ? t("attendance.date") : "Date"} *
                </label>
                <Controller
                  name="date"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      type="date"
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t ? t("attendance.status") : "Status (Set All)"} *
                </label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <select
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value as TAttendanceStatus;
                        field.onChange(value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    >
                      {AttendanceStatuses.map((status) => (
                        <option key={status} value={status}>
                          {t ? t(`statuses.${status}`) : status}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              {status !== "Absent" &&
                status !== "Leave" &&
                watchedEmployees.length > 0 && (
                  <div>
                    <Controller
                      control={form.control}
                      name="overtimeHours"
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="0.5"
                          {...field}
                          placeholder={
                            t
                              ? t("attendance.enterOvertimeHours")
                              : "Overtime hours"
                          }
                          label={t("attendance.overtimeHours")}
                          error={fieldState.error?.message}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    />
                  </div>
                )}
            </div>

            {/* Employee Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  {t
                    ? t("attendance.selectEmployeesLabel", {
                        count: watchedEmployees.length,
                      })
                    : `Select Employees * (${watchedEmployees.length} selected)`}
                </label>
              </div>
              {/* Select All Checkbox  */}
              <div className="mb-4 flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 justify-start">
                <Input
                  type="checkbox"
                  label={t ? t("attendance.selectAll") : "Select All"}
                  checked={
                    watchedEmployees.length ===
                      employees.filter(
                        (emp) =>
                          !todayAttendanceEmployees.includes(emp.id.toString()),
                      ).length &&
                    employees.filter(
                      (emp) =>
                        !todayAttendanceEmployees.includes(emp.id.toString()),
                    ).length > 0
                  }
                  onChange={(e) => {
                    const eligibleEmployees = employees.filter(
                      (emp) =>
                        !todayAttendanceEmployees.includes(emp.id.toString()),
                    );
                    if (e.target.checked) {
                      form.setValue(
                        "employees",
                        eligibleEmployees.map((emp) => ({
                          id: emp.id,
                          status: status,
                          hoursLate: "",
                          overtimeHours: "",
                        })),
                      );
                    } else {
                      form.setValue("employees", []);
                    }
                  }}
                  id="select-all-employees"
                />
              </div>

              {/* Employee List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {employees.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {t
                      ? t("home.noEmployees")
                      : "No employees found. Please add employees first."}
                  </p>
                ) : (
                  employees.map((employee, index) => {
                    const selected = watchedEmployees.some(
                      (emp) => emp.id === employee.id,
                    );
                    const hasAttendanceToday =
                      todayAttendanceEmployees.includes(employee.id.toString());
                    return (
                      <EmployeesSelectionItem
                        key={index + "-employee-selection"}
                        employee={employee}
                        form={form}
                        handleEmployeeToggle={handleEmployeeToggle}
                        hasAttendanceToday={hasAttendanceToday}
                        selected={selected}
                        index={index}
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full text-base py-3 md:py-2"
            >
              {t ? t("attendance.submit") : "Mark Attendance"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface IEmployeesSelectionItemProps {
  selected: boolean;
  hasAttendanceToday: boolean;
  employee: Employee;
  index: number;
  handleEmployeeToggle: (id: string) => void;
  form: UseFormReturn<AttendanceFormData>;
}

const EmployeesSelectionItem = ({
  hasAttendanceToday,
  selected,
  employee,
  handleEmployeeToggle,
  form,
  index,
}: IEmployeesSelectionItemProps) => {
  const { t } = useTranslation();
  return (
    <motion.div
      whileTap={!hasAttendanceToday ? { scale: 0.95 } : {}}
      onClick={() => {
        if (!hasAttendanceToday) handleEmployeeToggle(employee.id);
      }}
      className={` border rounded-lg p-3 transition-colors  cursor-pointer ${
        selected
          ? "bg-blue-50 border-blue-300"
          : hasAttendanceToday
            ? "bg-gray-50 border-gray-300"
            : "bg-white border-gray-200 hover:border-blue-300"
      }`}
    >
      <div className="flex gap-3 mb-3">
        <Input
          type="checkbox"
          checked={selected || hasAttendanceToday}
          onChange={() => handleEmployeeToggle(employee.id)}
          disabled={hasAttendanceToday}
          className="border-4 border-black"
          id={employee.id}
        />
        <label
          htmlFor={employee.id}
          className={`text-sm md:text-base font-medium select-none ${
            hasAttendanceToday ? "opacity-50 text-gray-600" : "text-gray-900"
          }`}
        >
          {employee.name}
        </label>
        {hasAttendanceToday && (
          <span className="text-xs text-gray-500 ml-auto">
            {t ? t("attendance.alreadyMarked") : "Already marked"}
          </span>
        )}
      </div>

      {selected && (
        <div className="grid grid-cols-1 gap-3 ml-8">
          <Controller
            control={form.control}
            name={`employees.${index}.status`}
            render={({ field }) => (
              <select
                value={field.value}
                onChange={(e) => {
                  const value = e.target.value as TAttendanceStatus;
                  field.onChange(value);
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {AttendanceStatuses.map((status) => (
                  <option key={status} value={status}>
                    {t ? t(`statuses.${status}`) : status}
                  </option>
                ))}
              </select>
            )}
          />

          {form.watch(`employees.${index}.status`) === "Late" && (
            <Controller
              control={form.control}
              name={`employees.${index}.hoursLate`}
              render={({ field, fieldState }) => (
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  {...field}
                  error={fieldState.error?.message}
                  placeholder={t ? t("home.enterHoursLate") : "Hours late"}
                  label={t("attendance.hoursLate")}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            />
          )}

          {form.watch(`employees.${index}.status`) !== "Absent" &&
            form.watch(`employees.${index}.status`) !== "Leave" && (
              <Controller
                control={form.control}
                name={`employees.${index}.overtimeHours`}
                render={({ field, fieldState }) => (
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    label={t("attendance.overtimeHours")}
                    {...field}
                    placeholder={
                      t ? t("attendance.enterOvertimeHours") : "Overtime hours"
                    }
                    error={fieldState.error?.message}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              />
            )}
        </div>
      )}
    </motion.div>
  );
};
