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
    .map(x => x.slice(1).map(x => x.split('')))

// Top, Bottom, Left, Right
function tileToEdges(arr) {
    const edge1 = arr[0]
    const edge2 = arr[arr.length - 1]
    const edge3 = arr.reduce((p, c) => {
        p.push(c[0])
        return p
    }, [])
    const edge4 = arr.reduce((p, c) => {
        p.push(c[c.length - 1])
        return p
    }, [])
    return [edge1, edge2, edge3, edge4];
}

function reverseCompare(arr1, arr2) {
    return arr1.join('') === arr2.join('') ||
        [...arr1].reverse().join('') === arr2.join('')
}


const allEdges = rawTiles.flatMap(tileToEdges)
const countedEdges = allEdges
    .map(x => x.join(''))
    .reduce((map, edge) => {
        const reversed = edge.split('').reverse().join('')
        if (map.has(edge)) {
            return map.set(edge, map.get(edge) + 1)
        }
        if (map.has(reversed)) {
            return map.set(reversed, map.get(reversed) + 1)
        }
        return map.set(edge, 1)
    }, new Map())

const uniqueEdges = Array.from(countedEdges.entries())
    .filter(([key, val]) => val === 1)
    .map(([key, val]) => key)

function isUniqueEdge(edge) {
    return uniqueEdges.includes(edge.join('')) ||
        uniqueEdges.includes([...edge].reverse().join(''))
}

function flipV(arr) {
    return arr.reverse()
}

function flipH(arr) {
    return arr.map(x => x.reverse())
}

function rotate(matrix) {
    const n = matrix.length;
    const x = Math.floor(n / 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {
        for (let j = i; j < y - i; j++) {
            k = matrix[i][j];
            matrix[i][j] = matrix[y - j][i];
            matrix[y - j][i] = matrix[y - i][y - j];
            matrix[y - i][y - j] = matrix[j][y - i]
            matrix[j][y - i] = k
        }
    }
    return matrix
}

const funcs = [flipV, flipH, rotate];

// Randomly modifies until in the correct orientation
function modifyUntil(arr, condition) {
    while (!condition(arr)) {
        const rand = Math.floor(Math.random() * funcs.length)
        const func = funcs[rand];
        arr = func(arr)
    }
    return arr
}

function hasEdge(tile, edge) {
    return tileToEdges(tile).some(e => reverseCompare(e, edge))
}

// Will remove the tile from the array
function getTileWithEdge(edge, allTiles) {
    const index = allTiles.findIndex(tile => hasEdge(tile, edge))
    if (index === -1) {
        throw Error('Could not find tile with edge ' + edge)
    }
    return allTiles.splice(index, 1);
}

function printTile(tile) {
    tile.forEach(x => console.log(x.join('')))
    console.log('')
}

function completeRow(leftmostTile, allTiles) {
    const result = []
    let current = leftmostTile;
    while (true) {
        result.push(current)
        const [top, bottom, left, right] = tileToEdges(current);
        if (isUniqueEdge(right)) {
            break // We have hit the end of the row
        }
        // console.log('Looking for ', right.join(''))
        const [next] = getTileWithEdge(right, allTiles)
        // console.log(allTiles.length)
        // console.log('Found tile ', tileToEdges(next).map(x => x.join('')))
        current = modifyUntil(next, tile => {
            const [top2, bottom2, left2, right2] = tileToEdges(tile)
            // console.log(left2.join(''))
            return left2.join('') === right.join('')
        })
    }
    return result
}

function allRows(cornerTile, remainingTiles) {
    const result = []
    let currentTile = cornerTile;
    while (true) {
        // console.log('Finding row')
        const row = completeRow(currentTile, remainingTiles)
        result.push(row)
        const [top, bottom, left, right] = tileToEdges(currentTile);
        if (isUniqueEdge(bottom)) {
            break // We have hit the end of the column
        }
        const [next] = getTileWithEdge(bottom, remainingTiles)
        current = modifyUntil(next, tile => {
            const [top2, bottom2, left2, right2] = tileToEdges(tile)
            return top2.join('') === bottom.join('')
        })
        currentTile = current
    }
    return result
}

function removeEdges(tile) {
    const tAndB = tile.slice(1, -1)
    return tAndB.map(x => x.slice(1, -1))
}

function joinRows(tiles) {
    return tiles.reduce((p, c) => {
        return p.map((x, i) => [...x, ...c[i]])
    })
}

const seamonster =
    `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `

const seamonsterIndex = seamonster
    .split('\n')
    .map(line => line.split('').reduce((p, c, i) => {
        if (c === '#') {
            return [...p, i]
        }
        return p
    }, []))

function isMonster(image, i, j) {
    return seamonsterIndex.every((x, index) => x.every(y => image[i + index] ? image[i + index][j + y] === '#' : false))
}

function removeMonster(image, i, j) {
    return seamonsterIndex.forEach((x, index) => x.forEach(y => image[i + index][j + y] = '0'))
}

function checkMonsters(image) {
    for (let i = 0; i < image.length; i++) {
        for (let j = 0; j < image[i].length; j++) {
            if (isMonster(image, i, j)) {
                return true
            }
        }
    }
    return false
}

function removeMonsters(image) {
    for (let i = 0; i < image.length; i++) {
        for (let j = 0; j < image[i].length; j++) {
            if (isMonster(image, i, j)) {
                removeMonster(image, i, j);
            }
        }
    }
    return image
}

function ex2() {
    const remainingTiles = JSON.parse(JSON.stringify(rawTiles));
    // Top left 
    const cornerIndex = remainingTiles.findIndex(rawTile => {
        return tileToEdges(rawTile)
            .filter(isUniqueEdge)
            .length === 2
    })
    const [topLeft] = remainingTiles.splice(cornerIndex, 1);
    const modified = modifyUntil(topLeft, arr => {
        const [top, bottom, left, right] = tileToEdges(arr)
        // console.log(isUniqueEdge(top), isUniqueEdge(bottom), isUniqueEdge(left), isUniqueEdge(right))
        return isUniqueEdge(top) && isUniqueEdge(left)
    })
    const result = allRows(topLeft, remainingTiles)
    const trimmed = result.map(row => row.map(removeEdges))
    const joined = trimmed.map(joinRows);
    const concat = joined.reduce((p, c) => [...p, ...c])
    
    const monstered = modifyUntil(concat, checkMonsters)
    const sansMonsters = removeMonsters(monstered)
    console.log(sansMonsters.map(x => x.join('')))
    const roughness = sansMonsters.flatMap(x => x.filter(y => y === '#')).length
    console.log(roughness)
}

ex2()