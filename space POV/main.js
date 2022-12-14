//celestials object on seperate js
//document elements
const container3d = document.getElementById("container-3d");
const ground = document.getElementById('ground');
//compass
let compass = ['north', 'east', 'south', 'west'];
let compassCounter = 0;

//setting fov in 1920 width
let fov = 90;
let fovRadian = degToRad(fov);
//setting sphere
let radius = 1920 / (2 * Math.sin(fovRadian/2));
let perspective = 1920 / (2 * Math.tan(fovRadian / 2));
container3d.style.perspective = perspective + 'px';
let offSetZ = radius - perspective;
//setting ground
let gPos = celPos(0,0);
ground.style.height = (2 * radius) + 'px';
ground.style.width = (2 * radius) + 'px';
ground.style.transform = `translate3d(${gPos.x}px, ${gPos.y + radius}px, ${gPos.z}px) rotateX(${90}deg)`;

//setting compass
compass.forEach(direction => {
    let div = document.createElement('div');
    div.id = direction;
    div.classList.add('compass');
    let pos = celPos(compassCounter, 0);
    compassCounter += 90;
    div.style.transform = `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`;
    div.innerHTML = direction.charAt(0).toUpperCase();
    container3d.append(div);
});

//setting celestials
for(let celName in celInfo){
    let cel = celInfo[celName];
    let div = document.createElement('div');
    div.id = celName;
    div.style.height = '30px';
    div.style.width = '30px';
    div.style.backgroundColor = cel.color;
    div.classList.add('celestial');
    let pos = celPos(cel.azimuth, cel.altitude);
    div.style.transform = `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`;
    container3d.append(div);
}


//moving the mouse
let addAzimuth = 0;
let addAltitude = 0;
let changeAzimuthRate = 0.25;
let changeAltitudeRate = 0.25;
let pressed = false;


document.addEventListener('mousemove', mouseMoveFnc);
document.addEventListener('mousedown', mouseDownFnc);
document.addEventListener('mouseup', mouseUpFnc);

function mouseMoveFnc(event){
    if(pressed){
        let currentX = event.clientX;
        let currentY = event.clientY;
        let movementX = currentX - prevX;
        let movementY = currentY - prevY;
        addAzimuth += movementX * changeAzimuthRate;
        addAltitude -= movementY * changeAltitudeRate;
        if(addAltitude > 90){
            addAltitude = 90;
        }
        else if (addAltitude<-90){
            addAltitude = -90;
        }
        prevX = currentX;
        prevY = currentY;
        for (let celName in celInfo){
            let cel = celInfo[celName];
            let pos = celPos(cel.azimuth + addAzimuth, cel.altitude + addAltitude);
            document.getElementById(celName).style.transform = `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`;
        }
        compass.forEach(dir =>{
            let pos = celPos(compassCounter + addAzimuth, addAltitude);
            document.getElementById(dir).style.transform = `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`;
            compassCounter += 90;
        });
        let gPos = celPos(0,0 + addAltitude);
        ground.style.transform = `translate3d(${gPos.x}px, ${gPos.y + radius}px, ${gPos.z}px) rotateX(${90}deg)`;
        if(addAltitude <= 0){
            container3d.style.backgroundColor = 'black';
            ground.style.backgroundColor = '#3D8361';
        }
        else{
            container3d.style.backgroundColor = '#3D8361';
            ground.style.backgroundColor = 'black';
        }
    }
}
function mouseDownFnc(event){
    pressed = true;
    prevX = event.clientX;
    prevY = event.clientY;
}
function mouseUpFnc(event){
    pressed = false;
}


//functions
function celPos(azimuth, altitude){
    let dz = -radius*Math.cos(degToRad(azimuth))*Math.cos(degToRad(altitude)) + perspective;
    let dx = radius*Math.sin(degToRad(azimuth))*Math.cos(degToRad(altitude));
    let dy = -radius*Math.sin(degToRad(altitude));
    return {x: dx,y: dy, z: dz}; 
}

function degToRad(deg){
    return deg * Math.PI / 180;
}
function radToDeg(rad){
    return rad * 180 / Math.PI;
}
function visualAngle (size, distance){
    return (2 * Math.atan(size / (2 * distance)));
}
function trueSize(angle){
    return (2 * radius * Math.sin(angle / 2));
}