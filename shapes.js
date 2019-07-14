/*
 * Architectural change:
 * every shape manipulation happens in shapes.js
 * including reversals
 */

function pushMultiple(lst1, lst2) {
    for (let i = 0; i < lst2.length; i++) {
        lst1.push(lst2[i]);
    }
}

function normalizeList(lst) {
    var magnitude = 0;
    for (var i = 0; i < lst.length; i++) {
        magnitude += lst[i]*lst[i];
    }

    magnitude = Math.sqrt(magnitude);

    for (var i = 0; i < lst.length; i++) {
        lst[i] /= magnitude;
    }
}

function cross3(lst1, lst2) {
    return [
        [lst1[1] * lst2[2] - lst1[2] * lst2[1]],
        [lst1[2] * lst2[0] - lst1[0] * lst2[2]],
        [lst1[0] * lst2[1] - lst1[1] * lst2[0]]
    ];
}

function negateV(lst) {
    for (let i = 0; i < lst.length; i++) lst[i] *= -1;
}

function negativeV(lst) {
    var newLst = [];
    for (let i = 0; i < lst.length; i++) newLst.push(lst[i] * -1);
    return newLst;
}

function distanceFromZeroWhenAdded(position, v) {
    return Math.sqrt(
        (position[0] + v[0]) * (position[0] + v[0]) +
        (position[1] + v[1]) * (position[1] + v[1]) +
        (position[2] + v[2]) * (position[2] + v[2])
    )
}

function makeIcosphereTrigs(icoVerts) {
    var trigs = [
    [icoVerts[0][0], icoVerts[0][1], icoVerts[0][2]],
    [icoVerts[11][0], icoVerts[11][1], icoVerts[11][2]],
    [icoVerts[5][0],  icoVerts[5][1],  icoVerts[5][2]],

    [icoVerts[0][0],  icoVerts[0][1],  icoVerts[0][2]],
    [icoVerts[5][0],  icoVerts[5][1],  icoVerts[5][2]],
    [icoVerts[1][0],  icoVerts[1][1],  icoVerts[1][2]],
    
    [icoVerts[0][0],  icoVerts[0][1],  icoVerts[0][2]],
    [icoVerts[1][0],  icoVerts[1][1],  icoVerts[1][2]],
    [icoVerts[7][0],  icoVerts[7][1],  icoVerts[7][2]],
    
    [icoVerts[0][0],  icoVerts[0][1],  icoVerts[0][2]],
    [icoVerts[7][0],  icoVerts[7][1],  icoVerts[7][2]],
    [icoVerts[10][0], icoVerts[10][1], icoVerts[10][2]],
    
    [icoVerts[0][0],  icoVerts[0][1],  icoVerts[0][2]],
    [icoVerts[10][0], icoVerts[10][1], icoVerts[10][2]],
    [icoVerts[11][0], icoVerts[11][1], icoVerts[11][2]],
    
    [icoVerts[1][0],  icoVerts[1][1],  icoVerts[1][2]],
    [icoVerts[5][0],  icoVerts[5][1],  icoVerts[5][2]],
    [icoVerts[9][0],  icoVerts[9][1],  icoVerts[9][2]],
    
    [icoVerts[5][0],  icoVerts[5][1],  icoVerts[5][2]],
    [icoVerts[11][0], icoVerts[11][1], icoVerts[11][2]],
    [icoVerts[4][0],  icoVerts[4][1],  icoVerts[4][2]],
    
    [icoVerts[11][0], icoVerts[11][1], icoVerts[11][2]],
    [icoVerts[10][0], icoVerts[10][1], icoVerts[10][2]],
    [icoVerts[2][0],  icoVerts[2][1],  icoVerts[2][2]],
    
    [icoVerts[10][0], icoVerts[10][1], icoVerts[10][2]],
    [icoVerts[7][0],  icoVerts[7][1],  icoVerts[7][2]],
    [icoVerts[6][0],  icoVerts[6][1],  icoVerts[6][2]],
    
    [icoVerts[7][0],  icoVerts[7][1],  icoVerts[7][2]],
    [icoVerts[1][0],  icoVerts[1][1],  icoVerts[1][2]],
    [icoVerts[8][0],  icoVerts[8][1],  icoVerts[8][2]],
    
    [icoVerts[3][0],  icoVerts[3][1],  icoVerts[3][2]],
    [icoVerts[9][0],  icoVerts[9][1],  icoVerts[9][2]],
    [icoVerts[4][0],  icoVerts[4][1],  icoVerts[4][2]],
    
    [icoVerts[3][0],  icoVerts[3][1],  icoVerts[3][2]],
    [icoVerts[4][0],  icoVerts[4][1],  icoVerts[4][2]],
    [icoVerts[2][0],  icoVerts[2][1],  icoVerts[2][2]],
    
    [icoVerts[3][0],  icoVerts[3][1],  icoVerts[3][2]],
    [icoVerts[2][0],  icoVerts[2][1],  icoVerts[2][2]],
    [icoVerts[6][0],  icoVerts[6][1],  icoVerts[6][2]],
    
    [icoVerts[3][0],  icoVerts[3][1],  icoVerts[3][2]],
    [icoVerts[6][0],  icoVerts[6][1],  icoVerts[6][2]],
    [icoVerts[8][0],  icoVerts[8][1],  icoVerts[8][2]],
    
    [icoVerts[3][0],  icoVerts[3][1],  icoVerts[3][2]],
    [icoVerts[8][0],  icoVerts[8][1],  icoVerts[8][2]],
    [icoVerts[9][0],  icoVerts[9][1],  icoVerts[9][2]],
    
    [icoVerts[4][0],  icoVerts[4][1],  icoVerts[4][2]],
    [icoVerts[9][0],  icoVerts[9][1],  icoVerts[9][2]],
    [icoVerts[5][0],  icoVerts[5][1],  icoVerts[5][2]],
    
    [icoVerts[2][0],  icoVerts[2][1],  icoVerts[2][2]],
    [icoVerts[4][0],  icoVerts[4][1],  icoVerts[4][2]],
    [icoVerts[11][0], icoVerts[11][1], icoVerts[11][2]],
    
    [icoVerts[6][0],  icoVerts[6][1],  icoVerts[6][2]],
    [icoVerts[2][0],  icoVerts[2][1],  icoVerts[2][2]],
    [icoVerts[10][0], icoVerts[10][1], icoVerts[10][2]],
    
    [icoVerts[8][0],  icoVerts[8][1],  icoVerts[8][2]],
    [icoVerts[6][0],  icoVerts[6][1],  icoVerts[6][2]],
    [icoVerts[7][0],  icoVerts[7][1],  icoVerts[7][2]],
    
    [icoVerts[9][0],  icoVerts[9][1],  icoVerts[9][2]],
    [icoVerts[8][0],  icoVerts[8][1],  icoVerts[8][2]],
    [icoVerts[1][0],  icoVerts[1][1],  icoVerts[1][2]]];

    for (var i = 0; i < trigs.length; i++) {
        normalizeVector(trigs[i]);
    }

    return trigs;
}

