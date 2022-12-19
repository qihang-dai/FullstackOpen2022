# What I learnt in this course 

### Learnt module export and import

### Anti-pattern: Array Indexes as Keys
我们可以通过使用数组索引作为键来使控制台中的错误信息消失。通过向map方法的回调函数传递第二个参数，可以拿到索引。

notes.map((note, i) => ...)
当这样调用时，i被分配为笔记所在的数组中的索引值。

因此，定义行的生成也是不出错的一种方法：

```javascript
<ul>
  {notes.map((note, i) =>
    <li key={i}>
      {note.content}
    </li>
  )}
</ul>
```

然而，这是不推荐的，即使它看起来工作得很好，也会产生想不到的问题。这是因为React使用数组索引作为键来确定哪些列表项已更改、添加或删除。如果我们的数组中的项目顺序发生变化，React将不得不重新渲染整个列表，因为它不知道哪些项目已更改。这会导致性能问题，特别是在大型列表中。

在这篇[文章](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318)中可以阅读更多关于这个问题的内容

