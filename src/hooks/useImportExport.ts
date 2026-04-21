import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface IUseImportExportProps<T> {
  keys: string[];
  onDataImported?: (data: T) => Promise<void>;
  onDataExported?: () => Promise<void>;
}
export const useImportExport = <T>({
  keys,
  onDataExported,
  onDataImported,
}: IUseImportExportProps<T>) => {
  const { t } = useTranslation();
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportData = async (data: T) => {
    try {
      setExporting(true);
      const filePath = await save({
        defaultPath:
          keys.join("_") + `-${new Date().getTime()}-` + "backup.json",
        filters: [{ name: "JSON", extensions: ["json"] }],
      });

      if (!filePath) return;

      await writeTextFile(filePath, JSON.stringify(data, null, 2));
      onDataExported && (await onDataExported());
      setExporting(false);
    } catch (error) {
      console.error("Export ERROR:", error);
      alert(t("export.error"));
      setExporting(false);
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
      setImporting(true);
      const filePath = await pickFile();
      if (!filePath) return;

      const content = await readTextFile(filePath as string);

      const data = JSON.parse(content) as T;

      // send to backend
      // await window.__TAURI__.invoke("import_data", { data });

      onDataImported && (await onDataImported(data));
      setImporting(false);
    } catch (err) {
      console.error("IMPORT ERROR:", err);
      alert(t("import.error"));
      setImporting(false);
    }
  };

  return {
    exportData,
    importData,
    importing,
    exporting,
  };
};
