class Camera { 
    constructor() {
        this.position = [0, 0, 3];
        this.lookAt = [0, 0, 0];
        this.up = [0.0, 1.0, 0.0];
        this.update = function() {}

        this.setupMatrices();
    }

    setupMatrices() {
        this.viewMatrix = new Matrix4();
        this.projectMatrix = new Matrix4();

        this.projectMatrix.setPerspective(90, 1, 0.01, 100);

        this.updateViewMatrix();
    }

    updateViewMatrix() {
        this.viewMatrix.setLookAt(
            this.position[0], this.position[1], this.position[2],
            this.lookAt[0], this.lookAt[1], this.lookAt[2],
            this.up[0], this.up[1], this.up[2]
        );
    }

    setProjectMatrix(fov, near, far) {
        this.projectMatrix.setPerspective(fov, 1, near, far);
    }

    setOrtho(left, right, bottom, top, near, far) {
        this.projectMatrix.setOrtho(left, right, bottom, top, near, far);
    }

    setPosition(x, y, z) {
        this.position = [x, y, z];
        this.updateViewMatrix();
    }

    setLookAt(x, y, z) {
        this.lookAt = [x, y, z];
        this.updateViewMatrix();
    }
}