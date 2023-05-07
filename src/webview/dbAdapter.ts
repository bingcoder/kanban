import { DbAdapter } from "../adapter";
import "@/lib/nedb";

if ("acquireVsCodeApi" in window) {
  // vscode 环境
  window.dbAdapter = window.acquireVsCodeApi;
} else {
  // web 环境
  const kanbanDb = new window.Nedb({
    filename: "db/kanban.db",
    autoload: true,
    timestampData: true,
  });

  const taskDb = new window.Nedb({
    filename: "db/task.db",
    autoload: true,
    timestampData: true,
  });

  const adapter = new DbAdapter({
    kanbanDb,
    taskDb,
    webview: window,
  });
  console.log(adapter);

  document.addEventListener("kanbanMessage", (e: any) => {
    console.log("kanbanMessage", e.detail);
    if (e.detail?.source === "vscKanban") {
      const { command, payload } = e.detail;
      const commander = adapter[command as keyof typeof adapter];
      if (typeof commander === "function") {
        commander(payload);
      } else {
        console.warn("web adapter command is not exist");
      }
    }
  });

  window.dbAdapter = () => ({
    postMessage(data: any) {
      const kanbanEvent = new CustomEvent("kanbanMessage", { detail: data });
      document.dispatchEvent(kanbanEvent);
    },
  });
}
