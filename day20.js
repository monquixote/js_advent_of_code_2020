const fs = require('fs');

const rawTiles = fs.readFileSync(process.argv[2], 'utf-8')
    .trim()
    .split('\n')
    .reduce((arr, c) => {
        if (c.length === 0) {
            arr.push([]);
        } else {
            arr[arr.length - 1].push(c)
        }
        return arr;
    }, [[]])

const tiles = rawTiles.reduce((map, [head, ...rest]) => {
    const id = Number(head.slice(5,-1));
    const img = rest.map(x => x.split(''))
    return map.set(id,img);
}, new Map())

function mapToEdges(arr) {
    const edge1 = arr[0]
    const edge2 = arr[arr.length -1]
    const edge3 = arr.reduce((p,c) => {
        p.push(c[0])
        return p
    }, [])
    const edge4 = arr.reduce((p,c) => {
        p.push(c[c.length-1])
        return p
    }, [])
    return [edge1, edge2, edge3, edge4];
}

const newMap = Array.from(tiles.entries()).reduce((p,[key, val]) => {
    return p.set(key,mapToEdges(val));
}, new Map())

function reverseCompare(arr1,arr2) {
    return arr1.join('') === arr2.join('') ||
    [...arr1].reverse().join('') === arr2.join('')
}

function commonEdges(tile1, tile2) {
    let common = 0;
    for(t1 of tile1) {
        for(t2 of tile2) {
            if(reverseCompare(t1,t2)){
                common++
            }
        }
    }
    return common;
}

function findAllCommonEdges(key, tileMap) {
    const toCompare = tileMap.get(key);
    const compareAgainst = Array.from(tileMap.entries())
        .filter(([k,v]) => k !== key)
        .map(([k,v]) => v);
    const numCommon = compareAgainst.filter(x => commonEdges(x, toCompare) > 0)
    return numCommon.length;

}

const allKeys = Array.from(newMap.keys());

const countMap = allKeys.reduce((p,c) => {
    return p.set(c, findAllCommonEdges(c, newMap));
}, new Map())

const cornerIds = Array.from(countMap.entries())
    .filter(([k,v]) => v === 2)
    .map(([k,v]) => k)

const productCorners = cornerIds.reduce((p,c) => p*c);

console.log(countMap)
console.log(cornerIds);
console.log(productCorners)
//findAllCommonEdges(3391, newMap)
 //console.log(newMap)