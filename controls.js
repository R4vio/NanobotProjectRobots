import { move } from "./globalFunctions.js";

export default function checkKey(e, currentbot, rows, columns, allPositions, allRobots) {
    if (e.keyCode == '38') {
        // up arrow
        console.log('up')
        return move(currentbot, rows, columns, allPositions, allRobots, {dx: 0, dy: -1});
    }
    else if (e.keyCode == '40') {
        // down arrow
        console.log('down')
        return move(currentbot, rows, columns, allPositions, allRobots, {dx: 0, dy: 1});
    }
    else if (e.keyCode == '37') {
        // left arrow
        console.log('left')
        return move(currentbot, rows, columns, allPositions, allRobots, {dx: -1, dy: 0});
    }
    else if (e.keyCode == '39') {
        // right arrow
        console.log('right')
        return move(currentbot, rows, columns, allPositions, allRobots, {dx: 1, dy: 0});
    }
    

}