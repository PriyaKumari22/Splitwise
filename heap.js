export { BinaryHeap };

class BinaryHeap {
  constructor() {
    this.heap = [];
  }

  insert(value) {
    console.log(value);
    this.heap.push(value);
    this.bubbleUp();
  }

  size() {
    return this.heap.length;
  }

  empty() {
    return this.size() === 0;
  }

  bubbleUp() {
    let idx = this.size() - 1;

    while (idx > 0) {
      let element = this.heap[idx],
        parentIndex = Math.floor((idx - 1) / 2),
        parent = this.heap[parentIndex];

      if (parent[0] >= element[0]) break;
      this.heap[idx] = parent;
      this.heap[parentIndex] = element;
      idx = parentIndex;
    }
  }

  extractMax() {
    const max = this.heap[0];
    const tmp = this.heap.pop();
    if (!this.empty()) {
      this.heap[0] = tmp;
      this.sinkDown(0);
    }
    return max;
  }

  sinkDown(idx) {
    let lf = 2 * idx + 1,
      rt = 2 * idx + 2,
      lrgst = idx;
    const length = this.size();

    if (lf < length && this.heap[lf][0] > this.heap[lrgst][0]) {
      lrgst = lf;
    }
    if (rt < length && this.heap[rt][0] > this.heap[lrgst][0]) {
      lrgst = rt;
    }

    if (lrgst !== idx) {
      let tmp = this.heap[lrgst];
      this.heap[lrgst] = this.heap[idx];
      this.heap[idx] = tmp;
      this.sinkDown(lrgst);
    }
  }
}
