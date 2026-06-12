/* ============================================================
   CK48 Reunion — Class Found-Ratio Bubble Chart
   Requires: D3 v7 (loaded before this script)
   Usage: ClassBubbleChart.init({ containerId, data, height })
     data: [{ id, className, totalAlumni, foundAlumni }, ...]
   ============================================================ */

(function () {
  const ClassBubbleChart = {
    instances: {},

    init({ containerId, data, height = 420 }) {
      if (!window.d3) {
        console.warn('ClassBubbleChart: D3 not loaded');
        return;
      }
      const container = document.getElementById(containerId);
      if (!container) return;

      // Teardown any prior instance
      if (this.instances[containerId]) {
        this.instances[containerId].destroy();
      }

      container.innerHTML = '';
      this.instances[containerId] = this._build({ container, containerId, data, height });
    },

    _build({ container, containerId, data, height }) {
      const d3 = window.d3;
      const uid = containerId.replace(/[^a-z0-9]/gi, '_');

      function getWidth() { return container.clientWidth || 400; }
      let width = getWidth();

      // Bubble radius scale (sqrt area ∝ totalAlumni)
      const rScale = d3.scaleSqrt()
        .domain(d3.extent(data, d => d.totalAlumni))
        .range([24, 38]);

      // Node data
      const nodes = data.map((d, i) => ({
        ...d,
        r: rScale(d.totalAlumni),
        ratio: d.totalAlumni > 0 ? d.foundAlumni / d.totalAlumni : 0,
        i,
        x: width / 2 + (Math.random() - 0.5) * width * 0.6,
        y: height / 2 + (Math.random() - 0.5) * height * 0.5,
        vx: 0,
        vy: 0,
      }));

      // ── SVG ───────────────────────────────────────────────────
      const svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('display', 'block');

      const defs = svg.append('defs');

      // Gold gradient (bottom-dark → top-light)
      const gid = `bc-gold-${uid}`;
      const grad = defs.append('linearGradient')
        .attr('id', gid)
        .attr('x1', '0%').attr('y1', '100%')
        .attr('x2', '0%').attr('y2', '0%');
      grad.append('stop').attr('offset', '0%').attr('stop-color', '#8a6530');
      grad.append('stop').attr('offset', '60%').attr('stop-color', '#b08d57');
      grad.append('stop').attr('offset', '100%').attr('stop-color', '#d4ac70');

      // Glow filter for high-ratio bubbles
      const fid = `bc-glow-${uid}`;
      const filt = defs.append('filter').attr('id', fid)
        .attr('x', '-40%').attr('y', '-40%')
        .attr('width', '180%').attr('height', '180%');
      filt.append('feGaussianBlur')
        .attr('in', 'SourceGraphic').attr('stdDeviation', '4').attr('result', 'blur');
      const fm = filt.append('feMerge');
      fm.append('feMergeNode').attr('in', 'blur');
      fm.append('feMergeNode').attr('in', 'SourceGraphic');

      // Per-bubble clip paths (IDs indexed by node.i)
      const clipPaths = defs.selectAll(null)
        .data(nodes)
        .join('clipPath')
        .attr('id', d => `bc-clip-${uid}-${d.i}`);
      const clipCircles = clipPaths.append('circle').attr('r', d => d.r);

      // ── Drawing layers ────────────────────────────────────────
      const layer = svg.append('g');

      // 1) Dark background circles
      const bgCircles = layer.selectAll('.bc-bg')
        .data(nodes).join('circle')
        .attr('class', 'bc-bg')
        .attr('r', d => d.r)
        .attr('fill', '#162640');

      // 2) Water fill rects (clipped to circle shape)
      const waterRects = layer.selectAll('.bc-water')
        .data(nodes).join('rect')
        .attr('class', 'bc-water')
        .attr('clip-path', d => `url(#bc-clip-${uid}-${d.i})`)
        .attr('fill', `url(#${gid})`);

      // 3) Sheen: subtle top-highlight (frosted glass look)
      const sheenClipPaths = defs.selectAll(null)
        .data(nodes)
        .join('clipPath')
        .attr('id', d => `bc-sheen-${uid}-${d.i}`);
      sheenClipPaths.append('circle').attr('r', d => d.r);

      const sheens = layer.selectAll('.bc-sheen')
        .data(nodes).join('ellipse')
        .attr('class', 'bc-sheen')
        .attr('rx', d => d.r * 0.55)
        .attr('ry', d => d.r * 0.28)
        .attr('fill', 'rgba(255,255,255,0.07)')
        .attr('clip-path', d => `url(#bc-sheen-${uid}-${d.i})`);

      // 4) Ring / border
      const rings = layer.selectAll('.bc-ring')
        .data(nodes).join('circle')
        .attr('class', 'bc-ring')
        .attr('r', d => d.r)
        .attr('fill', 'none')
        .attr('stroke-width', 1.5);

      // 5) Hit area (transparent, for events)
      const hits = layer.selectAll('.bc-hit')
        .data(nodes).join('circle')
        .attr('class', 'bc-hit')
        .attr('r', d => d.r)
        .attr('fill', 'transparent')
        .attr('cursor', 'pointer');

      // 6) Class name text
      const names = layer.selectAll('.bc-name')
        .data(nodes).join('text')
        .attr('class', 'bc-name')
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.92)')
        .attr('pointer-events', 'none')
        .attr('font-family', 'inherit')
        .attr('font-weight', '600')
        .attr('font-size', d => d.r > 30 ? 13 : 11)
        .text(d => d.className);

      // 7) Percentage text
      const pcts = layer.selectAll('.bc-pct')
        .data(nodes).join('text')
        .attr('class', 'bc-pct')
        .attr('text-anchor', 'middle')
        .attr('pointer-events', 'none')
        .attr('font-family', 'inherit')
        .attr('font-size', d => d.r > 30 ? 11 : 9)
        .text(d => `${Math.round(d.ratio * 100)}%`);

      // ── Tooltip ───────────────────────────────────────────────
      const tip = d3.select(container).append('div')
        .attr('class', 'bc-tooltip')
        .style('display', 'none');

      hits
        .on('mouseenter touchstart', function (event, d) {
          tip.style('display', 'block')
            .html(`<span class="bc-tip-class">${d.className}</span>` +
              `<span class="bc-tip-stat">找到 <b>${d.foundAlumni}</b> / ${d.totalAlumni} 人</span>` +
              `<span class="bc-tip-pct">${Math.round(d.ratio * 100)}%</span>`);
          _positionTip(event);
        })
        .on('mousemove', _positionTip)
        .on('mouseleave touchend', () => tip.style('display', 'none'));

      function _positionTip(event) {
        const rect = container.getBoundingClientRect();
        const ex = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
        const ey = event.clientY ?? event.touches?.[0]?.clientY ?? 0;
        const tx = ex - rect.left + 14;
        const ty = ey - rect.top - 8;
        // Keep tooltip inside container
        const tw = 140;
        tip
          .style('left', Math.min(tx, width - tw) + 'px')
          .style('top', ty + 'px');
      }

      // ── Force simulation ──────────────────────────────────────
      const sim = d3.forceSimulation(nodes)
        .force('center', d3.forceCenter(width / 2, height / 2).strength(0.04))
        .force('collide', d3.forceCollide(d => d.r + 2.5).strength(0.85).iterations(3))
        .force('charge', d3.forceManyBody().strength(-8))
        .force('y', d3.forceY(d => {
          // Bubbles with higher ratio float slightly higher
          return height * (0.28 + (1 - d.ratio) * 0.44);
        }).strength(0.04))
        .alphaTarget(0.08)   // keep simulation gently running forever
        .alphaDecay(0.01)
        .on('tick', tick);

      function tick() {
        const pad = 4;
        nodes.forEach(d => {
          d.x = Math.max(d.r + pad, Math.min(width - d.r - pad, d.x));
          d.y = Math.max(d.r + pad, Math.min(height - d.r - pad, d.y));
        });

        // ClipPath circles follow bubble position
        clipCircles.attr('cx', d => d.x).attr('cy', d => d.y);
        sheenClipPaths.selectAll('circle').attr('cx', d => d.x).attr('cy', d => d.y);

        bgCircles.attr('cx', d => d.x).attr('cy', d => d.y);

        // Water rect: bottom of rect = bottom of circle, height = 2r * ratio
        waterRects
          .attr('x', d => d.x - d.r)
          .attr('y', d => d.y + d.r * (1 - 2 * d.ratio))
          .attr('width', d => d.r * 2)
          .attr('height', d => d.r * 2 * d.ratio);

        // Sheen (top inner highlight)
        sheens
          .attr('cx', d => d.x)
          .attr('cy', d => d.y - d.r * 0.45);

        // Ring color: gold-bright for high ratio, dim for low
        rings
          .attr('cx', d => d.x).attr('cy', d => d.y)
          .attr('stroke', d => d.ratio > 0.75 ? '#c9a96e' : 'rgba(180,140,80,0.3)')
          .attr('filter', d => d.ratio > 0.8 ? `url(#${fid})` : null);

        hits.attr('cx', d => d.x).attr('cy', d => d.y);

        // Text vertical positioning: name above center, pct below
        const nameOffset = -6;
        const pctOffset = 8;
        names
          .attr('x', d => d.x)
          .attr('y', d => d.y + nameOffset)
          .attr('fill', d => d.ratio > 0.4 ? 'rgba(255,255,255,0.92)' : 'rgba(200,200,220,0.75)');

        pcts
          .attr('x', d => d.x)
          .attr('y', d => d.y + pctOffset)
          .attr('fill', d => d.ratio > 0.5 ? '#c9a96e' : 'rgba(140,120,90,0.8)');
      }

      // ── Resize ────────────────────────────────────────────────
      const ro = new ResizeObserver(() => {
        width = getWidth();
        svg.attr('width', width);
        sim.force('center', d3.forceCenter(width / 2, height / 2).strength(0.04));
        sim.alpha(0.4).restart();
      });
      ro.observe(container);

      return {
        destroy() {
          sim.stop();
          ro.disconnect();
        },
      };
    },
  };

  window.ClassBubbleChart = ClassBubbleChart;
})();
