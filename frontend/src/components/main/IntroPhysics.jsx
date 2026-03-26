import {useEffect, useRef} from 'react';
import Matter from 'matter-js';

export default function IntroPhysics({tools, isActive}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!tools || tools.length === 0) return;
        if (!isActive) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        const {Engine, Runner, Bodies, World} = Matter;

        const engine = Engine.create();
        engine.gravity.y = 1.5;
        const world = engine.world;

        const images = {};

        const bodies = tools.map((tool) => {
            const iconSize = Math.floor(Math.random() * (110 - 50 + 1)) + 50;
            const x = Math.random() * (width - iconSize) + iconSize / 2;
            const y = -Math.random() * 800;

            const body = Matter.Bodies.circle(x, y, iconSize / 2, {
                restitution: 0.3,
                friction: 0.5,
            });
            body.toolData = tool;
            body.iconSize = iconSize;

            const img = new Image();
            img.src = tool.thumbnail;
            images[tool.id] = img;

            return body;
        });

        const floor = Bodies.rectangle(width / 2, height + 25, width, 50, {isStatic: true});
        const wallLeft = Bodies.rectangle(-25, height / 2, 50, height, {isStatic: true});
        const wallRight = Bodies.rectangle(width + 25, height / 2, 50, height, {isStatic: true});
        World.add(world, [floor, wallLeft, wallRight, ...bodies]);

        const runner = Runner.create();
        Runner.run(runner, engine);

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            bodies.forEach((body) => {
                const dx = body.position.x - mouseX;
                const dy = body.position.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const repelRadius = 100;

                if (dist < repelRadius && dist > 0) {
                    const force = ((repelRadius - dist) / repelRadius) * 0.3;
                    Matter.Body.applyForce(body, body.position, {
                        x: (dx / dist) * force,
                        y: (dy / dist) * force,
                    });
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        let animId;
        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            bodies.forEach((body) => {
                const {x, y} = body.position;
                const angle = body.angle;
                const img = images[body.toolData.id];
                const iconSize = body.iconSize;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);

                ctx.beginPath();
                ctx.arc(0, 0, iconSize / 2, 0, Math.PI * 2);
                ctx.clip();

                ctx.fillStyle = '#ffffff';
                ctx.fill();

                if (img && img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
                } else {
                    ctx.fillStyle = '#9c88ff';
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.font = `bold ${iconSize * 0.4}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(body.toolData.name[0], 0, 0);
                }

                ctx.restore();
            });

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animId);
            Runner.stop(runner);
            Engine.clear(engine);
        };
    }, [tools, isActive]);

    return <canvas ref={canvasRef} style={{width: '100%', height: '100%', pointerEvents: 'none'}} />;
}