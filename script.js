/* =====================================================
   WORLD DRIVE: EARTH
   V1 GAME SCRIPT
===================================================== */


/* =====================================================
   GAME STATE
===================================================== */

const game = {

    started: false,

    x: 0,
    y: 0,

    speed: 0,

    rotation: 0,

    health: 100,
    hunger: 100,
    energy: 100,

    money: 10000,

    gameMinutes: 8 * 60,

    acceleration: false,
    braking: false,
    reversing: false,

    steeringLeft: false,
    steeringRight: false

};


/* =====================================================
   HTML ELEMENTS
===================================================== */

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");

const world =
    document.getElementById("world");

const car =
    document.getElementById("car");

const message =
    document.getElementById("message");

const healthText =
    document.getElementById("health");

const hungerText =
    document.getElementById("hunger");

const energyText =
    document.getElementById("energy");

const moneyText =
    document.getElementById("money");

const gameTimeText =
    document.getElementById("gameTime");

const periodText =
    document.getElementById("period");

const coordinatesText =
    document.getElementById("coordinates");

const phonePanel =
    document.getElementById("phonePanel");

const inventoryPanel =
    document.getElementById("inventoryPanel");

const mapPanel =
    document.getElementById("mapPanel");


/* =====================================================
   START GAME
===================================================== */

startButton.addEventListener("click", () => {

    game.started = true;

    startScreen.style.display = "none";

    showMessage(
        "Welcome to Thrissur! 🚗 Drive and explore."
    );

});


/* =====================================================
   MESSAGE SYSTEM
===================================================== */

let messageTimer;

function showMessage(text) {

    message.textContent = text;

    clearTimeout(messageTimer);

    messageTimer = setTimeout(() => {

        message.textContent =
            "Drive. Race. Explore. Live the World.";

    }, 3000);

}


/* =====================================================
   BUTTON HELPER
===================================================== */

function holdButton(element, startFunction, endFunction) {

    element.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            startFunction();

        }
    );

    element.addEventListener(
        "pointerup",
        event => {

            event.preventDefault();

            endFunction();

        }
    );

    element.addEventListener(
        "pointercancel",
        endFunction
    );

    element.addEventListener(
        "pointerleave",
        endFunction
    );

}


/* =====================================================
   DRIVING BUTTONS
===================================================== */

const accelerateButton =
    document.getElementById("accelerateButton");

const brakeButton =
    document.getElementById("brakeButton");

const reverseButton =
    document.getElementById("reverseButton");

const leftButton =
    document.getElementById("leftButton");

const rightButton =
    document.getElementById("rightButton");


holdButton(

    accelerateButton,

    () => {
        game.acceleration = true;
    },

    () => {
        game.acceleration = false;
    }

);


holdButton(

    brakeButton,

    () => {
        game.braking = true;
    },

    () => {
        game.braking = false;
    }

);


holdButton(

    reverseButton,

    () => {
        game.reversing = true;
    },

    () => {
        game.reversing = false;
    }

);


holdButton(

    leftButton,

    () => {
        game.steeringLeft = true;
    },

    () => {
        game.steeringLeft = false;
    }

);


holdButton(

    rightButton,

    () => {
        game.steeringRight = true;
    },

    () => {
        game.steeringRight = false;
    }

);


/* =====================================================
   HORN
===================================================== */

document
    .getElementById("hornButton")
    .addEventListener("click", () => {

        showMessage("📢 HONK!");

    });


/* =====================================================
   PHONE
===================================================== */

document
    .getElementById("phoneButton")
    .addEventListener("click", () => {

        phonePanel.style.display = "block";

    });


document
    .getElementById("closePhone")
    .addEventListener("click", () => {

        phonePanel.style.display = "none";

    });


/* =====================================================
   INVENTORY
===================================================== */

document
    .getElementById("inventoryButton")
    .addEventListener("click", () => {

        inventoryPanel.style.display = "block";

    });


document
    .getElementById("closeInventory")
    .addEventListener("click", () => {

        inventoryPanel.style.display = "none";

    });


/* =====================================================
   MAP
===================================================== */

document
    .getElementById("mapButton")
    .addEventListener("click", () => {

        mapPanel.style.display = "block";

    });


document
    .getElementById("closeMap")
    .addEventListener("click", () => {

        mapPanel.style.display = "none";

    });


/* =====================================================
   POI INTERACTION
===================================================== */

document
    .querySelectorAll(".poi")
    .forEach(poi => {

        poi.addEventListener("click", () => {

            const name =
                poi.dataset.name;

            showMessage(
                "📍 " + name
            );

        });

    });


/* =====================================================
   GAME LOOP
===================================================== */

let previousTime =
    performance.now();


function gameLoop(currentTime) {

    const delta =
        Math.min(
            (currentTime - previousTime) / 1000,
            0.05
        );

    previousTime =
        currentTime;


    if (game.started) {

        updateDriving(delta);

        updateCamera();

        updateNeeds(delta);

        updateGameTime(delta);

        updateHUD();

    }


    requestAnimationFrame(gameLoop);

}


requestAnimationFrame(gameLoop);


/* =====================================================
   DRIVING
===================================================== */

