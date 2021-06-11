import Cell from "./Cell.js";
import { ArrinArr, getObstacleMaps, getMouseCoords, popValue, duplicate, move, IndexArrinArr} from "./globalFunctions.js";
import {checkKey} from './controls.js'

const canvas = document.createElement("canvas");
const canvasContainer = document.querySelector(".canvas-container");
canvas.width = canvasContainer.clientWidth;
canvas.height = canvasContainer.clientHeight;
const c = canvas.getContext("2d");
c.strokeStyle = "#000";
c.fillStyle = "#ccc";

const rows = 100;
const columns = 140;
let cellSize = 1;
canvasContainer.clientHeight / rows < canvasContainer.clientWidth / columns
	? (cellSize = canvasContainer.clientHeight / rows)
	: (cellSize = canvasContainer.clientWidth / columns);
c.font = `${cellSize / 3}px sans-serif`;

// setup board
let grid;
var finder = new PF.AStarFinder();
let currentbot;
let interval;
let cells = [];
let allPositions = [];
let allRobots = [];
let allGoals = [];
let paths = [];
let bgImage;
function setup() {
	bgImage = new Image(1, 1);
	bgImage.src = './garbage.jpg';
	grid = new PF.Grid(columns, rows)
	cells = [];
	paths = [];
	allPositions = [];
	allRobots = [];
	currentbot = [];
	clearInterval(interval);
	for (let x = 0; x < columns; x++) {
		for (let y = 0; y < rows; y++) {
			cells.push(new Cell(c, x, y, cellSize));
		}
	}
	interval = setInterval(animate, 100);
}

setup();
let goal = [2,2];
let autonomousBots = false;
function animate() {
	
	if(autonomousBots){
		if (allGoals.length > 0){
			goal = allGoals[0]
			pathfollow(TherapyMode);
		}
	}
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.drawImage(bgImage, 0, 0, cellSize * columns, cellSize * rows,);
	cells.forEach((cell, i) => {
		cell.draw();
	});
	
}
function pathfollow(targetMode){
	for (let i = 0; i < allRobots.length; i++) {
		let robot = allRobots[i];
		let x = robot[0]
		let y = robot[1]
		goal = allGoals[i%allGoals.length]
		console.log(grid.clone())
		let path = finder.findPath(x, y, goal[0], goal[1], grid.clone());
		let pathmove;
		path.length > 1 ? pathmove = path[1] : pathmove = path[0];
		cells[x*rows + y].changeType('empty');
		allRobots = move(robot, rows, columns, allPositions, allRobots, {dx: pathmove[0]-x , dy: pathmove[1]-y} );
		robot = allRobots[i];
		cells[robot[0]*rows + robot[1]].changeType('robot');
		updateRobotList();
	}
}
const saveForm = document.getElementById("save-form");
const mapName = document.getElementById("map-name");

saveForm.addEventListener("submit", (e) => {
	e.preventDefault();
	let mapInput = mapName.value;
	if (!duplicate(mapInput)) {
		let newMap = Object.create({});
		newMap[mapInput] = allPositions;

		let oldMaps;

		if (localStorage.getItem("obstacleMaps")) {
			oldMaps = getObstacleMaps();
		} else {
			oldMaps = [];
		}
		localStorage.setItem("obstacleMaps", JSON.stringify([...oldMaps, newMap]));
		mapName.value = "";
	} else {
		console.log("Duplicate names!");
	}
});

let uploadOpen = true;
const uploadBtn = document.getElementById("upload-btn");
uploadBtn.addEventListener("click", (e) => {
	if (uploadOpen) {
		makeListItems();
	} else {
		itemList.innerHTML = "";
	}
	uploadOpen = !uploadOpen;
});

const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", (e) => {
	setup();
	updateRobotList();
});

const itemList = document.getElementById("saved-items");
function makeListItems() {
	itemList.innerHTML = "";
	let maps = getObstacleMaps() || [];
	if (maps.length > 0) {
		maps.forEach((map) => {
			let name = Object.keys(map);
			let liTag = document.createElement("li");
			liTag.textContent = name;
			itemList.appendChild(liTag);
			liTag.addEventListener("click", (e) => {
				loadMap(map[name[0]]);
			});
		});
	}
	// mapNames.flat()
}

