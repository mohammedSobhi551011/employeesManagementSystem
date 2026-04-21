import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface IUseImportExportProps<T> {
  keys: string[];
  onDataImported?: (data: T) => void;
  onDataExported?: () => void;
}
export const useImportExport = <T>({
  keys,
  onDataExported,
  onDataImported,
}: IUseImportExportProps<T>) => {
  const { t } = useTranslation();
  const [imported, setImported] = useState(false);
  const [exported, setExported] = useState(false);
  const [importedData, setImportedData] = useState<T | null>(null);
  const exportData = async () => {
    try {
      const data = Object.fromEntries(
        keys.map((key) => [key, JSON.parse(localStorage.getItem(key) || "[]")]),
      );

      const filePath = await save({
        defaultPath:
          keys.join("_") + `-${new Date().getTime()}-` + "backup.json",
        filters: [{ name: "JSON", extensions: ["json"] }],
      });

      if (!filePath) return;

      await writeTextFile(filePath, JSON.stringify(data, null, 2));
      setExported(true);
      onDataExported && onDataExported();
    } catch (error) {
      setExported(false);
      console.error("Export ERROR:", error);
      alert(t("export.error"));
    }
  };

  const pickFile = async () => {
    const filePath = await open({
      multiple: false,
      filters: [{ name: "JSON", extensions: ["json"] }],
    });

    return filePath;
  };

  const importData = async () => {
    try {
      const filePath = await pickFile();
      if (!filePath) return;

      const content = await readTextFile(filePath as string);

      const data = JSON.parse(content) as T;

      // send to backend
      // await window.__TAURI__.invoke("import_data", { data });
      setImported(true);
      onDataImported && onDataImported(data);
      setImportedData(data);
    } catch (err) {
      setImported(false);
      console.error("IMPORT ERROR:", err);
      alert(t("import.error"));
    }
  };

  return {
    exportData,
    importData,
    imported,
    exported,
    setImported,
    setExported,
    importedData,
  };
};
