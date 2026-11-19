(function () {
  "use strict";
  const SP = window.StoryboardPrompt;
  const STORAGE_KEY = "storyboard-prompt-builder:v1";

  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

  let project = load() || SP.newProject();

  // ---------- persistence ----------
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? SP.normalizeProject(JSON.parse(raw)) : null;
    } catch (e) {
      return null;
    }
  }
  let saveTimer;
  function flush() {
    clearTimeout(saveTimer);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(project)); } catch (e) { /* storage unavailable */ }
  }
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 250);
  }
  window.addEventListener("pagehide", flush);

  // ---------- helpers ----------
  function fillSelect(select, values, labels) {
    select.innerHTML = "";
    values.forEach((v) => {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = labels ? labels[v] : v;
      select.appendChild(o);
    });
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 1600);
  }

  async function copy(text, what) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    toast(`${what} copied`);
  }

  function download(name, text, type) {
    const blob = new Blob([text], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function slug() {
    return (project.title || "storyboard").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "storyboard";
  }

  // ---------- project panel ----------
  function initProjectPanel() {
    fillSelect($("#sel-target"), Object.keys(SP.TARGETS), SP.TARGETS);
    const styleLabels = Object.fromEntries(Object.keys(SP.STYLES).map((k) => [k, k[0].toUpperCase() + k.slice(1)]));
    styleLabels.custom = "Custom (notes only)";
    fillSelect($("#sel-style"), [...Object.keys(SP.STYLES), "custom"], styleLabels);
    const dl = $("#lighting-list");
    SP.LIGHTING.filter(Boolean).forEach((l) => { const o = document.createElement("option"); o.value = l; dl.appendChild(o); });

    $$("[data-p]").forEach((el) => {
      el.addEventListener("input", () => {
        project[el.dataset.p] = el.value;
        save();
        updateMjVisibility();
        updateAllOutputs();
      });
    });
  }

  function renderProjectPanel() {
    $$("[data-p]").forEach((el) => { el.value = project[el.dataset.p] ?? ""; });
    updateMjVisibility();
    renderCharacters();
  }

  function updateMjVisibility() {
    $("#mj-only").hidden = project.target !== "midjourney";
  }

  function renderCharacters() {
    const wrap = $("#characters");
    wrap.innerHTML = "";
    project.characters.forEach((c, i) => {
      const div = document.createElement("div");
      div.className = "char";
      div.innerHTML = `
        <button type="button" class="del" title="Remove character" aria-label="Remove character">✕</button>
        <label>Name <input data-c="name" placeholder="e.g. Mina" /></label>
        <label>Look (consistent description) <textarea data-c="description" rows="2" placeholder="e.g. 30s Korean woman, short black bob, yellow raincoat, silver locket"></textarea></label>`;
      $$("[data-c]", div).forEach((el) => {
        el.value = c[el.dataset.c] || "";
        el.addEventListener("input", () => { c[el.dataset.c] = el.value; save(); updateAllOutputs(); });
      });
      $(".del", div).addEventListener("click", () => {
        project.characters.splice(i, 1);
        save(); renderCharacters(); updateAllOutputs();
      });
      wrap.appendChild(div);
    });
  }

  // ---------- shots ----------
  function renderShots() {
    const wrap = $("#shots");
    wrap.innerHTML = "";
    const tpl = $("#tpl-shot");
    project.shots.forEach((shot, i) => {
      const node = tpl.content.firstElementChild.cloneNode(true);
      node.dataset.index = i;
      $(".shot-num", node).textContent = `#${i + 1}`;
      $$("select[data-list]", node).forEach((sel) => {
        const values = SP[sel.dataset.list].slice();
        const cur = shot[sel.dataset.s];
        if (cur && !values.includes(cur)) values.unshift(cur);
        fillSelect(sel, values);
      });
      $$("[data-s]", node).forEach((el) => {
        el.value = shot[el.dataset.s] ?? "";
        el.addEventListener("input", () => {
          shot[el.dataset.s] = el.type === "number" ? Number(el.value) : el.value;
          save();
          updateOutput(node, shot);
        });
      });
      node.addEventListener("click", (e) => {
        const act = e.target.closest("[data-act]");
        if (!act) return;
        handleShotAction(act.dataset.act, i, node, shot);
      });
      updateOutput(node, shot);
      wrap.appendChild(node);
    });
  }

  function handleShotAction(act, i, node, shot) {
    const shots = project.shots;
    if (act === "copy") return copy($(".out-prompt", node).textContent, `Shot ${i + 1} prompt`);
    if (act === "copy-neg") return copy($(".out-neg", node).textContent, "Negative prompt");
    if (act === "up" && i > 0) [shots[i - 1], shots[i]] = [shots[i], shots[i - 1]];
    else if (act === "down" && i < shots.length - 1) [shots[i + 1], shots[i]] = [shots[i], shots[i + 1]];
    else if (act === "dup") shots.splice(i + 1, 0, SP.newShot(Object.assign({}, shot, { id: undefined, characters: shot.characters.slice() })));
    else if (act === "del") {
      if (!confirm(`Delete shot ${i + 1}?`)) return;
      shots.splice(i, 1);
      if (!shots.length) shots.push(SP.newShot());
    } else return;
    shots.forEach((s) => { if (!s.id) s.id = Math.random().toString(36).slice(2, 10); });
    save();
    renderShots();
  }

  function updateOutput(node, shot) {
    const r = SP.buildPrompt(project, shot);
    $(".out-prompt", node).textContent = r.prompt;
    $(".out-neg", node).textContent = r.negative;
    $(".out-neg-wrap", node).hidden = !r.negative;
  }

  function updateAllOutputs() {
    $$("#shots .shot").forEach((node) => updateOutput(node, project.shots[Number(node.dataset.index)]));
  }

  // ---------- toolbar ----------
  function initToolbar() {
    $("#btn-add-shot").addEventListener("click", () => {
      const last = project.shots[project.shots.length - 1];
      project.shots.push(SP.newShot(last ? { setting: last.setting, timeOfDay: last.timeOfDay, lighting: last.lighting } : {}));
      save();
      renderShots();
      $$("#shots .shot").pop().querySelector("[data-s=action]").focus();
    });
    $("#btn-add-char").addEventListener("click", () => {
      project.characters.push({ name: "", description: "" });
      save(); renderCharacters();
    });
    $("#btn-new").addEventListener("click", () => {
      if (!confirm("Start a new storyboard? The current one will be cleared (export it first if you want to keep it).")) return;
      setProject(SP.newProject());
    });
    $("#btn-example").addEventListener("click", () => {
      if (!confirm("Replace the current storyboard with the example?")) return;
      setProject(SP.normalizeProject(EXAMPLE));
    });
    $("#btn-copy-all").addEventListener("click", () => {
      const text = SP.buildAll(project)
        .map((r) => `Shot ${r.number}${r.shot.title ? " — " + r.shot.title : ""}\n${r.prompt}${r.negative ? "\nNegative: " + r.negative : ""}`)
        .join("\n\n");
      copy(text, "All prompts");
    });
    $("#btn-export-md").addEventListener("click", () => download(`${slug()}.md`, SP.toMarkdown(project), "text/markdown"));
    $("#btn-export-json").addEventListener("click", () => download(`${slug()}.json`, JSON.stringify(project, null, 2), "application/json"));
    $("#file-import").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      e.target.value = "";
      if (!file) return;
      try {
        setProject(SP.normalizeProject(JSON.parse(await file.text())));
        toast("Storyboard imported");
      } catch (err) {
        alert("Could not import that file: " + err.message);
      }
    });
  }

  function setProject(p) {
    project = p;
    save();
    renderProjectPanel();
    renderShots();
  }

  const EXAMPLE = {
    title: "The Last Lighthouse",
    logline: "A lighthouse keeper on her final night before automation finds a message in a bottle meant for her.",
    target: "midjourney",
    style: "cinematic",
    styleNotes: "muted teal and amber palette",
    aspectRatio: "2.39:1",
    setting: "rocky island lighthouse in the North Sea",
    characters: [
      { name: "Mina", description: "60-year-old Korean woman, silver hair in a low bun, weathered navy wool coat, round wire glasses" },
      { name: "Gull", description: "scruffy grey-and-white herring gull with a bent wing feather" },
    ],
    shots: [
      { title: "Establishing", shotType: "extreme wide shot", angle: "high angle", movement: "slow push in", action: "The lighthouse stands alone on black rocks as waves crash", timeOfDay: "dusk", lighting: "blue hour", mood: "lonely, quiet", duration: 5 },
      { title: "Lighting the lamp", shotType: "medium shot", angle: "low angle", movement: "static", action: "Mina strikes a match to light the lamp for the last time", setting: "lamp room at the top of the lighthouse", lighting: "candlelight", mood: "solemn", duration: 4 },
      { title: "The bottle", shotType: "close-up", angle: "eye level", movement: "tracking shot", action: "Mina's hands lift a barnacle-covered glass bottle from the tide pool while Gull watches", timeOfDay: "night", lighting: "moonlight", mood: "mysterious", duration: 3 },
      { title: "The letter", shotType: "extreme close-up", angle: "overhead top-down", movement: "static", action: "A faded handwritten letter addressed to Mina, unfolded on a wooden table", setting: "keeper's kitchen", lighting: "golden hour", mood: "tender, nostalgic", dialogue: "\"If you are reading this, the light still matters.\"", duration: 4 },
    ],
  };

  initProjectPanel();
  initToolbar();
  renderProjectPanel();
  renderShots();
})();
