import * as vscode from "vscode";
import * as path from "path";
import NeDb from "@seald-io/nedb";
import {
  VscodeReceiveMessage,
  UpdateStatusMessage,
  UpdateDeveloperMessage,
  AddTaskRequestMessage,
  UpdateTaskRequestMessage,
  GetTasksRequestMessage,
  TaskRecord,
  Kanban,
  MessagePayload,
  UpdateTasksResponseMessage,
  UpdateKanbanResponseMessage,
  RequestMessage,
  KanbanMessage,
} from "./constants";

interface TreeItem {
  _id: string;
  title: string;
}

class KanbanDataProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<any> =
    new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> =
    this._onDidChangeTreeData.event;

  constructor(
    readonly context: vscode.ExtensionContext,
    readonly db: { kanbanDb: NeDb }
  ) {}

  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }

  getChildren() {
    return this.db.kanbanDb.findAsync({}).sort({ createdAt: 1 }) as any;
  }

  getTreeItem(item: TreeItem) {
    const treeItem: vscode.TreeItem = {
      label: `${item.title}`,
      command: {
        command: "vscTaskKanban.openKanban",
        title: "Open Kanban",
        arguments: [item],
      },
      contextValue: "kanban",
    };
    return treeItem;
  }
}

class KanbanView {
  readonly treeDataProvider: KanbanDataProvider;
  readonly view: vscode.TreeView<TreeItem>;
  readonly kanbanDb: NeDb<Kanban>;
  readonly taskDb: NeDb<TaskRecord>;
  private webviewPanel: vscode.WebviewPanel | undefined = undefined;
  constructor(readonly context: vscode.ExtensionContext) {
    this.kanbanDb = new NeDb({
      filename: path.join(context.extensionPath, "db/kanban.db"),
      autoload: true,
      timestampData: true,
    });
    this.taskDb = new NeDb({
      filename: path.join(context.extensionPath, "db/task.db"),
      autoload: true,
      timestampData: true,
    });
    this.treeDataProvider = new KanbanDataProvider(context, {
      kanbanDb: this.kanbanDb,
    });
    this.view = vscode.window.createTreeView("vsc-task-kanban", {
      treeDataProvider: this.treeDataProvider,
      showCollapseAll: true,
    });

    context.subscriptions.push(this.view);

    vscode.commands.registerCommand("vscTaskKanban.refresh", this.refreshTree);
    vscode.commands.registerCommand("vscTaskKanban.addKanban", this.addKanban);
    vscode.commands.registerCommand(
      "vscTaskKanban.renameKanban",
      this.renameKanban
    );
    vscode.commands.registerCommand(
      "vscTaskKanban.deleteKanban",
      this.deleteKanban
    );
    vscode.commands.registerCommand(
      "vscTaskKanban.openKanban",
      this.openKanban
    );
  }

  refreshTree = () => {
    this.treeDataProvider.refresh();
  };

  verifyKanban = async (title?: string) => {
    let errMsg: string = "";

    if (!title) {
      errMsg = "请输入名称!!!";
    }
    const kanban = await this.kanbanDb.findOneAsync({ title });
    if (kanban) {
      errMsg = `看板${title}已经存在!!!`;
    }

    if (errMsg) {
      vscode.window.showErrorMessage(errMsg);
      return Promise.reject();
    }
  };

  // kanban
  addKanban = async () => {
    const title = await vscode.window.showInputBox({
      prompt: "Type the new title",
      placeHolder: "Type the new title",
    });
    await this.verifyKanban(title);
    if (title) {
      await this.kanbanDb.insertAsync({
        title,
        status: [],
        developer: [],
      } as any);
      this.refreshTree();
    }
  };

  deleteKanban = async (item: TreeItem) => {
    const pickItem = await vscode.window.showQuickPick(
      [
        { label: "是", value: true },
        { label: "否", value: false },
      ],
      {
        title: "是否删除(看板及所有任务)",
      }
    );

    if (pickItem?.value) {
      await this.kanbanDb.removeAsync({ _id: item._id }, { multi: false });
      if (this.webviewPanel && this.webviewPanel.title === item.title) {
        this.webviewPanel.dispose();
      }
      this.refreshTree();
    }
  };

  renameKanban = async (item: TreeItem) => {
    const title = await vscode.window.showInputBox({
      value: item.title,
      prompt: "Type the new title",
      placeHolder: "Type the new title",
    });
    await this.verifyKanban(title);
    await this.kanbanDb.updateAsync({ _id: item._id }, { $set: { title } });
    if (this.webviewPanel && this.webviewPanel.title === item.title) {
      this.webviewPanel.title = title!;
    }
    this.refreshTree();
  };

  refreshWebviewKanban = async (_id: string) => {
    const kanban = await this.kanbanDb.findOneAsync({ _id });
    if (this.webviewPanel) {
      this.webviewPanel.webview.postMessage(
        new UpdateKanbanResponseMessage(kanban)
      );
    }
  };

  updateStatus = async ({
    _id,
    status,
  }: MessagePayload<UpdateStatusMessage>) => {
    await this.kanbanDb.updateAsync({ _id }, { $set: { status } });
    await this.refreshWebviewKanban(_id);
  };

  updateDeveloper = async ({
    _id,
    developer,
  }: MessagePayload<UpdateDeveloperMessage>) => {
    await this.kanbanDb.updateAsync({ _id }, { $set: { developer } });
    await this.refreshWebviewKanban(_id);
  };

  openKanban = async (item: TreeItem) => {
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (this.webviewPanel) {
      this.webviewPanel.dispose();
    }
    this.webviewPanel = vscode.window.createWebviewPanel(
      "vscKanban",
      item.title,
      columnToShowIn!,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    this.webviewPanel.onDidDispose(
      () => {
        this.webviewPanel = void 0;
      },
      null,
      this.context.subscriptions
    );

    const script = this.webviewPanel.webview.asWebviewUri(
      vscode.Uri.file(path.join(this.context.extensionPath, "webview/main.js"))
    );

    const kanban = await this.kanbanDb.findOneAsync({ _id: item._id });
    if (kanban) {
      this.webviewPanel.webview.html = `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
          </head>
          <body>
          <div id="root"></div>
            <script>var vscKanban = ${JSON.stringify(kanban)}</script>
            <script crossorigin src=${script}></script>
          </body>
        </html>`;

      this.webviewPanel.webview.onDidReceiveMessage(
        (message: RequestMessage) => {
          if (message.source === KanbanMessage.source) {
            console.log(message.command);

            // this[message.command]?.(message.payload as any);
          }
        }
      );
    }
  };
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "kanban" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  new KanbanView(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
