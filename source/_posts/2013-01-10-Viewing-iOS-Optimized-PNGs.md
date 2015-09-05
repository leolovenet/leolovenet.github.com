---
title: 查看app里被Xcode优化了的png图片
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
问题:当我们构建自己的ios app时，Xcode会优化压缩我们的程序里的png图片，如果想再次查看正常图片的话，需要反压缩，怎么做呢？  
答案：用Xcode自带的工具。  

**Q: When I build my iOS application, Xcode optimizes the PNG files within my application’s bundle, meaning that Preview can’t display them. How can I view these optimized files?**

A: This optimization is done by the **pngcrush** tool, which you can find inside Xcode. The **pngcrush** tool supports a command line option, `-revert-iphone-optimizations`, that undoes the optimizations done during the Xcode build process. So, to view an optimized PNG file, you should first undo the optimization and then open it with Preview.

Listing 1 shows how you can use the **pngcrush** tool to convert an iOS-optimized PNG file (`Local.png`) to a standard PNG file (`Local-standard.png`).

**Listing 1:** Undoing iOS PNG optimization

``` bash 
$ /Applications/Xcode.app/Contents/Developer\
/Platforms/iPhoneOS.platform/Developer/usr/bin/pngcrush \
-revert-iphone-optimizations -q Local.png Local-standard.png
```

If you have Xcode installed in a non-standard place, you can locate the tool using **xcode-select**, as shown in Listing 2.

**Listing 2:** Using **xcode-select** to locate pngcrush

``` bash 
$ "`xcode-select -print-path`"\
/Platforms/iPhoneOS.platform/Developer/usr/bin/pngcrush \
-revert-iphone-optimizations -q Local.png Local-standard.png
```