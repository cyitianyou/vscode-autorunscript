# Auto Run Script for Visual Studio Code
[此插件](https://github.com/cyitianyou/vscode-autorunscript)主要是为了解决项目中比较多的批处理文件的快速执行问题。

## 注意事项

* 1、目前插件只支持Windows版本
* 2、插件安装后,需要先指定本机Node.js安装路径,路径指定错误不检查,后续执行报错
     指定Node.js安装路径,使用配置项  autorunscript.nodePath
* 3、VS2015(及后续版本)会自动全局安装TypeScript(如安装时勾选),如脚本中用到了tsc命令,最好在系统环境变量Path中将      %APPDATA%\npm 加到最前面,这样脚本才会使用通过"npm install -g typescript"安装的TypeScript

## 效果图
![Preview](images/preview.gif)

## 鸣谢 | Thanks
[民间盗号组织领导人](https://github.com/HackingGroup "一脸懵逼")<br>
[Color-Coding](http://colorcoding.org/ "咔啦工作室")<br>