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
export {ArrinArr, getObstacleMaps, getMouseCoords, popValue}