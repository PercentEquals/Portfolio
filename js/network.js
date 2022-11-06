let canvas = undefined;
let ctx = undefined;
let header = undefined;

let isMouseInCanvas = false;
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

let stars = [];

class Star {
    constructor(startingX, startingY, startingZ) {
        this.x = startingX;
        this.y = startingY;
        this.z = startingZ;

        this.startingX = startingX;
        this.startingY = startingY;

        this.mouseX = mouseX;
        this.mouseY = mouseY;

        this.radius = 1;
        this.speed = 3;

        this.update = () => {
            this.z -= this.speed;

            if (this.z <= 1) {
                this.z = canvas.width;
            }

            this.x = this.startingX / this.z * canvas.width + canvas.width / 2 + (-this.mouseX + canvas.width / 2) / 16;
            this.y = this.startingY / this.z * canvas.height + canvas.height / 2 + (-this.mouseY + canvas.height / 2) / 16;

            this.radius = 0.5 * canvas.width / this.z;
            if (this.radius <= 0)
                this.radius = 0.01;
        };

        this.draw = () => {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.globalAlpha = (canvas.width - this.z < 100) ? (canvas.width - this.z) / 100 : 1;
            ctx.fill();
            ctx.closePath();
        };
    }
}

const init = () => {
    canvas.width = header.offsetWidth;
    canvas.height = header.offsetHeight;

    stars = [];
    const starCount = Math.round(canvas.width * (canvas.height / 500) * 0.1);

    if (starCount > 400) starCount = 400;
	if (starCount < 50)  starCount = 50;

    let fallback = 0;

    while (stars.length < starCount) {
		let randx = Math.random() * canvas.width - canvas.width/2;
		let randy = Math.random() * canvas.height - canvas.height/2;
        let shouldAdd = true;

		for (let i = stars.length; i--; )
		{
            shouldAdd = true;

			if (Math.hypot(randx - stars[i].startingX, randy - stars[i].startingY) < (30 - fallback * 5) && fallback < 5)
			{
                shouldAdd = false;
				fallback++;
				break;
			}
		}

		if (shouldAdd)
		{
			fallback = 0;
			stars.push(new Star(randx, randy, Math.random() * canvas.width));
		}
    }
}

const canvasFrame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "#EEE";
	ctx.fillStyle = "#EEE";
	ctx.lineWidth = 1.5;

    let connections = 0;

    for (let i = stars.length; i--; ) {
        stars[i].update();

        if (isMouseInCanvas && i != 0) {
            connections = 0;

            for (let j = i - 1; j--; ) {
                if (connections > 5) break;

                if (Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y) < 120) {

                    if (!(Math.hypot((stars[i].x + stars[j].x) / 2 - mouseX, (stars[i].y + stars[j].y) / 2 - mouseY) < 200)) {
                        continue;
                    }

                    ctx.beginPath();
                    ctx.globalAlpha = (100 - Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y)) / 100;
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.stroke();
                    ctx.closePath();
                    connections++;
                }
            }
        }

        stars[i].draw();
    }

    requestAnimationFrame(canvasFrame);
}

var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var touchscreen = 'ontouchstart' in window | mobile;

(function() {
    canvas = document.getElementById('network');
    ctx = canvas.getContext('2d');
    header = document.getElementsByTagName('header')[0];

    init();
    requestAnimationFrame(canvasFrame);

    
    window.addEventListener('resize', () => {
        init();
    });

    header.addEventListener('mousemove', (event) => {
        if (!touchscreen) {
            isMouseInCanvas = true;

            mouseX = event.clientX;
            mouseY = event.clientY;
        }
    });

    header.addEventListener('mouseleave', () => {
        isMouseInCanvas = false;
    });
})();