function updateDriving(delta) {

    const maxSpeed = 260;

    const accelerationPower = 160;

    const brakingPower = 220;

    const reversePower = 90;


    /* Accelerate */

    if (game.acceleration) {

        game.speed +=
            accelerationPower * delta;

    }


    /* Brake */

    if (game.braking) {

        game.speed -=
            brakingPower * delta;

    }


    /* Reverse */

    if (game.reversing) {

        game.speed -=
            reversePower * delta;

    }


    /* Natural slowdown */

    if (
        !game.acceleration &&
        !game.braking &&
        !game.reversing
    ) {

        if (game.speed > 0) {

            game.speed -=
                45 * delta;

        }

        if (game.speed < 0) {

            game.speed +=
                35 * delta;

        }

    }


    /* Limit speed */

    game.speed =
        Math.max(
            -90,
            Math.min(
                maxSpeed,
                game.speed
            )
        );


    /* Steering */

    const steeringStrength =
        1.8 * delta *
        Math.min(
            1,
            Math.abs(game.speed) / 50
        );


    if (game.steeringLeft) {

        game.rotation -=
            steeringStrength;

    }


    if (game.steeringRight) {

        game.rotation +=
            steeringStrength;

    }


    /* Movement */

    const movement =
        game.speed * delta;


    game.x +=
        Math.sin(game.rotation) *
        movement;

    game.y -=
        Math.cos(game.rotation) *
        movement;


    /* Rotate car */

    const degrees =
        game.rotation *
        180 /
        Math.PI;

    car.style.transform =
        `rotate(${degrees}deg)`;

}


/* =====================================================
   CAMERA
===================================================== */

function updateCamera() {

    const viewportWidth =
        window.innerWidth;

    const viewportHeight =
        window.innerHeight;


    const playerX =
        viewportWidth / 2;

    const playerY =
        viewportHeight / 2;


    world.style.transform =
        `translate(${-game.x}px, ${-game.y}px)`;


    /*
       Keep the player visually near
       the center of the screen.
    */

    world.style.left =
        `${-50 + game.x / viewportWidth * 50}vw`;

    world.style.top =
        `${-50 + game.y / viewportHeight * 50}vh`;

}


/* =====================================================
   HEALTH / HUNGER / ENERGY
===================================================== */

function updateNeeds(delta) {

    /*
       Hunger decreases slowly.
    */

    game.hunger -=
        0.35 * delta;


    /*
       Driving consumes energy.
    */

    if (Math.abs(game.speed) > 10) {

        game.energy -=
            0.15 * delta;

    }


    /*
       Keep values between 0 and 100.
    */

    game.hunger =
        Math.max(
            0,
            Math.min(
                100,
                game.hunger
            )
        );

    game.energy =
        Math.max(
            0,
            Math.min(
                100,
                game.energy
            )
        );


    /*
       Very low hunger/energy
       affects health slowly.
    */

    if (
        game.hunger <= 0 ||
        game.energy <= 0
    ) {

        game.health -=
            0.1 * delta;

    }


    game.health =
        Math.max(
            0,
            Math.min(
                100,
                game.health
            )
        );

}


/* =====================================================
   GAME TIME
===================================================== */

function updateGameTime(delta) {

    /*
       1 real second =
       1 game minute
    */

    game.gameMinutes +=
        delta;


    if (game.gameMinutes >= 1440) {

        game.gameMinutes -= 1440;

    }

}


/* =====================================================
   HUD
===================================================== */

function updateHUD() {

    healthText.textContent =
        Math.round(game.health);

    hungerText.textContent =
        Math.round(game.hunger);

    energyText.textContent =
        Math.round(game.energy);

    moneyText.textContent =
        Math.floor(game.money)
            .toLocaleString();


    /* Time */

    const totalMinutes =
        Math.floor(game.gameMinutes);

    const hours =
        Math.floor(
            totalMinutes / 60
        );

    const minutes =
        totalMinutes % 60;


    const displayHours =
        String(
            hours
        ).padStart(2, "0");

    const displayMinutes =
        String(
            minutes
        ).padStart(2, "0");


    gameTimeText.textContent =
        `${displayHours}:${displayMinutes}`;


    /* Period */

    let period = "NIGHT";

    if (
        hours >= 6 &&
        hours < 12
    ) {

        period = "MORNING";

    }
    else if (
        hours >= 12 &&
        hours < 17
    ) {

        period = "AFTERNOON";

    }
    else if (
        hours >= 17 &&
        hours < 21
    ) {

        period = "EVENING";

    }


    periodText.textContent =
        period;


    /* Night mode */

    if (
        hours >= 21 ||
        hours < 6
    ) {

        document
            .getElementById("game")
            .classList.add("night");

    }
    else {

        document
            .getElementById("game")
            .classList.remove("night");

    }


    /* Fake geographic coordinates */

    const baseLat =
        10.5276;

    const baseLon =
        76.2144;


    const latitude =
        baseLat +
        game.y * 0.00001;

    const longitude =
        baseLon +
        game.x * 0.00001;


    coordinatesText.textContent =
        `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

}


/* =====================================================
   KEYBOARD SUPPORT
   Useful when testing on PC.
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "ArrowUp" ||
            event.key === "w") {

            game.acceleration = true;

        }

        if (event.key === "ArrowDown" ||
            event.key === "s") {

            game.braking = true;

        }

        if (event.key === "ArrowLeft" ||
            event.key === "a") {

            game.steeringLeft = true;

        }

        if (event.key === "ArrowRight" ||
            event.key === "d") {

            game.steeringRight = true;

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        if (event.key === "ArrowUp" ||
            event.key === "w") {

            game.acceleration = false;

        }

        if (event.key === "ArrowDown" ||
            event.key === "s") {

            game.braking = false;

        }

        if (event.key === "ArrowLeft" ||
            event.key === "a") {

            game.steeringLeft = false;

        }

        if (event.key === "ArrowRight" ||
            event.key === "d") {

            game.steeringRight = false;

        }

    }
);


/* =====================================================
   INITIAL MESSAGE
===================================================== */

showMessage(
    "Choose START GAME to begin."
);
