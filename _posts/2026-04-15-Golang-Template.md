---
title: 'Golang Template'
date: 2026-04-15
permalink: /posts/2026/04/Golang-template/
tags:
  - Golang-template
---

### 一些常用的golang数据结构

#### 队列Queue

------

```go
type Queue[T any] struct {
	items *list.List
}

func NewQueue[T any]() *Queue[T] {
	return &Queue[T]{
		items: list.New(),
	}
}

func (q *Queue[T]) Enqueue(item T) {
	q.items.PushBack(item)
}

func (q *Queue[T]) Dequeue() (T, bool) {
	if q.IsEmpty() {
		var zero T
		return zero, false
	}
	front := q.items.Front()
	q.items.Remove(front)
	return front.Value.(T), true
}

func (q *Queue[T]) Front() (T, bool) {
	if q.IsEmpty() {
		var zero T
		return zero, false
	}
	return q.items.Front().Value.(T), true
}

func (q *Queue[T]) IsEmpty() bool {
	return q.items.Len() == 0
}

func (q *Queue[T]) Size() int {
	return q.items.Len()
}
```

#### 优先队列Priority_Queue

----

```go
type PriorityQueue[T any] struct {
	items []T
	less  func(a, b T) bool // 自定义排序规则（a 是否优先于 b）
}

// 构造函数
func New[T any](less func(a, b T) bool) *PriorityQueue[T] {
	pq := &PriorityQueue[T]{
		items: []T{},
		less:  less,
	}
	heap.Init(pq)
	return pq
}

func (pq PriorityQueue[T]) Len() int {
	return len(pq.items)
}

func (pq PriorityQueue[T]) Less(i, j int) bool {
	return pq.less(pq.items[i], pq.items[j])
}

func (pq PriorityQueue[T]) Swap(i, j int) {
	pq.items[i], pq.items[j] = pq.items[j], pq.items[i]
}

func (pq *PriorityQueue[T]) Push(x any) {
	pq.items = append(pq.items, x.(T))
}

func (pq *PriorityQueue[T]) Pop() any {
	old := pq.items
	n := len(old)
	item := old[n-1]
	pq.items = old[:n-1]
	return item
}

// 入队
func (pq *PriorityQueue[T]) PushItem(x T) {
	heap.Push(pq, x)
}

// 出队
func (pq *PriorityQueue[T]) PopItem() T {
	return heap.Pop(pq).(T)
}

// 查看堆顶（不弹出）
func (pq *PriorityQueue[T]) Peek() T {
	return pq.items[0]
}

// 是否为空
func (pq *PriorityQueue[T]) Empty() bool {
	return pq.Len() == 0
}
```

#### 栈Stack

----

```go
type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(item T) {
	s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, bool) {
	if s.IsEmpty() {
		var zero T
		return zero, false
	}
	item := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return item, true
}

func (s *Stack[T]) Peek() (T, bool) {
	if s.IsEmpty() {
		var zero T
		return zero, false
	}
	return s.items[len(s.items)-1], true
}

func (s *Stack[T]) IsEmpty() bool {
	return len(s.items) == 0
}

func (s *Stack[T]) Size() int {
	return len(s.items)
}
```

