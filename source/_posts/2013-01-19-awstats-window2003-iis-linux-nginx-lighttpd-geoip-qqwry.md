---
title:  Config Awstats on Window2003 or Linux with GeoIP/QQWry
author: leolovenet
layout: post
comments: true
categories:
  - Awstats
  - IIS
  - Lighttpd
  - Linux
  - Nginx
  - Windows
  - QQWry
tags:
  - Awstats
  - IIS
  - Lighttpd
  - Linux
  - Nginx
  - Windows
  - QQWry
sidebar: collapse 
---
![awstats.png](/downloads/images/awstats.png "awstats example")

Awstats是一个日志分析工具(web log分析为强),很好很强大,不多解释,感兴趣的wiki一下。这是一个安装教程文章.

首先是awstas在windows 2003下与iis6的配置过程,然后是在Linux下和Nginx一起的配置，紧跟着Linux下与Lighttpd一起配置的过程,总之,这个可能是目前市面上最仔细全面安装awstas的教程了.
<!--more-->
  
Awstas官方网站de下载地址[点击这里](http://awstats.sourceforge.net/#DOWNLOAD).  
目前为止最新版本是7.1 释放时间是 **2012-12-20 18:32**

本文将会安装awstas的插件与启用的功能如下列表:
<pre>
GeoIP		显示IP属于那个国家
GeoLiteCity	显示IP属于那个城市
hostinfo	可以查询IP的Whois信息
qqhostinfo	显示IP纯真版数据库de信息
decodeutfkeys	解决"用以搜索的关键词"乱码
timezone	解决windows平台下的日志时间差8小时问题
day-by-day	可以根据日期(以天为单位)查看日志的js
tooltips	显示一些详细的提示信息
AllowToUpdateStatsFromBrowser 允许通过浏览器执行更新,显示最新的日志分析结果
</pre>

## 1. Install Awstats with IIS6 under windowns 2003

用Windows做服务器真心难用,所以安装配置起来最麻烦.  
在windows平台下载Zip版本的[7.1稳定发行包](http://prdownloads.sourceforge.net/awstats/awstats-7.1.zip)

Awstas是用perl（一个夸平台脚本语言）写成的, 所以要在windows平台下工作的话,必须先安装搭建Perl语言环境. 在windows平台下, 我们需要安装ActivePerl的免费版本.  
ActivePerl官方网站de下载地址[点击这里](http://www.activestate.com/activeperl),截止今天,最新版本是 **5.16.2.1602** ,在官方下载页面根据自己的操作系统选择下载64位还是32位的安装包.

安装过程直接点击下一步下一步就可以了.没有什么要特别要特别注意的,只是在选择安装路径的时候,如果不能默认的`c:\Perl`的话,就放到其他盘符里吧,类似`D:\Perl`,不要安装在乱七八糟的路径下,避免不必要的错误.验证安装是否完成的的办法,我认为最好的是注销一下当前用户,再登陆进来,然后点击`开始 >> 运行 >> cmd`,然后输入命令`perl -v`,看看反应,如果能正常打印perl的版本号的话,就说明安装的没有问题,反之,就不用再往下看了,因为必须解决这个问题才可以往下进行.

一般安装包会自动整合Perl的功能到IIS6中去,但如果你发现它没有做到的话,也不用着急,手动添加一下就好了,很容易,检查方法,打开 `"Internet 信息服务(IIS)管理器" – "Web服务扩展" – 查看右面"web 服务器扩展"` 列表里有没有Perl的字样.如果没有的话,就点击`添加一个新的web服务扩展`,如图1-1,填写扩展名(当然你也可以自己随便定义扩展名,只要你喜欢),然后点击添加按钮,然后根据你的Perl安装路径填写,比如,`c:\Perl\bin\perl.exe "%s" %s`,这里我的Perl安装路径是默认的`c:\Perl`, 如果你的不同,请做相应修改,点击确定完成. 这样你就可以通过浏览器查看perl在iis上的执行结果了,这是进行下面步骤的基础.

图1-1 
![awstats.1-1.png](/downloads/images/awstats.1-1.png) 

因为IIS6的默认日志格式很奇特,所以想要用awstas分析的话,需要修改一下默认的日志的格式.具体步骤,打开 "Internet 信息服务(IIS)管理器" ,在网站列表中找到你想要分析日志的网站,右击选择属性,在网站标签下,确保 "启用日志记录" 被勾选着,然后点击右边的属性按钮,确保日志计划是 "每天", 勾选 "文件命名和创建使用当地时间", 并记住 "日志文件路径" 待会我们会进到这个目录里(如图1-2).

图1-2  
![awstats.1-2.png](/downloads/images/awstats.1-2.png) 

然后点击高级标签(如图1-3).关键时刻来临了,兴奋起来吧!这里你真的不能出错,一定要再三检查你勾选的选项,不然很容易出错,还不容易发现.

图1-3
![awstats.1-3.png](/downloads/images/awstats.1-3.png)   

请确保有且仅有以下几项是选中状态,不能多也不能少.

<pre>
date
time
c-ip
cs-username
cs-method
cs-uri-stem
sc-status
sc-bytes
cs-version
cs(User-Agent)
cs(Referer)
</pre>

然后点击确定,保存配置,再然后关掉网站,打开我的电脑,进入到上面说的 "日志文件路径" 中去,删除所有现有的日志,重新开始网站.

下面建立两个目录(当然你也可以建立在其他盘符,不过要记得修改以下所有步骤的路径):

<pre>
#用于存放awstats的程序文件
C:\LogAnalyse\awstats
#用于存放awstats程序分析log之后的结果数据文件
C:\LogAnalyse\awstats_data_dir
</pre>

<span style="color: #d14;">右击awstats_data_dir目录选择属性,安全,添加Everyone的完全控制权限,不然无法从浏览器端更新.</span>

将下载下来的zip包解压,并把`wwwroot`目录下的所有内容放到`C:\LogAnalyse\awstats`下.  
进入到`C:\LogAnalyse\awstats\cgi-bin`目录下,新建一个叫`awstats.logWin.conf`的文件(必须叫这个名字,没得商量,待会要用的),然后输入下面的内容,注意修改`SiteDomain<code>与`LogFile</code>选项值.  
如果你想知道具体每个选项的意思[点击这里查看官网说明](http://awstats.sourceforge.net/docs/awstats_config.html)

``` bash
# AWSTATS CONFIGURE FILE
#需要分析的日志路径,注意替成 C:/WINDOWS/system32/LogFiles/W3SVC952692957  为图1-2中你的网站日志路径
LogFile="C:/WINDOWS/system32/LogFiles/W3SVC952692957/ex%YY-0%MM-0%DD-0.log"
LogType=W
#这个很重要,因为IIS6的日志不标准,木有办法啦
LogFormat="date time cs-method cs-uri-stem cs-username c-ip cs-version cs(User-Agent) cs(Referer) sc-status sc-bytes"
LogSeparator=" "
#就是说明一下你给那个站点做的分析,分析结果页面左上角显示
SiteDomain="blog.bbkanba.com"
HostAliases="localhost 127.0.0.1"
DNSLookup=0
#看上面,不解释
DirData="C:/LogAnalyse/awstats_data_dir/"
DirCgi="/cgi-bin"
DirIcons="/icon"
AllowToUpdateStatsFromBrowser=1
AllowFullYearView=2
#同一时间只能有一个update运行
EnableLockForUpdate=1
DNSStaticCacheFile="dnscache.txt"
DNSLastUpdateCacheFile="dnscachelastupdate.txt"
SkipDNSLookupFor=""
AllowAccessFromWebToAuthenticatedUsersOnly=0
AllowAccessFromWebToFollowingAuthenticatedUsers=""
AllowAccessFromWebToFollowingIPAddresses=""
CreateDirDataIfNotExists=0
BuildHistoryFormat=text
BuildReportFormat=html
SaveDatabaseFilesWithPermissionsForEveryone=0
PurgeLogFile=0
ArchiveLogRecords=0
KeepBackupOfHistoricFiles=0
DefaultFile="index.php index.html"
#这里可以指定那些地址不纳入分析结果,比如私网地址的访客
SkipHosts="" 
SkipUserAgents=""
SkipFiles=""
SkipReferrersBlackList=""
OnlyHosts=""
OnlyUserAgents=""
OnlyUsers=""
OnlyFiles=""
NotPageList="css js class gif jpg jpeg png bmp ico rss xml swf"
ValidHTTPCodes="200 304"
ValidSMTPCodes="1 250"
AuthenticatedUsersNotCaseSensitive=0
URLNotCaseSensitive=0
URLWithAnchor=0
URLQuerySeparators="?;"
URLWithQuery=0
URLWithQueryWithOnlyFollowingParameters=""
URLWithQueryWithoutFollowingParameters=""
URLReferrerWithQuery=0
WarningMessages=1
ErrorMessages=""
DebugMessages=0
NbOfLinesForCorruptedLog=50
WrapperScript=""
DecodeUA=0
MiscTrackerUrl="/js/awstats_misc_tracker.js"
LevelForBrowsersDetection=2
LevelForOSDetection=2
LevelForRefererAnalyze=2
LevelForRobotsDetection=2
LevelForSearchEnginesDetection=2
LevelForKeywordsDetection=2
LevelForFileTypesDetection=2
LevelForWormsDetection=0
UseFramesWhenCGI=1
DetailedReportsOnNewWindows=1
#分析结果页面的缓存时间,默认不缓存,这样你就可以手工通过浏览器更新,时时查看最新数据了
Expires=0
MaxRowsInHTMLOutput=1000
#Lang默认是auto,根据浏览器设置现实页面语言,这里强制为汉语了
Lang="cn"
DirLang="./lang"
ShowMenu=1					
ShowSummary=UVPHB
ShowMonthStats=UVPHB
ShowDaysOfMonthStats=VPHB
ShowDaysOfWeekStats=PHB
ShowHoursStats=PHB
ShowDomainsStats=PHB
ShowHostsStats=PHBL
ShowAuthenticatedUsers=0
ShowRobotsStats=HBL
ShowWormsStats=0
ShowEMailSenders=0
ShowEMailReceivers=0
ShowSessionsStats=1
ShowPagesStats=PBEX
ShowFileTypesStats=HB
ShowFileSizesStats=0	
ShowDownloadsStats=HB	
ShowOSStats=1
ShowBrowsersStats=1
ShowScreenSizeStats=0
ShowOriginStats=PH
ShowKeyphrasesStats=1
ShowKeywordsStats=1
ShowMiscStats=a
ShowHTTPErrorsStats=1
ShowSMTPErrorsStats=0
ShowClusterStats=0
AddDataArrayMonthStats=1
AddDataArrayShowDaysOfMonthStats=1
AddDataArrayShowDaysOfWeekStats=1
AddDataArrayShowHoursStats=1
IncludeInternalLinksInOriginSection=0
MaxNbOfDomain = 10
MinHitDomain  = 1
MaxNbOfHostsShown = 10
MinHitHost    = 1
MaxNbOfLoginShown = 10
MinHitLogin   = 1
MaxNbOfRobotShown = 10
MinHitRobot   = 1
MaxNbOfDownloadsShown = 10
MinHitDownloads = 1
MaxNbOfPageShown = 10
MinHitFile    = 1
MaxNbOfOsShown = 10
MinHitOs      = 1
MaxNbOfBrowsersShown = 10
MinHitBrowser = 1
MaxNbOfScreenSizesShown = 5
MinHitScreenSize = 1
MaxNbOfWindowSizesShown = 5
MinHitWindowSize = 1
MaxNbOfRefererShown = 10
MinHitRefer   = 1
MaxNbOfKeyphrasesShown = 10
MinHitKeyphrase = 1
MaxNbOfKeywordsShown = 10
MinHitKeyword = 1
MaxNbOfEMailsShown = 20
MinHitEMail   = 1
FirstDayOfWeek=1
ShowFlagLinks=""
ShowLinksOnUrl=1
UseHTTPSLinkForUrl=""
MaxLengthOfShownURL=64
HTMLHeadSection=""
HTMLEndSection=""
MetaRobot=0
Logo="awstats_logo6.png"
LogoLink="http://www.awstats.org"
BarWidth   = 260
BarHeight  = 90
StyleSheet=""
color_Background="FFFFFF"	
color_TableBGTitle="CCCCDD"	
color_TableTitle="000000"	
color_TableBG="CCCCDD"		
color_TableRowTitle="FFFFFF"	
color_TableBGRowTitle="ECECEC"	
color_TableBorder="ECECEC"	
color_text="000000"		
color_textpercent="606060"	
color_titletext="000000"
color_weekend="EAEAEA"
color_link="0011BB"
color_hover="605040"
color_u="FFAA66"
color_v="F4F090"
color_p="4477DD"
color_h="66DDEE"
color_k="2EA495"
color_s="8888DD"
color_e="CEC2E8"
color_x="C1B2E2"
ExtraTrackedRowsLimit=500

#以下是启用的插件们
HTMLHeadSection="&lt;script language=javascript src='/js/day-by-day-head.js'&gt;&lt;/script&gt;"
HTMLEndSection="&lt;script language=javascript src='/js/day-by-day-end.js'&gt;&lt;/script&gt;"
LoadPlugin="geoip GEOIP_STANDARD C:/LogAnalyse/awstats/cgi-bin/plugins/GeoIP.dat"
LoadPlugin="geoip_city_maxmind GEOIP_STANDARD C:/LogAnalyse/awstats/cgi-bin/plugins/GeoLiteCity.dat"
LoadPlugin="hostinfo"
LoadPlugin="qqhostinfo"
LoadPlugin="decodeutfkeys"
LoadPlugin="timezone +8"
LoadPlugin="tooltips"
```


点击开始-运行-cmd,输入以下命令,安装所需要的软件包.

<pre>
 ppm install Geo::IP::PurePerl
 ppm install Geography::Countries
 ppm install IP::Country 
 ppm install Geo-IPfree 
 ppm install Net-Xwhois
</pre>

下载[GeoIP.dat](http://www.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz)和[GeoLiteCity.dat](http://www.maxmind.com/download/geoip/database/GeoLiteCity.dat.gz),解压缩以后,放入`C:\LogAnalyse\awstats\cgi-bin\plugins`目录.
下载[qqhostinfo.pm](/downloads/code/qqhostinfo.pm)和[qqwry.pl](/downloads/code/qqwry.pl)和[QQWry.Dat](http://www.cz88.net/)到`C:\LogAnalyse\awstats\cgi-bin\plugins`目录下.

<span style="color: #d14;">然后选中这5个文件,右击选择属性,安全,添加Everyone的读取权限(如图1-4)</span>

图1-4

![awstats.1-4.png](/downloads/images/awstats.1-4.png) 

下载[day-by-day-head.js](/downloads/code/day-by-day-head.js)和[day-by-day-end.js](/downloads/code/day-by-day-end.js)到`C:\LogAnalyse\awstats\js`目录下.

在C:\LogAnalyse\awstats\_data\_dir目录下新建一个`crontab.bat`文件.输入下面的内容

<pre>
perl %cd%/../awstats/cgi-bin/awstats.pl -update -config=logWin  -lang=cn  -databasebreak=day
</pre>

解释一下,这个bat文件是要设立计划任务时用的,比如每隔30分钟自动更新下分析数据.


* %cd%/../awstats/cgi-bin/awstats.pl文件是awstats执行分析的主程序perl脚本(%cd%当前目录)
* -update 表示更新
* -config=logWin 知道为什么上面的文件为什么必须叫awstats.logWin.conf了吧, awstats.pl会掐头去尾留中间的找配置文件,如果你上面的文件不叫awstats.logWin.conf,而是awstats.bbkanba.conf的话,这里也需要改成-config=bbkanba
* -lang=cn 告诉awstats.pl生成中文页面,你喜欢其他语言可以去C:/LogAnalyse/awstats/cgi-bin/lang目录下瞅瞅,看看这个参数的值可以是什么.
* -databasebreak=day 这个重要哦, awstas默认是以月为单位分析展示数据的,而这里的我们安装了day-by-day插件, 就要求它以天为单位展示.


保存好以后,点击开始-运行-cmd,直接用鼠标将`crontab.bat`文件拖放到黑窗口里,然后回车,你会看到类似图1-5的效果,说明成功配置好了,反之,根据错误提示自己排查吧.原因无非权限呀,路径呀,依赖的perl库啊之类的.

图1-5

![awstats.1-5.png](/downloads/images/awstats.1-5.png)  

然后在控制面板,计划任务,添加计划任务,达到如图1-6的样子就可以了,不然就是你配错了.

图1-6  
![awstats.1-6.png](/downloads/images/awstats.1-6.png)

到此,我们已经配置好了awstas的工作环境,下面新建立一个网站来展示数据吧.

打开 "Internet 信息服务(IIS)管理器" –> "网站" 右击 –> "新建网站" –> 新建网站向导,下一步 –> 描述 "log.bbkanba.com",下一步 –> 全部未分配,80,主机头:log.bbkanba.com –> 主目录路径C:\LogAnalyse\awstats –> 最后一定要勾上 "执行(如ISAPI 应用程序或 CGI)" –> 下一步完成.

还需要一个perl脚本重定向,创建到C:\LogAnalyse\awstats\index.pl下面,这样每次打开`http://log.bbkanba.com`就可以看到最新的统计数据了(还的改一下网站的设置，添加index.pl到默认内容文档里,网站属性-文档-默认内容文档).

``` perl
#!/usr/bin/perl
use POSIX qw(strftime);
print strftime "Location: http://log.bbkanba.com/cgi-bin/awstats.pl?config=log&databasebreak=day&day=%d&month=%m&year=%Y\n\n" ,localtime;
```

congratulation you are finished! celebrate吧.
windows的到这里打完,收工,我去煮个泡面,待会继续Linux下的.

## 2. Install Awstats with Lighttpd under Linux(CentOS)

到了，我最爱的Linux服务器环境安装就变的容易多了.  
首先通过yum安装perl的依赖包,然后下载安装awstats的rpm安装包,然后安装所需要的插件,创建配置文件,创建计划任务,就ok了.全部命令如下.  
配置文件同上面window2003下的基本一样，只是变更了一下路径.这里我们分析`/var/log/lighttpd/access.log`这个日志文件.配置文件的意思看上面.

``` bash
#需要从http://packages.sw.be/rpmforge-release/ 选择自己平台的rpm包安装,这里我的系统是CentOS6 x86_64,你要根据自己的平台选择,下面是wiki地址
##http://wiki.centos.org/AdditionalResources/Repositories/RPMForge
 
wget http://packages.sw.be/rpmforge-release/rpmforge-release-0.5.2-2.el6.rf.x86_64.rpm
rpm -Uvh rpmforge-release*rpm
 
yum -y install perl  perl-CPAN perl-Compress-Raw-Zlib  perl-Compress-Zlib  perl-GSSAPI  perl-HTML-Parser  perl-HTML-Tagset  perl-IO-Compress-Base perl-IO-Compress-Zlib  perl-URI  perl-libwww-perl gzip perl-Geo-IP perl-Net-XWhois perl-FCGI perl-FCGI-ProcManager
 
wget http://prdownloads.sourceforge.net/awstats/awstats-7.1-1.noarch.rpm
rpm -ivh awstats-7.1-1.noarch.rpm
rm -rf awstats-7.1-1.noarch.rpm
 
cd  /usr/local/awstats/wwwroot/cgi-bin/plugins/
wget http://www.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz
wget http://www.maxmind.com/download/geoip/database/GeoLiteCity.dat.gz
gunzip GeoIP.dat.gz GeoLiteCity.dat.gz
 
wget http://leolovenet.com/downloads/code/qqhostinfo.pm
wget http://leolovenet.com/downloads/code/qqwry.pl
wget http://leolovenet.com/downloads/code/QQWry.Dat
cd /usr/local/awstats/wwwroot/js/
wget http://leolovenet.com/downloads/code/day-by-day-head.js
wget http://leolovenet.com/downloads/code/day-by-day-end.js
mkdir -p /usr/local/awstats/awstats_data_dir
chmod -R 777 /usr/local/awstats/awstats_data_dir
 
cat > /etc/awstats/awstats.log.conf <<ALLENDEND
# AWSTATS CONFIGURE FILE
LogFile="/var/log/lighttpd/access.log"
LogType=W
LogFormat=1
LogSeparator=" "
SiteDomain="blog.bbkanba.com"
HostAliases="localhost 127.0.0.1"
DNSLookup=0
DirData="/usr/local/awstats/awstats_data_dir"
DirCgi="/cgi-bin"
DirIcons="/icon"
AllowToUpdateStatsFromBrowser=1
AllowFullYearView=2
EnableLockForUpdate=1
DNSStaticCacheFile="dnscache.txt"
DNSLastUpdateCacheFile="dnscachelastupdate.txt"
SkipDNSLookupFor=""
AllowAccessFromWebToAuthenticatedUsersOnly=0
AllowAccessFromWebToFollowingAuthenticatedUsers=""
AllowAccessFromWebToFollowingIPAddresses=""
CreateDirDataIfNotExists=0
BuildHistoryFormat=text
BuildReportFormat=html
SaveDatabaseFilesWithPermissionsForEveryone=0
PurgeLogFile=0
ArchiveLogRecords=0
KeepBackupOfHistoricFiles=0
DefaultFile="index.php index.html"
SkipHosts=""
SkipUserAgents=""
SkipFiles=""
SkipReferrersBlackList=""
OnlyHosts=""
OnlyUserAgents=""
OnlyUsers=""
OnlyFiles=""
NotPageList="css js class gif jpg jpeg png bmp ico rss xml swf"
ValidHTTPCodes="200 304"
ValidSMTPCodes="1 250"
AuthenticatedUsersNotCaseSensitive=0
URLNotCaseSensitive=0
URLWithAnchor=0
URLQuerySeparators="?;"
URLWithQuery=0
URLWithQueryWithOnlyFollowingParameters=""
URLWithQueryWithoutFollowingParameters=""
URLReferrerWithQuery=0
WarningMessages=1
ErrorMessages=""
DebugMessages=0
NbOfLinesForCorruptedLog=50
WrapperScript=""
DecodeUA=0
MiscTrackerUrl="/js/awstats_misc_tracker.js"
LevelForBrowsersDetection=2
LevelForOSDetection=2
LevelForRefererAnalyze=2
LevelForRobotsDetection=2
LevelForSearchEnginesDetection=2
LevelForKeywordsDetection=2
LevelForFileTypesDetection=2
LevelForWormsDetection=0
UseFramesWhenCGI=1
DetailedReportsOnNewWindows=1
Expires=0
MaxRowsInHTMLOutput=1000
Lang="cn"
DirLang="./lang"
ShowMenu=1                  
ShowSummary=UVPHB
ShowMonthStats=UVPHB
ShowDaysOfMonthStats=VPHB
ShowDaysOfWeekStats=PHB
ShowHoursStats=PHB
ShowDomainsStats=PHB
ShowHostsStats=PHBL
ShowAuthenticatedUsers=0
ShowRobotsStats=HBL
ShowWormsStats=0
ShowEMailSenders=0
ShowEMailReceivers=0
ShowSessionsStats=1
ShowPagesStats=PBEX
ShowFileTypesStats=HB
ShowFileSizesStats=0    
ShowDownloadsStats=HB   
ShowOSStats=1
ShowBrowsersStats=1
ShowScreenSizeStats=0
ShowOriginStats=PH
ShowKeyphrasesStats=1
ShowKeywordsStats=1
ShowMiscStats=a
ShowHTTPErrorsStats=1
ShowSMTPErrorsStats=0
ShowClusterStats=0
AddDataArrayMonthStats=1
AddDataArrayShowDaysOfMonthStats=1
AddDataArrayShowDaysOfWeekStats=1
AddDataArrayShowHoursStats=1
IncludeInternalLinksInOriginSection=0
MaxNbOfDomain = 10
MinHitDomain  = 1
MaxNbOfHostsShown = 10
MinHitHost    = 1
MaxNbOfLoginShown = 10
MinHitLogin   = 1
MaxNbOfRobotShown = 10
MinHitRobot   = 1
MaxNbOfDownloadsShown = 10
MinHitDownloads = 1
MaxNbOfPageShown = 10
MinHitFile    = 1
MaxNbOfOsShown = 10
MinHitOs      = 1
MaxNbOfBrowsersShown = 10
MinHitBrowser = 1
MaxNbOfScreenSizesShown = 5
MinHitScreenSize = 1
MaxNbOfWindowSizesShown = 5
MinHitWindowSize = 1
MaxNbOfRefererShown = 10
MinHitRefer   = 1
MaxNbOfKeyphrasesShown = 10
MinHitKeyphrase = 1
MaxNbOfKeywordsShown = 10
MinHitKeyword = 1
MaxNbOfEMailsShown = 20
MinHitEMail   = 1
FirstDayOfWeek=1
ShowFlagLinks=""
ShowLinksOnUrl=1
UseHTTPSLinkForUrl=""
MaxLengthOfShownURL=64
HTMLHeadSection=""
HTMLEndSection=""
MetaRobot=0
Logo="awstats_logo6.png"
LogoLink="http://www.awstats.org"
BarWidth   = 260
BarHeight  = 90
StyleSheet=""
color_Background="FFFFFF"
color_TableBGTitle="CCCCDD"
color_TableTitle="000000"
color_TableBG="CCCCDD"
color_TableRowTitle="FFFFFF"
color_TableBGRowTitle="ECECEC"
color_TableBorder="ECECEC"
color_text="000000"
color_textpercent="606060"
color_titletext="000000"
color_weekend="EAEAEA"
color_link="0011BB"
color_hover="605040"
color_u="FFAA66"
color_v="F4F090"
color_p="4477DD"
color_h="66DDEE"
color_k="2EA495"
color_s="8888DD"
color_e="CEC2E8"
color_x="C1B2E2"
ExtraTrackedRowsLimit=500
 
HTMLHeadSection="<script language=javascript src='/js/day-by-day-head.js'></script>"
HTMLEndSection="<script language=javascript src='/js/day-by-day-end.js'></script>"
LoadPlugin="geoip GEOIP_STANDARD /usr/local/awstats/wwwroot/cgi-bin/plugins/GeoIP.dat"
LoadPlugin="geoip_city_maxmind GEOIP_STANDARD /usr/local/awstats/wwwroot/cgi-bin/plugins/GeoLiteCity.dat"
LoadPlugin="hostinfo"
LoadPlugin="qqhostinfo"
LoadPlugin="decodeutfkeys"
LoadPlugin="tooltips"
ALLENDEND
 
cat > /usr/local/awstats/wwwroot/index.pl  <<ALLENDEND
#!/usr/bin/perl
use POSIX qw(strftime);
print strftime "Location: http://log.bbkanba.com/cgi-bin/awstats.pl?config=log&databasebreak=day&day=%d&month=%m&year=%Y\n\n" ,localtime;
ALLENDEND
 
cat > /etc/cron.hourly/00awstats <<ALLENDEND
#!/bin/bash
# path to cgi-bin
AWS=/usr/local/awstats/wwwroot/cgi-bin/awstats.pl
# append your domain
DOMAINS="log"
# loop through all domains
for d in \${DOMAINS}
do
   \${AWS} -update -config=\${d}  -lang=cn  -databasebreak=day
done
ALLENDEND
chmod +x /etc/cron.hourly/00awstats
/etc/cron.hourly/00awstats
```

linux平台下的web日志时间一般没有问题，所以没有添加`LoadPlugin="timezone +8"`

执行完上面的内容你应该可以看到与 图1-5 类似的结果,就说明安装awstats成功了。  
下面添加一个虚拟站点给lighttpd,好让我们可以通过浏览器查看统计结果,全部命令如下

``` bash
sed -e 's/.*mod_ssi.*/"mod_ssi",/' /etc/lighttpd/lighttpd.conf > /tmp/lighttpd.conf
mv /tmp/lighttpd.conf /etc/lighttpd/lighttpd.conf
cat >> /etc/lighttpd/lighttpd.conf <<ALLALLEND
\$HTTP["host"] =~ "log.bbkanba.com" {
index-file.names   = ( "index.pl","index.php", "index.html","index.htm" )
server.port = 80
cgi.assign = (
".pl" => "/usr/bin/perl",
".cgi" => "/usr/bin/perl"
)
server.document-root = "/usr/local/awstats/wwwroot/"
accesslog.filename = "/var/log/lighttpd/log.access.log"
}
ALLALLEND

/etc/init.d/lighttpd restart
```
ok,到此结束.

## 3. Install Awstats with Nginx under Linux(CentOS)

awstats与Nginx合作还是有点复杂的,不像Lighttpd支持perl扩展那么容易,这里我们要让nginx支持perl扩展是通过一个perl脚本实现的。

不过,**7.1**版本的awstats的[ChangLog](http://awstats.sourceforge.net/docs/awstats_changelog.txt)里说明了Add example of nginx setup.  
我还没有试过官方的办法,好像是通过一个php的脚本,可以在最新发行版本包里的tools/nginx目录看看.

下面我讲的是通过 [fastcgi-wrapper.pl](/downloads/code/fastcgi-wrapper.pl) 实现的.

``` bash
wget http://leolovenet.com/downloads/code/fastcgi-wrapper.pl
mv  fastcgi-wrapper.pl /usr/local/bin/
chmod +x fastcgi-wrapper.pl 
mkdir -p /var/run/nginx/
/usr/local/bin/fastcgi-wrapper.pl &
ps aux|grep  fcgi-wrapper.pl
```


awstats的安装与上面Lighttpd篇里的一样,添加一个虚拟站点给nginx,好让我们可以通过浏览器查看统计结果的命令如下,这里假设nginx安装在了`/usr/local/nginx`目录下,并且虚拟站点的配置文件在`/usr/local/nginx/conf/vhost`下.

``` bash
mkdir -p /var/run/nginx/
mkdir -p /usr/local/nginx/conf/vhost

cat >  /usr/local/nginx/conf/vhost/awstats.conf<<ALLALLEND
log_format  awstat  '\$remote_addr - \$remote_user [\$time_local] \$request '
             '\$status \$body_bytes_sent \$http_referer '
             '\$http_user_agent \$http_x_forwarded_for';
server
     {
          listen       80;
          server_name log.bbkanba.com;
          index index.pl index.html index.htm index.php default.html default.htm default.php;
          root  /usr/local/awstats/wwwroot/;
 
      location ~ .*\.(pl|cgi)?\$
         {
                gzip off;
                fastcgi_pass   unix:/var/run/nginx/perl_cgi-dispatch.sock;
                root /usr/local/awstats/wwwroot;
                fastcgi_index  index.cgi;
                fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
                fastcgi_param  SERVER_SOFTWARE    nginx;
                fastcgi_param  QUERY_STRING       \$query_string;
                fastcgi_param  REQUEST_METHOD     \$request_method;
                fastcgi_param  CONTENT_TYPE       \$content_type;
                fastcgi_param  CONTENT_LENGTH     \$content_length;
                fastcgi_param  SCRIPT_FILENAME    \$document_root\$fastcgi_script_name;
                fastcgi_param  SCRIPT_NAME        \$fastcgi_script_name;
                fastcgi_param  REQUEST_URI        \$request_uri;
                fastcgi_param  DOCUMENT_URI       \$document_uri;
                fastcgi_param  DOCUMENT_ROOT      \$document_root;
                fastcgi_param  SERVER_PROTOCOL    \$server_protocol;
                fastcgi_param  REMOTE_ADDR        \$remote_addr;
                fastcgi_param  REMOTE_PORT        \$remote_port;
                fastcgi_param  SERVER_ADDR        \$server_addr;
                fastcgi_param  SERVER_PORT        \$server_port;
                fastcgi_param  SERVER_NAME        \$server_name;
                fastcgi_read_timeout   60;
          }

          location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)\$
               {
                    expires      30d;
               }

          location ~ .*\.(js|css)?\$
               {
                    expires      12h;
               }

          access_log  /var/log/awstat.log  awstat;
}

ALLALLEND

chmod +x /etc/cron.hourly/00awstats
/etc/init.d/nginx reload
```

ok,到此结束.
