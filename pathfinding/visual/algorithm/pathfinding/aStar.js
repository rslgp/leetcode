import MinHeap from "../../data_structure/priority_queue/min_heap_array.js"

// Node class
class Node {
    constructor(x, y, g = 0, h = 0, f = 0, parent = null) {
        this.x = x;
        this.y = y;
        this.g = g; // Cost from start to this node
        this.h = h; // Heuristic cost to goal
        this.f = f; // Total cost (g + h)
        this.parent = parent; // To track the path
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
        //this.instance = new Array(grid.length * this.width).fill(false); // better performance
        this.instance = new Set(); // better memory efficiency
    }

    visit(node) {
        let uniqueIndex = node.x * this.width + node.y;
        // this.instance[uniqueIndex] = true;
        this.instance.add(uniqueIndex);
    }

    isVisited(node) {
        let uniqueIndex = node.x * this.width + node.y;
        // return this.instance[uniqueIndex] === true;
        return this.instance.has(uniqueIndex);
    }


    isVisited(x, y) {
        let uniqueIndex = x * this.width + y;
        // return this.instance[uniqueIndex] === true;
        return this.instance.has(uniqueIndex);
    }
}

function aStar(start, goal, grid) {
    const openList = new MinHeap(grid); // Use a min-heap for the open list
    const closedList = new ClosedList(grid); //set for memory of formula (index = x * width + y) vs 1D array for performance new Array(grid.length * width).fill(false);

    const explored = [];


    let neighbors = [];
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
        neighbors.length = 0;
        for (const dir of directions) {
            newX = current.x + dir.x;
            newY = current.y + dir.y;

            if (
                //bondaries
                newX < LIMIT_COMPRIMENTO &&
                newY < LIMIT_LARGURA &&
                newX >= 0 &&
                newY >= 0

                //end-bondaries
                && grid[newX][newY] === 0 // free path
            ) {
                if (closedList.isVisited(newX, newY)) continue;
                // that can be improved (see aStar_igWall) to only add add neighbors that are not visited and with smaller g cost
                neighbors.push(new Node(newX, newY));
            }
        }

        let g, h, f, existingNode;
        for (const neighbor of neighbors) {
            //if (closedList.isVisited(neighbor)) continue;

            g = current.g + 1;
            h = neighbor.calculateHeuristic(goal);
            f = g + h;

            // Check if this neighbor is already in the openList with a better g cost
            existingNode = openList.get(neighbor)
            if (existingNode && existingNode.f < f) continue;

            neighbor.g = g;
            neighbor.h = h;
            neighbor.f = f;
            neighbor.parent = current;

            if (!existingNode) {
                openList.insert(neighbor);
            }
        }
    }
    return { path: [], explored }; // No path found
}

export { Node, aStar }