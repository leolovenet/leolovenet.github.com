---
title: Xcode打包app命令-PackageApplication
author: leolovenet
layout: post
comments: true
categories:
  - IOS
  - Xcode
tags:
  - IOS
  - Xcode
---
xcode提供有这样一个perl脚本工具,可以打包一个app为ipa文件，为上传app store做准备. 路径是

<pre>
`xcode-select -print-path`/Platforms/iPhoneOS.platform/Developer/usr/bin/PackageApplication
</pre>

添加`-help`参数查看**PackageApplication**用法帮助，或者添加`-man`参数查看完整的帮助信息。

<pre>
`xcode-select -print-path`/Platforms/iPhoneOS.platform/Developer/usr/bin/PackageApplication -help
Usage:
    PackageApplication [-s signature] application [-o output_directory]
    [-verbose] [-plugin plugin] || -man || -help

    Options:

        -s   certificate name to resign application before packaging
        -o              specify output filename
        -plugin         specify an optional plugin
        -help           brief help message
        -man            full documentation
        -v[erbose]      provide details during operation
</pre>

[More Useful](http://leolovenet.com/blog/2013/02/22/xcode-package-application-to-ipa/)