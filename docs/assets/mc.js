(function () {
  "use strict";

  const BASE = new URL("../", document.currentScript.src);
  const cache = new Map();
  const COL = 150;
  const ROW = 84;
  const NODE = 96;
  const SLOT = 36;

  function load(src) {
    const url = new URL(src, BASE).href;
    if (!cache.has(url)) {
      cache.set(url, fetch(url).then(function (r) {
        if (!r.ok) throw new Error(src + ": HTTP " + r.status);
        return r.json();
      }));
    }
    return cache.get(url);
  }

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function num(x) {
    return x.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
  }

  function item(data, id) {
    const it = data.items[id];
    if (!it) throw new Error("нет предмета " + id + " в выгрузке");
    return it;
  }

  function mod(data, id) {
    const ns = id.split(":")[0];
    if (!data.mods[ns]) throw new Error("нет имени мода " + ns + " в выгрузке");
    return data.mods[ns];
  }

  function layers(list) {
    return list.slice().reverse().map(function (t) {
      return "url(\"" + new URL(t, BASE).href + "\")";
    }).join(", ");
  }

  function abbr(name) {
    return name.split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 3).toUpperCase();
  }

  function icon(data, id) {
    const it = item(data, id);
    const ic = it.icon;
    if (!ic) return el("div", "mc-icon mc-text", abbr(it.name));
    if (ic.type === "flat") {
      const e = el("div", "mc-icon mc-flat");
      e.style.backgroundImage = layers(ic.layers);
      return e;
    }
    if (ic.type === "cube") {
      const e = el("div", "mc-icon mc-cube");
      const inner = el("div", "mc-cube-inner");
      ["top", "left", "right"].forEach(function (f) {
        const face = el("div", "mc-face mc-" + f);
        face.style.backgroundImage = layers(ic[f]);
        inner.appendChild(face);
      });
      e.appendChild(inner);
      return e;
    }
    throw new Error(id + ": неизвестный вид иконки " + ic.type);
  }

  const tip = el("div", "mc-tooltip");

  function showTip(ev, lines) {
    const host = document.fullscreenElement || document.body;
    if (tip.parentNode !== host) host.appendChild(tip);
    tip.replaceChildren();
    lines.forEach(function (l, i) {
      tip.appendChild(el("div", i === 0 ? "" : l.cls || "mc-tt-line", l.text));
    });
    tip.style.display = "block";
    moveTip(ev);
  }

  function moveTip(ev) {
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    let x = ev.clientX + 14;
    let y = ev.clientY - h - 8;
    if (x + w > window.innerWidth - 4) x = ev.clientX - w - 14;
    if (y < 4) y = ev.clientY + 18;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  }

  function hideTip() {
    tip.style.display = "none";
  }

  function hover(target, lines, onEnter, onLeave) {
    target.addEventListener("mouseenter", function (ev) {
      showTip(ev, lines());
      if (onEnter) onEnter();
    });
    target.addEventListener("mousemove", moveTip);
    target.addEventListener("mouseleave", function () {
      hideTip();
      if (onLeave) onLeave();
    });
  }

  function itemLines(data, slot) {
    const lines = [{ text: slot.name }];
    if (slot.alt && slot.alt.length) {
      lines.push({ text: "Подходит любой: " + slot.alt.join(", ") });
    }
    lines.push({ text: mod(data, slot.item), cls: "mc-tt-mod" });
    return lines;
  }

  function slot(data, s, count, big) {
    const e = el("div", big ? "mc-slot mc-big" : "mc-slot");
    if (!s) return e;
    e.appendChild(icon(data, s.item));
    if (count > 1) e.appendChild(el("span", "mc-count", num(count)));
    hover(e, function () { return itemLines(data, s); });
    return e;
  }

  function findRecipe(data, id) {
    const found = data.recipes.filter(function (r) {
      return r.outputs.some(function (o) { return o.item === id; });
    });
    if (found.length !== 1) throw new Error(id + ": рецептов в выгрузке " + found.length + ", нужен один");
    return found[0];
  }

  function card(host, data) {
    const r = findRecipe(data, host.dataset.item);
    const panel = el("div", "mc-panel");
    panel.appendChild(el("div", "mc-title", r.station));
    const row = el("div", "mc-row");
    if (r.grid) {
      const grid = el("div", "mc-grid");
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          const cell = r.grid[y] ? r.grid[y][x] : null;
          grid.appendChild(slot(data, cell === null || cell === undefined ? null : r.inputs[cell], 1));
        }
      }
      row.appendChild(grid);
    } else {
      const col = el("div", "mc-col");
      r.inputs.forEach(function (s) { col.appendChild(slot(data, s, s.count)); });
      row.appendChild(col);
    }
    row.appendChild(el("div", "mc-arrow"));
    const out = el("div", "mc-col");
    r.outputs.forEach(function (s) { out.appendChild(slot(data, s, s.count, true)); });
    row.appendChild(out);
    panel.appendChild(row);
    if (r.tool) panel.appendChild(el("div", "mc-note", "Инструмент: " + r.tool));
    if (r.crafts !== 1) panel.appendChild(el("div", "mc-note", "Сколько раз на этап: " + num(r.crafts)));
    host.replaceChildren(panel);
  }

  function graph(data) {
    const nodes = new Map();
    data.recipes.forEach(function (r) {
      const o = r.outputs[0];
      nodes.set(r.id, { id: r.id, recipe: r, item: o.item, slot: o, total: r.crafts * o.count, ins: [], outs: [] });
    });
    data.sources.forEach(function (s) {
      nodes.set(s.id, { id: s.id, source: s, item: s.item, slot: s, total: s.count, ins: [], outs: [] });
    });
    const edges = data.edges.map(function (e, i) {
      const a = nodes.get(e.from);
      const b = nodes.get(e.to);
      if (!a || !b) throw new Error("ребро " + e.from + " > " + e.to + " без узла");
      const edge = { i: i, from: a, to: b, item: e.item, amount: e.amount };
      a.outs.push(edge);
      b.ins.push(edge);
      return edge;
    });
    return { nodes: Array.from(nodes.values()), edges: edges };
  }

  function layout(g) {
    const state = new Map();
    function depth(n) {
      const s = state.get(n);
      if (s === "busy") throw new Error("цикл в дереве на узле " + n.id);
      if (s !== undefined) return s;
      state.set(n, "busy");
      let d = 0;
      n.outs.forEach(function (e) { d = Math.max(d, depth(e.to) + 1); });
      state.set(n, d);
      return d;
    }
    let max = 0;
    g.nodes.forEach(function (n) { n.depth = depth(n); max = Math.max(max, n.depth); });
    const cols = [];
    for (let d = 0; d <= max; d++) cols.push([]);
    const seen = new Set();
    function visit(n) {
      if (seen.has(n)) return;
      seen.add(n);
      cols[n.depth].push(n);
      n.ins.forEach(function (e) { visit(e.from); });
    }
    g.nodes.filter(function (n) { return n.depth === 0; }).forEach(visit);
    function order(col) { col.forEach(function (n, i) { n.pos = i; }); }
    cols.forEach(order);
    function mean(list, side) {
      if (!list.length) return null;
      return list.reduce(function (a, e) { return a + e[side].pos; }, 0) / list.length;
    }
    function sweep(col, key, side) {
      col.forEach(function (n) {
        const m = mean(n[key], side);
        n.bary = m === null ? n.pos : m;
      });
      col.sort(function (a, b) { return a.bary - b.bary || a.pos - b.pos; });
      order(col);
    }
    for (let k = 0; k < 6; k++) {
      for (let d = 1; d <= max; d++) sweep(cols[d], "outs", "to");
      for (let d = max - 1; d >= 0; d--) sweep(cols[d], "ins", "from");
    }
    const tall = Math.max.apply(null, cols.map(function (c) { return c.length; }));
    cols.forEach(function (col) {
      const off = (tall - col.length) * ROW / 2;
      col.forEach(function (n, i) {
        n.x = (max - n.depth) * COL;
        n.y = off + i * ROW;
      });
    });
    return { width: max * COL + NODE, height: tall * ROW };
  }

  function nodeLines(data, n) {
    if (n.source) {
      return [{ text: n.slot.name }, { text: "Добыть: " + num(n.total) }]
        .concat(n.slot.alt.length ? [{ text: "Подходит любой: " + n.slot.alt.join(", ") }] : [])
        .concat([{ text: mod(data, n.item), cls: "mc-tt-mod" }]);
    }
    const r = n.recipe;
    const lines = [{ text: n.slot.name }, { text: r.station + ", раз: " + num(r.crafts) }];
    if (r.tool) lines.push({ text: "Инструмент: " + r.tool });
    r.inputs.forEach(function (s) {
      lines.push({ text: num(s.count * r.crafts) + " " + s.name });
    });
    lines.push({ text: "Выход: " + num(n.total) + " " + n.slot.name });
    lines.push({ text: mod(data, n.item), cls: "mc-tt-mod" });
    return lines;
  }

  function related(n) {
    const nodes = new Set([n]);
    const edges = new Set();
    function up(m) {
      m.ins.forEach(function (e) {
        edges.add(e);
        if (!nodes.has(e.from)) { nodes.add(e.from); up(e.from); }
      });
    }
    function down(m) {
      m.outs.forEach(function (e) {
        edges.add(e);
        if (!nodes.has(e.to)) { nodes.add(e.to); down(e.to); }
      });
    }
    up(n);
    down(n);
    return { nodes: nodes, edges: edges };
  }

  function tree(host, data) {
    const g = graph(data);
    const size = layout(g);
    const SVG = "http://www.w3.org/2000/svg";
    const view = el("div", "mc-tree-view");
    const stage = el("div", "mc-tree-stage");
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("width", size.width);
    svg.setAttribute("height", size.height);
    stage.style.width = size.width + "px";
    stage.style.height = size.height + "px";
    stage.appendChild(svg);
    g.edges.forEach(function (e) {
      const x1 = e.from.x + NODE / 2 + SLOT / 2;
      const y1 = e.from.y + SLOT / 2;
      const x2 = e.to.x + NODE / 2 - SLOT / 2;
      const y2 = e.to.y + SLOT / 2;
      const dx = Math.max(30, (x2 - x1) / 2);
      const p = document.createElementNS(SVG, "path");
      p.setAttribute("class", "mc-edge");
      p.setAttribute("d", "M" + x1 + " " + y1 + " C" + (x1 + dx) + " " + y1 + " " + (x2 - dx) + " " + y2 + " " + x2 + " " + y2);
      svg.appendChild(p);
      e.path = p;
    });
    g.nodes.forEach(function (n) {
      const e = el("div", "mc-node" + (n.depth === 0 ? " mc-target" : ""));
      e.style.left = n.x + "px";
      e.style.top = n.y + "px";
      const s = el("div", "mc-slot");
      s.appendChild(icon(data, n.item));
      e.appendChild(s);
      e.appendChild(el("div", "mc-node-name", n.slot.name));
      e.appendChild(el("div", "mc-node-count", num(n.total)));
      stage.appendChild(e);
      n.el = e;
      hover(s, function () { return nodeLines(data, n); }, function () {
        const rel = related(n);
        g.nodes.forEach(function (m) { m.el.classList.toggle("mc-dim", !rel.nodes.has(m)); });
        g.edges.forEach(function (ed) {
          ed.path.classList.toggle("mc-hot", rel.edges.has(ed));
          ed.path.classList.toggle("mc-dim", !rel.edges.has(ed));
        });
      }, function () {
        g.nodes.forEach(function (m) { m.el.classList.remove("mc-dim"); });
        g.edges.forEach(function (ed) { ed.path.classList.remove("mc-hot", "mc-dim"); });
      });
    });
    view.appendChild(stage);

    const t = { s: 1, x: 0, y: 0 };
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
    let moved = false;
    function fit() {
      const w = view.clientWidth;
      const h = view.clientHeight;
      const pad = 24;
      moved = false;
      if (!w || !h) return;
      t.s = Math.min(1.5, (w - pad * 2) / size.width, (h - pad * 2) / size.height);
      t.x = (w - size.width * t.s) / 2;
      t.y = (h - size.height * t.s) / 2;
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
      hideTip();
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
        const [a, b] = Array.from(ptrs.values());
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch) {
          const r = view.getBoundingClientRect();
          zoomAt(d / pinch, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
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

    host.replaceChildren(view, tools, el("div", "mc-tree-hint", "Колесо меняет масштаб, перетаскивание двигает дерево"));
    new ResizeObserver(function () { if (!moved) fit(); }).observe(view);
  }

  function fail(host, err) {
    host.replaceChildren(el("div", "mc-error", "Не удалось показать: " + err.message));
    console.error(err);
  }

  function mount(root) {
    root.querySelectorAll("div.mc-recipe[data-src]:not([data-done])").forEach(function (host) {
      host.dataset.done = "1";
      load(host.dataset.src).then(function (d) { card(host, d); }).catch(function (e) { fail(host, e); });
    });
    root.querySelectorAll("div.mc-tree[data-src]:not([data-done])").forEach(function (host) {
      host.dataset.done = "1";
      load(host.dataset.src).then(function (d) { tree(host, d); }).catch(function (e) { fail(host, e); });
    });
  }

  if (window.document$) {
    window.document$.subscribe(function () { mount(document); });
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { mount(document); });
  } else {
    mount(document);
  }
})();
