function ArrinArr(haystack, needle){
    let length = haystack.length;
    for (let i= 0; i< length;i++){
        if(haystack[i][0] === needle[0] && haystack[i][1] === needle[1]){
            return true
        }
    }
    return false;
}

function getObstacleMaps(){
   return JSON.parse(localStorage.getItem('obstacleMaps'))
}

function getMouseCoords(e, cellSize, columns, rows){
    let clickPosition = {x: e.clientX - 32, y: e.clientY - 32};
    if ((Math.floor(clickPosition.x / cellSize)) >= 0 && (Math.floor(clickPosition.x / cellSize) < columns) && Math.floor(clickPosition.y / cellSize) >= 0 && Math.floor(clickPosition.y / cellSize) < rows) {
        let xy = [Math.floor(clickPosition.x / cellSize), Math.floor(clickPosition.y / cellSize)]
        return xy;
    }
}

function popValue(poses, pos){
    let index = IndexArrinArr(poses, pos);
    if (index > -1){
        poses.splice(index, 1)
    }
    return poses
}
function IndexArrinArr(haystack, needle){
    let length = haystack.length;
    for (let i= 0; i< length;i++){
        if(haystack[i][0] === needle[0] && haystack[i][1] === needle[1]){
            return i
        }
    }
    return -1;
}
//dir: {dx, dy}
function move(currentpos, rows, cols, allPositions, allRobots, dir){
    let {dx, dy} = dir;
    let nextpos = [currentpos[0]+dx, currentpos[1]+dy]
    if(checkmove(nextpos, rows, cols, allPositions, allRobots)){
        allRobots[IndexArrinArr(allRobots, currentpos)] = nextpos
    }
    return allRobots
}
function checkmove(nextpos, rows, cols, allPositions, allRobots){
    if(checkBounds(nextpos, rows, cols) && !ArrinArr(allRobots, nextpos) && !ArrinArr(allPositions, nextpos)){
        return true
    }
    return false
}
function checkBounds(pos, rows, cols){
    let [x, y] = pos;
    if (x < cols && x >= 0 && y >= 0 && y < rows) {
        return true;
    }
    return false;
}

// check for duplicate map names
function duplicate(mapInput){
    let maps = getObstacleMaps() || [];
    let i = 0;
    while (i< maps.length){
        let map = maps[i];
        if (Object.keys(map)[0] === mapInput){
            return true;
        }
        i++;
    }
    return false;
}
export {ArrinArr, getObstacleMaps, getMouseCoords, popValue, duplicate, move, IndexArrinArr}
