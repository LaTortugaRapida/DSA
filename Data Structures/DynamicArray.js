/**
 * Class representing a "Dynamic Array" data structure.
 * Uses a typed array (Uint32Array) as internal storage.
 */
export class DArray {
    // Private fields
    /** @private @type {number} Current number of elements in the array */
    #size = 0;

    /** @private @type {number} Current capacity (allocated memory) of the array */
    #capacity = 0;

    /** @private @type {Uint32Array|null} Internal array for storing data */
    #arr = null;

    // Public fields
    /** @public @type {number} Capacity multiplier when the array is full */
    CAP_EXPONENT = 2;

    /**
     * Initializes the dynamic array with a given initial capacity.
     * @param {number} initialCapacity - Initial capacity of the array (must be a strictly positive integer).
     * @throws {TypeError} If initialCapacity is not a positive integer.
     */
    constructor(initialCapacity) {
        if (!Number.isInteger(initialCapacity) || initialCapacity <= 0) {
            throw new TypeError("Capacity must be a positive integer!");
        }
        this.#capacity = initialCapacity;
        this.#size = 0;
        this.#arr = new Uint32Array(initialCapacity);
    }

    get capacity() {
        return this.#capacity;
    }

    /**
     * Changes the capacity of the internal array.
     * @param {number} newCapacity - The new capacity of the array.
     * @param {number} [fill=0] - The value used to fill new elements if newCapacity > #size.
     */
    resize(newCapacity, fill = 0) {
        if (!Number.isInteger(newCapacity) || newCapacity <= 0) {
            throw new TypeError("Capacity must be a positive integer!");
        }
        let newArr = new Uint32Array(newCapacity);
        let small = Math.min(newCapacity, this.#size);
        if (newCapacity > this.#size) {
            newArr.fill(fill);
        }
        for (let i = 0; i < small; ++i) {
            newArr[i] = this.#arr[i];
        }
        this.#capacity = newCapacity;
        this.#size = small;
        this.#arr = newArr;
    }

    /**
     * Adds an element to the end of the array. If the array is full, increases its capacity by CAP_EXPONENT.
     * @param {number} elem - The element to add.
     */
    push_back(elem) {
        if (typeof elem !== "number") {
            throw new TypeError("Element must be of type number!");
        }
        if (this.#size === this.#capacity) {
            this.resize(this.#capacity * this.CAP_EXPONENT);
        }
        this.#arr[this.#size++] = elem;
    }

    /**
     * Removes the last element from the array (decreases the size). Does nothing if the array is empty.
     */
    pop_back() {
        if (this.empty()) {
            throw new Error("The array is empty!");
        }
        let elem = this.#arr[--this.#size];
        this.#arr[this.#size] = 0;
        return elem;
    }

    /**
     * Removes an element at the specified index, shifting all subsequent elements to the left.
     * @param {number} index - The index of the element to remove.
     * @throws {Error} If the index is out of bounds.
     */
    erase(index) {
        if (this.empty()) {
            throw new Error("The array is empty!");
        }
        if (!Number.isInteger(index)) {
            throw new TypeError("Index must be an integer!");
        }
        if (index < 0 || index > this.#size - 1) {
            throw new Error("Index is out of bound!");
        }
        let tmp = this.#arr[index];
        for (let i = index + 1; i < this.#size; ++i) {
            this.#arr[i - 1] = this.#arr[i];
        }
        --this.#size;
        this.#arr[this.#size] = 0;
        return tmp;
    }

    /**
     * Returns the element at the specified index.
     * @param {number} index - The index of the element.
     * @returns {number} The value of the element.
     * @throws {Error} If the index is out of bounds.
     */
    at(index) {
        if (this.empty()) {
            throw new Error("The array is empty!");
        }
        if (!Number.isInteger(index)) {
            throw new TypeError("Index must be an integer!");
        }
        if (index < 0 || index >= this.#size) {
            throw new Error("Index is out of bound!");
        }
        return this.#arr[index];
    }

    /**
     * Checks if the array is empty.
     * @returns {boolean} true if the array is empty, otherwise false.
     */
    empty() {
        return this.#size === 0;
    }

    /**
     * Clears the array (logically, by resetting the size to 0).
     */
    clear() {
        if (this.empty()) {
            throw new Error("The array is empty!");
        }
        this.#size = 0;
        this.#arr.fill(0);
    }

    /**
     * Sets a new value for the element at the specified index.
     * @param {number} i - The index of the element.
     * @param {number} value - The new value.
     */
    setValue(i, value) {
        if (this.empty()) {
            throw new Error("The array is empty!");
        }
        if (!Number.isInteger(i)) {
            throw new TypeError("Index must be a positive integer!");
        }
        if (i < 0 || i > this.#size - 1) {
            throw new Error("Index is out of bound!");
        }
        if (typeof value !== "number") {
            throw new TypeError("Value must be of type number!");
        }
        return (this.#arr[i] = value);
    }

    /**
     * Returns the first element of the array.
     * @returns {number|undefined} The first element.
     */
    front() {
        if (this.empty()) {
            throw new Error("The array is empty!");
        }
        return this.#arr[0];
    }

    /**
     * Returns the last element of the array.
     * @returns {number|undefined} The last element.
     */
    back() {
        if (this.empty()) {
            throw new Error("The array is empty!");
        }
        return this.#arr[this.#size - 1];
    }

    /**
     * Returns the current capacity of the array.
     * @returns {number} The capacity.
     */
    capacity() {
        return this.#capacity;
    }

    /**
     * Returns the current size of the array.
     * @returns {number} The size.
     */
    size() {
        return this.#size;
    }

    /**
     * Makes the object iterable (allows the use of a for...of loop).
     * @returns {Iterator} Iterator object.
     */
    [Symbol.iterator]() {
        let i = 0;
        return {
            next: () => {
                if (this.empty()) {
                    return { value: undefined, done: true };
                }
                if (i < this.#size) {
                    return { value: this.#arr[i++], done: false };
                } else {
                    return { value: undefined, done: true };
                }
            },
        };
    }

    /**
     * Reserves memory, increasing capacity to n if the current capacity is less than n.
     * @param {number} n - The desired minimum capacity.
     */
    reserve(n) {
        if (!Number.isInteger(n) || n <= 0) {
            throw new TypeError("Capacity must be a positive integer!");
        }
        if (n > this.#capacity) {
            this.resize(n);
        }
    }

    /**
     * Shrinks the capacity of the array to fit its actual size (#size).
     */
    shrinkToFit() {
        this.resize(this.#size);
    }

    /**
     * Converts the structure to a standard JavaScript array.
     * @returns {Array<number>} A standard array of elements.
     */
    toArray() {
        let arrJS = new Array(this.#size);
        for (let i = 0; i < this.#size; ++i) {
            arrJS[i] = this.#arr[i];
        }
        return arrJS;
    }

    /**
     * Inserts an element at the specified position, shifting the rest of the elements to the right.
     * @param {number} pos - The index to insert at.
     * @param {number} value - The value to insert.
     * @throws {Error} If the position is out of bounds.
     */
    insert(pos, value) {
        if (!Number.isInteger(pos) || pos < 0) {
            throw new TypeError("Position must be a positive integer");
        }
        if (typeof value !== "number") {
            throw new TypeError("Value must be of type number!");
        }
        if (this.#size === this.#capacity) {
            this.resize(this.#capacity * this.CAP_EXPONENT);
        }
        for (let i = this.#size; i > pos; --i) {
            this.#arr[i] = this.#arr[i - 1];
        }
        ++this.#size;
        return (this.#arr[pos] = value);
    }

    /**
     * Swaps two elements by their indices.
     * @param {number} i - The index of the first element.
     * @param {number} j - The index of the second element.
     * @throws {RangeError} If either index is out of bounds.
     */
    swap(i, j) {
        if (this.#size <= 1) {
            throw new Error("No enough elements for swapping!");
        }
        if (!Number.isInteger(i) || i < 0 || !Number.isInteger(j) || j < 0) {
            throw new TypeError("Index must be a positive integer!");
        }
        if (i < 0 || i > this.#size - 1 || j < 0 || j > this.#size - 1) {
            throw new Error("Index is out of bound!");
        }
        if (i === j) {
            return;
        }
        [this.#arr[i], this.#arr[j]] = [this.#arr[j], this.#arr[i]];
    }

    /**
     * Returns an iterator for the array's values.
     * @returns {Iterator} Value iterator.
     */
    values() {
        return this[Symbol.iterator]();
    }

    /**
     * Returns an iterator for the array's keys (indices).
     * @returns {Iterator} Key iterator.
     */
    keys() {
        let i = 0;
        return {
            next: () => {
                if (i < this.#size) {
                    return { value: i++, done: false };
                } else {
                    return { value: undefined, done: true };
                }
            },
        };
    }

    /**
     * Returns an iterator for [index, value] pairs.
     * @returns {Iterator} Entries iterator.
     */
    entries() {
        let i = 0;
        return {
            next: () => {
                if (this.empty()) {
                    return { value: undefined, done: true };
                }
                if (i < this.#size) {
                    return { value: [i, this.#arr[i++]], done: false };
                } else {
                    return { value: undefined, done: true };
                }
            },
        };
    }

    /**
     * Executes a provided function once for each array element.
     * @param {Function} callback - Function to execute on each element.
     * @param {Object} [thisArg] - Value to use as 'this' when executing the callback.
     * @throws {TypeError} If callback is not a function.
     */
    forEach(callback, thisArg) {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function!");
        }
        if (this.empty()) {
            throw new Error("The array is empty!");
        }
        for (let i = 0; i < this.#size; ++i) {
            callback.call(thisArg, this.#arr[i], i, this);
        }
    }

    /**
     * Creates a new DArray populated with the results of calling a provided function on every element.
     * @param {Function} callback - Function that is called for every element.
     * @param {Object} [thisArg] - Value to use as 'this' when executing the callback.
     * @returns {DArray} A new dynamic array.
     */
    map(callback, thisArg) {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function!");
        }
        if (this.empty()) {
            throw new Error("The array is empty!");
        }
        let newArr = new DArray(this.#capacity);
        for (let i = 0; i < this.#size; ++i) {
            newArr.push_back(callback.call(thisArg, this.#arr[i], i, this));
        }
        return newArr;
    }

    /**
     * Creates a new DArray with all elements that pass the test implemented by the provided function.
     * @param {Function} callback - Predicate function to test each element.
     * @param {Object} [thisArg] - Value to use as 'this' when executing the callback.
     * @returns {DArray} A filtered dynamic array.
     */
    filter(callback, thisArg) {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function!");
        }
        if (this.empty()) {
            throw new Error("The array is empty!");
        }
        let newArr = new DArray(this.#capacity);
        for (let i = 0; i < this.#size; ++i) {
            if (callback.call(thisArg, this.#arr[i], i, this)) {
                newArr.push_back(this.#arr[i]);
            }
        }
        return newArr;
    }

    /**
     * Executes a user-supplied "reducer" callback function on each element of the array, passing in the return value from the calculation on the preceding element.
     * @param {Function} callback - Function to execute on each element.
     * @param {*} [initialValue] - Initial value for the accumulator.
     * @returns {*} The final reduced value.
     * @throws {TypeError} If the array is empty and no initialValue is provided.
     */
    reduce(callback, initialValue) {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function!");
        }
        if (this.empty() || initialValue === undefined) {
            throw new TypeError("Empty array or no initialValue!");
        }
        let res = initialValue;
        for (let i = 0; i < this.#size; ++i) {
            res = callback(res, this.#arr[i], i, this.#arr);
        }
        return res;
    }

    /**
     * Tests whether at least one element in the array passes the test implemented by the provided function.
     * @param {Function} callback - Function to test for each element.
     * @param {Object} [thisArg] - Value to use as 'this' when executing the callback.
     * @returns {boolean} true if at least one element passes the test, otherwise false.
     */
    some(callback, thisArg) {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function!");
        }
        if (this.empty()) {
            throw new TypeError("Empty array!");
        }
        for (let i = 0; i < this.#size; ++i) {
            if (callback.call(thisArg, this.#arr[i], i, this.#arr)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Tests whether all elements in the array pass the test implemented by the provided function.
     * @param {Function} callback - Function to test for each element.
     * @param {Object} [thisArg] - Value to use as 'this' when executing the callback.
     * @returns {boolean} true if all elements pass the test, otherwise false.
     */
    every(callback, thisArg) {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function!");
        }
        if (this.empty()) {
            throw new TypeError("Empty array!");
        }
        for (let i = 0; i < this.#size; ++i) {
            if (!callback.call(thisArg, this.#arr[i], i, this.#arr)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns the value of the first element in the array that satisfies the provided testing function.
     * @param {Function} callback - Function to test for each element.
     * @param {Object} [thisArg] - Value to use as 'this' when executing the callback.
     * @returns {number|undefined} The value of the found element, or undefined.
     */
    find(callback, thisArg) {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function!");
        }
        if (this.empty()) {
            throw new TypeError("Empty array!");
        }
        for (let i = 0; i < this.#size; ++i) {
            if (callback.call(thisArg, this.#arr[i], i, this.#arr)) {
                return this.#arr[i];
            }
        }
        return undefined;
    }

    /**
     * Returns the index of the first element in the array that satisfies the provided testing function.
     * @param {Function} callback - Function to test for each element.
     * @param {Object} [thisArg] - Value to use as 'this' when executing the callback.
     * @returns {number} The index of the found element, or -1 if not found.
     */
    findIndex(callback, thisArg) {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function!");
        }
        if (this.empty()) {
            throw new TypeError("Empty array!");
        }
        for (let i = 0; i < this.#size; ++i) {
            if (callback.call(thisArg, this.#arr[i], i, this.#arr)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Determines whether an array includes a certain value among its entries.
     * @param {number} value - The value to search for.
     * @returns {boolean} true if the value is found, otherwise false.
     */
    includes(value) {
        for (let i = 0; i < this.#size; ++i) {
            if (this.#arr[i] === value) {
                return true;
            }
        }
        return false;
    }
}
