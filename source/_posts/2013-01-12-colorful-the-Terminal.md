---
title: 使终端(iTerm2/Terminal)色彩缤纷
author: leolovenet
layout: post
comments: true
categories:
  - Linux
  - Mac
  - Terminal  
tags:
  - Linux
  - Mac
  - Terminal
---
因为经常使用终端 (iTerm|Terminal) ssh到服务器上去,所以整日盯着黑乎乎的屏幕很头痛,还不利于眼睛,所谓“工欲善其事,必先利其器”,所以今天就想让终端也色彩缤纷起来,让我们锻炼眼睛识别颜色的能力吧. 

![terminal-colorful.png](/downloads/images/terminal-colorful.png "terminal colorful example")

<!--more-->
  
在git上找到了<a href="http://ethanschoonover.com/solarized" target="_blank">SOLARIZED</a>这个项目,可以配置很多很多程序的颜色主体哦,哈哈,很是激动,下面具体讲讲配置过程.

我的机器主要用到iTerm2,而服务器因为是CentOS,那就要用到<a href="https://github.com/seebi/dircolors-solarized" target="_blank">dircolors-solarized</a>子项目.

首先讲一下, CentOS 下的ls配置  Solarized Color Theme for GNU ls (as setup by GNU dircolors).

Linux下的 `ls --color=auto` 命令,其实是根据两个文件来显示颜色的, `/etc/DIR_COLORS` 或者 `~/.dir_colors`, 一个是系统级别的配置文件,一个用户级别的配置文件.

Solarized Color Theme for GNU ls项目提供了配置好了的颜色配置文件,并且可以根据文件类型来展示不同的颜色,可以看看我上面的实例图片,色彩缤纷吧.  

我就不讲Terminal的 16-色 和 256-色 的差别了,因为我也一知半解.不过这个项目的<a href="https://github.com/seebi/dircolors-solarized/raw/master/dircolors.ansi-universal" target="_blank">dircolors.ansi-universal</a>配置文件可以工作在两种形式的终端下,而<a href="https://github.com/seebi/dircolors-solarized/raw/master/dircolors.256dark" target="_blank">dircolors.256dark</a>只能工作在265色的终端下,所以除非你知道自己的终端是支持265色的,不然还是下载<a href="https://github.com/seebi/dircolors-solarized/raw/master/dircolors.ansi-universal" target="_blank">dircolors.ansi-universal</a>.

下面是具体命令

{% include_code  [execute below script in terminal] lang:bash terminal_colorful.sh  %}


该项目的[ReadMe][1]文件还有很多信息,比如怎样配置265色的终端,感兴趣的可以仔细看看.

**iTerm2的配置**

iTerm2的配置配置更简单一点,进入到<a href="https://github.com/altercation/solarized/tree/master/iterm2-colors-solarized" target="_blank">iTerm2</a>的配置子项目下,下载配置文件<a href="https://github.com/altercation/solarized/raw/master/iterm2-colors-solarized/Solarized%20Dark.itermcolors" target="_blank">Solarized Dark.itermcolors</a>或者<a href="https://github.com/altercation/solarized/raw/master/iterm2-colors-solarized/Solarized%20Light.itermcolors" target="_blank">Solarized Light.itermcolors</a>,双击导入,然后更改首选项选择主题就可以.  
具体可以查看<a href="https://github.com/altercation/solarized/blob/master/iterm2-colors-solarized/README.md" target="_blank">ReadMe</a>文件.

这里需要补充一点的是,mac 下的ls命令不是gun ls,所以即使iterm2安装了颜色主题,敲入ls命令以后,显示的文件颜色还是有问题的,这里有一个补救办法,运行下面这行,之后再看ls命令的颜色是不是变了

``` bash
export LSCOLORS=gxfxbEaEBxxEhEhBaDaCaD
```

但是,这种补救办法也不完美,比如不能根据文件类型来显示颜色.

如果你想追求完美的话,还有另外一种办法,就是用 `brew install coreutils`, 安装 gun ls 命令到 mac 下,到时你还需要跟上面在linux下操作的一样,下载配置文件,放入到 ~/.dir_colors

具体就不说了,累了,睡觉了.

 [1]: https://github.com/seebi/dircolors-solarized/blob/master/README.md