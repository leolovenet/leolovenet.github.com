---
title: windows office excel vba script 一例
author: leolovenet
layout: post
comments: true
categories:
  - Windows
  - VB
tags:
  - Windows
  - VB
---

上周学习vba的总结.

``` vbnet

Sub getData()

	  '单引号开始的是注视行
	  '声明变量
    Dim RowNumMax As Integer, RowNumMax2 As Integer
    Dim ASht As Worksheet, BSht As Worksheet
    Dim Site
    
    '根据表格名字获得表格,并赋值个变量
    Set ASht = Sheets("Sheet1")
    Set BSht = Sheets("Sheet2")
    '锁定屏幕更新
    Application.ScreenUpdating = False
    On Error Resume Next
           
    '检查表格数据
    '定位数据的函数有两个Range 或者 Cells
    'Range是表示法是Range("E2")
    'Cells的表示法是坐标类似Cells(1,1)
    
    If ASht.Range("E2") = "" Then
    MsgBox "E2列中没有网站数据"
    ASht.Activate
    ASht.Cells.Select
    End
    End If
        
    ASht.Select
    RowNumMax = ASht.[E65536].End(xlUp).Row   'E列最下面一行的行数，中间有空格也行
    
    BSht.Select
    RowNumMax2 = BSht.[A65536].End(xlUp).Row
    BSht.Range("A2:A" & RowNumMax2).ClearFormats
            
    '清除格式
    ASht.Select
    ASht.Cells.Select
    Selection.ClearFormats
    '快捷设置选中单元格de属性
    With Selection.Interior
        .Pattern = xlNone
        .TintAndShade = 0
        .PatternTintAndShade = 0
    End With

	  'for循环
    For x = 2 To RowNumMax + 1
        Site = ASht.Range("E" & x)
        '不等于操作符 &lt;&gt;
        If Site &lt;&gt; "" Then
         'MsgBox Site
        	'Unique
           For a = 2 To RowNumMax + 1
               If a &lt;&gt; x Then
                    If Site = ASht.Range("E" & a) Then
                        MsgBox "E" & a & "跟E" & x & "重复，整理被迫中断"
                    End
                End If
               End If
           Next a
         
         For xx = 2 To RowNumMax2 + 1
             'MsgBox BSht.Range("A" & xx)
             'If xx &gt; 3 Then
             'Exit For
             'End If
             If Trim(Site) = Trim(BSht.Range("A" & xx)) Then
               BSht.Range("A" & xx).Interior.ColorIndex = 15
              'MsgBox "A" & xx
              '字符串处理函数Trim去除字符串开头结尾的空格符号,跟php的一样
              '换行符常量,vbLf
              '利用Replace函数删除换行符              
               ASht.Range("F" & x) = Replace(Trim(BSht.Range("H" & xx)), vbLf, "")
               'ASht.Range("G" & x) = Trim(BSht.Range("K" & xx))
               ASht.Range("H" & x) = Replace(Trim(BSht.Range("C" & xx)), vbLf, "")
               ASht.Range("J" & x) = Replace(Trim(BSht.Range("B" & xx)), vbLf, "")
               ASht.Range("K" & x) = Replace(Trim(BSht.Range("F" & xx)), vbLf, "")
               'MsgBox BSht.Range("F" & xx).Formula =
               'BSht.Range("D" & xx).MergeArea.Cells(1, 1) 读取合并单元格的值
               ASht.Range("L" & x) = Replace(Trim(BSht.Range("D" & xx).MergeArea.Cells(1, 1)), vbLf, "")               
             End If
             
         Next xx
         
        Else 
        
         ASht.Range("F" & x) = ""
         ASht.Range("H" & x) = ""
         ASht.Range("J" & x) = ""
         ASht.Range("K" & x) = ""
         ASht.Range("L" & x) = ""
                  
        End If
        'If x &gt; 3 Then
        'Exit For
        'End If
    Next x
    
    ASht.Range("F2:G53").ClearContents
    'ASht.Range("G2:G5555").ClearContents

    Application.ScreenUpdating = True
End Sub
```