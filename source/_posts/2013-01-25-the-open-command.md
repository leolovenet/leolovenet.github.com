---
title: mac 下的 open命令
author: leolovenet
layout: post
comments: true
categories:
  - Mac
tags:
  - Mac
---
mac下的应用程序是一个有结构的目录(想在Finder下查看程序目录内容,可以在程序目录上右击选择 "Show Package Contents" 像下图一样).

![open-command.png](/downloads/images/open-command.png "open command example")

安装程序也是简单的把这个目录copy到你想要的地方就可以，大部分是 ~/Application 或者 /Application 下.

但想要在命令行下运行程序怎么办？你总不能在命令行下运行一个目录吧！

这个时候发现了`/usr/bin/open`命令,就是干这个的.  

比如,我想在命令行下运行Firefox,运行下面的命令即可

``` bash
open -a /Applications/Firefox.app
```

想在命令行下,用 Finder 打开此时的路径的话,运行下面的命令

``` bash
open ./
```
想要用系统默认程序打开响应的文件,运行下面的命令

``` bash
open Readme.md
```

open命令的其他参数:

<pre>
/usr/bin/open --help
open: unrecognized option `--help'
Usage: open [-e] [-t] [-f] [-W] [-R] [-n] [-g] [-h] [-b &lt;bundle identifier>] [-a &lt;application>] [filenames] [--args arguments]
Help: Open opens files from a shell.
      By default, opens each file using the default application for that file.  
      If the file is in the form of a URL, the file will be opened as a URL.
Options: 
      -a                Opens with the specified application.
      -b                Opens with the specified application bundle identifier.
      -e                Opens with TextEdit.
      -t                Opens with default text editor.
      -f                Reads input from standard input and opens with TextEdit.
      -F  --fresh       Launches the app fresh, that is, without restoring windows. Saved persistent state is lost, excluding Untitled documents.
      -R, --reveal      Selects in the Finder instead of opening.
      -W, --wait-apps   Blocks until the used applications are closed (even if they were already running).
          --args        All remaining arguments are passed in argv to the application's main() function instead of opened.
      -n, --new         Open a new instance of the application even if one is already running.
      -j, --hide        Launches the app hidden.
      -g, --background  Does not bring the application to the foreground.
      -h, --header      Searches header file locations for headers matching the given filenames, and opens them.
</pre>