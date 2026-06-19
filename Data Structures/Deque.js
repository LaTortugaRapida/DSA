class BucketedDeque {
  // === State ===
  #everyBucketsLength = 8;
  #bucketSize;
  #buckets;
  #frontBucket;
  #backBucket;
  #frontIndex;
  #backIndex;
  #size;

  /**
   * @param {number} [bucketSize]
   */
  constructor(bucketSize = 4) {
    this.#init(bucketSize);
  }

  #init(bucketSize) {
    if (Number.isInteger(bucketSize) && bucketSize > 0) {
      if (bucketSize % 2) {
        ++bucketSize;
      }
      this.#bucketSize = bucketSize;
    } else {
      this.#bucketSize = 8;
    }
    this.#size = 0;
    this.#buckets = new Array(this.#bucketSize);
    this.#frontIndex = this.#everyBucketsLength - 1;
    this.#backIndex = 0;
    const mid = this.#bucketSize / 2;
    this.#frontBucket = mid - 1;
    this.#backBucket = mid;
    for (let i = 0; i < this.#bucketSize; ++i) {
      this.#buckets[i] = new Array(this.#everyBucketsLength).fill(undefined);
    }
  }

  // === Core operations ===

  /**
   * @param {*} value
   */
  push_front(value) {
    this.#buckets[this.#frontBucket][this.#frontIndex] = value;
    --this.#frontIndex;
    if (this.#frontIndex < 0) {
      this.#frontIndex = this.#everyBucketsLength - 1;
      --this.#frontBucket;
      if (this.#frontBucket < 0) {
        this._ensureBucket(true);
      }
    }
    ++this.#size;
  }

  /**
   * @param {*} value
   */
  push_back(value){ 
    this.#buckets[this.#backBucket][this.#backIndex] = value;
    ++this.#backIndex;
    if(this.#backIndex === this.#everyBucketsLength) {
      this.#backIndex = 0;
      ++this.#backBucket;
      if(this.#backBucket === this.#bucketSize) {
        this._ensureBucket(false);
      }
    }
    ++this.#size;
  }

  /**
   * @returns {*}
   * @throws {RangeError} If the deque is empty.
   */
  pop_front() {
    if (this.#size === 0) {
      throw new RangeError("Empty Deque!");
    }
    ++this.#frontIndex;
    if (this.#frontIndex >= this.#everyBucketsLength) {
      this.#frontIndex = 0;
      ++this.#frontBucket;
    }
    const tmp = this.#buckets[this.#frontBucket][this.#frontIndex];
    --this.#size;
    return tmp;
  }

  /**
   * @returns {*}
   * @throws {RangeError} If the deque is empty.
   */
  pop_back() {
    if (this.#size === 0) throw new RangeError("Empty Deque!");
    --this.#backIndex;
    if (this.#backIndex < 0) {
      this.#backIndex = this.#everyBucketsLength - 1;
      --this.#backBucket;
    }
    const tmp = this.#buckets[this.#backBucket][this.#backIndex];
    --this.#size;
    return tmp;
  }

  // === Access ===

  /**
   * @returns {*|undefined}
   */
  front() {
    if (this.#size === 0) return undefined;
    return this.at(0);
  }

  /**
   * @returns {*|undefined}
   */
  back() {
    if (this.#size === 0) return undefined;
    return this.at(this.#size - 1);
  }

  // === Utilities ===

  /**
   * @returns {void}
   */
  clear() {
    this.#init(this.#bucketSize);
  }

  /**
   * @returns {number}
   */
  size() {
    return this.#size;
  }

  /**
   * @returns {boolean}
   */
  isEmpty() {
    return this.#size === 0;
  }

  /**
   * @returns {Array}
   */
  toArray() {
    let arr = [];
    for (let i = 0; i < this.#size; ++i) {
      arr.push(this.at(i));
    }
    return arr;
  }

  /**
   * @param {number} globalIndex
   * @returns {*|undefined}
   */
  at(globalIndex) {
    let val = this._bucketIndex(globalIndex);
    if(val === undefined) return undefined;
    return this.#buckets[val.buckIdx][val.localIdx];
  }

  // === Iterator ===

  /**
   * @returns {Iterator}
   */
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if(index < this.#size) {
          return {value: this.at(index++), done: false};
        }
        return {value: undefined, done: true};
      }
    }
  }

  // === Internal methods (optional) ===

  /**
   * @param {boolean} [front=false]
   */
  _ensureBucket(front = false) {
    const newSize = this.#bucketSize + 2;
    const newBuckets = new Array(newSize);
    if (front) {
      for (let i = 0; i < this.#bucketSize; ++i) {
        newBuckets[i + 2] = this.#buckets[i];
      }
      for (let i = 0; i < 2; ++i) {
        newBuckets[i] = new Array(this.#everyBucketsLength).fill(undefined);
      }
      this.#frontBucket = 1;
      this.#backBucket += 2;
    } else {
      for (let i = 0; i < this.#bucketSize; ++i) {
        newBuckets[i] = this.#buckets[i];
      }
      for (let i = this.#bucketSize; i < newSize; ++i) {
        newBuckets[i] = new Array(this.#everyBucketsLength).fill(undefined);
      }
    }
    this.#buckets = newBuckets;
    this.#bucketSize = newSize;
  }

  /**
   * @param {number} globalIndex
   * @returns {{localIdx: number, buckIdx: number}|undefined}
   */
  _bucketIndex(globalIndex) {
    if(!Number.isInteger(globalIndex) || globalIndex < 0 || globalIndex >= this.#size) 
      return undefined;
    let absoluteIdx = this.#frontIndex + 1 + globalIndex;
    let localIdx = absoluteIdx % this.#everyBucketsLength;
    let buckIdx = this.#frontBucket + Math.floor(absoluteIdx / this.#everyBucketsLength);
    return {localIdx, buckIdx};    
  }
}

