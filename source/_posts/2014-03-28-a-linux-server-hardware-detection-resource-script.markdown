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

输出的格式位 markdown, 可以很容易转换成 html 的 table .或者改一下脚本的输出格式为cvs, 到[这个网站](http://www.tablesgenerator.com/html_tables)生成表格. 

目前可以检查的资源有: 包含服务器的型号, U 数, Dell 序列号, 内存数, 最大内存数, 可以插的内存条数, 已经用的内存条数, 内存类型, 硬盘大小, CPU 信息.

``` bash
#!/bin/bash

ISINSTALLED_D=$(rpm -qa |grep dmidecode)

if [ -z $ISINSTALLED_D ]; then
	yum -y install dmidecode
fi

export PATH=$HOME/bin:/bin:/usr/bin:/usr/local/bin:/sbin:/usr/sbin:/usr/local/sbin
NUM=$1
NUM=${NUM:=0}
ISSHOW_DES=$2
ISSHOW_DES=${ISSHOW_DES:=0}

U_NUM=$(dmidecode -t chassis |grep Height:|cut -d : -f 2)
U_NUM=${U_NUM// /}
PRODUCT=$(dmidecode -t system|grep Product|cut -d : -f 2|  sed -e 's/^[ \t]*//')
SERIAL=$(dmidecode -t system|grep Serial|cut -d : -f 2|  sed -e 's/^[ \t]*//')
HOSTNAME=$(hostname | cut -d . -f 1)
MEM=$(free -o|cut -c 1-20|grep -vi "swap"|grep Mem|cut -d : -f 2|sed -e 's/^[ \t]*//')
MEM=$(echo "$MEM 1000000" | awk '{printf "%.1fGB", $1/$2}')
MEM_MAX_CAPACITY=$(dmidecode -t memory|grep "Maximum Capacity"|cut -d : -f 2)
MEM_MAX_CAPACITY=${MEM_MAX_CAPACITY// /}
MEM_NUM_OF_DEV=$(dmidecode -t memory|grep "Number Of Devices"|cut -d : -f 2)
MEM_NUM_OF_DEV=${MEM_NUM_OF_DEV// /}
MEM_NUM_OF_DEV_USED=$(dmidecode -t memory|grep "Speed: Unknown"|wc -l)
MEM_NUM_OF_DEV_USED=$(($MEM_NUM_OF_DEV - $MEM_NUM_OF_DEV_USED))
MEM_TYPE=$(dmidecode -t memory|grep "Type: "|tail -1|cut -d : -f 2)
MEM_TYPE=${MEM_TYPE// /}
DISK_SIZE=$(fdisk  -l  2>/dev/null | grep GB |cut -d , -f 1|cut -d : -f 2|sed -e 's/ //g')
DISK_SIZE=$(echo $DISK_SIZE|tr ' ' '+')
CPU=$(cat /proc/cpuinfo |grep CPU|head -1|cut -d : -f 2 | sed -e 's/^[ \t]*//')
CPU=${CPU// /}
CPU=${CPU//@/ }
CPU_NUM=$(cat /proc/cpuinfo |grep CPU|wc -l)
CPU_INFO="$CPU * $CPU_NUM"

if [ "${ISSHOW_DES}0" != "00" ]; then
	echo "|ID|服务器名|服务器型号|U数|DELL序列号|内存数|最大内存|总内存槽数|已经内存槽数|内存类型|硬盘大小信息|CPU 信息汇总|"
	echo "|--|------|--------|---|---------|-----|------|---------|----------|------|----------|----------|"
fi
echo "|$NUM|$HOSTNAME|$PRODUCT|$U_NUM|$SERIAL|$MEM|$MEM_MAX_CAPACITY|$MEM_NUM_OF_DEV|$MEM_NUM_OF_DEV_USED|$MEM_TYPE|$DISK_SIZE|$CPU_INFO|"
```