function normalizeVector(v) {
    var magnitude = 0;
    for (var i = 0; i < v.length; i++) {
        magnitude += v[i] * v[i];
    }

    magnitude = Math.sqrt(magnitude);

    for (var i = 0; i < v.length; i++) {
        v[i] /= magnitude;
    }
}

function getIcoMiddlePoint(p1, p2) {
    var p = [Math.avg(p1[0], p2[0]), Math.avg(p1[1], p2[1]), Math.avg(p1[2], p2[2])];
    normalizeVector(p);

    return p;
}

function refineIcosphere(trigs) {
    var newTrigs = [];
    for (var i = 0; i < trigs.length; i += 3) {
        var a = getIcoMiddlePoint(trigs[i], trigs[i+1]);
        var b = getIcoMiddlePoint(trigs[i+1], trigs[i+2]);
        var c = getIcoMiddlePoint(trigs[i+2], trigs[i]);

        pushMultiple(newTrigs, [trigs[i], a, c]);
        pushMultiple(newTrigs, [trigs[i+1], b, a]);
        pushMultiple(newTrigs, [trigs[i+2], c, b]);
        pushMultiple(newTrigs, [a, b, c]);
    }

    return newTrigs;
}

function calculateConvexNormals(verts) {
    var normals = [];

    let v1 = null
    let v2 = null

    let v1crossv2 = null
    let v2crossv1 = null

    for (let trig = 0; trig < verts.length; trig += 3) {
         v1 = [
             verts[trig + 1][0] - verts[trig][0],
             verts[trig + 1][1] - verts[trig][1],
             verts[trig + 1][2] - verts[trig][2]
        ];
        v2 = [
            verts[trig + 2][0] - verts[trig + 1][0],
            verts[trig + 2][1] - verts[trig + 1][1],
            verts[trig + 2][2] - verts[trig + 1][2]
        ];

        v1crossv2 = cross3(v1, v2);
        normalizeVector(v1crossv2);
        v2crossv1 = negativeV(v1crossv2);

        if (
            distanceFromZeroWhenAdded(verts[trig], v1crossv2)
            >
            distanceFromZeroWhenAdded(verts[trig], v2crossv1)) {
            for (let i = 0; i < 3; i++) normals.push([v1crossv2[0], v1crossv2[1], v1crossv2[2]]);
        } else {
            for (let i = 0; i < 3; i++) normals.push([v2crossv1[0], v2crossv1[1], v2crossv1[2]]);
        }
    }

    return normals;
}

