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

    let getCdCommand = function(){
        let terminal_integrated_config = vscode.workspace.getConfiguration('terminal.integrated');
        let shell_windows_config:string =terminal_integrated_config.shell.windows.toUpperCase();
        if(shell_windows_config.endsWith('POWERSHELL.EXE')) return 'cd -Path ';
        if(shell_windows_config.endsWith('CMD.EXE')) return 'cd /d ';
        return 'cd /d ';
    }

    let run = function(e:vscode.Uri,isNode:boolean){
        if(!e && !e.fsPath) return;
        //获取配置
        let config = vscode.workspace.getConfiguration('autorunscript');
        //判断路径类型
        let script =  e.fsPath;  //使用绝对路径
        if(config.get('pathType','Relative') == 'Relative'){
            script =  script.replace(vscode.workspace.rootPath + '\\','.\\') ;
        } //使用相对路径

        //定义cd命令及参数
        //PowerShell: cd -Path
        //CMD: cd /d
        let cdCommand=getCdCommand();

        //创建终端并显示
        let terminal = vscode.window.createTerminal();
        terminal.show();
        
        //使用Node环境
        if(config.get('useNode',true) || isNode){        
            let nodePath = config.get('nodePath','');
            terminal.sendText(cdCommand + '"' + nodePath + '"');
            terminal.sendText('.\\nodevars.bat');
            terminal.sendText(cdCommand + '"'+vscode.workspace.rootPath+'"'); 
        }

        terminal.sendText(script);
    }

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let autoRunScript = vscode.commands.registerCommand('extension.AutoRunScript', (e:vscode.Uri) => {
        run(e,false);
    });
    let autoRunScriptInNode = vscode.commands.registerCommand('extension.AutoRunScriptInNode', (e:vscode.Uri) => {
        run(e,true);
    });

    context.subscriptions.push(autoRunScript);
    context.subscriptions.push(autoRunScriptInNode);
}

// this method is called when your extension is deactivated
export function deactivate() {
}