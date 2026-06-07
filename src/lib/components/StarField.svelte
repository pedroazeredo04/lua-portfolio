<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d')!;

		const rng = (() => {
			let s = 42;
			return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
		})();

		type Star = {
			rx: number; ry: number; r: number; color: string;
			baseOpacity: number; amplitude: number; phase: number; speed: number;
		};

		const tinyColors  = ['#ffffff', '#e8eeff', '#fff8e0', '#c8d4ff', '#ffe8f0'];

		let tinyStars: Star[]  = [];
		let medStars:  Star[]  = [];

		let W = 0, H = 0;

		function gaussian(): number {
			const u = rng(), v = rng();
			return Math.sqrt(-2 * Math.log(u + 1e-10)) * Math.cos(2 * Math.PI * v);
		}

		function build() {
			W = canvas.width  = window.innerWidth;
			H = canvas.height = window.innerHeight;

			// Milky Way band: diagonal axis, all coords in 0-1 relative space
			const angle = Math.PI * 0.2;
			const ca = Math.cos(angle), sa = Math.sin(angle);

			function bandPoint(spreadY: number): [number, number] {
				const along = (rng() - 0.5) * Math.sqrt(2) * 1.2;
				const perp  = gaussian() * spreadY;
				return [
					0.5 + along * ca - perp * sa,
					0.5 + along * sa + perp * ca,
				];
			}

			tinyStars = Array.from({ length: 700 }, () => {
				const inBand = rng() < 0.55;
				const [rx, ry] = inBand ? bandPoint(0.18) : [rng(), rng()];
				return {
					rx, ry,
					r: 0.3 + rng() * 0.55,
					color: tinyColors[Math.floor(rng() * tinyColors.length)],
					baseOpacity: 0.35 + rng() * 0.45,
					amplitude: 0.08 + rng() * 0.12,
					phase: rng() * Math.PI * 2,
					speed: 0.0003 + rng() * 0.0006,
				};
			});

			medStars = Array.from({ length: 200 }, () => {
				const inBand = rng() < 0.45;
				const [rx, ry] = inBand ? bandPoint(0.22) : [rng(), rng()];
				return {
					rx, ry,
					r: 1.0 + rng() * 1.6,
					color: tinyColors[Math.floor(rng() * tinyColors.length)],
					baseOpacity: 0.5 + rng() * 0.4,
					amplitude: 0.12 + rng() * 0.15,
					phase: rng() * Math.PI * 2,
					speed: 0.0002 + rng() * 0.0008,
				};
			});
		}

		function drawMilkyWay() {
			const bx = W * 0.5, by = H * 0.5;
			const angle = Math.PI * 0.2;
			const len = Math.sqrt(W * W + H * H);
			ctx.save();
			ctx.translate(bx, by);
			ctx.rotate(angle);
			const g = ctx.createLinearGradient(-len / 2, 0, len / 2, 0);
			g.addColorStop(0,    'rgba(80,40,180,0)');
			g.addColorStop(0.25, 'rgba(100,60,200,0.045)');
			g.addColorStop(0.5,  'rgba(120,70,210,0.07)');
			g.addColorStop(0.75, 'rgba(100,60,200,0.045)');
			g.addColorStop(1,    'rgba(80,40,180,0)');
			ctx.fillStyle = g;
			ctx.fillRect(-len / 2, -H * 0.4, len, H * 0.8);
			ctx.restore();
		}

		function drawTiny(s: Star, t: number) {
			const op = Math.max(0, Math.min(1, s.baseOpacity + s.amplitude * Math.sin(s.phase + t * s.speed)));
			ctx.globalAlpha = op;
			ctx.fillStyle = s.color;
			ctx.beginPath();
			ctx.arc(s.rx * W, s.ry * H, s.r, 0, Math.PI * 2);
			ctx.fill();
		}

		function drawMed(s: Star, t: number) {
			const op = Math.max(0, Math.min(1, s.baseOpacity + s.amplitude * Math.sin(s.phase + t * s.speed)));
			ctx.globalAlpha = op;
			ctx.shadowBlur   = 5;
			ctx.shadowColor  = s.color;
			ctx.fillStyle = s.color;
			ctx.beginPath();
			ctx.arc(s.rx * W, s.ry * H, s.r, 0, Math.PI * 2);
			ctx.fill();
			ctx.shadowBlur = 0;
		}

		let raf: number;
		let start: number | null = null;

		function frame(ts: number) {
			if (!start) start = ts;
			const t = ts - start;

			ctx.clearRect(0, 0, W, H);
			ctx.globalAlpha = 1;

			drawMilkyWay();

			ctx.shadowBlur = 0;
			for (const s of tinyStars) drawTiny(s, t);

			for (const s of medStars)  drawMed(s, t);

			ctx.globalAlpha = 1;
			raf = requestAnimationFrame(frame);
		}

		function onResize() {
			W = canvas.width  = window.innerWidth;
			H = canvas.height = window.innerHeight;
		}

		build();
		raf = requestAnimationFrame(frame);

		window.addEventListener('resize', onResize);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<canvas
	bind:this={canvas}
	style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;"
></canvas>
