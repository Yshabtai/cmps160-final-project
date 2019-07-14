var __SHADER_SOURCE_TABLE__ = {
    "shadowmap": {
        V: `
        attribute vec3 a_position;

        uniform mat4 u_modelMatrix;
        uniform mat4 u_viewMatrix;
        uniform mat4 u_projectMatrix;

        void main() {
            gl_Position = u_projectMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);
        }
        `,
        F: `
            precision mediump float;

            uniform vec3 u_lightPos;
            uniform float u_nearFar[2];

            void main() {
                float depth = (u_lightPos.z - gl_FragCoord.z) / (u_nearFar[1] - u_nearFar[0]);
                gl_FragColor = vec4(depth, 0.0, 0.0, 1.0);
            }
        `,
        attributes: [
            {name: "a_position", size: 12}
        ],
        uniforms: [
            "u_modelMatrix", "u_viewMatrix", "u_projectMatrix", "u_lightPos", "u_nearFar"
        ]
    },
    "color": {
        V: `
            attribute vec3 a_position;
            attribute vec3 a_color;
            attribute vec3 a_normal;

            uniform mat4 u_modelMatrix;
            uniform mat4 u_viewMatrix;
            uniform mat4 u_projectMatrix;
            uniform mat4 u_normalMatrix;

            uniform mat4 u_shadowViewMatrix[2];
            uniform mat4 u_shadowProjectMatrix[2];

            varying mediump vec4 v_color;
            varying mediump vec4 v_position;
            varying mediump vec4 v_normal;

            varying mediump vec4 v_shadowPos[2];

            const mat4 texUnitConverter = mat4(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 
                0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);

            void main() {
                gl_Position = u_projectMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);

                v_color = vec4(a_color, 1.0);
                v_position = u_projectMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);

                v_normal = u_normalMatrix * vec4(a_normal, 1.0);

                for (int i = 0; i < 1; i++) {
                    v_shadowPos[i] = u_shadowProjectMatrix[i] * u_shadowViewMatrix[i] * u_modelMatrix * vec4(a_position, 1.0);
                }
            }
        `,

        F: `
            precision mediump float;

            varying vec4 v_color;
            varying vec4 v_position;
            varying vec4 v_normal;

            uniform vec4 u_ambientColor;
            uniform vec4 u_dLP[2]; //Directional light "position"
            uniform vec2 u_nearFar[2]; //The near and far plane of the shadow
            uniform vec4 u_dLD[2]; //Directional light direction
            uniform vec4 u_dLC[2]; //Directional light color
            uniform float u_dLB[2]; //Directional light brightness

            varying vec4 v_shadowPos[2];
            uniform sampler2D u_shadowMap[2];

            uniform vec4 u_cameraPosition;
            
            void main() {
                vec3 normal = normalize(v_normal.xyz);

                vec3 diffuseColor = vec3(0.0, 0.0, 0.0);
                float depthAcc = 0.0;
                for (int i = 0; i < 1; i++) {

                    float shadowmapDepth = texture2D(u_shadowMap[i], v_shadowPos[i].xy / v_shadowPos[i].w / 2.0 + 0.5).x;
                    float myDepth = (length(v_position.x - u_dLP[i].x) - u_nearFar[i].x)
                                        /
                                    (u_nearFar[i].y - u_nearFar[i].x);

                    depthAcc += myDepth;

                    float visibility = shadowmapDepth + 0.05 < myDepth ? 0.0 : 1.0;

                    //Calculate directional lights
                    float nDotL = max(-dot(normal, normalize(u_dLD[i].xyz)), 0.0);
                    diffuseColor += u_dLC[i].xyz * v_color.xyz * nDotL * u_dLB[i] * visibility;
                }

                gl_FragColor = vec4(diffuseColor.xyz + u_ambientColor.xyz * v_color.xyz, 1.0);
                //gl_FragColor = vec4(depthAcc, 0.0, 0.0, 1.0);
            }
        `,
        attributes: [
            {name: "a_position", size: 12},
            {name: "a_color", size: 12},
            {name: "a_normal", size: 12}
        ],
        uniforms: [
            "u_modelMatrix", "u_viewMatrix", "u_projectMatrix", "u_normalMatrix", "u_cameraPosition",
            "u_ambientColor", "u_dLP", "u_nearFar", "u_dLD", "u_dLC", "u_dLB",
            "u_shadowMap", "u_shadowViewMatrix", "u_shadowProjectMatrix"
        ]
    },

    "texture": { 
        V: `
        attribute vec4 a_position;
        attribute vec2 a_texCoord;
        attribute vec4 a_normal;

        uniform mat4 u_modelMatrix;
        uniform mat4 u_viewMatrix;
        uniform mat4 u_projectMatrix;
        uniform mat4 u_normalMatrix;

        varying mediump vec4 v_position;
        varying mediump vec2 v_texCoord;
        varying mediump vec4 v_normal;

        void main() {
            gl_Position = u_projectMatrix * u_viewMatrix * u_modelMatrix * a_position;

            v_normal = u_normalMatrix * a_normal;
            v_texCoord = a_texCoord;
            v_position = u_modelMatrix * a_position;
        }
        `,

        F: 
        `
            precision mediump float;

            varying vec4 v_position;
            varying vec2 v_texCoord;
            varying vec4 v_normal;

            uniform vec4 u_ambientColor;
            uniform vec4 u_dLP[2]; //Directional light "position"
            uniform vec2 u_nearFar[2]; //The near and far plane of the shadow
            uniform vec4 u_dLD[2]; //Directional light direction
            uniform vec4 u_dLC[2]; //Directional light color
            uniform float u_dLB[2]; //Directional light brightness

            varying vec4 v_shadowPos[2];
            uniform sampler2D u_shadowMap[2];

            uniform vec4 u_cameraPosition;

            uniform sampler2D u_sampler;

            void main() {
                vec3 normal = normalize(v_normal.xyz);
                vec3 color = texture2D(u_sampler, v_texCoord).xyz;

                vec3 diffuse = vec3(0.0, 0.0, 0.0);

                for (int i = 0; i < 4; i++) {
                    float nDotL = max(-dot(normal, normalize(u_dLD[i]).xyz), 0.0);
                    diffuse += u_dLC[i].xyz * color * nDotL * u_dLB[i];
                }

                gl_FragColor = vec4(diffuse + color * u_ambientColor.xyz, 1.0);
            }
        `,
        attributes: [
            {name: "a_position", size: 12},
            {name: "a_texCoord", size: 8},
            {name: "a_normal", size: 12}
        ],
        uniforms: [
            "u_modelMatrix", "u_viewMatrix", "u_projectMatrix", "u_normalMatrix", "u_cameraPosition", 
            "u_sampler",
            "u_ambientColor", "u_dLP", "u_nearFar", "u_dLD", "u_dLC", "u_dLB",
            "u_shadowMap", "u_shadowViewMatrix", "u_shadowProjectMatrix"
        ]
    }
}

