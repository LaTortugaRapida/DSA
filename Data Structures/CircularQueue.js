import { DArray } from "./DynamicArray.js";

class CircularQueue {
    #data;
    #front;
    #size;
    constructor(capacity = 8) {
        this.#init(capacity);
    }

    /* ================= Basic State ================= */
    #init(capacity) {
        if (!Number.isInteger(capacity) || capacity <= 0) {
            throw new Error("Capacity must be a positive integer");
        }
        this.#data = new DArray(capacity);
        this.#front = 0;
        this.#size = 0;
    }
    size() {
        return this.#size;
    }

    capacity() {
        return this.#data.capacity;
    }

    isEmpty() {
        return this.#size === 0;
    }

    clear() {
        this.#init(this.#data.capacity);
    }

    /* ================= Core Queue Operations ================= */

    enqueue(value) {
        if (this.#size === this.#data.capacity) {
            this.#grow();
        }
        let rearPos = (this.#front + this.#size) % this.#data.capacity;
        this.#data.setValue(rearPos, value);
        ++this.#size;
    }

    dequeue() {
        if (this.#size === 0) throw new Error("Empty queue!");
        let val = this.#data.at(this.#front);
        this.#front = (this.#front + 1) % this.#data.capacity;
        --this.#size;
        return val;
    }

    front() {
        if (this.#size === 0) throw new Error("Empty queue!");
        return this.#data.at(this.#front);
    }

    back() {
        if (this.#size === 0) throw new Error("Empty queue!");
        let back = (this.#size + this.#front - 1) % this.#data.capacity;
        return this.#data.at(back);
    }

    /* ================= Internal Resize ================= */

    #grow() {
        let newCap = this.#data.capacity * 2;
        let newData = new DArray(newCap);
        for (let i = 0; i < this.#size; ++i) {
            let rear = (this.#front + i) % this.#data.capacity;
            newData.push_back(this.#data.at(rear));
        }
        this.#data = newData;
        this.#front = 0;
    }

    /* ================= Utilities ================= */

    toArray() {
        let arr = [];
        for (let i = 0; i < this.#size; ++i) {
            let rear = (this.#front + i) % this.#data.capacity;
            arr.push(this.#data.at(rear));
        }
        return arr;
    }

    toString() {
        return JSON.stringify(this.toArray());
    }

    [Symbol.iterator]() {
        let arr = this.toArray();
        let idx = 0;
        return {
            next: () => {
                if (idx < arr.length) {
                    return { value: arr[idx++], done: false };
                } else {
                    return { value: undefined, done: true };
                }
            },
        };
    }
}
