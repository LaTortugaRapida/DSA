class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class SinglyLinkedList {
  #head;
  #size;
  constructor(value = null) {
    this.#head = value !== null ? new Node(value) : null;
    this.#size = 0;
  }

  empty() {
    return this.#head === null;
  }

  size() {
    return this.#size;
  }

  clear() {
    this.#head = null;
    this.#size = 0;
  }

  front() {
    if (this.empty()) throw new Error("List is empty!");
    return this.#head.value;
  }

  back() {
    if (this.empty()) throw new Error("List is empty!");
    let node = this.#head;
    while (node.next) {
      node = node.next;
    }
    return node.value;
  }

  at(index) {
    if (!Number.isInteger(index) || index < 0)
      throw new Error("Index must be a positive integer!");
    if (this.empty()) throw new Error("List is empty!");
    if (index >= this.#size) throw new Error("Invalid index!");
    let node = this.#head;
    while (index--) {
      node = node.next;
    }
    return node.value;
  }

  pushFront(value) {
    let newNode = new Node(value);
    if (this.empty()) {
      this.#head = newNode;
    } else {
        let tmp = this.#head;
        this.#head = newNode;
        newNode.next = tmp;
    }
    ++this.#size;
  }

  pushBack(value) {
    let newNode = new Node(value);
    if (this.empty()) {
      this.#head = newNode;
    } else {
        let node = this.#head;
        while (node.next) {
            node = node.next;
        }
        node.next = newNode;
    }
    ++this.#size;
  }

  popFront() {
    if (this.empty()) throw new Error("List is empty!");
    const val = this.#head.value;
    this.#head = this.#head.next;
    --this.#size;
    return val;
  }

  popBack() {
    if (this.empty()) throw new Error("List is empty!");
    if (this.#size === 1) {
      const val = this.#head.value;
      this.#head = null;
      this.#size = 0;
      return val;
    }
    let node = this.#head;
    while (node.next.next) {
      node = node.next;
    }
    const val = node.next.value;
    node.next = null;
    --this.#size;
    return val;
  }

  insert(index, value) {
    if (!Number.isInteger(index) || index < 0)
      throw new Error("Index must be a positive integer!");
    if (index > this.#size) throw new Error("Invalid index!");
    if (index === 0) {
      this.pushFront(value);
      return;
    }
    let newNode = new Node(value);
    let prev = this.#head;
    while (index > 1) {
      prev = prev.next;
      --index;
    }
    let next = prev.next;
    prev.next = newNode;
    newNode.next = next;
    ++this.#size;
  }

  erase(index) {
    if (!Number.isInteger(index) || index < 0)
      throw new Error("Index must be a positive integer!");
    if (index >= this.size()) throw new Error("Invalid index!");
    if (index === 0) {
      return this.popFront();
    }
    if (index === this.size() - 1) {
      return this.popBack();
    }
    let prev = this.#head;
    while (index > 1) {
      prev = prev.next;
      --index;
    }
    let val = prev.next.value;
    prev.next = prev.next.next || null;
    --this.#size
    return val;
  }

  find(value) {
    if (this.empty()) throw new Error("List is empty!");
    let node = this.#head;
    let index = 0;
    while (node) {
      if (node.value === value) return index;
      node = node.next;
      ++index;
    }

    return -1;
  }

  contains(value) {
    if (this.empty()) throw new Error("List is empty!");
    let node = this.#head;
    while (node) {
      if (node.value === value) return true;
      node = node.next;
    }
    return false;
  }

  toArray() {
    if (this.empty()) return [];
    let list = [];
    let node = this.#head;
    while (node) {
      list.push(node.value);
      node = node.next;
    }
    return list;
  }

  reverse() {
    if (this.empty()) throw new Error("List is empty!");
    if (this.#size === 1) return;
    let cur = this.#head;
    let next = cur.next;
    let prev = null;
    while (cur) {
      next = cur.next;
      cur.next = prev;
      prev = cur;
      cur = next;
    }
    this.#head = prev;
  }

  *[Symbol.iterator]() {
    let node = this.#head;
    while (node) {
      yield node.value;
      node = node.next;
    }
  }

  *entries() {
    let node = this.#head;
    let index = 0;
    while (node) {
      yield [index++, node.value];
      node = node.next;
    }
  }
}
