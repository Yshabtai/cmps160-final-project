
var renderer = null;
var speed = 0.01;
var isSphere = true;

function main() {
    //Begin the program.
    document.getElementById("gl").onclick = function(ev) {
        onCanvasClick(ev);
    };

    //Get GL contxt
    gl = getWebGLContext(document.getElementById("gl"));
    initShaders(gl);
    renderer = new Renderer(gl);

    //Set the camera
    let camera = new Camera();
    camera.setPosition(0.0, 3.0, 8.0);
    camera.setLookAt(0, 0, 0);

    let geo1 = new Geometry("icosphere", {"color": [0.5, 1, 0.5, 1], "textureName": "photo", "height": 3});
    let geo2 = new Geometry("icosphere", {"color": [1, 1, 1, 1], "height": 40});

    geo1.setPosition(0, 0, 0);

    geo2.setScale(0.5, 0.5, 0.5);

    geo2.update = function() {
        if (geo2.theta === undefined) {
            geo2.theta = 0;
        }

        geo2.setPosition(Math.cos(geo2.theta) * 7, 0, Math.sin(geo2.theta) * 7);
        geo2.theta += speed;
    }

    renderer.addGeometry("color", geo1);
    renderer.addGeometry("color", geo2);

    renderer.addImage("photo", "./res/checkers.jpg")
    renderer.addImage("dirt", "./res/dirt.jpg")
    renderer.addImage("red", "./res/red.jpg")

    renderer.addDirectionalLight([-1, 0, 0], [1, 1, 1], 1);
    renderer.addDirectionalLight([1, 0, 0], [0, 0, 0], 1);


    loopRender(renderer, camera)
}

//Sets up webgl
function glSetup(gl) {
    //Clears canvas, and adds z-buffer usage
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function loopRender(renderer, camera) {
    renderer.render(camera)
    requestAnimationFrame(function() {loopRender(renderer, camera)});
}

function changeColor() {
    let red = document.getElementById("red-color");
    let green = document.getElementById("green-color");
    let blue = document.getElementById("blue-color");

    red = red.value / 255.0;
    green = green.value / 255.0;
    blue = blue.value / 255.0;

    let arr = [red, green, blue];

    renderer.lights.directionalBuffer.color = [red, green, blue, 1.0];
}

function changeSpeed() {
    speed = document.getElementById("speed").value / 1000;
}

function toggleMoon() {
    let ele = document.getElementById("moon");
    if (ele.checked) {
        renderer.clearGeometries();
        let geo1 = new Geometry("icosphere", {"color": [0.5, 1, 0.5, 1], "textureName": "photo", "height": 3});
        let geo2 = new Geometry("cube", {"color": [1, 1, 1, 1]});
    
    
        geo1.setPosition(0, 0, 0);
    
        geo2.setScale(0.5, 0.5, 0.5);
    
        geo2.update = function() {
            if (geo2.theta === undefined) {
                geo2.theta = 0;
            }
    
            geo2.setPosition(Math.cos(geo2.theta) * 7, 0, Math.sin(geo2.theta) * 7);
            geo2.theta += speed;
        }
    
        renderer.addGeometry("color", geo1);
        renderer.addGeometry("color", geo2);
    } else {
        renderer.clearGeometries();
        let geo1 = new Geometry("icosphere", {"color": [0.5, 1, 0.5, 1], "textureName": "photo", "height": 3});
        let geo2 = new Geometry("icosphere", {"color": [1, 1, 1, 1], "height": 40});
    
    
        geo1.setPosition(0, 0, 0);
    
        geo2.setScale(0.5, 0.5, 0.5);
    
        geo2.update = function() {
            if (geo2.theta === undefined) {
                geo2.theta = 0;
            }
    
            geo2.setPosition(Math.cos(geo2.theta) * 7, 0, Math.sin(geo2.theta) * 7);
            geo2.theta += speed;
        }
    
        renderer.addGeometry("color", geo1);
        renderer.addGeometry("color", geo2);
    }

}