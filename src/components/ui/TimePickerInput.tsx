import { useState, useEffect, SelectHTMLAttributes } from "react";

type TimeFormat = "AM" | "PM";

interface TimePickerProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> {
  value?: string; // "HH:mm" 24h format
  onChange?: (time: string) => void;
  format12h?: boolean; // use 12h format if true
  label?: string;
  error?: string;
  labelClassName?: string;
}

export const TimePickerInput = ({
  label,
  value,
  onChange,
  format12h = false,
  error,
  className = "",
  labelClassName,
  ...props
}: TimePickerProps) => {
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [period, setPeriod] = useState<TimeFormat>("AM");

  // Initialize from value
  useEffect(() => {
    if (!value) return;
    const [hStr, mStr] = value.split(":");
    let h = parseInt(hStr, 10);
    if (format12h) {
      setPeriod(h >= 12 ? "PM" : "AM");
      if (h === 0) h = 12;
      else if (h > 12) h -= 12;
    }
    setHour(String(h).padStart(2, "0"));
    setMinute(mStr.padStart(2, "0"));
  }, [value, format12h]);

  // Update parent when any change
  useEffect(() => {
    if (!hour || !minute) return;

    let h = parseInt(hour, 10);
    const m = parseInt(minute, 10);

    if (format12h) {
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
    }

    const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    onChange?.(time);
  }, [hour, minute, period, onChange, format12h]);

  const hours = format12h
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          className={`text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {/* Hours */}
        <select
          className={` px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          {...props}
        >
          <option value="">HH</option>
          {hours.map((h) => (
            <option key={h} value={String(h).padStart(2, "0")}>
              {String(h).padStart(2, "0")}
            </option>
          ))}
        </select>

        {/* Minutes */}
        <select
          className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
        >
          <option value="">MM</option>
          {minutes.map((m) => (
            <option key={m} value={String(m).padStart(2, "0")}>
              {String(m).padStart(2, "0")}
            </option>
          ))}
        </select>

        {/* AM/PM */}
        {format12h && (
          <select
            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            value={period}
            onChange={(e) => setPeriod(e.target.value as TimeFormat)}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
