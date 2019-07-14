class Geometry {
    constructor(type, args) {
        this.type = type;
        this.position = [0.0, 0.0, 0.0];
        this.scale = [1, 1, 1];
        this.indices = [];

        this.setupMatrices();
        this.handleArgs(args);
        this.update = function() {};

        this.vertices = this.makeVertices(type);
        this.UVs = this.makeUVs(type);
        this.normals = this.makeNormals(type);

        this.handleArgsPost()
    }

    setupMatrices() {
        this.modelMat = new Matrix4();
        this.translateMat = new Matrix4();
        this.rotateMat = new Matrix4();
        this.scaleMat = new Matrix4();
        this.normalMat = new Matrix4();

        this.normalMat.setInverseOf(this.modelMat);
        this.normalMat.transpose();
    }

    handleArgs(args) {
        if (args === undefined) {
            this.segments = 4;
            this.color = [[1.0, 1.0, 1.0, 1.0]];
            this.height = 1;
            this.textureName = "default";
            this.refine = 3;
            this.smooth = true;

            return;
        }

        if (args["segments"] != undefined) this.segments = args[segments]
        else this.segments = 4;

        if (args["color"] != undefined) {
            this.color = [];
            if (args["color"][0][0] === undefined) {
                //There is only one color
                this.color = [args["color"]];
            } else {
                //There is a color per vertex
                this.color = args["color"];
            }
        } else this.color = [[1.0, 1.0, 1.0, 1.0]];

        if (args["height"] != undefined) this.height = args["height"]
        else this.height = 1

        if (args["textureName"] != undefined) this.textureName = args["textureName"]
        else this.textureName = "default"

        if (args["refine"] != undefined) this.refine = args["refine"]
        else this.refine = 3 

        if (args["smooth"] != undefined) this.smooth = args["smooth"]
        else this.smooth = true
    }

    handleArgsPost() {
        var newColor = [];
        let c = this.color;
        let modI = 0;
        for (let i = 0; i < this.vertices.length; i++) {
            modI = i % c.length;
            newColor.push([c[modI][0], c[modI][1], c[modI][2], c[modI][3]]);
        }

        this.color = newColor;
    }

    setPosition(x, y, z) {
        this.position = [x, y, z];
        this.translateMat.setTranslate(x, y, z);
        this.modelMat = new Matrix4();
        this.modelMat.multiply(this.scaleMat);
        this.modelMat.multiply(this.rotateMat);
        this.modelMat.multiply(this.translateMat);
    }

    setRotation(angle, x, y, z) {
        this.rotateMat.setRotate(angle, x, y, z);
        this.modelMat = new Matrix4();
        this.modelMat.multiply(this.scaleMat);
        this.modelMat.multiply(this.rotateMat);
        this.modelMat.multiply(this.translateMat);
    }

    setScale(x, y, z) {
        this.scale = [x, y, z];
        this.scaleMat.setScale(x, y, z);
        this.modelMat = new Matrix4();
        this.modelMat.multiply(this.scaleMat);
        this.modelMat.multiply(this.rotateMat);
        this.modelMat.multiply(this.translateMat);
    }

    translate(x, y, z) {
        this.position[0] += x;
        this.position[1] += y;
        this.position[2] += z;

        let translateMat = new Matrix4();
        translateMat.setTranslate(this.position[0], this.position[1], this.position[2]);
        
        this.modelMat = this.translateMat.multiply(this.modelMat);

        return this;
    }

    rotate(angle, x, y, z) {
        let rotateMat = new Matrix4();
        rotateMat.setRotate(angle, x, y, z);

        this.modelMat.multiply(rotateMat);

        return this;
    }

    applyScale(x, y, z) {
        this.scale[0] *= x;
        this.scale[1] *= x;
        this.scale[2] *= x;

        let scaleMat = new Matrix4();
        scaleMat.setScale(x, y, z);

        this.modelMat.multiply(scaleMat);

        return this;
    }

    getColor(index) {
        if (this.color === undefined) return [0.0, 0.0, 0.0, 0.0];
        else return this.color[index % this.color.length];
    }

    makeVertices(type) {
        if      (type === "triangle") return makeTriangleV();
        else if (type === "square") return makeSquareV();
        else if (type === "circle") return makeCircleV(this.segments);
        else if (type === "cube") return makeCubeV();
        else if (type === "tallcube") return makeTallcubeV(this.height);
        else if (type === "icosphere") return makeIcosphereV(this.refine);
    }

    makeUVs(type) {
        if      (type === "triangle") return makeTriangleUV();
        else if (type === "square") return makeSquareUV();
        else if (type === "circle") return makeCircleUV(this.segments);
        else if (type === "cube") return makeCubeUV();
        else if (type === "tallcube") return makeTallcubeUV(this.height);
        else if (type === "icosphere") return makeIcosphereUV(this.refine);
    }

    makeNormals(type) {
        if      (type === "triangle") return makeTriangleN();
        else if (type === "square") return makeSquareN();
        else if (type === "circle") return makeCircleN(this.segments);
        else if (type === "cube") return makeCubeN();
        else if (type === "tallcube") return makeTallcubeN(this.height);
        else if (type === "icosphere") return makeIcosphereN(this.smooth, this.vertices);
    }
}