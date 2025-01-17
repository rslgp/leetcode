//HIGHLY OPTIMIZED
import MinHeap from "../../data_structure/priority_queue/min_heap_array.js";

// Node class
class Node {
    constructor(x, y, wall = 0, g = 0, h = 0, f = 0, parent = null) {
        this.x = x;
        this.y = y;
        this.g = g; // Cost from start to this node
        this.h = h; // Heuristic cost to goal
        this.f = f; // Total cost (g + h)
        this.parent = parent; // To track the path
        this.wallIgnored = wall; // Number of walls ignored to reach this node
    }

    // Helper method to calculate the heuristic (Manhattan distance)
    calculateHeuristic(goal) {
        return Math.abs(this.x - goal.x) + Math.abs(this.y - goal.y);
    }

    // Helper method to check if two nodes are equal
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }

    // Helper method to get a string representation of the node
    toString() {
        return `${this.x},${this.y}`;
    }
}

class ClosedList {
    constructor(grid) {
        this.width = grid[0].length;
        this.instance = new Set(); // Use a Set for memory efficiency
    }

    visit(node) {
        let uniqueIndex = node.x * this.width + node.y;
        this.instance.add(uniqueIndex);
    }

    isVisited(node) {
        let uniqueIndex = node.x * this.width + node.y;
        return this.instance.has(uniqueIndex);
    }

    isVisited(x, y) {
        let uniqueIndex = x * this.width + y;
        // return this.instance[uniqueIndex] === true;
        return this.instance.has(uniqueIndex);
    }
}

function aStar(start, goal, grid, MaxWallIgnore = 1, WALL_PENALITY = .01) {
    const openList = new MinHeap(grid); // Use a min-heap for the open list
    const closedList = new ClosedList(grid); // Use a closed list to track visited nodes

    const explored = [];

    let newX, newY;
    const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
    ];
    const LIMIT_COMPRIMENTO = grid.length;
    const LIMIT_LARGURA = grid[0].length;

    // Initialize the start node
    start.h = start.calculateHeuristic(goal);
    start.f = start.g + start.h;
    openList.insert(start);

    while (!openList.isEmpty()) {
        // Extract the node with the lowest f cost
        const current = openList.extractMin();

        // Mark the node as visited
        closedList.visit(current);

        // Highlight explored nodes
        if (!current.equals(start) && !current.equals(goal)) {
            explored.push(current);
        }

        // If we reached the goal, reconstruct the path
        if (current.equals(goal)) {
            const path = [];
            let temp = current;
            while (temp) {
                path.push(temp);
                temp = temp.parent;
            }
            path.reverse();
            return { path, explored };
        }

        // Explore neighbors
        for (const dir of directions) {
            newX = current.x + dir.x;
            newY = current.y + dir.y;

            // Check boundaries
            if (
                newX < LIMIT_COMPRIMENTO &&
                newY < LIMIT_LARGURA &&
                newX >= 0 &&
                newY >= 0
            ) {
                const isObs = grid[newX][newY] === 1;
                const wall = current.wallIgnored + (isObs ? 1 : 0); // Count obstacles ignored per node

                // Skip if the number of walls ignored exceeds the limit
                if (wall > MaxWallIgnore) continue;

                // Skip if the neighbor is already in the closed list
                if (closedList.isVisited(newX, newY)) continue;

                // Create a new neighbor node
                const neighbor = new Node(newX, newY, wall, current.g + 1);


                // Calculate the heuristic and total cost
                neighbor.h = neighbor.calculateHeuristic(goal);
                const wallPenalty = neighbor.wallIgnored > 0 ? WALL_PENALITY : 0; // Large penalty for bypassing walls
                neighbor.f = neighbor.g + neighbor.h + wallPenalty;
                neighbor.parent = current;

                // Check if this neighbor is already in the open list with a better or equal cost
                const existingNode = openList.get(neighbor);
                if (existingNode && existingNode.f <= neighbor.f) continue;

                // Add the neighbor to the open list
                openList.insert(neighbor);
            }
        }
    }
    return { path: [], explored }; // No path found
}

export { Node, aStar };