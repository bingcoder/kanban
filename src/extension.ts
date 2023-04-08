import * as vscode from "vscode";
import * as path from "path";
import NeDb from "@seald-io/nedb";
import dayjs from "dayjs";

interface TreeItem {
  _id: string;
  title: string;
  createTime: string;
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

  getChildren(element: TreeItem) {
    return this.db.kanbanDb.findAsync({}).sort({ createTime: 1 }) as any;
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
  readonly kanbanDb: NeDb;
  readonly taskDb: NeDb;
  constructor(readonly context: vscode.ExtensionContext) {
    this.kanbanDb = new NeDb({
      filename: path.join(context.extensionPath, "db/kanban.db"),
      autoload: true,
    });
    this.taskDb = new NeDb({
      filename: path.join(context.extensionPath, "db/task.db"),
      autoload: true,
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

  // kanban
  addKanban = async () => {
    const title = await vscode.window.showInputBox({
      prompt: "Type the new title",
      placeHolder: "Type the new title",
    });
    await this.kanbanDb.insertAsync({
      title,
      createTime: dayjs().format("YYYY-MM-DD"),
    });
    this.refreshTree();
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
      this.refreshTree();
    }
  };

  renameKanban = async (item: TreeItem) => {
    const title = await vscode.window.showInputBox({
      value: item.title,
      prompt: "Type the new title",
      placeHolder: "Type the new title",
    });
    await this.kanbanDb.updateAsync({ _id: item._id }, { $set: { title } });
    this.refreshTree();
  };

  openKanban = (item: TreeItem) => {
    console.log(item);
  };

  addTask = async (doc: any) => {
    await this.taskDb.insertAsync(doc);
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
