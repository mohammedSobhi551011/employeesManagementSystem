import type { AttendanceRecord } from "../types";
import {
  addMultipleAttendanceRecords,
  updateAttendanceRecord as updateAttendanceRecordStorage,
  deleteAttendanceRecord as deleteAttendanceRecordStorage,
  deleteAttendanceRecordsByEmployeeId as deleteAttendanceRecordsStorage,
} from "../utils/storage";

export const useAttendance = () => {
  const addMultipleRecords = async (
    records: Omit<AttendanceRecord, "id">[],
  ) => {
    await addMultipleAttendanceRecords(records);
  };

  const updateAttendanceRecord = async (
    id: string,
    updatedData: Partial<AttendanceRecord>,
  ) => {
    await updateAttendanceRecordStorage(id, updatedData);
  };

  const deleteAttendanceRecord = async (id: string) => {
    await deleteAttendanceRecordStorage(id);
  };

  const deleteAttendanceRecordsByEmployeeId = async (employeeId: string) => {
    await deleteAttendanceRecordsStorage(employeeId);
  };

  return {
    addMultipleRecords,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    deleteAttendanceRecordsByEmployeeId,
  };
};
