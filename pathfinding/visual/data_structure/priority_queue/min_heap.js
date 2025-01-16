export default class MinHeap {
    constructor() {
        this.heap = [];
    }

    // Get the index of the parent node
    parentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    // Get the index of the left child node
    leftChildIndex(index) {
        return 2 * index + 1;
    }

    // Get the index of the right child node
    rightChildIndex(index) {
        return 2 * index + 2;
    }

    // Swap two nodes
    swap(i, j) {
        let temp = this.heap[i]
        this.heap[i] = this.heap[j]
        this.heap[j] = temp;
    }

    // Insert a new node
    insert(node) {
        this.heap.push(node);
        this.heapifyUp();
    }

    // Move the last node up to maintain the heap property
    heapifyUp() {
        let index = this.heap.length - 1;
        let parentIdx;
        while (index > 0) {
            parentIdx = this.parentIndex(index);
            if (this.heap[parentIdx].f <= this.heap[index].f) break;
            this.swap(parentIdx, index);
            index = parentIdx;
        }
    }

    // Extract the node with the minimum f cost
    extractMin() {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.heapifyDown();
        }
        return min;
    }

    // Move the root node down to maintain the heap property
    heapifyDown() {
        let index = 0;
        const length = this.heap.length;
        let smallestIdx, leftChildIdx, rightChildIdx;
        while (true) {
            smallestIdx = index;
            leftChildIdx = this.leftChildIndex(index);
            rightChildIdx = this.rightChildIndex(index);

            if (leftChildIdx < length && this.heap[leftChildIdx].f < this.heap[smallestIdx].f) {
                smallestIdx = leftChildIdx;
            }
            if (rightChildIdx < length && this.heap[rightChildIdx].f < this.heap[smallestIdx].f) {
                smallestIdx = rightChildIdx;
            }
            if (smallestIdx === index) break;
            this.swap(index, smallestIdx);
            index = smallestIdx;
        }
    }

    // Check if the heap is empty
    isEmpty() {
        return this.heap.length === 0;
    }
}