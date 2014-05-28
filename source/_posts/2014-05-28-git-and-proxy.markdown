---
layout: post
title: "配置git使用proxy"
date: 2014-05-28 09:50:17 +0800
comments: true
categories:
- git
- proxy
tags:
- git
- proxy
keywords: "git,proxy"
description: "configure git to use a proxy,supports ssh, git, http, and https protocols"
---
Git 目前支持的三种协议  `git://` `ssh://`  `http://` 和 `https://`.  

其代理配置各不相同.  
  (1) core.gitproxy 用于 `git://` 协议  
  (2) http.proxy 用于 `http://` 协议  
  (3) `ssh://` 协议的代理需要配置 ssh 的 ProxyCommand 参数  

## (一) 针对GIT 协议(git://)配置代理 ##

git 协议配置代理可以有两种方式,但是都是需要安装软件:  `socat`  
(1) Debian/Ubuntu just `sudo apt-get install socat `  
(2) CentOS use yum install  epel source  `yum -y install socat`  
(3) Mac OS: `brew install socat`  

### 1. Git Through A HTTP Proxy ###
让 git 走 HTTP 代理需要创建 `gitproxy.sh` 脚本,然后赋予可执行权限: 参考的[这个文章](http://www.emilsit.net/blog/archives/how-to-use-the-git-protocol-through-a-http-connect-proxy/)

``` bash

#!/bin/sh
# Use socat to proxy git through an HTTP CONNECT firewall.
# Useful if you are trying to clone git:// from inside a company.
# Requires that the proxy allows CONNECT to port 9418.
#
# Save this file as gitproxy somewhere in your path (e.g., ~/bin) and then run
# chmod +x gitproxy
# git config --global core.gitproxy gitproxy
#
# More details at http://tinyurl.com/8xvpny

# Configuration. Common proxy ports are 3128, 8123, 8000.
_proxy=proxy.yourcompany.com
_proxyport=3128

exec socat STDIO PROXY:$_proxy:$1:$2,proxyport=$_proxyport

```

然后,配置 git 使用这个代理, 在 `~/.gitconfig` 文件里写入:

``` bash
[core]
    gitproxy=gitproxy.sh for github.com
    #man git-config 查看 core.gitproxy 部分,关于 for * 的说明
```

### 2. Git Through A SOCKS Proxy (or SSH Tunnel) ###
[参考的这篇文章](http://www.aireadfun.com/blog/2013/08/27/using-git-through-a-socks-proxy-or-ssh-tunnel/)

第一步: 使用 ssh开启一个socks 代理.  
``` bash
ssh -nNT -D 8119 remote.host
#This command starts a SOCKS v4 proxy listening on localhost, port 8119.
```

第二步: 创建一个新的 `gitproxysocks.sh` 脚本,并赋予可执行权限.

```bash
#!/bin/sh
#
# Use socat to proxy git through a SOCKS proxy.
# Useful if you are trying to clone git:// from inside a company.
#
# See http://tinyurl.com/8xvpny for Emil Sit's original HTTP proxy script.
# See http://tinyurl.com/45atuth for updated SOCKS version.## Configuration.
_proxy=localhost_proxyport=8119
execsocat STDIO SOCKS4:$_proxy:$1:$2,socksport=$_proxyport
```
第三步: 配置 git 使用这个脚本,可以像上面那样写入到配置文件 `~/.gitconfig` 中,也可以配置 `GIT_PROXY_COMMAND` 环境变量, git 获取数据时会检查这个环境变量.

```bash
export GIT_PROXY_COMMAND=gitproxysocks.sh
```

## (二) 针对HTTP 协议(http://)配置代理 ##

配置 git 对 `http://` 协议开头的仓库使用 http 代理,可以直接编辑 `~/.gitconfig` 文件.

```bash
[http]
    proxy = http://proxy.yourcompany.com:8080
```

或者,可以通过下面的脚本直接设置 `http_proxy`, `https_proxy` 与 `all_proxy` 环境变量.  
把下面的脚本保存为 `http_proxy.sh` , 并在  `~/.bashrc` 或者 `~/.zshrc` 里加入 `source /path/to/http_proxy.sh`,这样在想使用 proxy 时,运行 `http_proxy_enable` 命令就可以了,取消时运行 `http_proxy_disable`

```bash
#!/bin/sh
http_proxy_enable() {
    IP="proxy.yourcompany.com:8080"
    export http_proxy=$IP
    export https_proxy=$IP
    export all_proxy=$IP
}

http_proxy_disable() {
    unset http_proxy
    unset https_proxy
    unset all_proxy
}
```


## (三) 针对SSH 协议(ssh://)配置代理 ##

使用 ssh 的好处就是在 clone 数据,或者提交数据到 github.com 时,不用在输入 github 的帐号密码.  
下面是 ssh 的设置,打开 `~/.ssh/config`
输入 :

``` bash
Host github*
    User git
    Hostname github.com
    Port 22
    Proxycommand ssh root@proxy.yourcompany.com nc %h %p
    IdentityFile  ~/.ssh/id_rsa
```
