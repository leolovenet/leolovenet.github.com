---
title: 'xcode编译的app程序打包为ipa文件'
author: leolovenet
layout: post
comments: true
categories:
  - APP
  - IOS
  - Xcode
tags:
  - APP
  - IOS
  - Xcode
description: "将xcode编译的app程序打包ipa文件"
---

正确的方法是利用Xcode,The right way is –>”Xcode menu” –> Project –> Archive –> “Xcode menu Window” –> “Organizer” –> ” Organizer – Archives” –> Distribute –>”Save for Enterpirs of Ad-Hoc Deployment” –> next –> ***.ipa –> done.
<!-- more -->

<del datetime="2013-03-09T14:05:58+00:00">新年回来以后的第一篇文章。</del>

<del datetime="2013-03-09T14:14:19+00:00">项目需要将测试版本的app发到外地客户的iphone上测试效果,这时就需要客户手机的UDID，将他的手机UDID添加到开发团队里，创建新的签名，使用新的签名编译程序导出ipa文件，将ipa文件传输给远在外地的客户,让客户通过itunes安装上。</del>

<del datetime="2013-03-09T14:14:19+00:00">这样相比开发,测试,上传到app store里,等待apple审核通过,客户在安装测试,要省不知多少时间（当然客户的手机如果越狱了那就没有必要这么麻烦了）. 下面我就具体说一下上面的操作过程,主要是将xcode编译的app变为ipa文件的过程.</del>

<del datetime="2013-03-09T14:14:19+00:00">1、登陆<a href="https://developer.apple.com/ios/manage/overview/index.action" target="_blank">iOS Provisioning Portal</a>，登入新的手机UDID,创建新的签名文件.</del>

<del datetime="2013-03-09T14:14:19+00:00">2、xcode打开Organizer(⌘+shift+2), Devices标签下,左边Provisioning Profiles标签下，点击下面的Refresh,将新创建的签名下载下来。</del>

<del datetime="2013-03-09T14:14:19+00:00">3、在项目的targets下指定用新的签名.</del>

<del datetime="2013-03-09T14:14:19+00:00">4、编译好的app，右击在Finder下显示.(如果显示不了,打开Finder,⌘+shift+G,输入~/Library/Developer/Xcode/DerivedData,找到XXX-*****/Build/Products/***/XXX.app).</del>

<del datetime="2013-03-09T14:14:19+00:00">5、打开iTunes,切换置App标签，将XXX.app鼠标拖放置iTunes的App标签内.</del>

<del datetime="2013-03-09T14:14:19+00:00">6、在iTunes的XXX.app上,右击,选择&#8221;Show in finder&#8221;。现在你就有了你的ipa文件了。</del>

<del datetime="2013-03-09T14:14:19+00:00">因为这个ipa已经是用最新的签名编译好了的，所以，它可以直接在客户的机器上安装。</del>

<del datetime="2013-03-09T14:14:19+00:00">传输给客户后，让客户双击ipa文件，默认自动导入到客户的iTunes的app标签下，让客户使用数据线链接自己的iphone，然后在itunes里选中iphone，切换到iphone的app标签下，找到XXX,此时在右边会有一个安装的按钮，点击，然后点击下面的应用，之后点击同步就可以了。</del>