var __SHADER_TABLE__ = {}

/*
    Shader table structure:
    {
        "color": {
            program: <WebGLProgramObject>,
            attributes: [
                {
                    "location": <WebGLAttribLication>,
                    "name": "a_position",
                    "size": 12 (in bytes)
                }
                .
                .
                .
            ],
            uniforms: {
                "u_viewMatrix": <WebGLUniformLocation>,
                .
                .
                .
            }
        },
        .
        .
        .
    }
*/
function initShaders(gl) {
    __SHADER_TABLE__.shaderList = [];
    Object.keys(__SHADER_SOURCE_TABLE__).forEach(key => {
        console.log("Making shader for key " + key);
        __SHADER_TABLE__[key] = {};
        __SHADER_TABLE__[key].name = key;
        __SHADER_TABLE__[key].geometries = [];
        __SHADER_TABLE__[key].vCount = 0;
        __SHADER_TABLE__[key].attributes = [];
        __SHADER_TABLE__[key].uniforms = {};
        __SHADER_TABLE__[key].vBuffer = [];

        __SHADER_TABLE__[key].program = createProgram(gl,
            __SHADER_SOURCE_TABLE__[key].V,
            __SHADER_SOURCE_TABLE__[key].F);

        let attributeStride = 0;
        for (var i = 0; i < __SHADER_SOURCE_TABLE__[key].attributes.length; i++) {
            __SHADER_TABLE__[key].attributes.push({
                "location": gl.getAttribLocation(__SHADER_TABLE__[key].program, __SHADER_SOURCE_TABLE__[key].attributes[i]["name"]),
                "name": __SHADER_SOURCE_TABLE__[key].attributes[i]["name"],
                "size": __SHADER_SOURCE_TABLE__[key].attributes[i]["size"]
            });

            attributeStride += __SHADER_SOURCE_TABLE__[key].attributes[i]["size"];
        }
        __SHADER_TABLE__[key].attributeStride = attributeStride;

        for (var i = 0; i < __SHADER_SOURCE_TABLE__[key].uniforms.length; i++) {
            __SHADER_TABLE__[key].uniforms[__SHADER_SOURCE_TABLE__[key].uniforms[i]] =
                gl.getUniformLocation(__SHADER_TABLE__[key].program, __SHADER_SOURCE_TABLE__[key].uniforms[i]);
        }

        __SHADER_TABLE__.shaderList.push(__SHADER_TABLE__[key]);
    });
}

