import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

const bootstrap = async (): Promise<void> => {
  try {
    if (typeof window !== "undefined" && window.__TAURI__) {
      const employees = localStorage.getItem("employees") || "[]";
      const attendance = localStorage.getItem("attendance") || "[]";
      if (employees !== "[]" || attendance !== "[]") {
        try {
          const modulePath = "@tauri-apps/api/" + "tauri";
          const mod = await import(/* @vite-ignore */ modulePath);
          const invoke = (
            mod as { invoke: (cmd: string, args: unknown) => Promise<void> }
          ).invoke;
          await invoke("migrate_from_local", {
            employees_json: employees,
            attendance_json: attendance,
          });
          localStorage.removeItem("employees");
          localStorage.removeItem("attendance");
        } catch (e) {
          console.error("Migration failed:", e);
        }
      }
    }
  } catch (e) {
    console.error("Startup migration check failed:", e);
  }

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

bootstrap();
