'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-autorunscript" is now active!');

    let getCdCommand = function () {
        let terminal_integrated_config = vscode.workspace.getConfiguration('terminal.integrated');
        let shell_windows_config: string = terminal_integrated_config.shell.windows.toUpperCase();
        if (shell_windows_config.endsWith('POWERSHELL.EXE')) return 'cd -Path ';
        if (shell_windows_config.endsWith('CMD.EXE')) return 'cd /d ';
        return 'cd /d ';
    }

    let run = function (e: vscode.Uri, isNode: boolean, isSudo: boolean = false) {
        if (!e && !e.fsPath) return;
        //获取配置
        let config = vscode.workspace.getConfiguration('autorunscript');
        //判断路径类型
        let script = e.fsPath;  //使用绝对路径
        if (config.get('pathType', 'Relative') == 'Relative') {
            script = script.replace(vscode.workspace.rootPath + '\\', '.\\');
        } //使用相对路径

        let editor = vscode.window.activeTextEditor;
        if (editor.document.languageId === 'shellscript') {
            script = 'bash ' + script;
        }
        //sudo 模式
        if (isSudo) {
            script = 'sudo ' + script;
        }
        //定义cd命令及参数
        //PowerShell: cd -Path
        //CMD: cd /d
        let cdCommand = getCdCommand();

        //创建终端并显示
        let terminal = vscode.window.createTerminal();
        terminal.show();

        if (editor.document.languageId !== 'shellscript') {
            //使用Node环境
            if (config.get('useNode', true) || isNode) {
                let nodePath = config.get('nodePath', '');
                terminal.sendText(cdCommand + '"' + nodePath + '"');
                terminal.sendText('.\\nodevars.bat');
                terminal.sendText(cdCommand + '"' + vscode.workspace.rootPath + '"');
            }
        }

        terminal.sendText(script);
    }

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let autoRunScript = vscode.commands.registerCommand('extension.AutoRunScript', (e: vscode.Uri) => {
        run(e, false);
    });
    let autoRunScriptInNode = vscode.commands.registerCommand('extension.AutoRunScriptInNode', (e: vscode.Uri) => {
        run(e, true);
    });

    ///adapt on not windows
    let auto_run_script_by_sudo = vscode.commands.registerCommand('extension.AutoRunScriptBySudo', (e: vscode.Uri) => {
        run(e, false, true);
    });
    //linux下 node环境变量预置后，bash可直接执行node 命令
    // let auto_run_script_in_node_by_sudo = vscode.commands.registerCommand('extension.AutoRunScriptInNodeBySudo', (e: vscode.Uri) => {
    //     run(e, true, true);
    // });

    context.subscriptions.push(autoRunScript);
    context.subscriptions.push(autoRunScriptInNode);
    context.subscriptions.push(auto_run_script_by_sudo);
    // context.subscriptions.push(auto_run_script_in_node_by_sudo);
}

// this method is called when your extension is deactivated
export function deactivate() {
}