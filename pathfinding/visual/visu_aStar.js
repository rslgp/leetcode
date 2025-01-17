import { aStar, Node } from "./algorithm/pathfinding/aStar_igWall.js"
const gridElement = document.getElementById("grid");
const startButton = document.getElementById("startButton");

// Example grid (0 = walkable, 1 = blocked)
//

let grid;
// grid = [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
//     [0, 1, 1, 0, 0, 0, 0, 0, 1, 0],
//     [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
//     [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
//     [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
//     [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
//     [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// ]
grid = [
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [0, 1, 0, 0, 0, 0, 1, 0, 1, 1],
    [0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
// grid = [
//     [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
//     [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
//     [0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
//     [0, 1, 1, 1, 1, 0, 1, 0, 1, 0],
//     [0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
//     [0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
//     [0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
//     [0, 1, 1, 1, 1, 1, 1, 0, 0, 0]
// ]

let start = null;
let goal = null;

// Render the grid
function renderGrid(grid) {
    gridElement.innerHTML = "";
    for (let i = 0; i < grid.length; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < grid[i].length; j++) {
            const cell = document.createElement("td");
            cell.dataset.x = i;
            cell.dataset.y = j;

            if (grid[i][j] === 1) {
                cell.classList.add("blocked");
            }

            row.appendChild(cell);
        }
        gridElement.appendChild(row);
    }
}

// Handle cell clicks
function handleCellClick(event) {
    const cell = event.target;
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    if (!start) {
        // Set start point
        start = new Node(x, y);
        cell.classList.add("start");
    } else if (!goal) {
        // Set goal point
        goal = new Node(x, y);
        cell.classList.add("goal");
    } else {
        alert("Start and goal points are already set!");
    }
}

// Visualize the final path
function visualizePath(path) {
    for (const node of path) {
        if (!node.equals(start) && !node.equals(goal)) {
            const cell = gridElement.children[node.x].children[node.y];
            cell.classList.add("path");
        }
    }
}

// Helper function to add delay
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Initialize
renderGrid(grid);

// Add click event listeners to cells
gridElement.querySelectorAll("td").forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
});

async function runExplored(explored) {
    // Highlight explored nodes
    for (let current of explored) {
        if (!current.equals(start) && !current.equals(goal)) {
            const cell = gridElement.children[current.x].children[current.y];
            cell.classList.add("explored");
            await sleep(100); // Delay for visualization
        }
    }
}

// Start A* when the button is clicked
startButton.addEventListener("click", () => {
    if (!start || !goal) {
        alert("Please set both start and goal points!");
        return;
    }
    const { path, explored } = aStar(start, goal, grid);
    console.log(path.length);
    runExplored(explored);
    visualizePath(path);
});