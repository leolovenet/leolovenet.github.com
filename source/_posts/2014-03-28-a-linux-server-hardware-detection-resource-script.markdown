---
layout: post
title: "检测 Linux 服务器硬件资源的 bash 脚本"
date: 2014-03-28 13:21:53 +0800
comments: true
categories: 
- Bash
- Linux
tags: 
- Bash
- Linux
keywords: "Linux,Bash, Linux server hardware detection"
description: " A Linux server hardware detection resource script that contains the server model, U number, Dell serial number, the number of memory, the maximum amount of memory, the memory can be inserted in the number, the number of memory has been used, the type of memory, hard disk size, CPU information."
---

最近公司要做机房的机器整理,把空闲的机器撤下来. 

这样就需要列一个机器硬件配置的列表,就写了一个 bash 脚本来做检查,先for 循环自动 scp 到目标机器, 然后 for 循环自动 ssh 登录进所有的机器运行这个脚本.

输出的格式位 markdown, 可以很容易转换成 html 的 table .或者改一下脚本的输出格式为cvs,  到(这个网站)[http://www.tablesgenerator.com/html_tables]生成表格. 

目前可以检查的资源有: 包含服务器的型号, U 数, Dell 序列号, 内存数, 最大内存数, 可以插的内存条数, 已经用的内存条数, 内存类型, 硬盘大小, CPU 信息.

{% gist 9825167 %}
