class Node {
  constructor(value, prev = null, next = null) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

class DoublyLinkedList {
  #head;
  #tail;

  constructor(value = null) {
    this.#head = value !== null ? new Node(value) : null;
    this.#tail = this.#head;
  }

  empty() {
    return this.#head === this.#tail && this.#head === null;
  }

  size() {
    if (this.empty()) return 0;
    let size = 0;
    let node = this.#head;
    while (node) {
      ++size;
      node = node.next;
    }
    return size;
  }

  clear() {
    this.#head = null;
    this.#tail = this.#head;
  }

  front() {
    if (this.empty()) throw new Error("The List is empty!");
    return this.#head.value;
  }

  back() {
    if (this.empty()) throw new Error("The List is empty!");
    return this.#tail.value;
  }

  at(index) {
    if (this.empty()) throw new Error("The List is empty!");
    if (!Number.isInteger(index) || index < 0)
      throw new Error("Index must be a positive integer!");
    const size = this.size();
    if (index >= size) throw new Error("Invalid index");
    let mid = Math.floor(size / 2);
    let node;
    if (index <= mid) {
      node = this.#head;
      while (index > 0) {
        node = node.next;
        --index;
      }
    } else {
      node = this.#tail;
      let curIdx = size - 1;
      while (curIdx > index) {
        node = node.prev;
        --curIdx;
      }
    }
    return node.value;
  }

  pushFront(value) {
    let newNode = new Node(value);
    if (this.empty()) {
      this.#head = this.#tail = newNode;
      return;
    }
    newNode.next = this.#head;
    this.#head.prev = newNode;
    this.#head = newNode;
  }

  pushBack(value) {
    let newNode = new Node(value);
    if (this.empty()) {
      this.#head = this.#tail = newNode;
      return;
    }
    this.#tail.next = newNode;
    newNode.prev = this.#tail;
    this.#tail = newNode;
  }
  popFront() {
    if (this.empty()) throw new Error("The List is empty!");
    if (this.size() === 1) {
      let first = this.#head;
      this.#head = null;
      this.#tail = null;
      return first.value;
    }
    let first = this.#head.value;
    this.#head.next.prev = null;
    this.#head = this.#head.next;
    return first;
  }

  popBack() {
    if (this.empty()) throw new Error("The List is empty!");
    if (this.size() === 1) {
      let last = this.#head;
      this.#head = null;
      this.#tail = null;
      return last.value;
    }
    let last = this.#tail.value;
    this.#tail.prev.next = null;
    this.#tail = this.#tail.prev;
    return last;
  }

  insert(index, value) {
    if (!Number.isInteger(index) || index < 0)
      throw new Error("Index must be a positive integer!");
    let size = this.size();
    if (index > size) throw new Error("Invalid index");
    if (index === 0) {
      this.pushFront(value);
      return;
    }
    if (index === size) {
      this.pushBack(value);
      return;
    }
    let newNode = new Node(value);
    let cur = this.#head;
    while (index--) {
      cur = cur.next;
    }
    newNode.prev = cur.prev;
    newNode.next = cur;
    cur.prev.next = newNode;
    cur.prev = newNode;
  }

  erase(index) {
    if (!Number.isInteger(index) || index < 0)
      throw new Error("Index must be a positive integer!");
    let size = this.size();
    if (index >= size) throw new Error("Invalid index");
    if (index === 0) {
      return this.popFront();
    }
    if (index === size - 1) {
      return this.popBack();
    }
    let cur = this.#head;
    while (index--) {
      cur = cur.next;
    }
    cur.prev.next = cur.next;
    cur.next.prev = cur.prev;
    return cur.value;
  }

  find(value) {
    if (this.empty()) return -1;
    let index = 0;
    let node = this.#head;
    while (node) {
      if (node.value === value) return index;
      node = node.next;
      ++index;
    }
    return -1;
  }

  contains(value) {
    if (this.empty()) return false;
    let node = this.#head;
    while (node) {
      if (node.value === value) return true;
      node = node.next;
    }
    return false;
  }

  toArray() {
    if (this.empty()) return [];
    let arr = new Array();
    let node = this.#head;
    while (node) {
      arr.push(node.value);
      node = node.next;
    }
    return arr;
  }

  reverse() {
    if (this.empty()) throw new Error("The List is empty!");
    let size = this.size();
    if (size === 1) return;
    let odd = size % 2 ? true : false;
    size = Math.floor(size / 2);
    let start = this.#head;
    let end = this.#tail;
    let save;
    while (size--) {
      let nextStart = start.next;
      let nextEnd = end.prev;

      save = start.prev;
      start.prev = start.next;
      start.next = save;

      save = end.prev;
      end.prev = end.next;
      end.next = save;

      start = nextStart;
      end = nextEnd;
    }

    if (odd) {
      save = start.prev;
      start.prev = start.next;
      start.next = save;
    }
    [this.#tail, this.#head] = [this.#head, this.#tail];
  }

  *[Symbol.iterator]() {
    let node = this.#head;

    while (node) {
      yield node.value;
      node = node.next;
    }
  }

  *reverseIteration() {
    let node = this.#tail;
    while (node) {
      yield node.value;
      node = node.prev;
    }
  }

  *entries() {
    let index = 0;
    let node = this.#head;
    while (node) {
      yield [index++, node.value];
      node = node.next;
    }
  }
}