function getShader(name) {
    return __SHADER_TABLE__[name];
}

function getShaderi(index) {
    __SHADER_TABLE__.shaderList[index];
}

class Renderer {
    constructor(gl) {
        this.gl = gl;
        this.glSetup();
        this.bufferSetup();
        this.lightsSetup();
    }

    glSetup() {
        let gl = this.gl;
        //Setup WebGL clear canvas parameters
        gl.clearColor(0, 0, 0, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    bufferSetup() {
        //Contains all geometries ever added
        this.geometries = [];

        //This is the vectex buffer. There is only one and it contains
        //all vertex attributes for each vertex of each geometry
        this.vertBuffer = gl.createBuffer();
        this.textures = {};
        this.texBind = {"5": null, "6": null, "7": null}
    }

    lightsSetup() {
        let gl = this.gl;
        /*
        This is the lights object
        Organizations:
         
        this.lights {
            ambient: {
                "color": [x, y, z, w]
            },
            directional: [
                {
                    "direction": [x, y, z, w],
                    "color": [r, g, b, a],
                    "brightness": 1.0
                }
            ],
            point: [
                {
                    "position": [x, y, z, w],
                    "color": [r, g, b, a],
                    "brightness": 1.0
                }
            ],
            directionalBuffer: {
                "direction": [x, y, z, w, x, y, z, w, ...],
                "color": [r, g, b, a, r, g, b, a, ...],
                "brightness": [1, 1, ...]
            }
            pointBuffer: [x, y, z, w, r, g, b, a, brightness, x, y, z, w, ...]
        }
         */
         this.lights = {};
         this.lights.ambient = {
             "color": [0.1, 0.1, 0.1, 1.0]
         };
 
         this.lights.point = [];
         this.lights.directional = [];
         this.lights.directionalBuffer = {
             "direction": [],
             "color": [],
             "brightness": []
         };
         this.lights.pointBuffer = {
             "position": [],
             "color": [],
             "brightness": []
         };
 
         this.lights.directional.framebuffers = [];
         gl.activeTexture(gl.TEXTURE0);
         let textureSize = 1024;
         //Set the framebuffers
         for (let i = 0; i < 2; i++) {
             let theTexture = gl.createTexture();

             gl.bindTexture(gl.TEXTURE_2D, theTexture);
             gl.texImage2D(
                gl.TEXTURE_2D,
                0, gl.RGBA, textureSize, textureSize,
                0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            let framebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, theTexture, 0);
            this.lights.directional.framebuffers.push({
                "framebuffer": framebuffer,
                "texture": theTexture,
                "size": textureSize
            });
        }
    }
    
    clearGeometries() {
        for (let i = 0; i < __SHADER_TABLE__.shaderList.length; i++) {
            let shader = __SHADER_TABLE__.shaderList[i];
            shader.geometries = [];
            shader.vBuffer = [];
            shader.vCount = 0;
        }

        this.geometries = [];

        let totalBuffer = [];
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(totalBuffer), gl.STATIC_DRAW);
    }

    render(camera) {
        //Clears screen
        this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        this.gl.clear(gl.COLOR_BUFFER_BIT);

        let offset = 0;
        for (let i = 0; i < __SHADER_TABLE__.shaderList.length; i++) {
            if (__SHADER_TABLE__.shaderList[i].name === "shadowmap") {
                //Shadow maps get rendered first
                offset += this.renderShadowmap(offset);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.clearColor(0.0, 0.0, 0.0, 1.0);

                //Clear HTML canvas
//                this.gl.clear(gl.COLOR_BUFFER_BIT);
            } else {
                offset += this.renderShader(__SHADER_TABLE__.shaderList[i], offset, camera);
            }
        }
    }

    /**
     * This function renders a shader
     * @param {Object} shader 
     * @param {Number} offset 
     * @param {Camera} camera 
     */
    renderShader(shader, offset, camera) {
        let gl = this.gl;
        gl.useProgram(shader.program);

        //Set all attributes
        let attribs = shader.attributes;
        let attribSum = 0;
        for (let i = 0; i < attribs.length; i++) {
            gl.vertexAttribPointer(
                attribs[i]["location"], 
                attribs[i]["size"] / 4,
                gl.FLOAT,
                false,
                shader.attributeStride,
                offset + attribSum);
            attribSum += attribs[i]["size"];
            gl.enableVertexAttribArray(attribs[i]["location"]);
        }

        //Set the camera's uniforms
        try {
            gl.uniformMatrix4fv(shader.uniforms["u_viewMatrix"], false, camera.viewMatrix.elements);
            gl.uniformMatrix4fv(shader.uniforms["u_projectMatrix"], false, camera.projectMatrix.elements);
        } catch(e) {}

        /**
         * THIS PART IS ESSENTIAL
         * Get each camera from the lights
         * Put their positions in the shader
         */
        let cam0 = this.lights.directional[0].camera;
        let cam1 = this.lights.directional[1].camera;
        let shadowView = [].concat(Array.from(cam0.viewMatrix.elements));
        if (cam1 != undefined) shadowView = shadowView.concat(cam1.viewMatrix.elements);
//        else shadowView = shadowView.concat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

        let shadowProject = [].concat(Array.from(cam0.projectMatrix.elements));
        if (cam1 != undefined) shadowProject = shadowProject.concat(cam1.projectMatrix.elements);
//        else shadowProject = shadowProject.concat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

        //Set light uniforms
        try {
            gl.uniform4fv(shader.uniforms["u_ambientColor"], new Float32Array(this.lights.ambient.color));
            gl.uniform4fv(shader.uniforms["u_dLP"], new Float32Array(cam0.position.concat([1])));
            gl.uniform2fv(shader.uniforms["u_nearFar"], new Float32Array([1, 30]));
            gl.uniform4fv(shader.uniforms["u_dLD"], new Float32Array(this.lights.directionalBuffer.direction));
            gl.uniform4fv(shader.uniforms["u_dLC"], new Float32Array(this.lights.directionalBuffer.color));
            gl.uniform1fv(shader.uniforms["u_dLB"], new Float32Array(this.lights.directionalBuffer.brightness));
        } catch(e) {}

        //Set shadowmap uniforms
        if(this.pt === undefined) this.pt = 0;
        if (this.pt < 10) {

            this.pt += 1;
        }

        try {
            gl.uniformMatrix4fv(shader.uniforms["u_shadowViewMatrix"], false, cam0.viewMatrix.elements);
            gl.uniformMatrix4fv(shader.uniforms["u_shadowProjectMatrix"], false, cam0.projectMatrix.elements);
            gl.uniform2fv(shader.uniforms["u_nearFar"], new Float32Array([1, 30, 1, 30]));
            gl.uniform1i(shader.uniforms["u_shadowMap"], 1, 2);
        } catch(e) {
            console.log(e);
        }

        //Render
        let vertCount = 0;
        
        for (let i = 0; i < shader.geometries.length; i++) {
            shader.geometries[i].update();

            try {
                if (this.textures[shader.geometries[i].textureName].bind === -1) {
                    if (this.texBind["7"] == null) {
                        gl.activeTexture(gl.TEXTURE0 + 7);
                        gl.bindTexture(gl.TEXTURE_2D, this.textures[shader.geometries[i].textureName].location);
                        this.texBind["7"] = this.textures[shader.geometries[i].textureName];
                        this.textures[shader.geometries[i].textureName].bind = 7;
                    } else {
                        this.texBind["7"].bind = -1;
                        gl.activeTexture(gl.TEXTURE0 + 7);
                        gl.bindTexture(gl.TEXTURE_2D, this.textures[shader.geometries[i].textureName].location);
                        this.texBind["7"] = this.textures[shader.geometries[i].textureName];
                        this.textures[shader.geometries[i].textureName].bind = 7;
                    }
                }
                gl.uniform1i(shader.uniforms["u_sampler"], this.textures[shader.geometries[i].textureName].bind);
            } catch(e) {
                //console.log("Warning: Trying to set undefined texture");
            }

            gl.uniformMatrix4fv(shader.uniforms["u_modelMatrix"], false, shader.geometries[i].modelMat.elements);
            gl.uniformMatrix4fv(shader.uniforms["u_normalMatrix"], false, shader.geometries[i].normalMat.elements);

            gl.drawArrays(gl.TRIANGLES, vertCount, shader.geometries[i].vertices.length);
            vertCount += shader.geometries[i].vertices.length;
        }

        return shader.vCount * shader.attributeStride;
    }

    renderShadowmap(offset) {
        let gl = this.gl;
        let shader = getShader("shadowmap");

        if(this.cd === undefined) this.cd = 0;
        
        //Switch to framebuffer rendering
        for (let i = 0; i < 2; i++) {
            let lightColor = this.lights.directional[i].color
            if(lightColor[0] === 0 && lightColor[1] === 0 && lightColor[2] === 0) continue;

            //If the light has an actual color, proceed
            let fb = this.lights.directional.framebuffers[i];
            gl.useProgram(shader.program);
/*   
            gl.activeTexture(gl.TEXTURE0 + i+1);
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb.framebuffer);
            gl.bindTexture(gl.TEXTURE_2D, fb.texture);
            gl.viewport(0, 0, fb.size, fb.size);

            gl.clearColor(1.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
*/
            let attribs = shader.attributes;
            //Set all attributes
            gl.vertexAttribPointer(
                attribs[0].location,
                attribs[0].size / 4,
                gl.FLOAT,
                false,
                0,
                offset);

            //Position camera at light, and point it in the right direction
            let lightDirection = this.lights.directional[i].direction;
            let lightOpposite = [];
            for (let j = 0; j < lightDirection.length; j++) {
                if (lightDirection[j] === 0 || lightColor[j] === -0) lightOpposite.push(0)
                else lightOpposite.push(lightDirection[j] * -1);
            }

            lightDirection[3] = 0;

            if(this.cd < 10) {

                this.cd++;
            }

            let camera = new Camera();
            camera.setPosition(lightOpposite[0] * 10, lightOpposite[1] * 10, lightOpposite[2] * 10);
            camera.setOrtho(-5, 5, -5, 5, 1, 30);
            camera.setLookAt(0, 0, 0);

            this.lights.directional[i].camera = camera;

            //Send over camera uniforms
            try {
                gl.uniformMatrix4fv(shader.uniforms["u_viewMatrix"], false, camera.viewMatrix.elements);
                gl.uniformMatrix4fv(shader.uniforms["u_projectMatrix"], false, camera.projectMatrix.elements);
                gl.uniform3fv(shader.uniforms["u_lightPos"], camera.position);
                gl.uniform1f(shader.uniforms["u_nearFar"], 1, 30);
            } catch(e) {
                console.log("Error setting uniform matrices")
            }

            let vertCount = 0;
            for (let j = 0; j < shader.geometries.length; j++) {
                gl.uniformMatrix4fv(shader.uniforms["u_modelMatrix"], false, shader.geometries[j].modelMat.elements);
                gl.drawArrays(gl.TRIANGLES, vertCount, shader.geometries[j].vertices.length);

                vertCount += shader.geometries[j].vertices.length;
            }
        }

        return shader.vCount * shader.attributeStride;
    }

    addGeometry(shaderName, geometry) {
        let shader = getShader(shaderName);
        this.geometries.push(geometry);
        shader.geometries.push(geometry);
        shader.vCount += geometry.vertices.length;

        //Add to buffer, depending on which shader
        if (shaderName === "color") {
            let tempBuffer = [];
            for (let i = 0; i < geometry.vertices.length; i++) {
                tempBuffer.push(geometry.vertices[i][0]);
                tempBuffer.push(geometry.vertices[i][1]);
                tempBuffer.push(geometry.vertices[i][2]);

                tempBuffer.push(geometry.color[i][0]);
                tempBuffer.push(geometry.color[i][1]);
                tempBuffer.push(geometry.color[i][2]);

                tempBuffer.push(geometry.normals[i][0]);
                tempBuffer.push(geometry.normals[i][1]);
                tempBuffer.push(geometry.normals[i][2]);
            }
            shader.vBuffer = shader.vBuffer.concat(tempBuffer);

        } else if (shaderName === "texture" || shaderName === "texture_flat") {
            let tempBuffer = [];
            for (let i = 0; i < geometry.vertices.length; i++) {
                tempBuffer.push(geometry.vertices[i][0]);
                tempBuffer.push(geometry.vertices[i][1]);
                tempBuffer.push(geometry.vertices[i][2]);

                tempBuffer.push(geometry.UVs[i][0]);
                tempBuffer.push(geometry.UVs[i][1]);

                tempBuffer.push(geometry.normals[i][0]);
                tempBuffer.push(geometry.normals[i][1]);
                tempBuffer.push(geometry.normals[i][2]);
            }
            shader.vBuffer = shader.vBuffer.concat(tempBuffer);
        }

        this.addGeometryToShadow(geometry);

        var totalBuffer = [];
        for (let i = 0; i < __SHADER_TABLE__.shaderList.length; i++) {
            totalBuffer = totalBuffer.concat(__SHADER_TABLE__.shaderList[i].vBuffer);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(totalBuffer), gl.STATIC_DRAW);
    }

    addGeometryToShadow(geometry) {
        let tempBuffer = [];
        let shader = getShader("shadowmap");
        shader.geometries.push(geometry);
        shader.vCount += geometry.vertices.length;
        for (let i = 0; i < geometry.vertices.length; i++) {
            tempBuffer.push(geometry.vertices[i][0]);
            tempBuffer.push(geometry.vertices[i][1]);
            tempBuffer.push(geometry.vertices[i][2]);
        }
        shader.vBuffer = shader.vBuffer.concat(tempBuffer);
    }

    addImage(name, src) {
        let renderer = this;

        var image = new Image();
        image.onload = function() {
            renderer.addTexture(name, image);
        }

        image.src = src;
    }

    addTexture(name, image) {
        let gl = this.gl;
        var newTexture = this.gl.createTexture();

        let bindIndex = -1;
        if (this.texBind["5"] == null) {
            bindIndex = 5;
        } else if (this.texBind["6"] == null) {
            bindIndex = 6;
        } else if (this.texBind["7"] == null) {
            bindIndex = 7;
        }

        gl.activeTexture(gl.TEXTURE0 + bindIndex);
        gl.bindTexture(gl.TEXTURE_2D, newTexture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        this.textures[name] = {
            "location": newTexture,
            "bind": bindIndex
        };

        this.texBind[bindIndex + ""] = this.textures[name];

        gl.bindTexture(gl.TEXTURE_2D, this.textures[name].location);
    }

    setAmbientLight(color) {
        color = [color[0], color[1], color[2], 1.0];
        this.lights.ambient.color = color;
    }

    addDirectionalLight(direction, color, brightness) {
        //Cannot add more than 4 lights
        if (this.lights.directional.length > 1) {
            console.log("Error: Cannot add more than 2 lights");
        }

        //Make sure everything is the right size
        normalize(direction);
        direction = [direction[0], direction[1], direction[2], 1.0];
        color = [color[0], color[1], color[2], 1.0];

        //Push this to the lights array (this is good to have)
        this.lights.directional.push({
            "direction": direction,
            "color": color,
            "brightness": brightness
        });

        //Add the light to the buffer
        this.lights.directionalBuffer.direction = this.lights.directionalBuffer.direction.concat(direction);

        this.lights.directionalBuffer.color = this.lights.directionalBuffer.color.concat(color);

        this.lights.directionalBuffer.brightness.push(brightness);
    }
}

function normalize(vec) {
    let magnitude = 0;
    for (let i = 0; i < vec.length; i++) magnitude += vec[i] * vec[i];
    magnitude = Math.sqrt(magnitude);
    for (let i = 0; i < vec.length; i++) vec[i] /= magnitude;
}