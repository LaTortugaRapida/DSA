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
    #size;

    constructor(value = null) {
        this.#head = value !== null ? new Node(value) : null;
        this.#tail = this.#head;
        if(value === null) this.#size = 0;
        else this.#size = 1;
    }

    empty() {
        return this.#size === 0;
    }

    size() {
        return this.#size;
    }

    clear() {
        this.#head = null;
        this.#tail = this.#head;
        this.#size = 0;
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
        if (index >= this.#size) throw new Error("Invalid index");
        let mid = Math.floor(this.#size / 2);
        let node;
        if (index <= mid) {
            node = this.#head;
            while (index > 0) {
                node = node.next;
                --index;
            }
        } else {
            node = this.#tail;
            let curIdx = this.#size - 1;
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
        } else {
            newNode.next = this.#head;
            this.#head.prev = newNode;
            this.#head = newNode;
        }
        ++this.#size;
    }

    pushBack(value) {
        let newNode = new Node(value);
        if (this.empty()) {
            this.#head = this.#tail = newNode;
        } else {
            this.#tail.next = newNode;
            newNode.prev = this.#tail;
            this.#tail = newNode;
        }
        ++this.#size;
    }
    popFront() {
        if (this.empty()) throw new Error("The List is empty!");
        let first = this.#head.value;
        if (this.#size === 1) {
            this.#head = null;
            this.#tail = null;
        } else {
            this.#head = this.#head.next;
            this.#head.prev = null;
        }
        --this.#size;
        return first;
    }

    popBack() {
        if (this.empty()) throw new Error("The List is empty!");
        let last = this.#tail.value;
        if (this.#size === 1) {
            this.#head = null;
            this.#tail = null;
        } else {
            this.#tail = this.#tail.prev;
            this.#tail.next = null;
        }
        --this.#size;
        return last;
    }

    insert(index, value) {
        if (!Number.isInteger(index) || index < 0)
            throw new Error("Index must be a positive integer!");
        if (index > this.#size) throw new Error("Invalid index");
        if (index === 0) {
            this.pushFront(value);
            return;
        }
        if (index === this.#size) {
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
        ++this.#size
    }

    erase(index) {
        if (!Number.isInteger(index) || index < 0)
            throw new Error("Index must be a positive integer!");
        if (index >= this.#size) throw new Error("Invalid index");
        if (index === 0) {
            return this.popFront();
        }
        if (index === this.#size - 1) {
            return this.popBack();
        }
        let cur = this.#head;
        while (index--) {
            cur = cur.next;
        }
        --this.#size;
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
        if(this.empty()) throw new Error("The List is empty!");
        let cur = this.#head;

        while(cur) {
            let tmp = cur.prev;
            cur.prev = cur.next;
            cur.next = tmp;
            cur = cur.prev;
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
