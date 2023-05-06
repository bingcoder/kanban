interface Window {
  vscKanban: any;
  acquireVsCodeApi: () => {
    postMessage: (message: any) => void;
  };
}
