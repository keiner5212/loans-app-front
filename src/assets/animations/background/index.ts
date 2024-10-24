import { POINTS_COLOR, POINTS_COLOR_VARIABLE, POINTS_PER_SQUARE, SHOW_RADIOUS } from "./Constants";
import "./style.css";
import { gsap, Circ } from "gsap";

let posy = 0;

let width: number,
    height: number,
    canvas: any,
    ctx: any,
    points: any,
    target: any,
    animateHeader = true;



function initHeader() {
    width = innerWidth;
    height = innerHeight;
    target = { x: width / 2, y: height / 2 };


    canvas = document.getElementById("demo-canvas");
    ctx = canvas.getContext("2d");

    // create points
    points = [];
    for (let x = 0; x < width; x = x + width / POINTS_PER_SQUARE) {
        for (let y = 0; y < height; y = y + height / POINTS_PER_SQUARE) {
            let px = x + (Math.random() * width) / POINTS_PER_SQUARE;
            let py = y + (Math.random() * height) / POINTS_PER_SQUARE;
            let p = { x: px, originX: px, y: py, originY: py };
            points.push(p);
        }
    }

    // for each point find the 5 closest points
    for (let i = 0; i < points.length; i++) {
        let closest = [];
        let p1 = points[i];
        for (let j = 0; j < points.length; j++) {
            let p2 = points[j];
            if (!(p1 == p2)) {
                let placed = false;
                for (let k = 0; k < 5; k++) {
                    if (!placed) {
                        if (closest[k] == undefined) {
                            closest[k] = p2;
                            placed = true;
                        }
                    }
                }

                for (let k = 0; k < 5; k++) {
                    if (!placed) {
                        if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                            closest[k] = p2;
                            placed = true;
                        }
                    }
                }
            }
        }
        p1.closest = closest;
    }

    // assign a circle to each point
    for (let i in points) {
        let c = new Circle(
            points[i],
            2 + Math.random() * 2,
            POINTS_COLOR
        );
        points[i].circle = c;
    }
}

// Event handling
function addListeners() {
    if (!("ontouchstart" in window)) {
        window.addEventListener("mousemove", mouseMove);
    }
    window.addEventListener("scroll", scrollCheck);
    window.addEventListener("resize", resize);
}

function mouseMove(e: any) {
    let posx = (posy = 0);
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    } else if (e.clientX || e.clientY) {
        posx =
            e.clientX +
            document.body.scrollLeft +
            document.documentElement.scrollLeft;
        posy =
            e.clientY +
            document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    target.x = posx;
    target.y = posy;
}

function scrollCheck() {
    if (document.body.scrollTop > height) animateHeader = false;
    else animateHeader = true;
}

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    width = innerWidth;
    height = innerHeight;
}

// animation
function initAnimation() {
    animate();
    for (let i in points) {
        shiftPoint(points[i]);
    }
}

function animate() {
    if (animateHeader) {
        ctx.clearRect(0, 0, width, height);
        for (let i in points) {
            // detect points in range
            if (Math.abs(getDistance(target, points[i])) < SHOW_RADIOUS * 10000) {
                points[i].active = 0.3;
                points[i].circle.active = 0.6;
            } else if (Math.abs(getDistance(target, points[i])) < SHOW_RADIOUS * 10000 * 2) {
                points[i].active = 0.1;
                points[i].circle.active = 0.3;
            } else if (Math.abs(getDistance(target, points[i])) < SHOW_RADIOUS * 10000 * 3) {
                points[i].active = 0.02;
                points[i].circle.active = 0.1;
            } else {
                points[i].active = 0;
                points[i].circle.active = 0;
            }

            drawLines(points[i]);
            points[i].circle.draw();
        }
    }
    requestAnimationFrame(animate);
}

function shiftPoint(p: any) {
    gsap.to(p, {
        duration: 1 + 1 * Math.random(),
        x: p.originX - 50 + Math.random() * 100,
        y: p.originY - 50 + Math.random() * 100,
        ease: Circ.easeInOut,
        onComplete: function () {
            shiftPoint(p);
        },
    });
}

// Canvas manipulation
function drawLines(p: any) {
    if (!p.active) return;
    for (let i in p.closest) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.closest[i].x, p.closest[i].y);
        ctx.strokeStyle = POINTS_COLOR_VARIABLE + p.active + ")";
        ctx.stroke();
    }
}
class Circle {
    pos: { x: number; y: number } | null;
    radius: number | null;
    color: string;
    active?: number;

    constructor(pos: { x: number; y: number } | null, rad: number | null, color: string) {
        this.pos = pos || null;
        this.radius = rad || null;
        this.color = color;
    }

    draw() {
        if (!this.active) return;
        ctx.beginPath();
        ctx.arc(this.pos!.x, this.pos!.y, this.radius!, 0, 2 * Math.PI, false);
        ctx.fillStyle = POINTS_COLOR_VARIABLE + this.active + ")";
        ctx.fill();
    }
}


// Util
function getDistance(p1: any, p2: any) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}



export const init = () => {
    initHeader();
    initAnimation();
    addListeners();
    resize();

    //rezise listener
    window.addEventListener("resize", () => {
        resize();
    });
}