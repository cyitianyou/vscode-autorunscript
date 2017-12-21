"use strict";
// the module "vscode" contains the VS Code extensibility API
// import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {

    // use the console to output diagnostic information (console.log) and errors (console.error)
    // this line of code will only be executed once when your extension is activated
    console.log("Congratulations, your extension 'vscode-autorunscript' is now active!");

    let getCdCommand: Function = function (): string {
        let terminal_integrated_config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("terminal.integrated");
        let shell_windows_config: string = terminal_integrated_config.shell.windows.toUpperCase();
        if (shell_windows_config.endsWith("POWERSHELL.EXE")) { return "cd -Path "; }
        if (shell_windows_config.endsWith("CMD.EXE")) { return "cd /d "; }
        return "cd /d ";
    };

    let run: Function = function (e: vscode.Uri, isNode: boolean): void {
        if (!e && !e.fsPath) { return; }
        // 获取配置
        let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("autorunscript");
        // 判断路径类型
        let script: string = e.fsPath;  // 使用绝对路径
        if (config.get("pathType", "Relative") === "Relative") {
            script = script.replace(vscode.workspace.rootPath + "\\", ".\\");
        } // 使用相对路径

        // 定义cd命令及参数
        // powershell: cd -Path
        // cmd: cd /d
        let cdCommand: Function = getCdCommand();

        // 创建终端并显示
        let terminal: vscode.Terminal = vscode.window.createTerminal();
        terminal.show();

        // 使用Node环境
        if (config.get("useNode", true) || isNode) {
            let nodePath: string = config.get("nodePath", "");
            terminal.sendText(cdCommand + "'" + nodePath + "'");
            terminal.sendText(".\\nodevars.bat");
            terminal.sendText(cdCommand + "'" + vscode.workspace.rootPath + "'");
        }

        terminal.sendText(script);
    };

    // the command has been defined in the package.json file
    // now provide the implementation of the command with  registerCommand
    // the commandId parameter must match the command field in package.json
    let autoRunScript: vscode.Disposable = vscode.commands.registerCommand("extension.AutoRunScript", (e: vscode.Uri) => {
        run(e, false);
    });
    let autoRunScriptInNode: vscode.Disposable = vscode.commands.registerCommand("extension.AutoRunScriptInNode", (e: vscode.Uri) => {
        run(e, true);
    });

    context.subscriptions.push(autoRunScript);
    context.subscriptions.push(autoRunScriptInNode);
}

// this method is called when your extension is deactivated
export function deactivate(): void {
    /** */
}