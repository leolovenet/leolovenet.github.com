---
layout: post
title: "Hi Octopress"
date: 2014-02-13 17:16:08 +0800
comments: true
categories: 
 - Octopress
tags: 
 - Octopress
---

完成了 Blog 由 Wordpress 转向 Octopress 的迁移
我的 Blog 的迁移轨迹是 [CSDN](http://blog.csdn.net/apoxlo) --> [Wordpress](http://blog.bbkanba.com) --> Octepress
由于 CSDN 上面没有什么有用的文章我就没有迁移过来， Wordpress 的代码共享功能没有 Octepress 好用， 所以最终选择了 Octepress。

Github Pages 对用户使用 master 分支作为 `http://username.github.io` 网站的公共目录。因此，你需要在 source 分支上对你的 blog 源代码编辑，然后 commit 生成的内容到 master 分支上。

<!--more-->

##创建并部署一篇新博文的完整过程：

``` bash
rake new_post["New Post”]
rake generate
git add .
git commit -am "Some comment here.” 
git push origin source
rake deploy
```

##How to Update Octopress

``` bash
git pull octopress master     # Get the latest Octopress
bundle install                # Keep gems updated
rake update_source            # update the template's source
rake update_style             # update the template's style
```