function calculateIcosphereNormals(icoVerts) {
    //For each vertex
    //  Calculate the vector from it to the center
    //  Reverse that vector

    var normals = [];
    for (var i = 0; i < icoVerts.length; i++) {
        normals.push(icoVerts[i]);
    }

    return normals;
}

function makeTriangleV() {
    let height = Math.sqrt(1-0.5*0.5);
    return [
        [-1, -1 + (1 - height)/2, 0],
        [1, -1 + (1 - height)/2, 0],
        [0, Math.sqrt(1-0.5*0.5) + (1 - height)/2, 0]];
}

function makeTriangleUV() {
    let height = Math.sqrt(1-0.5*0.5);
    return [
        [-1, -1 + (1 - height)/2],
        [1, -1 + (1 - height)/2],
        [0, Math.sqrt(1-0.5*0.5) + (1 - height)/2]];
}

function makeTriangleN() {
    return [
        [0, 0, 1], [0, 0, 1], [0, 0, 1]
    ];
}

function makeSquareV() {
    return [
        [-1, -1, 0], [1, -1, 0], [1, 1, 0],
        [-1, -1, 0], [-1, 1, 0], [1, 1, 0]
    ];
}

function makeSquareUV() {
    return [
        [0, 0], [1, 0], [1, 1],
        [0, 0], [0, 1], [1, 1]
    ];
}

function makeSquareN() {
    return [
        [0, 0, 1], [0, 0, 1], [0, 0, 1],
        [0, 0, 1], [0, 0, 1], [0, 0, 1]
    ];
}

function makeCircleV(segments) {
    var vertices = [];

    let pi = Math.PI;
    let theta = pi/2;
    let delta = 2*pi / segments;

    let startX = Math.cos(pi/2);
    let startY = Math.sin(pi/2);
    for (var i = 0; i < segments; i++) {
        vertices.push([startX, startY, 0]);
        vertices.push([Math.cos(theta + delta), Math.sin(theta + delta), 0]);
        vertices.push([Math.cos(theta + 2*delta), Math.sin(theta + 2*delta), 0]);

        theta += delta;
    }

    return vertices;
}

function makeCircleUV(segments) {
    var UVs = [];

    let pi = Math.PI;
    let theta = pi/2;
    let delta = 2*pi / segments;

    let startX = Math.cos(pi/2);
    let startY = Math.sin(pi/2);
    for (var i = 0; i < segments; i++) {
        UVs.push([startX, startY, 0]);
        UVs.push([Math.cos(theta + delta), Math.sin(theta + delta)]);
        UVs.push([Math.cos(theta + 2*delta), Math.sin(theta + 2*delta)]);

        theta += delta;
    }

    return UVs;
}

