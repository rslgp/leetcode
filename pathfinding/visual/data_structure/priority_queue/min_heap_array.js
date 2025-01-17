import MinHeap from './min_heap.js'; // Import the original MinHeap class

export default class MinHeapWithMap extends MinHeap {
    constructor(grid) {
        super(); // Call the parent class constructor
        this.width = grid[0].length; // Store the grid width

        this.nodeMap = new Map(); // Add a Map for O(1) lookups

        // uses more memory to gain performance
        // this.height = grid.length; // Store the grid height
        // this.nodeArray = new Array(this.width * this.height).fill(null); // Initialize array
    }

    // Helper method to generate a unique integer key for a node
    getKey(node) {
        return node.x * this.width + node.y; // Unique index
    }

    // Override the insert method to update the array
    insert(node) {
        super.insert(node); // Call the parent class insert method
        this.nodeMap.set(this.getKey(node), node); // Add to the Map

        // this.nodeArray[this.getKey(node)] = node; // Add to the array

    }

    // Override the extractMin method to update the array
    extractMin() {
        const min = super.extractMin(); // Call the parent class extractMin method
        if (min) {
            this.nodeMap.delete(this.getKey(min)); // Remove from the Map
            //this.nodeArray[this.getKey(min)] = null; // Remove from the array
        }
        return min;
    }

    // Check if a node exists in the heap
    has(node) {
        return this.nodeMap.has(this.getKey(node));

        //return this.nodeArray[this.getKey(node)] !== null;
    }

    // Get a node from the heap
    get(node) {
        return this.nodeMap.get(this.getKey(node));

        // return this.nodeArray[this.getKey(node)];
    }
}