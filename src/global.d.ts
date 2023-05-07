interface Window {
  dbAdapter: any;
  vscKanban: any;
  Nedb: any;
  acquireVsCodeApi?: () => {
    postMessage: (message: any) => void;
  };
}
