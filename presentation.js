(() => {
  'use strict';
  document.querySelectorAll('.concept-intro-slide').forEach(slide => {
    const cue = slide.querySelector('.concept-scroll-cue');
    if (!cue) return;
    let inView = false;
    function syncCue() {
      cue.classList.toggle('is-scroll-cue-active', inView && !document.hidden);
    }
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      syncCue();
    }, { threshold: .5 }).observe(slide);
    document.addEventListener('visibilitychange', syncCue);
  });

  document.querySelectorAll('.concept-knowledge-slide').forEach(slide => {
    const replay = () => {
      slide.classList.remove('is-knowledge-active');
      void slide.offsetWidth;
      slide.classList.add('is-knowledge-active');
    };
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) replay();
      else slide.classList.remove('is-knowledge-active');
    }, { threshold: .15 }).observe(slide);
    slide.querySelector('.knowledge-replay').addEventListener('click', replay);
  });

  document.querySelectorAll('.concept-chain-slide').forEach(slide => {
    const blocks = Array.from(slide.querySelectorAll('.chain-block'));
    const link = slide.querySelector('.chain-link');
    const geometry = [[84.51,50.685,7.06,30], [83.835,34.8,9.52,-40], [74.93,19.54,12.36,-20], [58.52,7.67,15.34,0]];
    const homes = [[200,440,32/7.06,30], [440,440,48/9.52,-40], [440,200,68/12.36,-20], [200,200,92/15.34,0]];
    // The same original paths stay on screen throughout; only their group transforms change.
    const targets = geometry.map(([x,y]) => [-28+x*5,185+y*5,5,0]);
    let frame = 0, start = null, visible = false;
    const clamp = x => Math.max(0, Math.min(1,x));
    const smooth = x => x*x*(3-2*x);
    function render(elapsed) {
      const reveal = clamp((elapsed-600)/2200);
      const morph = smooth(clamp((elapsed-3200)/3000));
      const points = homes.map((home,i) => home.map((value,j) => value+(targets[i][j]-value)*morph));
      link.setAttribute('d', points.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' '));
      let length = 0;
      for (let i=1;i<points.length;i++) length += Math.hypot(points[i][0]-points[i-1][0], points[i][1]-points[i-1][1]);
      link.setAttribute('stroke-dasharray', length+' '+length);
      link.setAttribute('stroke-dashoffset', length*(1-reveal));
      link.setAttribute('opacity', reveal ? .55-morph*.25 : 0);
      blocks.forEach((block,i) => {
        const [x,y,scale,rotation] = points[i];
        const [sourceX,sourceY] = geometry[i];
        block.setAttribute('transform','translate('+x+' '+y+') rotate('+rotation+') scale('+scale+') translate('+(-sourceX)+' '+(-sourceY)+')');
      });
    }
    function tick(time) {
      if (start === null) start=time;
      const elapsed=time-start;
      render(elapsed);
      frame = elapsed<6200 && visible ? requestAnimationFrame(tick) : 0;
    }
    function replay() {
      cancelAnimationFrame(frame);
      frame=0; start=null; render(0);
      if (visible) frame=requestAnimationFrame(tick);
    }
    new IntersectionObserver(entries => {
      visible=entries[0].isIntersecting;
      if (visible) replay();
      else { cancelAnimationFrame(frame); frame=0; start=null; render(0); }
    }, {threshold:.25}).observe(slide);
    slide.querySelector('.chain-replay').addEventListener('click',replay);
    render(0);
  });
  document.querySelectorAll('.concept-star-slide').forEach(slide => {
    const rays = Array.from(slide.querySelectorAll('.star-ray'));
    const assembly = slide.querySelector('.star-assembly');
    const link = slide.querySelector('.star-start-link');
    let frame=0, start=null, visible=false;
    const clamp = x => Math.max(0,Math.min(1,x));
    const smooth = x => x*x*(3-2*x);
    function render(elapsed) {
      const placement=smooth(clamp((elapsed-650)/2300));
      assembly.setAttribute('transform','translate('+(-28+149.032*placement)+' '+(185-86.289*placement)+') scale('+(5-1.6*placement)+')');
      link.setAttribute('opacity',.3*(1-clamp((elapsed-650)/1400)));
      rays.forEach((ray,i) => {
        const amount=i===0?1:smooth(clamp((elapsed-1100-(i-1)*440)/2200));
        ray.setAttribute('opacity',i===0?1:clamp(amount*2));
        ray.setAttribute('transform','rotate('+(-i*60*(1-amount))+' 58.52 65.085)');
      });
    }
    function tick(time) {
      if(start===null) start=time;
      const elapsed=time-start;
      render(elapsed);
      frame=elapsed<5200 && visible?requestAnimationFrame(tick):0;
    }
    function replay() {
      cancelAnimationFrame(frame); frame=0; start=null; render(0);
      if(visible) frame=requestAnimationFrame(tick);
    }
    new IntersectionObserver(entries=>{
      visible=entries[0].isIntersecting;
      if(visible) replay();
      else {cancelAnimationFrame(frame);frame=0;start=null;render(0);}
    },{threshold:.25}).observe(slide);
    slide.querySelector('.star-replay').addEventListener('click',replay);
    render(0);
  });
  // Original black logo artwork from Ресурс 2.svg.
  const logoArtwork = {"width":414.19,"height":151.71,"paths":["M321.31,104.41c-2.68,2.18-5.6,4.02-8.75,5.47-4.8,2.19-9.99,3.31-15.44,3.31s-10.53-1.11-15.35-3.31c-4.83-2.19-9.13-5.25-12.8-9.07-3.69-3.84-6.61-8.29-8.68-13.21-2.09-4.91-3.15-10.29-3.15-15.95s1.06-10.89,3.15-15.87c2.07-4.98,5-9.42,8.7-13.21,3.64-3.78,7.94-6.81,12.78-8.99,4.81-2.19,9.98-3.31,15.35-3.31,3.56,0,7,.48,10.29,1.42l-.04-7.06c-3.31-.75-6.73-1.14-10.25-1.14-6.37,0-12.5,1.27-18.2,3.8-5.7,2.51-10.84,6.02-15.27,10.45-4.42,4.42-7.94,9.6-10.46,15.42-2.52,5.79-3.8,12.01-3.8,18.49s1.28,12.71,3.8,18.5c2.52,5.82,6.04,11.03,10.46,15.48,4.41,4.46,9.55,8,15.27,10.53,5.7,2.51,11.83,3.79,18.2,3.79s12.64-1.28,18.36-3.79c2.02-.89,3.97-1.92,5.84-3.07v-8.69Z","M21.79,110.25c-7.19,0-13.02-5.83-13.02-13.02v-17.48h46.99v-8.07H8.76v-38.58h56.57v-8.07H0v71.45c0,12.08,9.79,21.87,21.87,21.87h46.94v-8.09H21.79Z","M225.56,118.32v-42.69c0-5.64-1.16-10.66-3.45-14.94-2.27-4.23-5.73-7.61-10.3-10.02-4.59-2.44-10.52-3.67-17.62-3.67-3.71,0-7.98.5-12.69,1.49-4.38.94-9.26,2.57-14.52,4.85l3.55,6.48c3.36-1.5,6.88-2.87,10.44-4.07,4.11-1.38,8.3-2.09,12.45-2.09,6.03,0,10.79,1.15,14.14,3.42,3.34,2.25,5.67,5.11,6.95,8.52,1.23,3.3,1.85,6.67,1.85,10.02v17.89c0,4.93-2.21,9.52-6.07,12.58-2.98,2.32-6.41,4.07-10.19,5.21-7.53,2.29-15.47,2.28-21.8-.02-3.25-1.18-5.85-2.94-7.74-5.23-1.83-2.22-2.79-4.89-2.87-7.93-.08-3.19,1.07-6.28,3.23-8.69,2.15-2.4,5.05-4.28,8.61-5.6,3.48-1.3,7.32-1.95,11.4-1.95,6.52,0,12.25.92,17.29,1.74.09.02.19.03.29.05-.21-3.68-3.56-6.36-6.87-7.12-3.33-.77-7.8-1.2-12.58-1.2-5.47,0-10.6.97-15.25,2.89-4.61,1.92-8.31,4.61-11,7.99-2.68,3.35-4.03,7.36-4.03,11.92s1.21,8.39,3.59,11.61c2.4,3.25,5.76,5.78,9.97,7.53,4.25,1.78,9.15,2.68,14.55,2.68,4.09,0,8.29-.7,12.46-2.09,4.18-1.38,7.9-3.43,11.07-6.1,1.44-1.22,2.67-2.59,3.66-4.08l2.26-3.4v14h9.2Z","M390.06,58.03v2.88c1.86-1.41,3.99-2.65,6.36-3.67,6.34-2.72,12.72-2.83,17.78-2.63v-7.61c-7.74.15-15.53,1.49-19.71,4.08-2.81,1.74-4.42,4.27-4.42,6.94Z"],"polygon":"139.35 48.66 112.31 110.16 84.79 48.66 74.43 48.66 107.51 118.31 117.08 118.31 149.71 48.66 139.35 48.66","oSquares":[{"x":321.31,"y":102.36,"width":7,"height":7,"opacity":1},{"x":328.31,"y":95.36,"width":7,"height":7,"opacity":1},{"x":328.31,"y":88.36,"width":7,"height":7,"opacity":1},{"x":335.31,"y":81.36,"width":7,"height":7,"opacity":1},{"x":335.31,"y":74.36,"width":7,"height":7,"opacity":1},{"x":339.19,"y":67.36,"width":7,"height":7,"opacity":1},{"x":307.31,"y":25.36,"width":7,"height":7,"opacity":1},{"x":314.31,"y":32.36,"width":7,"height":7,"opacity":1},{"x":321.31,"y":32.36,"width":7,"height":7,"opacity":1},{"x":328.31,"y":39.36,"width":7,"height":7,"opacity":1},{"x":328.31,"y":46.36,"width":7,"height":7,"opacity":1},{"x":335.31,"y":53.36,"width":7,"height":7,"opacity":1},{"x":339.19,"y":60.36,"width":7,"height":7,"opacity":1},{"x":295.06,"y":137.04,"width":5.65,"height":5.65,"opacity":1},{"x":331.89,"y":121.74,"width":7,"height":7,"opacity":1},{"x":341.11,"y":13.74,"width":5.65,"height":5.65,"opacity":1},{"x":353.31,"y":39.36,"width":7,"height":7,"opacity":1},{"x":323.57,"y":13.58,"width":2.98,"height":2.98,"opacity":1},{"x":358.82,"y":27.36,"width":2.98,"height":2.98,"opacity":1},{"x":323.32,"y":65.56,"width":2.98,"height":2.98,"opacity":1},{"x":348.76,"y":107.87,"width":2.98,"height":2.98,"opacity":1},{"x":314.04,"y":87.12,"width":2.98,"height":2.98,"opacity":1},{"x":307.68,"y":126.12,"width":2.98,"height":2.98,"opacity":1},{"x":320.87,"y":134.87,"width":2.98,"height":2.98,"opacity":1},{"x":272.92,"y":148.73,"width":2.98,"height":2.98,"opacity":1},{"x":306,"y":64.07,"width":2.98,"height":2.98,"opacity":1},{"x":369.82,"y":4.43,"width":2.98,"height":2.98,"opacity":1},{"x":340.95,"y":0,"width":2.98,"height":2.98,"opacity":1},{"x":321.31,"y":95.32,"width":7,"height":7,"opacity":0.32},{"x":328.31,"y":81.36,"width":7,"height":7,"opacity":0.32},{"x":332.19,"y":60.36,"width":7,"height":7,"opacity":0.32},{"x":328.31,"y":53.36,"width":7,"height":7,"opacity":0.32},{"x":335.31,"y":46.36,"width":7,"height":7,"opacity":0.32},{"x":335.31,"y":39.36,"width":7,"height":7,"opacity":0.32},{"x":328.31,"y":32.36,"width":7,"height":7,"opacity":0.32},{"x":321.31,"y":39.36,"width":7,"height":7,"opacity":0.32},{"x":314.31,"y":25.36,"width":7,"height":7,"opacity":0.32},{"x":307.41,"y":32.36,"width":7,"height":7,"opacity":0.32},{"x":332.19,"y":67.36,"width":7,"height":7,"opacity":0.32},{"x":328.39,"y":102.36,"width":7,"height":7,"opacity":0.32},{"x":335.31,"y":95.32,"width":7,"height":7,"opacity":0.32},{"x":335.31,"y":88.36,"width":7,"height":7,"opacity":0.32},{"x":342.32,"y":74.36,"width":7,"height":7,"opacity":0.32},{"x":342.32,"y":53.36,"width":7,"height":7,"opacity":0.32},{"x":321.31,"y":109.36,"width":7,"height":7,"opacity":0.32}],"letterSquares":[{"x":372.95,"y":48.66,"width":9.19,"height":69.66,"opacity":1}]};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // The 15 isolated accents follow the main contour in the supplied SVG.
  const satelliteDelays = new Map(logoArtwork.oSquares.slice(13, 28).map((rect, i) => [rect, .74 + ((i * 7) % 15) / 14 * .19]));
  const slides = Array.from(document.querySelectorAll('.slide'));
  let activeSlide = 0;
  document.querySelectorAll('.pixel-field').forEach(canvas => {
    const context = canvas.getContext('2d');
    const slide = canvas.closest('.slide');
    const scene = canvas.dataset.scene;
    const animated = ['connections', 'assembly', 'logo'].includes(scene);
    const interactive = slide.id === 'complexity';
    const pointer = { active: false, x: 0, y: 0 };
    let hoverFrame = 0, hoverTime = 0;
    const logoPaths = scene === 'logo' ? logoArtwork.paths.map(path => new Path2D(path)) : [];
    const logoV = scene === 'logo' ? new Path2D('M' + logoArtwork.polygon.trim().split(/\s+/).reduce((path, value, i) => path + (i % 2 ? ',' : ' ') + value, '').trim() + 'Z') : null;
    const field = { pixels: [], links: [], width: 0, height: 0 };
    let frame = 0, started = 0, progress = 0, visible = false;
    const clamp = value => Math.max(0, Math.min(1, value));
    function layout() {
      const { width, height } = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      field.width = width;
      field.height = height;
      const step = width < 400 ? 20 : 28;
      const size = width < 400 ? 3 : 4;
      const columns = Math.max(1, Math.floor((width - 24) / step));
      const rows = Math.max(1, Math.floor((height - 24) / step));
      const left = (width - (columns - 1) * step) / 2;
      const top = (height - (rows - 1) * step) / 2;
      field.pixels = [];
      field.links = [];
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          field.pixels.push({ x: left + column * step, y: top + row * step, size, node: false });
        }
      }
      // Selected squares connect to a shared hub; all other squares remain.
      const at = (r, c) => field.pixels[r * columns + c];
      const middleRow = Math.floor((rows - 1) / 2);
      const middleColumn = Math.floor((columns - 1) / 2);
      const hub = at(middleRow, middleColumn);
      const edgeLeft = Math.min(1, columns - 1);
      const edgeRight = Math.max(edgeLeft, columns - 2);
      const levels = [...new Set([1, .23, .39, .5, .83].map(value => value === 1 ? Math.min(1, rows - 1) : Math.round(value * (rows - 1))))];
      const sources = levels.flatMap(row => [at(row, edgeLeft), at(row, edgeRight)]);
      sources.push(at(Math.min(1, rows - 1), middleColumn), at(Math.max(0, rows - 2), middleColumn));
      for (const from of [...new Set(sources)]) {
        if (from === hub) continue;
        from.node = hub.node = true;
        const dx = hub.x - from.x;
        const dy = hub.y - from.y;
        const vertical = Math.abs(dx) < step;
        field.links.push({
          from, to: hub,
          c1: { x: vertical ? from.x : from.x + dx * .55, y: vertical ? from.y + dy * .45 : from.y },
          c2: { x: vertical ? hub.x : hub.x - dx * .3, y: vertical ? hub.y - dy * .25 : hub.y },
          delay: field.links.length * .025
        });
      }
      if (scene === 'assembly' || scene === 'logo') {
        field.pixels = field.pixels.filter(pixel => pixel.node);
        prepareAssembly();
      }
      draw();
    }
    function prepareAssembly() {
      const centreX = field.width / 2;
      const centreY = field.height / 2;
      const extent = Math.min(field.width, field.height);
      const ordered = [...field.pixels].sort((a, b) => Math.atan2(a.y - centreY, a.x - centreX) - Math.atan2(b.y - centreY, b.x - centreX));
      // Each connected square gains a companion during assembly: 13 become 26.
      const targetSize = extent * .045;
      for (let i = 0; i < ordered.length; i++) {
        const pixel = ordered[i];
        const angle = -Math.PI + i * Math.PI * 2 / ordered.length;
        pixel.targetX = centreX + Math.cos(angle) * extent * .17;
        pixel.targetY = centreY + Math.sin(angle) * extent * .175;
        pixel.targetSize = targetSize;
        pixel.delay = ((i * .61803398875) % 1) * .12;
        const companionAngle = angle + Math.PI / ordered.length;
        field.pixels.push({
          x: pixel.x, y: pixel.y, size: pixel.size, node: true,
          parent: pixel,
          targetX: centreX + Math.cos(companionAngle) * extent * .17,
          targetY: centreY + Math.sin(companionAngle) * extent * .175,
          targetSize,
          delay: pixel.delay + .08
        });
      }
    }
    function drawAssembly() {
      // Start from the finished network of slide 02, then move its actual squares.
      for (const pixel of field.pixels) {
        const amount = clamp((progress - .12 - pixel.delay) / .66);
        const eased = amount * amount * (3 - 2 * amount);
        pixel.currentX = pixel.parent
          ? pixel.parent.currentX + (pixel.targetX - pixel.parent.targetX) * eased
          : pixel.x + (pixel.targetX - pixel.x) * eased;
        pixel.currentY = pixel.parent
          ? pixel.parent.currentY + (pixel.targetY - pixel.parent.targetY) * eased
          : pixel.y + (pixel.targetY - pixel.y) * eased;
        pixel.arrival = eased;
      }
      context.lineWidth = 1;
      context.lineCap = 'round';
      context.setLineDash([1, 3]);
      context.strokeStyle = 'rgba(112, 122, 138, ' + (.65 * (1 - clamp((progress - .07) / .05))) + ')';
      for (const link of progress < .12 ? field.links : []) {
        const from = link.from;
        const to = link.to;
        const dx = to.currentX - from.currentX;
        const dy = to.currentY - from.currentY;
        const vertical = Math.abs(link.from.x - link.to.x) < 28;
        context.beginPath();
        context.moveTo(from.currentX, from.currentY);
        context.bezierCurveTo(
          vertical ? from.currentX : from.currentX + dx * .55,
          vertical ? from.currentY + dy * .45 : from.currentY,
          vertical ? to.currentX : to.currentX - dx * .3,
          vertical ? to.currentY - dy * .25 : to.currentY,
          to.currentX, to.currentY
        );
        context.stroke();
      }
      context.setLineDash([]);
      for (const pixel of field.pixels) {
        const opacity = pixel.parent ? clamp((pixel.parent.arrival - .15) / .35) : 1;
        if (opacity <= 0) continue;
        const startShade = 98;
        const shade = Math.round(startShade + (56 - startShade) * pixel.arrival);
        context.fillStyle = 'rgb(' + shade + ', ' + shade + ', ' + (shade + 6) + ')';
        context.globalAlpha = opacity;
        const startSize = pixel.size + 1.5;
        const size = startSize + (pixel.targetSize - startSize) * pixel.arrival;
        context.fillRect(pixel.currentX - size / 2, pixel.currentY - size / 2, size, size);
      }
      context.globalAlpha = 1;
    }
    function drawLogo() {
      const extent = Math.min(field.width, field.height);
      const scale = field.width * .92 / logoArtwork.width;
      const left = (field.width - logoArtwork.width * scale) / 2;
      const top = (field.height - logoArtwork.height * scale) / 2;
      const movement = clamp((progress - .064) / .456);
      const eased = movement * movement * (3 - 2 * movement);
      const reveal = clamp((progress - .464) / .224);
      const letters = clamp((progress - .28) / .36);
      for (const pixel of field.pixels) {
        const ringX = (pixel.targetX - field.width / 2) / (extent * .17);
        const ringY = (pixel.targetY - field.height / 2) / (extent * .175);
        const destinationX = left + (297 + ringX * 47.5) * scale;
        const destinationY = top + (72 + ringY * 49) * scale;
        const x = pixel.targetX + (destinationX - pixel.targetX) * eased;
        const y = pixel.targetY + (destinationY - pixel.targetY) * eased;
        const size = pixel.targetSize + (7 * scale - pixel.targetSize) * eased;
        context.globalAlpha = 1 - reveal;
        context.fillStyle = '#38383e';
        if (reveal < 1) context.fillRect(x - size / 2, y - size / 2, size, size);
      }
      context.save();
      context.translate(left, top);
      context.scale(scale, scale);
      context.fillStyle = '#000';
      context.globalAlpha = letters;
      if (letters > 0) {
        for (const path of logoPaths.slice(1)) context.fill(path);
        context.fill(logoV);
        for (const rect of logoArtwork.letterSquares) context.fillRect(rect.x, rect.y, rect.width, rect.height);
      }
      context.globalAlpha = reveal;
      if (reveal > 0) {
        context.fill(logoPaths[0]);
        for (const rect of logoArtwork.oSquares) {
          const delay = satelliteDelays.get(rect);
          const appearance = delay === undefined ? reveal : clamp((progress - delay) / .07);
          if (appearance <= 0) continue;
          const easedAppearance = appearance * appearance * (3 - 2 * appearance);
          context.globalAlpha = easedAppearance * (rect.opacity < 1 ? .18 : rect.opacity);
          context.fillRect(rect.x, rect.y, rect.width, rect.height);
        }
      }
      context.restore();
      context.globalAlpha = 1;
    }
    function draw() {
      context.clearRect(0, 0, field.width, field.height);
      if (scene === 'assembly') { drawAssembly(); return; }
      if (scene === 'logo') { drawLogo(); return; }
      if (scene === 'connections') {
        context.lineWidth = 1;
        context.lineCap = 'round';
        context.setLineDash([1, 3]);
        for (const link of field.links) {
          const amount = clamp((progress - .2 - link.delay * .45) / .56);
          if (!amount) continue;
          const eased = amount * amount * (3 - 2 * amount);
          context.strokeStyle = 'rgba(112, 122, 138, ' + (.65 * amount) + ')';
          context.beginPath();
          context.moveTo(link.from.x, link.from.y);
          // Sample the cubic curve to reveal it progressively along its path.
          const segments = Math.max(1, Math.ceil(80 * eased));
          for (let i = 1; i <= segments; i++) {
            const t = eased * i / segments;
            const u = 1 - t;
            context.lineTo(
              u*u*u*link.from.x + 3*u*u*t*link.c1.x + 3*u*t*t*link.c2.x + t*t*t*link.to.x,
              u*u*u*link.from.y + 3*u*u*t*link.c1.y + 3*u*t*t*link.c2.y + t*t*t*link.to.y
            );
          }
          context.stroke();
        }
      }
      context.setLineDash([]);
      const gridFade = scene === 'connections' ? clamp(progress / .32) : 0;
      const nodeReveal = scene === 'connections' ? clamp((progress - .12) / .24) : 0;
      for (const pixel of field.pixels) {
        const opacity = scene === 'connections' && !pixel.node ? 1 - gridFade : 1;
        if (opacity <= 0) continue;
        context.globalAlpha = opacity;
        const emphasis = pixel.node ? nodeReveal : 0;
        const shade = Math.round(146 - emphasis * 48);
        context.fillStyle = 'rgb(' + shade + ', ' + shade + ', ' + (shade + 6) + ')';
        const size = pixel.size + emphasis * 1.5;
        context.fillRect(pixel.x + (pixel.hoverX || 0) - size / 2, pixel.y + (pixel.hoverY || 0) - size / 2, size, size);
      }
      context.globalAlpha = 1;
    }
    function animateHover(time) {
      hoverFrame = 0;
      const elapsed = hoverTime ? Math.min(50, time - hoverTime) : 16.67;
      hoverTime = time;
      const easing = 1 - Math.exp(-elapsed / 105);
      const radius = Math.min(150, Math.max(90, field.width * .23));
      let moving = false;
      for (const pixel of field.pixels) {
        const dx = pointer.x - pixel.x;
        const dy = pointer.y - pixel.y;
        const distance = Math.hypot(dx, dy);
        // Sample from the original grid so attraction always stays local.
        const influence = pointer.active ? Math.max(0, 1 - distance / radius) : 0;
        const pull = .65 * influence * influence;
        const targetX = dx * pull, targetY = dy * pull;
        pixel.hoverX = (pixel.hoverX || 0) + (targetX - (pixel.hoverX || 0)) * easing;
        pixel.hoverY = (pixel.hoverY || 0) + (targetY - (pixel.hoverY || 0)) * easing;
        if (Math.abs(targetX - pixel.hoverX) + Math.abs(targetY - pixel.hoverY) > .02) moving = true;
        else { pixel.hoverX = targetX; pixel.hoverY = targetY; }
      }
      draw();
      if (moving && visible) hoverFrame = requestAnimationFrame(animateHover);
      else hoverTime = 0;
    }
    function requestHover() {
      if (!hoverFrame && visible) hoverFrame = requestAnimationFrame(animateHover);
    }
    if (interactive) {
      canvas.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch') return;
        const bounds = canvas.getBoundingClientRect();
        pointer.x = (event.clientX - bounds.left) * field.width / bounds.width;
        pointer.y = (event.clientY - bounds.top) * field.height / bounds.height;
        pointer.active = true;
        requestHover();
      });
      const release = () => { pointer.active = false; requestHover(); };
      canvas.addEventListener('pointerleave', release);
      canvas.addEventListener('pointercancel', release);
      window.addEventListener('blur', release);
    }
    function tick(time) {
      if (!started) started = time;
      progress = clamp((time - started) / (scene === 'assembly' ? 7200 : scene === 'logo' ? 8000 : 3600));
      draw();
      frame = progress < 1 && visible ? requestAnimationFrame(tick) : 0;
    }
    function play() {
      cancelAnimationFrame(frame);
      started = 0;
      // Movement is the requested content of this presentation; never skip to O.
      progress = 0;
      draw();
      if (visible) frame = requestAnimationFrame(tick);
    }
    new ResizeObserver(layout).observe(canvas);
    layout();
    slide.querySelector('.replay')?.addEventListener('click', play);
    new IntersectionObserver(entries => {
      for (const entry of entries) {
        visible = entry.isIntersecting;
        if (visible) {
          if (animated) play();
        } else {
          cancelAnimationFrame(frame);
          frame = 0;
          if (interactive) {
            cancelAnimationFrame(hoverFrame);
            hoverFrame = 0;
            hoverTime = 0;
            pointer.active = false;
            for (const pixel of field.pixels) { pixel.hoverX = 0; pixel.hoverY = 0; }
            draw();
          }
        }
      }
    }, { threshold: .5 }).observe(canvas);
    reducedMotion.addEventListener('change', () => { if (animated) play(); });
  });
  document.querySelectorAll('.globe-field').forEach(canvas => {
    const context = canvas.getContext('2d');
    // Stylised continental silhouettes, projected onto a sphere and sampled on a square grid.
    const continents = [
      [[-17,36],[4,38],[34,30],[51,12],[42,-12],[31,-35],[17,-35],[9,-6],[-17,15]],
      [[-10,36],[-9,43],[-2,44],[-5,49],[8,54],[5,59],[15,71],[28,71],[32,60],[40,70],[65,55],[90,73],[135,55],[160,60],[178,45],[140,35],[118,6],[100,0],[78,9],[65,25],[42,36],[29,41],[23,38],[20,40],[16,46],[12,45],[16,39],[13,38],[7,44],[3,42]],
      [[-10,50],[-6,58],[-3,59],[1,52]],
      [[-168,67],[-130,73],[-105,82],[-60,52],[-53,46],[-82,25],[-87,15],[-107,24],[-124,45],[-160,55]],
      [[-81,12],[-62,10],[-35,-5],[-40,-22],[-67,-56],[-76,-38],[-81,-5]],
      [[112,-12],[135,-10],[154,-25],[145,-40],[117,-35]],
      [[-53,59],[-22,66],[-30,82],[-55,83],[-67,70]]
    ];
    let width = 0, height = 0, points = [], frame = 0, visible = false, lastFrame = 0;
    let elapsed = 0, previousTime = 0;
    const landAt = (longitude, latitude) => continents.some(polygon => {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [x1, y1] = polygon[i], [x2, y2] = polygon[j];
        if ((y1 > latitude) !== (y2 > latitude) && longitude < (x2 - x1) * (latitude - y1) / (y2 - y1) + x1) inside = !inside;
      }
      return inside;
    });
    let lastDrawElapsed = null;
    function layoutGlobe() {
      ({ width, height } = canvas.getBoundingClientRect());
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const mobile = width < 700;
      const radius = mobile ? height * .54 : Math.min(height * .70, width * .44);
      const cx = width * (mobile ? .97 : .86), cy = height * .82;
      const tiltCos = Math.cos(.26), tiltSin = Math.sin(.26);
      const step = mobile ? 6 : 8;
      points = [];
      for (let y = 4; y < height; y += step) {
        for (let x = 4; x < width; x += step) {
          const nx = (x - cx) / radius, ny = (y - cy) / radius;
          const distance = nx * nx + ny * ny;
          if (distance >= 1) continue;
          const z = Math.sqrt(1 - distance);
          const noise = ((Math.imul(x, 73856093) ^ Math.imul(y, 19349663)) >>> 0) / 4294967295;
          points.push({
            x, y, z, noise, size: 2.4 + noise * .5,
            longitude: Math.atan2(nx, z * tiltCos + ny * tiltSin),
            latitude: Math.asin(-ny * tiltCos + z * tiltSin), opacity: null
          });
        }
      }
      lastDrawElapsed = null;
      drawGlobe();
    }
    function drawGlobe() {
      context.clearRect(0, 0, width, height);
      // Screen coordinates and square sizes stay fixed. Only the continent mask rotates.
      const rotation = .35 - elapsed * .00014;
      const delta = lastDrawElapsed === null ? 0 : Math.max(0, elapsed - lastDrawElapsed);
      const blend = 1 - Math.exp(-delta / 85);
      lastDrawElapsed = elapsed;
      for (const point of points) {
        const lon = point.longitude + rotation;
        const degrees = ((lon * 180 / Math.PI + 540) % 360) - 180;
        const land = landAt(degrees, point.latitude * 180 / Math.PI);
        const network = Math.abs(Math.sin(point.latitude * 12)) < .065 || Math.abs(Math.sin(lon * 12)) < .065;
        const rim = Math.pow(1 - point.z, 7);
        const luminosity = Math.min(1, (land ? .58 + point.noise * .4 : .025 + point.noise * .065) + (network ? .12 : 0) + rim * .4);
        const target = luminosity;
        point.opacity = point.opacity === null ? target : point.opacity + (target - point.opacity) * blend;
        context.fillStyle = 'rgba(255, 255, 255, ' + point.opacity + ')';
        context.fillRect(point.x - point.size / 2, point.y - point.size / 2, point.size, point.size);
      }
    }
    function tickGlobe(time) {
      if (!visible || document.hidden) { frame = 0; previousTime = 0; return; }
      if (previousTime) elapsed += Math.min(time - previousTime, 100);
      previousTime = time;
      if (time - lastFrame >= 42) { drawGlobe(); lastFrame = time; }
      frame = requestAnimationFrame(tickGlobe);
    }
    function syncGlobe() {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      // This slide explicitly demonstrates motion, including when the system reduces animations.
      if (visible && !document.hidden) frame = requestAnimationFrame(tickGlobe);
      else drawGlobe();
    }
    new ResizeObserver(layoutGlobe).observe(canvas);
    layoutGlobe();
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncGlobe();
    }, { threshold: 0 }).observe(canvas.closest('.globe-slide'));
    const initialBounds = canvas.closest('.globe-slide').getBoundingClientRect();
    visible = initialBounds.bottom > 0 && initialBounds.top < window.innerHeight;
    syncGlobe();
    document.addEventListener('visibilitychange', syncGlobe);
  });
  const website = document.querySelector('.website-slide');
  if (website) {
    const input = website.querySelector('.website-query input');
    const answer = website.querySelector('.website-answer');
    website.querySelectorAll('.website-prompts button').forEach(button => {
      button.addEventListener('click', () => { input.value = button.textContent; input.focus(); });
    });
    website.querySelector('.website-contact').addEventListener('click', () => input.focus());
    website.querySelector('.website-query').addEventListener('submit', event => {
      event.preventDefault();
      if (!input.value.trim()) { input.focus(); return; }
      answer.hidden = false;
      answer.textContent = 'First, we understand your task. Then we connect data and workflows to create a solution that works for people. This is an interface preview; your request is not sent.';
    });
  }
  document.querySelectorAll('.concept-space-slide').forEach(slide => {
    new IntersectionObserver(entries => {
      slide.classList.toggle('is-contour-active', entries[0].isIntersecting);
    }, { threshold: .35 }).observe(slide);
  });
  document.querySelectorAll('.concept-light-slide').forEach(slide => {
    const replay = () => {
      slide.classList.remove('is-light-active');
      void slide.getBoundingClientRect();
      slide.classList.add('is-light-active');
    };
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) replay();
      else slide.classList.remove('is-light-active');
    }, { threshold: .35 }).observe(slide);
    slide.querySelector('.light-replay').addEventListener('click', replay);
  });
  document.querySelectorAll('.concept-wordmark-slide').forEach(slide => {
    const replay = () => {
      slide.classList.remove('is-wordmark-active');
      void slide.getBoundingClientRect();
      slide.classList.add('is-wordmark-active');
    };
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) replay();
      else slide.classList.remove('is-wordmark-active');
    }, { threshold: .35 }).observe(slide);
    slide.querySelector('.wordmark-replay').addEventListener('click', replay);
  });
  const conceptLinks = Array.from(document.querySelectorAll('[data-concept-link]'));
  function updateConceptMenu(slide) {
    for (const link of conceptLinks) {
      if (link.dataset.conceptLink === slide.dataset.concept) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  }
  const slideObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) { activeSlide = slides.indexOf(entry.target); updateConceptMenu(entry.target); }
    }
  }, { threshold: .45 });
  slides.forEach(slide => slideObserver.observe(slide));
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('button, a, input, textarea, select')) return;
    const direction = ['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key) ? 1
      : ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key) ? -1 : 0;
    if (!direction) return;
    const target = slides[activeSlide + direction];
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
})();
