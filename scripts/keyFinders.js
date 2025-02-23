export function getFirstKey(map) {
    return map.keys().next().value;
}

export function getNextKey(map, currentKey = 0) {
    let mapIter = map.keys();
    let found = false
    
    for (let key of mapIter) {
        if (found) return key;
        if (key === currentKey) 
            found = true;
    }
    return getFirstKey(map);
}