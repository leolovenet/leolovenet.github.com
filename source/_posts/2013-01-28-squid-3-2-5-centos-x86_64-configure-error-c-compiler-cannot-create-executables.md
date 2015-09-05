---
title: 'squid-3.2.5 CentOS X86_64 configure: error: C compiler cannot create executables'
author: leolovenet
comments: true
layout: post
categories:
  - Linux
  - Squid
  - C
  - Compiler
tags:
  - Linux
  - Squid
  - C
  - Compiler
keywords: "Squid, Linux, CentOS, C, compiler, C compiler cannot create executables"
description: "squid (3.2.5) configure: error: C compiler cannot create executables"
---
squid-3.2.5 在CentOS X86_64位的环境下默认配置编译会遇到错误，如下:

<pre>
checking whether the C compiler works... no
configure: error: in `/opt/packages/goodlePackages/squid/squid_src/squid-3.2.5':
configure: error: C compiler cannot create executables
</pre>

x86_64解决办法如下:

``` bash
./configure CXXFLAGS="-g -O2"  CFLAGS="-O2 -march=x86-64" --prefix=/usr/local/squid
make 
make install
```

i686

``` bash 
./configure -disable-64bit CFLAGS="-O3 -march=i686" --prefix=/usr/local/squid
make 
make install
```