function makeCubeV() {
    return [
        //front
        [-1, -1, 1], [-1, 1, 1], [1, 1, 1],
        [-1, -1, 1], [1, 1, 1], [1, -1, 1],

        //back
        [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [1, -1, -1], [-1, 1, -1], [-1, -1, -1],

        //top
        [-1, 1, 1], [-1, 1, -1], [1, 1, -1],
        [-1, 1, 1], [1, 1, -1], [1, 1, 1],

        //bottom
        [-1, -1, -1], [-1, -1, 1], [1, -1, 1],
        [-1, -1, -1], [1, -1, 1], [1, -1, -1],

        //left
        [-1, -1, -1], [-1, 1, -1], [-1, 1, 1],
        [-1, -1, -1], [-1, 1, 1], [-1, -1, 1],

        //right
        [1, -1, 1], [1, 1, 1], [1, 1, -1],
        [1, -1, 1], [1, 1, -1], [1, -1, -1]
    ];
}

function makeCubeUV() {
    var UVs = [];
    for (var i = 0; i < 6; i++) {
        UVs.push([0, 0]),
        UVs.push([0, 1]),
        UVs.push([1, 1]),
        UVs.push([0, 0]),
        UVs.push([1, 1]),
        UVs.push([1, 0])
    }

    return UVs;
}

function makeCubeN() {
    var normals = [];
    for (var i = 0; i < 6; i++) {
        normals.push([0, 0, 1]);
    }

    for (var i = 0; i < 6; i++) {
        normals.push([0, 0, -1]);
    }

    for (var i = 0; i < 6; i++) {
        normals.push([0, 1, 0]);
    }

    for (var i = 0; i < 6; i++) {
        normals.push([0, -1, 0]);
    }

    for (var i = 0; i < 6; i++) {
        normals.push([-1, 0, 0]);
    }

    for (var i = 0; i < 6; i++) {
        normals.push([1, 0, 0]);
    }

    return normals;
}

function makeIcosphereV(refine) {
    var vertices = []
    let t = (1.0 + Math.sqrt(5.0)) / 2.0;
    var icoVerts = [
        [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
        [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
        [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ];

    var trigs = makeIcosphereTrigs(icoVerts);
    for (var i = 0; i < refine; i++) {
        trigs = refineIcosphere(trigs);
    }

    pushMultiple(vertices, trigs);

    return vertices;
}

function makeIcosphereUV() {

}

function makeIcosphereN(smooth, verts) {
    if (smooth) {
        return calculateIcosphereNormals(verts);
    } else {
        return calculateConvexNormals(verts);
    }
}

function makeTallcubeV(height) {
    return [
        //front
        [-0.5, 0, 0.5], [0.5, 0, 0.5], [0.5, height, 0.5],
        [-0.5, 0, 0.5], [0.5, height, 0.5], [-0.5, height, 0.5],

        //back
        [-0.5, 0, -0.5], [0.5, 0, -0.5], [0.5, height, -0.5],
        [-0.5, 0, -0.5], [0.5, height, -0.5], [-0.5, height, -0.5],

        //top
        [-0.5, height, 0.5], [0.5, height, 0.5], [0.5, height, -0.5],
        [-0.5, height, 0.5], [0.5, height, -0.5], [-0.5, height, -0.5],

        //bottom
        [-0.5, 0, 0.5], [0.5, 0, 0.5], [0.5, 0, -0.5],
        [-0.5, 0, 0.5], [0.5, 0, -0.5], [-0.5, 0, -0.5],

        //left
        [-0.5, 0, -0.5], [-0.5, 0, 0.5], [-0.5, height, 0.5],
        [-0.5, 0, -0.5], [-0.5, height, 0.5], [-0.5, height, -0.5],

        //right
        [0.5, 0, -0.5], [0.5, 0, 0.5], [0.5, height, 0.5],
        [0.5, 0, -0.5], [0.5, height, 0.5], [0.5, height, -0.5],
    ];
}

function makeTallcubeUV(height) {
    return [
        [0, 0], [1, 0], [1, height],
        [0, 0], [1, height], [0, height],

        [0, 0], [1, 0], [1, height],
        [0, 0], [1, height], [0, height],

        [0, 0], [1, 0], [1, 1],
        [0, 0], [1, 1], [0, 1],

        [0, 0], [1, 0], [1, 1],
        [0, 0], [1, 1], [0, 1],

        [0, 0], [1, 0], [1, height],
        [0, 0], [1, height], [0, height],

        [0, 0], [1, 0], [1, height],
        [0, 0], [1, height], [0, height],
    ];
}

function makeTallcubeN() {
    return [
        [0, 0, 1], [0, 0, 1], [0, 0, 1],
        [0, 0, 1], [0, 0, 1], [0, 0, 1],

        [0, 0, -1], [0, 0, -1], [0, 0, -1],
        [0, 0, -1], [0, 0, -1], [0, 0, -1],
        
        [0, 1, 0], [0, 1, 0], [0, 1, 0],
        [0, 1, 0], [0, 1, 0], [0, 1, 0],
        
        [0, -1, 0], [0, -1, 0], [0, -1, 0],
        [0, -1, 0], [0, -1, 0], [0, -1, 0],
        
        [-1, 0, 0], [-1, 0, 0], [-1, 0, 0],
        [-1, 0, 0], [-1, 0, 0], [-1, 0, 0],
        
        [1, 0, 0], [1, 0, 0], [1, 0, 0],
        [1, 0, 0], [1, 0, 0], [1, 0, 0]
    ];
}