const robotList = document.getElementById("robots");
robotList.addEventListener("click", (e) => {
	if (e.target.nodeName != "UL") {
		let coords = e.target.textContent.split(",").map(x=>+x);
		currentbot = coords;
		Array.from(robotList.children).forEach((li) => {
			li.classList.remove("active-robot");
		});
		e.target.classList.add("active-robot");
	}
	console.log(currentbot)
	// let robotPositionValue = e.target
	// currentbot = allRobots[i]// where i is index of bot
});
function loadMap(map) {
	console.log(map);
	for (let i = 0; i < map.length; i++) {
		let [x, y] = [map[i][0], map[i][1]];
		//console.log(x, y)
		// console.log(cells[x*rows + y])
		cells[x * rows + y].changeType("obstacle");
		grid.setWalkableAt(x, y, false)
		allPositions.push([x, y]);
	}
}
let ObstacleMode = true;
let TherapyMode = true;
let RobotMode = true;
window.addEventListener("click", (e) => {
	let clickPosition = { x: e.clientX - 32, y: e.clientY - 32 };
	if (
		Math.floor(clickPosition.x / cellSize) >= 0 &&
		Math.floor(clickPosition.x / cellSize) < columns &&
		Math.floor(clickPosition.y / cellSize) >= 0 &&
		Math.floor(clickPosition.y / cellSize) < rows
	) {
		let xy = [Math.floor(clickPosition.x / cellSize), Math.floor(clickPosition.y / cellSize)];
		let [x, y] = [xy[0], xy[1]];
		if (ObstacleMode){
			if (!ArrinArr(allPositions, xy)) {
				cells[x * rows + y].changeType("obstacle");
				grid.setWalkableAt(x, y, false)
				allRobots = popValue(allRobots, [x, y]);
				allPositions.push(xy);
				updateRobotList();
			}
		}else{
			// goals
			if (!ArrinArr(allGoals, xy)) {
				if(TherapyMode){
					if (allGoals.length > 0){
						let xytemp = allGoals[0]
						cells[xytemp[0] * rows + xytemp[1]].changeType("empty");
					}
					allGoals = [xy]
				} else{
					allGoals.push(xy);
				}
				cells[x * rows + y].changeType("goal");
				grid.setWalkableAt(x, y, true)
				allRobots = popValue(allRobots, [x, y]);
				allPositions = popValue(allPositions, [x, y])
				updateRobotList();
			}
		}
		
	}
});

window.oncontextmenu = (e) => {
	e.preventDefault();
	let [x, y] = getMouseCoords(e, cellSize, columns, rows);
	if(RobotMode){
		if (!ArrinArr(allRobots, [x, y])) {
			cells[x * rows + y].changeType("robot");
			grid.setWalkableAt(x, y, true)
			allPositions = popValue(allPositions, [x, y]);
			allRobots.push([x, y]);
		}
	} else{
		cells[x * rows + y].changeType("empty");
		grid.setWalkableAt(x, y, true)
		allPositions = popValue(allPositions, [x, y]);
	}
	
	updateRobotList();
	console.log(allRobots)
};

function updateRobotList() {
	robotList.innerHTML = "";
	allRobots.forEach((robot) => {
		const li = document.createElement("li");
		li.textContent = robot;
		robotList.appendChild(li);
	});
}

window.addEventListener("keydown", (e) => {
	checkKey(e)
	let index = IndexArrinArr(allRobots, currentbot)
	if (index != -1){
		cells[currentbot[0]*rows + currentbot[1]].changeType('empty')
		switch (e.key) {
			case "w":
				allRobots = move(currentbot, rows, columns, allPositions, allRobots, {dx: 0 , dy: -1} )
				break;
			case "a":
				allRobots = move(currentbot, rows, columns, allPositions, allRobots, {dx: -1 , dy: 0} )
				break;
			case "s":
				allRobots = move(currentbot, rows, columns, allPositions, allRobots, {dx: 0 , dy: 1} )
				break;
			case "d":
				allRobots = move(currentbot, rows, columns, allPositions, allRobots, {dx: 1 , dy: 0} )
				break;
			default:
				break;
		}
		currentbot = allRobots[index]
		cells[currentbot[0]*rows + currentbot[1]].changeType('robot')
		updateRobotList();
	}
});

const manualHandling = document.getElementById('manual-handling');
manualHandling.addEventListener('change',e => {
	autonomousBots = false;
    // console.log(e.target.checked);
})
const autonomousHandling = document.getElementById('autonomous-handling');
autonomousHandling.addEventListener('change',e => {
	autonomousBots = true;
    
})
const obstacleEntity = document.getElementById('obstacle-entity');
obstacleEntity.addEventListener('change', e => {
	ObstacleMode = true;
})
const goalEntity = document.getElementById('goal-entity');
goalEntity.addEventListener('change', e => {
	ObstacleMode = false;
})
const emptyEntity = document.getElementById('empty-entity');
emptyEntity.addEventListener('change', e => {
	RobotMode = false;
})
const robotEntity = document.getElementById('robot-entity');
robotEntity.addEventListener('change', e => {
	RobotMode = true;
})
const targetTherapy = document.getElementById('target-therapy');
targetTherapy.addEventListener('change', e => {
	TherapyMode = true;
	//loop over allGoals
	for(let i = 0; i < allGoals.length; i++){
		let xtemp = allGoals[i][0]
		let ytemp = allGoals[i][1]
		cells[xtemp * rows + ytemp].changeType("empty");
	}
	allGoals = []
})
const targetTelemetry = document.getElementById('target-telemetry');
targetTelemetry.addEventListener('change', e => {
	TherapyMode = false;
})

document.querySelector(".canvas-container").appendChild(canvas);
