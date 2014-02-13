---
title: '[翻译]WRITE OBJECTIVE-C CODE — BLOCKS'
author: leolovenet
layout: post
comments: true
categories:
  - IOS
  - Object-C
  - Translation
tags:
  - IOS
  - Object-C
  - Translation  
---
一直对**Blocks**理解不是很深.特用白话翻译一小篇文章, 可能会使自己记得更清楚.  
  
下文翻译自Apple Document [Start Developing iOS Apps Today][1]中<a href="https://developer.apple.com/library/mac/#referencelibrary/GettingStarted/RoadMapOSX/books/WriteObjective-CCode/WriteObjective-CCode/WriteObjective-CCode.html" target="_blank">Write Objective-C Code</a>那篇**Blocks**.  

<!--more-->

**Blocks**,说白了就是可以在任何时候被多次执行封装好了的一段代码功能. 本质上是方便的匿名函数, 可以作为参数传递给一个方法或函数, 或者作为结果返回. **Blocks** 自己也可以有参数列表的定义和一个可以被检查出来的或者明确的返回类型声明. 

我们能用Blocks干什么呢？ 它可以指派到一个变量上, 或者说把一个Blocks赋值给一个变量, 这样就可以把这个变量当成函数一样来用了.

> Blocks are objects that encapsulate a unit of work—that is, a segment of code—that can be executed at any time. They are essentially portable and anonymous functions that one can pass in as parameters of methods and functions or that can be returned from methods and functions. Blocks themselves have a typed parameter list and may have an inferred or a declared return type. You can also assign a block to a variable and then call it just as you would a function.

那么Blocks怎么书写呢? **Blocks** 的语法标示符是（**^**）打头,下图具体格式展示了把一个 block 赋值个一个变量.

> A caret (^) is used as a syntactic marker for blocks. There are other, familiar syntactic conventions for parameters, return values, and body of the block (that is, the executed code). The following figure explicates the syntax, specifically when assigning a block to a variable.

![blocks_2x-1024x377.png](/downloads/images/blocks_2x-1024x377.png "object-c block syntax")

上面首先声明了一个变量`multiplier`,然后又实现了一个有一个`int`型参数和返回值是`int`型的 **Block**, 并把它赋值给了`myBlock`.  
现在就可以把`myBlock`当做一个函数来调用了, 例如这样：

> You can then call the block variable as if it were a function:

<pre>
int result = myBlock(4); // 返回结果是 28
</pre>


说完了格式, 该说作用域了. block跟调用它的主体共享作用域的. 也就是说, 如果你实现了一个方法, 并且在该方法里定义了一个 **block**, 那么在这个 **block** 内部就可以直接访问这个方法的局域变量和参数, 就像该函数访问全局变量一样. 但是, 这种访问的变量是只读的. 什么？我要在block里修改这个变量怎么办？那就需要这个变量在声明的时候以 `__block` 修饰符(**双下划线**)开头,这样这个变量就可以在block里被修改了. 还值得一说的是, 即使一个方法或者函数内的block被当做返回值返回, 然后此方法或者函数内的局部作用域被销毁, 此方法或者函数内部被block引用的本地变量仍然被当做block对象的一部分被保留, 直到block不再引用它们. 

> A block shares data in the local lexical scope. This characteristic of blocks is useful because if you implement a method and that method defines a block, the block has access to the local variables and parameters of the method (including stack variables) as well as to functions and global variables, including instance variables. This access is read-only, but if a variable is declared with the __block modifier, its value can be changed within the block. Even after the method or function enclosing a block has returned and its local scope has been destroyed, the local variables persist as part of the block object as long as there is a reference to the block.

跟**blocks**被作为一个方法或函数的参数使用一样, blocks也可以作为这个方法或函数的 "回调函数", 当我们在调用这个方法或函数的时候, 它们执行自己的代码, 而为了请求额外的信息或为了特殊的目的, 在合适的时间调用 **blocks**, 从而实现 "回调函数" 的功能. 相对于其他函数调用规则,block和调用主体共享作用域.

> As method or function parameters, blocks can serve as a callback. When invoked, the method or function performs some work and, at the appropriate moments, calls back to the invoking code—via the block—to request additional information or to obtain program-specific behavior from it. Blocks enable the caller to provide the callback code at the point of invocation. Instead of packaging the required data in a “context” structure, blocks capture data from the same lexical scope as the host method or function. Because the block code does not have to be implemented in a separate method or function, your implementation code can be simpler and easier to understand.

Objective-C 框架里有很多带 block 参数的方法.比如, Foundation框架里的`NSNotificationCenter`类就声明了下面的这样的一个带 block 参数的方法:

> Objective-C frameworks have many methods with block parameters. For example, the NSNotificationCenter class of the Foundation framework declares the following method, which has a block parameter: 

``` obj-c
- (id)addObserverForName:(NSString *)name object:(id)obj queue:(NSOperationQueue *)queue usingBlock:(void (^)(NSNotification *note))block
```

这个方法添加了一个监控器到通知中心.当一个符合指定名字的通知到达时, block 就负责处理. 像下面的代码一样:

> This method adds an observer to the notification center (notifications are discussed in Streamline Your App with Design Patterns). When a notification of the specified name is posted, the block is invoked to handle the notification. 

``` obj-c
opQ = [[NSOperationQueue alloc] init];
    [[NSNotificationCenter defaultCenter] addObserverForName:@"CustomOperationCompleted"
             object:nil queue:opQ
        usingBlock:^(NSNotification *notif) {
        // 处理通知消息的代码放到这里
    }];
```

 [1]: https://developer.apple.com/library/mac/#referencelibrary/GettingStarted/RoadMapOSX/