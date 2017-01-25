var targetRange = 1.6; // TODO work out how far we can see
var camera = 1;
var loop = 1;
$(document).ready(function() {
    $("#reverseControl").click(function() {
        $("#reverseControl").toggleClass("activeReverse");
    });

    $("#camChange").click(function() {
        camera = camera + 1;
        if (camera > 2) {
            camera = 1;
        }
        if (camera === 1) {
            $("#camera").attr("src", "img/camera.jpg");
            $("#cameraName").text("Front Camera");

        } else if (camera === 2) {
            $("#camera").attr("src", "img/robot.png");
            $("#cameraName").text("Back Camera");
        }
    });


    timerCycle();

    // sets a function that will be called when the websocket connects/disconnects
    NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

    // sets a function that will be called when the robot connects/disconnects
    NetworkTables.addRobotConnectionListener(onRobotConnection, true);


    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener(onValueChanged, true);

    // hook up our SendableChoosers to combo boxes
    attachSelectToSendableChooser("#auto-select", "/SmartDashboard/autonomous_mode");
});

function onRobotConnection(connected) {
    // TODO
    if (connected) {

    } else {

    }
}

function onNetworkTablesConnection(connected) {
    if (connected) {
        $("#Connection").text("Connected");
        $("#Connection").css({
            "color": "lime"
        });
    } else {
        $("#Connection").text("Disconnected");
        $("#Connection").css({
            "color": "red"
        });

    }
}

function onValueChanged(key, value, isNew) {
    switch (key) {
        case "/SmartDashboard/range_finder":
            changeRobotRange(value);
            break;

        case "/SmartDashboard/gyro":
            rotateCompass(value);
            rotateRobot(value);
            break;
    }
}

function changeRobotRange(dist) {
    var robot = document.getElementById("position-display-robot");
    var xpos = (dist-targetRange) / targetRange;
    if (xpos >= 1.0) {
        xpos = 1.0;
    }
    xpos = xpos*10.0 + 10.0 - 1.0;
    robot.style.top = xpos + "vw";
}

function changeRobotStrafePos(visionX) {
    visionX = -visionX;
    if (visionX >= -1.0 && visionX <= 1.0) {
        var robot = document.getElementById("position-display-robot");
        var ypos = visionX*10.0 - 0.75 + 10.0;
        robot.style.left = ypos + "vw";
    }
}

function rotateRobot(heading) {
    heading = -heading; // gyro is the wrong way around (ccw, not clockwise)
    var robot = document.getElementById("position-display-robot");
    robot.style.transform = "rotate(" + heading + "rad)";
}

function rotateCompass(heading) {
    heading = Math.PI - heading; // gyro is the wrong way around
    var robot = document.getElementById("compass");
    robot.style.transform = "rotate(" + heading + "rad)";
}

function timerCycle() {
    var countDownDate = Math.floor(Date.now() / 1000) + 22;
    var loop = 1;
    var x = setInterval(function() {
        var now = Math.floor(Date.now() / 1000);
        var distance = countDownDate - now;

        if (distance < 10) {
            document.getElementById("cycleTimer").innerHTML = "0" + distance;
        } else {
            document.getElementById("cycleTimer").innerHTML = distance;
        }
        if (distance === 1) {
            loop = loop + 1;
            if (loop <= 5) {
                countDownDate = Math.floor(Date.now() / 1000) + 22;
            } else {
                clearInterval(x);
                $("#cycleTimer").text("CLIMB");
                $("#cycleTimer").css({
                    "color": "red"
                });
                $("#cycleTimer").blink();
            }
        }
    }, 1000);
}
