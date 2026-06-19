import { BucketedDeque } from "./Deque.js"

class Stack {
  #data;
  #size;

  constructor(initialCapacity) {
    this.#data = new BucketedDeque(initialCapacity);
    this.#size = 0;
  }

  push(value) {
    this.#data.push_back(value);
    ++this.#size;
  }

  pop() {
    const val = this.#data.pop_back();
    --this.#size;
    return val;
  }

  peek() {
    return this.#data.back();
  }

  size() {
    return this.#size;
  }

  isEmpty() {
    return this.#size === 0;
  }

  clear() {
    this.#data = new BucketedDeque();
    this.#size = 0;
  }

  toArray() {
    return this.#data.toArray();
  }

  [Symbol.iterator]() {
    return this.#data[Symbol.iterator]();
  }
}
