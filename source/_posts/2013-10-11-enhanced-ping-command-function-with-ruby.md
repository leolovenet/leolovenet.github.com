---
layout: post
title: "用Ruby增强ping命令"
author: leolovenet
comments: true
categories: 
- Bash
- Linux
- Mac
- Ruby
- Shell
tags:
- Bash
- Linux
- Mac
- Ruby
- Shell
keywords: "Bash, Linux, Mac, Ruby,escape, Shell"
description: "a Ruby script enhanced ping command function."
sidebar: collapse
---

故事的起因是,我在mac下一直用chrome,但是chrome有一个很不爽的地方,是在地址栏copy的域名,每次都自动的加上`http://`的字符串, 这样就没有办法直接粘贴到 Terminal, 用ping命令查看ping值. 这个事情真的弄的我很头疼.

所以就想办法关掉这个chrome的特性,google了半天也也没有找到,就放弃了.如果有人知道告诉我,十分感谢 :)

转而想可不可以增加 ping 的功能呢? 让ping可以支持有`http://`的域名.

正好,最近再看ruby的一些东西,感觉蛮方便的.就写了一个ruby脚本,可以自动的去掉http之类的协议头,然后传给ping命令执行.不就ok了嘛.

写出来之后,又不爽不能及时的知道ip的地理位置,所以呢,就又增加了调用纯真的ip数据库,顺便把ip的地理位置信息现实出来.

第一步,安装所需要的依赖库,qqwry.dat自己下载,然后改脚本里的路径信息.

``` 
gem install escape qqwry
```
下面的代码我是另存为一个叫p的文件,放到了 `$home/bin/` 下面.
``` ruby
#!/usr/bin/env ruby
# encoding : utf-8
require "escape"
require "uri"
require 'qqwry'
require 'resolv'

unless ARGV.length == 1
  puts "Usage: p <domain>\n"
  exit
end

domain=ARGV[0].dup


if domain[0..3] != "http"
   domain.insert(0,'http://')
end
host=URI.parse("#{domain}").host
ip=Resolv.getaddress host

db = QQWry::Database.new('/Users/yourname/Documents/vbox/ip/qqwry.dat')
r = db.query(ip)

puts ""
puts "#{host}\t===>\t#{ip}\t===>\t#{r.country} #{r.area}"
puts ""
exec "ping #{host}"
```


使用方法:
```
p http://www.google.com 
```
脚本虽然很简单,但是用起来感觉很好.
