import { ITableColumn } from "../../types";

interface ITableProps<T extends { id?: string }> {
  columns: ITableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  isRTL?: boolean;
}

export const Table = <T extends { id?: string }>({
  columns,
  data,
  onRowClick,
  loading,
  isRTL = false,
}: ITableProps<T>) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-6 py-3 ${
                  isRTL ? "text-right" : "text-left"
                } text-sm font-semibold text-gray-700`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id ?? idx}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => {
                const value = row[col.key];

                return (
                  <td
                    key={String(col.key)}
                    className="px-6 py-4 text-sm text-gray-700"
                  >
                    {col.render
                      ? col.render(value, row, idx)
                      : typeof value === "string" || typeof value === "number"
                        ? value
                        : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
