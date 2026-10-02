(function () {
  "use strict";

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function branch(id, ins, outs) {
    const nodes = new Set([id]);
    const edges = new Set();
    function walk(start, map, key) {
      (map.get(start) || []).forEach(function (p) {
        edges.add(p);
        const next = p.dataset[key];
        if (!nodes.has(next)) {
          nodes.add(next);
          walk(next, map, key);
        }
      });
    }
    walk(id, ins, "from");
    walk(id, outs, "to");
    return { nodes: nodes, edges: edges };
  }

  function viewer(link, svg) {
    const width = parseFloat(svg.getAttribute("width"));
    const height = parseFloat(svg.getAttribute("height"));
    if (!width || !height) throw new Error("у дерева нет размера");
    const host = el("div", "mc-tree");
    const view = el("div", "mc-tree-view");
    const stage = el("div", "mc-tree-stage");
    stage.style.width = width + "px";
    stage.style.height = height + "px";
    svg.style.width = width + "px";
    svg.style.height = height + "px";
    stage.appendChild(svg);
    view.appendChild(stage);

    const paths = Array.from(svg.querySelectorAll("path.mc-e"));
    const nodes = Array.from(svg.querySelectorAll("g.mc-n"));
    const ins = new Map();
    const outs = new Map();
    paths.forEach(function (p) {
      if (!ins.has(p.dataset.to)) ins.set(p.dataset.to, []);
      ins.get(p.dataset.to).push(p);
      if (!outs.has(p.dataset.from)) outs.set(p.dataset.from, []);
      outs.get(p.dataset.from).push(p);
    });
    nodes.forEach(function (g) {
      g.addEventListener("mouseenter", function () {
        const rel = branch(g.dataset.id, ins, outs);
        nodes.forEach(function (n) { n.classList.toggle("mc-dim", !rel.nodes.has(n.dataset.id)); });
        paths.forEach(function (p) {
          p.classList.toggle("mc-hot", rel.edges.has(p));
          p.classList.toggle("mc-dim", !rel.edges.has(p));
        });
      });
      g.addEventListener("mouseleave", function () {
        nodes.forEach(function (n) { n.classList.remove("mc-dim"); });
        paths.forEach(function (p) { p.classList.remove("mc-hot", "mc-dim"); });
      });
    });

    const t = { s: 1, x: 0, y: 0 };
    let moved = false;
    function apply() {
      stage.style.transform = "translate(" + t.x + "px," + t.y + "px) scale(" + t.s + ")";
    }
    function zoomAt(f, cx, cy) {
      moved = true;
      const s = Math.min(3, Math.max(0.15, t.s * f));
      t.x = cx - (cx - t.x) * s / t.s;
      t.y = cy - (cy - t.y) * s / t.s;
      t.s = s;
      apply();
    }
    function fit() {
      const w = view.clientWidth;
      const h = view.clientHeight;
      moved = false;
      if (!w || !h) return;
      t.s = Math.min(1.5, (w - 16) / width, (h - 16) / height);
      t.x = (w - width * t.s) / 2;
      t.y = (h - height * t.s) / 2;
      apply();
    }

    view.addEventListener("wheel", function (ev) {
      ev.preventDefault();
      const b = view.getBoundingClientRect();
      zoomAt(Math.exp(-ev.deltaY * 0.0015), ev.clientX - b.left, ev.clientY - b.top);
    }, { passive: false });

    const ptrs = new Map();
    let pinch = 0;
    view.addEventListener("pointerdown", function (ev) {
      view.setPointerCapture(ev.pointerId);
      ptrs.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      view.classList.add("mc-drag");
    });
    view.addEventListener("pointermove", function (ev) {
      const p = ptrs.get(ev.pointerId);
      if (!p) return;
      if (ptrs.size === 1) {
        moved = true;
        t.x += ev.clientX - p.x;
        t.y += ev.clientY - p.y;
        apply();
      }
      p.x = ev.clientX;
      p.y = ev.clientY;
      if (ptrs.size === 2) {
        const pair = Array.from(ptrs.values());
        const d = Math.hypot(pair[0].x - pair[1].x, pair[0].y - pair[1].y);
        if (pinch) {
          const r = view.getBoundingClientRect();
          zoomAt(d / pinch, (pair[0].x + pair[1].x) / 2 - r.left, (pair[0].y + pair[1].y) / 2 - r.top);
        }
        pinch = d;
      }
    });
    function release(ev) {
      ptrs.delete(ev.pointerId);
      pinch = 0;
      if (!ptrs.size) view.classList.remove("mc-drag");
    }
    view.addEventListener("pointerup", release);
    view.addEventListener("pointercancel", release);

    const tools = el("div", "mc-tree-tools");
    function button(label, title, fn) {
      const b = el("button", "mc-btn", label);
      b.type = "button";
      b.title = title;
      b.addEventListener("click", fn);
      tools.appendChild(b);
    }
    button("+", "Приблизить", function () { zoomAt(1.25, view.clientWidth / 2, view.clientHeight / 2); });
    button("-", "Отдалить", function () { zoomAt(0.8, view.clientWidth / 2, view.clientHeight / 2); });
    button("Вписать", "Показать дерево целиком", fit);
    if (host.requestFullscreen) {
      button("На весь экран", "Развернуть на весь экран", function () {
        if (document.fullscreenElement === host) document.exitFullscreen();
        else host.requestFullscreen();
      });
      document.addEventListener("fullscreenchange", function () {
        if (!document.fullscreenElement || document.fullscreenElement === host) requestAnimationFrame(fit);
      });
    }
    host.append(view, tools, el("div", "mc-tree-hint", "Колесо меняет масштаб, перетаскивание двигает дерево"));
    const p = link.parentElement;
    (p.tagName === "P" && p.children.length === 1 ? p : link).replaceWith(host);
    new ResizeObserver(function () { if (!moved) fit(); }).observe(view);
  }

  function mount() {
    document.querySelectorAll("a.mc-tree-link:not([data-done])").forEach(function (link) {
      link.dataset.done = "1";
      fetch(link.href).then(function (r) {
        if (!r.ok) throw new Error(link.getAttribute("href") + ": HTTP " + r.status);
        return r.text();
      }).then(function (text) {
        const svg = new DOMParser().parseFromString(text, "image/svg+xml").documentElement;
        if (svg.nodeName !== "svg") throw new Error(link.getAttribute("href") + ": не SVG");
        viewer(link, document.importNode(svg, true));
      }).catch(function (err) {
        link.after(el("div", "mc-error", "Не удалось включить просмотр: " + err.message));
        console.error(err);
      });
    });
  }

  if (window.document$) window.document$.subscribe(mount);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
