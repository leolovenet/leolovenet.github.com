---
title: 关于开发Squid的ecap动态库插件的指导
author: leolovenet
layout: post
comments: true
categories:
  - C++
  - Linux
  - Squid
tags:
  - C++
  - Linux
  - Squid

keywords: "C++, Linux, Squid, Web, ecap, libraries"
description: "关于开发Squid的ecap动态库插件的指导-About the development Squid ecap dynamic libraries plug guidance"
sidebar: collapse
---

>"Squid cache"（简称为Squid）是一个流行的自由软件（GNU通用公共许可证）的代理服务器和Web缓存服务器。 Squid 有广泛的用途，从作为网页服务器的前置 cache 服务器缓存相关请求来提高Web服务器的速度，到为一组人共享网络资源而缓存万维网，域名系统和其他网络搜索，到通过过滤流量帮助网络安全，到局域网通过代理上网。Squid主要设计用于在 Unix 一类系统运行。

上面是摘自开源中国(oscine.net)对squid的中文介绍。squid的功能的确很强大，有些需要深入挖掘一下，今天这篇文章主要讲述一下这几天研究成果。squid 做透明代理或者网关的情况下，过滤用户请求内容，或者过滤用户请求的回应内容的技术。可以把 squid 当做一个理论上的“防火墙”来使用，避免用户浏览非法网站或下载带有病毒的文件(结合开源杀毒软件功能)，甚至替换掉那些烦人的广告。当然，它还可以在服务器的返回结果中植入自己的广告代码，或者统计代码，最灵活的是可以控制操作用户请求的 HTTP 头内容，过滤不必要的 HTTP 头信息，或者添加自定义HTTP头信息。

总之，**我们可以利用 squid 分析，捕捉，拦截，替换，或者修改请求回应信息。**

