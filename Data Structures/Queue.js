import { BucketedDeque } from "./Deque.js"
class Queue {
  #data;
  #size;

  constructor(buckets = 4) {
    this.#data = new BucketedDeque(buckets);
    this.#size = 0;
  }

  enqueue(value) {
    this.#data.push_back(value);
    ++this.#size;
  }

  dequeue() {
     --this.#size;
     return this.#data.pop_front();
  }

  front() {
    return this.#data.front();
  }

  back() {
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