Squid 拥有强大的<a target="_blank" href="http://www.squid-cache.org/Doc/config/acl/">ACL(访问控制)</a>配置指令，可以实现一些通用的访问控制，但是如果想要更加灵活的控制，应该怎么办? 在官网wiki中(<a target="_blank" href="http://wiki.squid-cache.org/SquidFaq/ContentAdaptation">Content Adaptation</a>)给出了答案.
<!--more-->
wiki给出了[5种技术方案](http://wiki.squid-cache.org/SquidFaq/ContentAdaptation#Summary)

<div class="squid">
<style>
.squid table
{
    margin: 0.5em 0;
    border-collapse: collapse;
}

.squid table td
{
    padding: 0.25em;
    border: 1px solid #ADB9CC;
}

.squid td p {
    margin: 0;
    padding: 0;
}
</style>
<table><tbody><tr>  <td colspan="1" rowspan="2" style="text-align: center"><p class="line862"> <strong>Mechanism</strong> </p></td>
  <td colspan="2" style="text-align: center"><p class="line891"><strong>Request</strong> </p></td>
  <td colspan="2" style="text-align: center"><p class="line891"><strong>Response</strong> </p></td>
</tr>
<tr>  <td style="text-align: center"><span class="anchor" id="line-101"></span><p class="line891"><strong>Header</strong> </p></td>
  <td style="text-align: center"><p class="line862"> <strong>Body</strong> </p></td>
  <td style="text-align: center"><p class="line862"> <strong>Header</strong> </p></td>
  <td style="text-align: center"><p class="line862"> <strong>Body</strong> </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-102"></span><p class="line862"> <a href="/SquidFaq/ContentAdaptation#secICAP">ICAP</a> </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-103"></span><p class="line862"> <a href="/SquidFaq/ContentAdaptation#secClientStreams">Client Streams</a> </p></td>
  <td><p class="line862">  </p></td>
  <td><p class="line862">  </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-104"></span><p class="line862"> <a href="/SquidFaq/ContentAdaptation#seceCAP">eCAP</a> </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-105"></span><p class="line862"> <a href="/SquidFaq/ContentAdaptation#secACLs">ACLs</a> </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
  <td><p class="line862">  </p></td>
  <td style="text-align: center"><p class="line862">del </p></td>
  <td><p class="line862">  </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-106"></span><p class="line862"> <a href="/SquidFaq/ContentAdaptation#secCodeHacks">code hacks</a> </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
  <td style="text-align: center"><p class="line862">yes </p></td>
</tr>
</tbody></table></div>
而这几种方案又各有优缺点，最好的排序方式是:
<div class="squid"><table><tbody><tr>  <td><p class="line862"> <strong>Evaluation Criteria</strong> </p></td>
  <td><p class="line862"> <strong>Mechanisms in rough order from "best" to "worst"</strong> </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-111"></span><p class="line862"> Squid independence </p></td>
  <td><p class="line862"> <a href="/SquidFaq/ContentAdaptation#secICAP">ICAP</a>, <a href="/SquidFaq/ContentAdaptation#seceCAP">eCAP</a>, <a href="/SquidFaq/ContentAdaptation#secACLs">ACLs</a>, <a href="/SquidFaq/ContentAdaptation#secClientStreams">Client Streams</a>, <a href="/SquidFaq/ContentAdaptation#secCodeHacks">code hacks</a> </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-112"></span><p class="line862"> Processing speed </p></td>
  <td><p class="line862"> <a href="/SquidFaq/ContentAdaptation#seceCAP">eCAP</a> or <a href="/SquidFaq/ContentAdaptation#secClientStreams">Client Streams</a> or <a href="/SquidFaq/ContentAdaptation#secACLs">ACLs</a> or <a href="/SquidFaq/ContentAdaptation#secCodeHacks">code hacks</a>, <a href="/SquidFaq/ContentAdaptation#secICAP">ICAP</a> </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-113"></span><p class="line862"> Development effort (header adaptation)</p></td>
  <td><p class="line862"> <a href="/SquidFaq/ContentAdaptation#secACLs">ACLs</a>, <a href="/SquidFaq/ContentAdaptation#secCodeHacks">code hacks</a>, <a href="/SquidFaq/ContentAdaptation#secClientStreams">Client Streams</a>, <a href="/SquidFaq/ContentAdaptation#seceCAP">eCAP</a>, <a href="/SquidFaq/ContentAdaptation#secICAP">ICAP</a> </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-114"></span><p class="line862"> Development effort (content adaptation)</p></td>
  <td><p class="line862"> <a href="/SquidFaq/ContentAdaptation#seceCAP">eCAP</a>, <a href="/SquidFaq/ContentAdaptation#secICAP">ICAP</a>, <a href="/SquidFaq/ContentAdaptation#secClientStreams">Client Streams</a>, <a href="/SquidFaq/ContentAdaptation#secCodeHacks">code hacks</a> </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-115"></span><p class="line862"> Versatility </p></td>
  <td><p class="line862"> <a href="/SquidFaq/ContentAdaptation#secCodeHacks">code hacks</a>, <a href="/SquidFaq/ContentAdaptation#seceCAP">eCAP</a>, <a href="/SquidFaq/ContentAdaptation#secICAP">ICAP</a>, <a href="/SquidFaq/ContentAdaptation#secClientStreams">Client Streams</a>, <a href="/SquidFaq/ContentAdaptation#secACLs">ACLs</a> </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-116"></span><p class="line862"> Maintenance overheads </p></td>
  <td><p class="line862"> <a href="/SquidFaq/ContentAdaptation#secACLs">ACLs</a>, <a href="/SquidFaq/ContentAdaptation#seceCAP">eCAP</a>, <a href="/SquidFaq/ContentAdaptation#secICAP">ICAP</a>, <a href="/SquidFaq/ContentAdaptation#secClientStreams">Client Streams</a>, <a href="/SquidFaq/ContentAdaptation#secCodeHacks">code hacks</a> </p></td>
</tr>
</tbody></table></div>

我先简单介绍一下ICAP([Internet Content Adaptation Protocol](http://tools.ietf.org/html/rfc3507))协议， ICAP是工作在web缓存代理服务器和真正的服务器之间的一个服务，通常来讲用户的HTTP请求送到代理缓存服务器之后，由代理缓存服务器判断是否可以命中缓存，或者把用户的请求转向真正的web服务，代理用户请求，并响应用户，记录缓存，待用户下次请求时，直接响应用户请求，省去向真正服务器的请求过程，加快响应速度，节约带宽成本.  
而加入了ICAP的代理缓存服务器的工作逻辑是:

<pre>
1.用户的HTTP请求送到代理缓存服务器.
2.代理缓存服务器将用户的请求消息发往ICAP服务器.
3.ICAP服务器接受到用户请求消息进行处理(可以分析，捕捉，拦截，替换，或者修改)，回应代理缓存服务器.
4.代理缓存服务器使用处理过的请求头，进行余下的处理流程，或者直接返回用户，或者查看是否命中缓存，或者转发给真正的内容提供服务器.
5.真正的内容提供服务器接受到请求以后回应代理缓存服务器相应的内容.
6.代理缓存服务器将接受到的回应内容发往ICAP服务器.
7.ICAP服务器接受到真正的服务器回应消息进行处理(可以分析，捕捉，拦截，替换，或者修改)，回应代理缓存服务器.
8.代理缓存服务器将内容回应给用户.
</pre>

从上面的处理过程可以看出icap协议的强大之处.  
上面的icap服务器类似http的web服务器一样，监听一个端口，等待代理缓存服务器的请求，并响应请求.而ecap可以看做是一个嵌入式的icap服务. ecap不必提供监听端口，而是以动态库的形式加载到了squid程序里面，通过api实现icap的逻辑处理，相当于squid的一个插件一样的工作.

经过尝试，我感觉目前最方便稳定的方式是开发squid的共享动态库ecap插件，实现自己的目的.  
当然你可以修改squid的源代码，但是那样做需要首先研究透彻squid的工作机理，而且需要谨慎的修改，原作者也不建议这样，因为可能会导致squid不稳定.  
当然还可以搭建icap服务，但是经过一轮的尝试和摸索一下，发现icap服务软件并没有像apache、nginx、和lighttpd这些成熟稳定的代码可以用，所以放弃，但是不乏一些小巧灵活的python架构的软件，可以使用，进行业务测试倒是可以，真正用于生产环境还是有点不足.  
比如：  
pyicap(<a target="_blank" href="https://github.com/netom/pyicap">A lightweight python framework for writing ICAP services</a>)，简单方便，生产环境不太适合.  
bitz-server(<a target="_blank" href="https://github.com/uditha-atukorala/bitz-server">An ICAP server implementation in C++ and Python</a>)，不太稳定.

关于ICAP服务器的部署说明，请自行参考上面的wiki说明.  
今天主要讲一下ecap的开发，部署，服务器环境为CentOS release 6.4 (Final) x86_64.  
到<http://www.e-cap.org/Downloads>下载安装最新版本的ecap库，编译安装.并同时下载最新版本的开发例子包[ecap\_adapter\_sample-0.2.0.tar.gz](http://www.measurement-factory.com/tmp/ecap/ecap_adapter_sample-0.2.0.tar.gz)

``` bash
yum -y install automake autoconf libtool 
mkdir -p /opt/packages
cd /opt/packages
wget http://www.measurement-factory.com/tmp/ecap/ecap_adapter_sample-0.2.0.tar.gz
wget http://www.measurement-factory.com/tmp/ecap/libecap-0.2.0.tar.gz
tar -zxf libecap-0.2.0.tar.gz
cd libecap-0.2.0
./configure
make
make install
```

编译安装squid，并在configure要加入`–enable-ecap`，开启ecap支持，如果你还想squid同时支持icap的话，还需要加入`–enable-icap-client`开关，然后配置，编译安装.

```
wget http://www.squid-cache.org/Versions/v3/3.3/squid-3.3.3.tar.bz2
tar -xf squid-3.3.3.tar.bz2
cd squid-3.3.3
./configure --enable-http-violations --enable-ltdl-convenience --enable-icap-client --enable-ecap --prefix=/usr/local/squid PKG_CONFIG_PATH=/usr/local/lib/pkgconfig 
make
make install
```

下面讲一下ecap的具体开发步骤，举个案例，现在我们想实现用户第一次访问网络时跳转到一个用户认证页面，认证通过以后才可以继续浏览网络.  
实现原理大概是:

<pre>
1.用户的请求送到squid，squid把用户请求http头交给ecap插件处理.
2.squid判断用户请求的url是否为我们的认证登陆页面.是，则放行不处理，否，则进行下面的逻辑.
2.ecap插件获取用户的ip地址，然后利用一个api接口去查询这个ip是否是否已经验证过，是，则放行通过，不处理，否，则进行下面的逻辑.
3.如果查询结果是这个ip还没有进行用户密码验证或者用户密码验证已经过期，则修改用户的http请求头，跳转到一个新的url地址，即我们的认证登陆页面，附带上用户的原始请求url.
4.用户在认证登陆页面输入账号密码登陆成功以后，数据库更新信息，然后跳转到用户原来的请求地址，继续浏览网络.
</pre>

上面的功能有点类似radius，这里我们拿squid实现，还有就是用户每个请求都需要验证，所以上面的解决办法效率可能会有点低，但是这里只是举例讲解一下ecap这个插件的功能应用.上面的功能实现最好不要在生产环境下部属.

下面让我们，解压开发例子包ecap\_adapter\_sample-0.2.0.tar.gz.

<pre>
.
├── acinclude.m4	  //m4宏文件不需要手工修改
├── aclocal.m4		 //m4宏文件不需要手工修改
├── bootstrap.sh     //脚本文件，自动运行autotool工具命令，不需要手工修改
├── cfgaux           //此目录下的所有文件都不需要手动修改
│   ├── ax_cxx_check_lib.m4
│   ├── config.guess
│   ├── config.sub
│   ├── depcomp
│   ├── install-sh
│   ├── ltmain.sh
│   ├── missing
│   ├── xstd_common.ac
│   └── xstd_cpp_checks.ac
├── change.log
├── configure       //生成的 configure 脚本
├── configure.in    //configure 脚本的生成源文件，需要手工编辑一下.
├── CREDITS       
├── LICENSE
├── Makefile.am     //Makefile.in脚本的生成源文件，此项目不需要手工修改.
├── Makefile.in	    //生成的 Makefile.in脚本
├── NOTICE
├── README
└── src
    ├── adapter_minimal.cc     //c++源文件，例子程序一
    ├── adapter_modifying.cc   //c++源文件，例子程序二
    ├── adapter_passthru.cc    //c++源文件，例子程序三
    ├── autoconf.h            //不需要修改，运行./configure之后，由autoconf.h.in生成的文件
    ├── autoconf.h.in         //不需要修改
    ├── Makefile.am  //Makefile.in脚本的生成源文件，需要手工编辑一下.
    ├── Makefile.in  //生成的 Makefile.in脚本
    └── sample.h    //例子的头文件
</pre>

如果你之前没有使用autotool工具的经验，这里有[一篇短文介绍](/downloads/files/autotools.pdf)，很快速的了解一下autotool工具. (autotool通常来说是autoconf， automake， autolib， 但是还有很多辅助的工具，包括 autoheader， aclocal， autoscan，运行这些命令之后，你就可以 `./configure && make && make install` ).  
写ecap插件很简单，例子包给出了3个例子插件.基本上一个插件只有一个源文件就可以搞定.所以写和部署起来还是蛮方便的.  
这里我们在原有的例子程序框架下修改一下. 然后写出我们自己的插件来.

``` bash
tar -zxf ecap_adapter_sample-0.2.0.tar.gz
mv ecap_adapter_sample-0.2.0 ecap_adapter_bbkanba
cd ecap_adapter_bbkanba/src
cp adapter_modifying.cc adapter_bbkanba.cc
sed -i -e 's/sample.h/bbkanba.h/' adapter_bbkanba.cc
sed -i -e '/.*\/config.h.*/d' adapter_bbkanba.cc
sed -i -e 's/.*ecap:\/\/.*/return "ecap:\/\/bbkanba.com\/bbkanba";/' adapter_bbkanba.cc
cat > Makefile.am <<ALLEND
EXTRA_DIST = \
    adapter_bbkanba.cc   
     
lib_LTLIBRARIES = \
    ecap_adapter_bbkanba.la
 
noinst_HEADERS = \
    bbkanba.h \
    Debugger.h \
    \
    autoconf.h 
 
ecap_adapter_bbkanba_la_SOURCES = adapter_bbkanba.cc \
                                 Debugger.cc 
             
ecap_adapter_bbkanba_la_CPPFLAGS = \$(LIBECAP_CFLAGS) 
ecap_adapter_bbkanba_la_LDFLAGS = -module -avoid-version \$(libecap_LIBS)
ecap_adapter_bbkanba_la_LIBADD= \$(LIBECAP_LIBS)  -lboost_system -lcppnetlib-uri
 
 
DISTCLEANFILES = \
        autoconf.h
 
AM_CPPFLAGS = -I\$(top_srcdir)/src
ALLEND
mv sample.h  bbkanba.h
cat > Debugger.h <<ALLEND
/* eCAP ClamAV Adapter  http://www.e-cap.org/
 * Copyright (C) 2011 The Measurement Factory.
 * Distributed under GPL v2 without any warranty.  */
 
#ifndef ECAP_MBAIDU_ADAPTER_DEBUGGER_H
#define ECAP_MBAIDU_ADAPTER_DEBUGGER_H
 
#include <libecap/common/log.h>
#include <iosfwd>
 
using libecap::ilNormal;
using libecap::ilCritical;
using libecap::flXaction;
using libecap::flApplication;
using libecap::mslLarge;
 
// TODO: rename to Log
 
// libecap::host::openDebug/closeDebug calls wrapper for safety and convenience
class Debugger {
    public:
        explicit Debugger(const libecap::LogVerbosity lv); // opens
        ~Debugger(); // closes
 
        // logs a message if host enabled debugging at the specified level
        template <class T>
        const Debugger &operator <<(const T &msg) const {
            if (debug)
                *debug << msg;
            return *this;
        }
 
    private:
        /* prohibited and not implemented */
        Debugger(const Debugger&);
        Debugger &operator=(const Debugger&);
 
        std::ostream *debug; // host-provided debug ostream or nil
};
 
#endif
ALLEND
cat > Debugger.cc <<ALLEND
/* eCAP ClamAV Adapter   http://www.e-cap.org/
 * Copyright (C) 2011 The Measurement Factory.
 * Distributed under GPL v2 without any warranty.  */
 
#include "bbkanba.h"
#include "Debugger.h"
#include <libecap/common/registry.h>
#include <libecap/host/host.h>
#include <iostream>
 
// TODO: support automated prefixing of log messages
 
Debugger::Debugger(const libecap::LogVerbosity lv):
    debug(libecap::MyHost().openDebug(lv)) {
}
 
Debugger::~Debugger() {
    if (debug)
        libecap::MyHost().closeDebug(debug);
}
ALLEND
cd ..
sed -i -e 's/AC_INIT.*/AC_INIT(eCAP bbkanba Adapter, 0.0.1, leolovenet@gmail.com, eCAP_bbkanba_Adapter)/' configure.in
sed -i -e 's/AC_CONFIG_SRCDIR.*/AC_CONFIG_SRCDIR([src\/bbkanba.h])/' configure.in
touch  ./NEWS
touch  ./AUTHORS
touch  ./ChangeLog
touch ./COPYING
autoreconf -ivf
./configure PKG_CONFIG_PATH=/usr/local/lib/pkgconfig
make
make install
```

如果上面运行`make`命令没有报错的话，说明你的编译环境，例子程序的框架修改没有问题. 下面我们就可以具体的编写插件代码了.  
上面引入两个debug的文件(源自eCAP ClamAV Adapter插件)，便于查看插件程序的执行过程，Debug信息会输出到squid的日志文件. 现在写自己的ecap插件，只需要编辑`adapter_bbkanba.cc`文件，之后运行`./configure && make && make install`. 默认情况下的安装路径为`/usr/local/lib`.  
写完插件，编译成功，并安装到相应目录下后，要让squid加载我们的插件，还需要修改squid的配置文件`squid.conf`，添加下面的内容:

<pre>
ecap_enable on
adaptation_send_client_ip on
loadable_modules /usr/local/lib/ecap_adapter_bbkanba.so
ecap_service bbkanbam reqmod_precache 0  ecap://bbkanba.com/bbkanba
adaptation_service_set reqFilter bbkanbam
adaptation_access reqFilter allow all
</pre>

每个配置选项squid的官网都有详细的解释，这里我就不多说了.大概意思就是让squid开启ecap插件，然后加载插件.并开启用户ip的功能，这样squid就会把用户的请求包与用户的ip送到ecaq插件来处理.  
注意，要想使上面的配置生效，需要在编译安装squid的时候，开启`--enable-ecap`选项.

现在运行`squid -NCXd 2`命令，调试squid是否加载了我们的插件.在经过一大串的输出后，应该会看到

<pre>LoadableModules.cc(14) LoadModule: Loaded Squid module from '/usr/local/lib/ecap_adapter_bbkanba.so'</pre>

说明我们的模块加载成功了，但是紧跟着的是错误信息:

<pre>ERROR: failed to start essential eCAP service: ecap://bbkanba.com/bbkanba:
Modifying Adapter: configuration error: victim value is not set
</pre>

导致squid启动不起来，为什么呢?让我们先来看看`adapter_bbkanba.cc`源文件.

ecap插件的源文件命名空间采用的是`namespace Adapter`. 主要有两个类`class Service: public libecap::adapter::Service`与`class Xaction: public libecap::adapter::Xaction`，即 Service 类与 Xaction 类.  
Service类代表的是一个ecap插件服务，上面我们在squid.conf配置文件里用ecap_service指令加载到squid程序里的，就是一个ecap服务.所以，继承自`libecap::adapter::Service`的Service类的主要功能可以看做是squid与ecap插件链接的一个沟通桥梁，把我们的插件与squid紧密结合在了一起.可以在ecap_service指令后，加入我们想要传送给插件的配置选项参数.  
默认的例子程序adapter\_modifying.cc，就需要采用victim和replacement参数，才可以加载成功.因为我们的程序源文件来源于adapter\_modifying.cc，因此在默认的情况下，要想让`ecap_adapter_bbkanba.so` 工作需要修改上面的ecap_service指令的值为下面才可以.

<pre>ecap_service bbkanbam reqmod_precache 0  ecap://bbkanba.com/bbkanba victim="test" replacement="bbkanba.com"</pre>

现在再次运行`squid -NCXd 2`命令，可以看到，squid不会再报错了.  
在我们假设的案例中，不需要在配置文件中向ecap插件传入配置选项，因为待会我们会修改源文件去掉检查是否有victim选项的代码.

在我们开始真正的编写插件代码之前，我们先引入一些需要的头文件，运行下面的命令.

``` bash
sed -i -e '/.*bbkanba.h.*/ a\#include "Debugger.h"\n#include <algorithm>' adapter_bbkanba.cc
```

自己手工处理一下Service类，使我们的开发框架变的干净整洁:  
删除`void setVictim(const std::string &value);`  
删除`void Adapter::Service::configure(const libecap::Options &cfg)`方法内的所有代码，使其变为空函数.  
删除`void Adapter::Service::reconfigure(const libecap::Options &cfg)`方法内的所有代码，使其变为空函数.  
删除`void setOne(const libecap::Name &name, const libecap::Area &valArea);`方法;  
删除`Cfgtor`类;

上面解释了Server类，现在解释一下Xaction类.Xaction类为真正干活的地方，所有插件的业务逻辑全部需要在这个类里完成.  
squid为每一个请求创建一个Server类对象，每一个Server类对象负责创建一个Xaction对象，Xaction对象负责处理业务逻辑.  
在Xaction类的`virtual void start();` 方法里开始业务逻辑的处理.

为了便于处理url的信息以及利用http请求查询api获取用户ip是否验证通过的结果，这里我利用<a target="_blank" href="http://www.boost.org/">boost</a>库和<a target="_blank" href="http://cpp-netlib.org/">cpp-netlib</a>库.首先让我们安装这两个库的最新版本.

``` bash
###install boost####
yum -y install icu libicu libicu-devel python python-devel
wget http://sourceforge.net/projects/boost/files/boost/1.53.0/boost_1_53_0.tar.gz/download
tar -zxf boost_1_53_0.tar.gz
cd  boost_1_53_0
./bootstrap.sh --prefix=/usr/local/boost_1_53_0
./b2 install
ln -s /usr/local/boost_1_53_0/lib/libboost_* /usr/local/lib/
ln -s /usr/local/boost_1_53_0/include/boost /usr/local/include/boost
echo "/usr/local/lib" > /etc/ld.so.conf.d/usrlocallib.conf
ldconfig
###install cpp-netlib-0.9.4####
wget http://dl.atrpms.net/el6-x86_64/atrpms/stable/atrpms-repo-6-6.el6.x86_64.rpm
rpm -Uvh atrpms-repo*rpm
yum -y --enablerepo=atrpms-testing install cmake
wget https://github.com/downloads/cpp-netlib/cpp-netlib/cpp-netlib-0.9.4.zip
unzip cpp-netlib-0.9.4.zip
cd cpp-netlib-0.9.4
sed -i -e '/if (Boost_FOUND)/ a\set (CMAKE_CXX_FLAGS "-lrt -fPIC")' CMakeLists.txt
mkdir cpp-netlib-build
cd cpp-netlib-build
cmake -DCMAKE_C_COMPILER=gcc -DCMAKE_CXX_COMPILER=g++ ..
make -j4
 
cp libs/network/src/*.a /usr/local/lib/
cd ..
cp -r boost/* /usr/local/include/boost/
ldconfig
```

**吐槽题外话，不想看的跳过.**  
这篇文章写到这里，已经写了有几天了.虽然中途因为工作，生活，还有懒惰心一度中断，但是这些原因都不是原因，最根本的原因是，我还得吐槽一下这个库，我当初在找http方面的库时候看到了cpp-netlib，觉得它很好用，可就是太臃肿了，为了用它我还的不得已引入boost，一路摸索的在公司高配服务器上安装编译调试，不是很费劲最后成了.感觉也没有那么复杂.但是但是，为了写这篇文章，我又的重新的在我的aliyun的低配置服务器上重新编译，编译问题到还是可以慢慢解决.但是我受不了的是cpp-netlib的编译速度之慢之慢之慢之慢之慢之慢之慢之慢之慢&#8230;..，我编译它用了超过8个小时，对，超过8个小时，超过8个小时，超过8个小时（重要的事情要说 3 遍），虽然这充分地表明我的机器配置有多低，但是我还要吐槽，这么个简单的库为啥要编译这么费劲，个老子里&#8230;，好，发泄完毕，继续之前贴出我机器的配置，以供瞻仰:

<pre>
#其实也没有那么糟糕了.还能用.
Intel(R) Xeon(R) CPU   E5645  @ 2.40GHz
Memory: 512M
Disk: 40G
</pre>

以下为在我的机器上编译cpp-netlib遇到的问题:

<pre>
问题一:g++: Internal error: Killed (program cc1plus)
解决: 经过多方查证，此错误的原因是，悲崔的内存不够导致的.怎么解决，只能通过增加swap分区办法了.
具体操作看这里.<a target="_blank" href="http://www.thegeekstuff.com/2010/08/how-to-add-swap-space/">how-to-add-swap-space</a>
</pre>

<pre>
问题二，编译插件成功，但是运行squid -NCXd 2命令后报错如下:
FATAL: dying from an unhandled exception: file not found
terminate called after throwing an instance of 'TextException'
  what():  file not found
Aborted
解决: 插件在编译连接的问题，重新安装boost库解决.
</pre>

**吐槽完毕，继续正文**

讲一下ecap插件开发的大概逻辑，然后贴出上面举出的案例的代码，这篇文章就这么落幕吧.  
squid的通过继承自`libecap::adapter::Service `类的子类，实现与ecap的通信，每过来一个请求就实例化一个Server类对象，然后Server对象通过自己的`virtual libecap::adapter::Xaction *makeXaction(libecap::host::Xaction *hostx);`方法，实例话一个继承自`libecap::adapter::Xaction`类的对象，利用该对象实现业务逻辑，具体的话，可以查看ecap的样板例子代码.  
说一下ecap插件开发中用到的数据结构类型.主要用到的以下几种:  
1. `libecap::Area` 类型，为灵活调整大小的空间，可以用来保存http请求头中的值.  
2. `libecap::Name` 类型，为全局唯一ID以及对应的字符串，可以用来保存http请求头中的头字符串.  
3. `libecap::Message` 类型，为squid转发过来的每个用户http请求的封装，其中包含用户请求的url，http头，和可能附带的其他数据(请求的话，post可能带有的数据，回应的话，就是回应的body信息了).  
4. `libecap::host::Xaction` 类型，每个用户请求的封装，包含`libecap::Message`.  
ok，主要用到的就这么多.要到达我们上面列出的案例要求，其实很简单，这里只在`void Adapter::Xaction::start() `里实现就可以了.  
这里我们假设，用户的认证登陆页面在本机的9090端口，任何未经过认证的，或者认证超时的用户，全部默认跳转到http://127.0.0.1:9090;  
查询用户是否可以访问网络的api接口是，http://127.0.0.1:9090/check.php?uip=x.x.x.x.  
查询结果如果为0，则表示用户没有经过认证，为1表示已经过期，为2表示正常放行.

下面为全部的代码，没有经过测试，不保证正确哦.

``` cpp
#include "bbkanba.h"
#include "Debugger.h"
#include <iostream>
#include <algorithm>
#include <libecap/common/registry.h>
#include <libecap/common/errors.h>
#include <libecap/common/message.h>
#include <libecap/common/header.h>
#include <libecap/common/names.h>
#include <libecap/common/named_values.h>
#include <libecap/host/host.h>
#include <libecap/adapter/service.h>
#include <libecap/adapter/xaction.h>
#include <libecap/host/xaction.h>
#include <boost/network/uri.hpp>
#include <boost/network/uri/uri_io.hpp>
#include <boost/network/protocol/http/client.hpp>
using namespace boost::network;
 
namespace Adapter { // not required, but adds clarity
using   libecap::size_type;
typedef libecap::RequestLine *CLRLP;
 
class Service: public libecap::adapter::Service {
    public:
        // About
        virtual std::string uri() const; // unique across all vendors
        virtual std::string tag() const; // changes with version and config
        virtual void describe(std::ostream &os) const; // free-format info
 
        // Configuration
        virtual void configure(const libecap::Options &cfg);
        virtual void reconfigure(const libecap::Options &cfg);
 
        // Lifecycle
        virtual void start(); // expect makeXaction() calls
        virtual void stop(); // no more makeXaction() calls until start()
        virtual void retire(); // no more makeXaction() calls
 
        // Scope (XXX: this may be changed to look at the whole header)
        virtual bool wantsUrl(const char *url) const;
 
        // Work
        virtual libecap::adapter::Xaction *makeXaction(libecap::host::Xaction *hostx);
};
 
class Xaction: public libecap::adapter::Xaction {
    public:
        Xaction(libecap::shared_ptr<Service> s, libecap::host::Xaction *x);
        virtual ~Xaction();
 
        // meta-information for the host transaction
        virtual const libecap::Area option(const libecap::Name &name) const;
        virtual void visitEachOption(libecap::NamedValueVisitor &visitor) const;
 
        // lifecycle
        virtual void start();
        virtual void stop();
 
        // adapted body transmission control
        virtual void abDiscard();
        virtual void abMake();
        virtual void abMakeMore();
        virtual void abStopMaking();
 
        // adapted body content extraction and consumption
        virtual libecap::Area abContent(size_type offset, size_type size);
        virtual void abContentShift(size_type size);
 
        // virgin body state notification
        virtual void noteVbContentDone(bool atEnd);
        virtual void noteVbContentAvailable();
 
        // libecap::Callable API, via libecap::host::Xaction
        virtual bool callable() const;
 
    protected:
        void stopVb(); // stops receiving vb (if we are receiving it)
 
        void getUri(libecap::shared_ptr<libecap::Message> &);
        void goToUrl( std::string orgUrl,std::string host,std::string state);
        void debugAction(const std::string &action,const bool &showOrgUrl=true);
        libecap::host::Xaction *lastHostCall(); // clears hostx
 
    private:
        CLRLP requestLine;
        libecap::Area uri; // Request-URI from headers, for logging
        libecap::shared_ptr<const Service> service; // configuration access
        libecap::host::Xaction *hostx; // Host transaction rep
 
        typedef enum { opUndecided, opOn, opComplete, opNever } OperationState;
        typedef enum { localWebServer, normal } OprationAdaptedState;
        OperationState receivingVb;
        OperationState sendingAb;
        OprationAdaptedState adaptedGotoAction;
};
 
static const std::string CfgErrorPrefix =
    "eBBkanba Adapter: configuration error: ";
 
} // namespace Adapter
 
std::string Adapter::Service::uri() const {
    return "ecap://bbkanba.com/bbkanba";
}
 
std::string Adapter::Service::tag() const {
    return PACKAGE_VERSION;
}
 
void Adapter::Service::describe(std::ostream &os) const {
    os << "A eBBkanba adapter from " << PACKAGE_NAME << " v" << PACKAGE_VERSION;
}
 
void Adapter::Service::configure(const libecap::Options &cfg) {
}
 
void Adapter::Service::reconfigure(const libecap::Options &cfg) {
}
void Adapter::Service::start() {
    libecap::adapter::Service::start();
}
 
void Adapter::Service::stop() {
    libecap::adapter::Service::stop();
}
 
void Adapter::Service::retire() {
    libecap::adapter::Service::stop();
}
 
bool Adapter::Service::wantsUrl(const char *url) const {
    return true; // no-op is applied to all messages
}
 
libecap::adapter::Xaction *Adapter::Service::makeXaction(libecap::host::Xaction *hostx) {
    return new Adapter::Xaction(std::tr1::static_pointer_cast<Service>(self),hostx);
}
 
Adapter::Xaction::Xaction(libecap::shared_ptr<Service> aService,libecap::host::Xaction *x):
    service(aService),
    hostx(x),
    receivingVb(opUndecided),
    sendingAb(opUndecided),
    adaptedGotoAction(normal){
}
 
Adapter::Xaction::~Xaction() {
    if (libecap::host::Xaction *x = hostx) {
        hostx = 0;
        requestLine = 0;
        x->adaptationAborted();
    }
}
 
const libecap::Area Adapter::Xaction::option(const libecap::Name &) const {
    return libecap::Area(); // this transaction has no meta-information
}
 
void Adapter::Xaction::visitEachOption(libecap::NamedValueVisitor &) const {
    // this transaction has no meta-information to pass to the visitor
}
 
void Adapter::Xaction::start() {
    Must(hostx);
 
    //static int scannerCount = 0;
    //++scannerCount;
    //Debugger(ilNormal|flApplication) << "eBBkanba: " << "Initializing eBBkanba engine #" << scannerCount << ".";
 
    //查看请求是否包含http头以外的数据
    if (hostx->virgin().body()) {
        receivingVb = opOn;
        hostx->vbMake(); // ask host to supply virgin body
    } else {
        // we are not interested in vb if there is not one
        receivingVb = opNever;
    }
 
    //获取用户ip
    libecap::Header::Value clientIP = hostx->option(libecap::metaClientIp);
 
    /* adapt message header ,copy一份http请求的纯原始副本,然后下面可能会修改内容*/
    libecap::shared_ptr<libecap::Message> adapted = hostx->virgin().clone();
    Must(adapted != 0);
    // delete ContentLength header because we may change the length
    // unknown length may have performance implications for the host
    //获取用户请求的url
    getUri(adapted);
 
    if (uri.size > 0) {
        //adapted->header().removeAny(libecap::headerContentLength);
        uri::uri url_path(uri.toString());
        std::string url_path_tolower = url_path.host();
        std::transform(url_path_tolower.begin(), url_path_tolower.end(),url_path_tolower.begin(), ::tolower);
        if (url_path_tolower != "127.0.0.1") {
            http::client::response response = http::client().get(http::request("http://127.0.0.1:9090/check.php?uip="+clientIP.toString()));
            std::string check = static_cast<std::string>(body(response));
            if ( check == "0" ){
                //则表示用户没有经过认证
                goToUrl(uri.toString(),"http://127.0.0.1:9090","0");
            }
            if( check == "1" ){
                //表示已经过期
                goToUrl(uri.toString(),"http://127.0.0.1:9090","1");
            }
        }
    }
 
    // 最后返回我们修改过的用户请求
    if (!adapted->body()) {
        sendingAb = opNever; // there is nothing to send
        lastHostCall()->useAdapted(adapted);
    } else {
        hostx->useAdapted(adapted);
    }
}
 
void Adapter::Xaction::stop() {
    hostx = 0;
    requestLine = 0;
}
 
void Adapter::Xaction::abDiscard()
{
    Must(sendingAb == opUndecided); // have not started yet
    sendingAb = opNever;
    // we do not need more vb if the host is not interested in ab
    stopVb();
}
 
void Adapter::Xaction::abMake()
{
    Must(sendingAb == opUndecided); // have not yet started or decided not to send
    Must(hostx->virgin().body()); // that is our only source of ab content
 
    // we are or were receiving vb
    Must(receivingVb == opOn || receivingVb == opComplete);
     
    sendingAb = opOn;
    hostx->noteAbContentAvailable();
}
 
void Adapter::Xaction::abMakeMore()
{
    Must(receivingVb == opOn); // a precondition for receiving more vb
    hostx->vbMakeMore();
}
 
void Adapter::Xaction::abStopMaking()
{
    sendingAb = opComplete;
    // we do not need more vb if the host is not interested in more ab
    stopVb();
}
 
libecap::Area Adapter::Xaction::abContent(size_type offset, size_type size) {
    Must(sendingAb == opOn || sendingAb == opComplete);
    return hostx->vbContent(offset, size);
}
 
void Adapter::Xaction::abContentShift(size_type size) {
    Must(sendingAb == opOn || sendingAb == opComplete);
    hostx->vbContentShift(size);
}
 
void Adapter::Xaction::noteVbContentDone(bool atEnd)
{
    Must(receivingVb == opOn);
    receivingVb = opComplete;
    if (sendingAb == opOn) {
        hostx->noteAbContentDone(atEnd);
        sendingAb = opComplete;
    }
}
 
void Adapter::Xaction::noteVbContentAvailable()
{
    Must(receivingVb == opOn);
    if (sendingAb == opOn)
        hostx->noteAbContentAvailable();
}
 
bool Adapter::Xaction::callable() const {
    return hostx != 0; // no point to call us if we are done
}
 
// tells the host that we are not interested in [more] vb
// if the host does not know that already
void Adapter::Xaction::stopVb() {
    if (receivingVb == opOn) {
        hostx->vbStopMaking();
        receivingVb = opComplete;
    } else {
        // we already got the entire body or refused it earlier
        Must(receivingVb != opUndecided);
    }
}
//重新定位请求地址,到用户认证页面,并把用户请求url作为参数传入
void Adapter::Xaction::goToUrl(std::string orgUrl,std::string new_host, std::string state)
{
    std::string new_url_path = new_host + "/?state=" + state + "&orgUrl=" + orgUrl;
    const libecap::Header::Value new_url_path_r = libecap::Area::FromTempString(new_url_path);
    debugAction("new URL: " + new_url_path);
    requestLine->uri(new_url_path_r);
}
void Adapter::Xaction::getUri(libecap::shared_ptr<libecap::Message> &adapted)
{
    if (!hostx)
        return;
    if ( (requestLine = dynamic_cast<CLRLP>(&adapted->firstLine())) )
        uri = requestLine->uri();
}
 
void Adapter::Xaction::debugAction(const std::string &actDescript,const bool &showOrgUrl)
{
    std::string descipt (actDescript);
    if(showOrgUrl)
        descipt += " ( org URL: " + uri.toString() + " )";
    Debugger(ilNormal|flApplication) << "eBBkanba: " << descipt ;
}
 
// this method is used to make the last call to hostx transaction
// last call may delete adapter transaction if the host no longer needs it
// TODO: replace with hostx-independent "done" method
libecap::host::Xaction *Adapter::Xaction::lastHostCall() {
    libecap::host::Xaction *x = hostx;
    Must(x);
    hostx = 0;
    requestLine = 0;
    return x;
}
 
// create the adapter and register with libecap to reach the host application
static const bool Registered = (libecap::RegisterService(new Adapter::Service), true);
```
可以下载我写的上面的例子文件[eCAP_bbkanba_Adapter-0.0.1.tar.gz](/downloads/files/eCAP_bbkanba_Adapter-0.0.1.tar.gz)

