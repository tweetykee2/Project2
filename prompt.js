/*
 * Storyboard prompt builder — pure logic, no DOM.
 * Works as a plain <script> in the browser (exposes window.StoryboardPrompt)
 * and as a CommonJS module in Node (used by the tests).
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.StoryboardPrompt = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const SHOT_TYPES = [
    "extreme wide shot",
    "wide shot",
    "full shot",
    "medium wide shot",
    "medium shot",
    "medium close-up",
    "close-up",
    "extreme close-up",
    "over-the-shoulder shot",
    "point-of-view shot",
    "insert shot",
    "two shot",
  ];

  const ANGLES = [
    "eye level",
    "low angle",
    "high angle",
    "bird's-eye view",
    "worm's-eye view",
    "dutch angle",
    "overhead top-down",
  ];

  const MOVEMENTS = [
    "static",
    "slow push in",
    "pull out",
    "pan left",
    "pan right",
    "tilt up",
    "tilt down",
    "tracking shot",
    "dolly zoom",
    "handheld",
    "crane up",
    "orbit",
  ];

  const LIGHTING = [
    "",
    "soft natural daylight",
    "golden hour",
    "blue hour",
    "harsh midday sun",
    "overcast diffuse light",
    "low-key chiaroscuro",
    "high-key bright",
    "neon practical lights",
    "candlelight",
    "moonlight",
    "rim light / backlit silhouette",
  ];

  const STYLES = {
    cinematic: "cinematic film still, anamorphic lens, shallow depth of field, film grain",
    anime: "anime key visual, clean cel shading, detailed background art",
    sketch: "rough pencil storyboard sketch, black and white, loose linework, grey marker shading",
    watercolor: "watercolor illustration, soft washes, visible paper texture",
    comic: "comic book panel, bold ink lines, flat colors, halftone shading",
    "3d": "3D animated film render, stylized characters, global illumination",
    photoreal: "photorealistic, 35mm photograph, natural color grading",
    noir: "film noir, high-contrast black and white, deep shadows",
  };

  const TARGETS = {
    generic: "Generic (any model)",
    midjourney: "Midjourney",
    sd: "Stable Diffusion / SDXL",
    dalle: "DALL·E / GPT image (natural language)",
    video: "Video model (Runway, Kling, Veo, Sora…)",
  };

  const DEFAULT_NEGATIVE =
    "blurry, low quality, deformed hands, extra fingers, distorted face, text, watermark, logo, signature, cropped";

  function clean(s) {
    return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
  }

  function joinParts(parts, sep) {
    return parts.map(clean).filter(Boolean).join(sep || ", ");
  }

  /** Characters referenced by name in the shot text, or explicitly listed in shot.characters. */
  function charactersInShot(project, shot) {
    const chars = (project.characters || []).filter((c) => clean(c.name));
    const explicit = new Set((shot.characters || []).map((n) => clean(n).toLowerCase()));
    const text = (clean(shot.action) + " " + clean(shot.dialogue)).toLowerCase();
    return chars.filter((c) => {
      const name = clean(c.name).toLowerCase();
      if (explicit.has(name)) return true;
      const re = new RegExp("(^|[^\\p{L}\\p{N}])" + escapeRegExp(name) + "($|[^\\p{L}\\p{N}])", "u");
      return re.test(text);
    });
  }

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function styleText(project) {
    const preset = STYLES[project.style] || "";
    return joinParts([preset, project.styleNotes]);
  }

  /** Core description shared by every target: what is in the frame. */
  function shotCore(project, shot) {
    const chars = charactersInShot(project, shot);
    const charDesc = chars
      .map((c) => (clean(c.description) ? `${clean(c.name)} (${clean(c.description)})` : clean(c.name)))
      .join("; ");
    return {
      framing: joinParts([shot.shotType, shot.angle && shot.angle !== "eye level" ? shot.angle : ""]),
      action: clean(shot.action),
      characters: charDesc,
      setting: joinParts([shot.setting || project.setting, shot.timeOfDay]),
      lighting: clean(shot.lighting),
      mood: clean(shot.mood),
      movement: clean(shot.movement),
      style: styleText(project),
    };
  }

  function arFlag(ar) {
    const v = clean(ar);
    return /^\d+(\.\d+)?:\d+(\.\d+)?$/.test(v) ? v : "16:9";
  }

  function buildPrompt(project, shot, targetOverride) {
    const target = targetOverride || project.target || "generic";
    const c = shotCore(project, shot);
    const ar = arFlag(project.aspectRatio);
    const negative = clean(project.negative) || DEFAULT_NEGATIVE;
    const out = { target, prompt: "", negative: "" };

    switch (target) {
      case "midjourney": {
        const body = joinParts([
          c.framing,
          c.action,
          c.characters,
          c.setting,
          c.lighting && c.lighting + " lighting",
          c.mood && c.mood + " mood",
          c.style,
        ]);
        const flags = [`--ar ${ar}`];
        if (clean(project.mjVersion)) flags.push(`--v ${clean(project.mjVersion)}`);
        if (clean(project.seed)) flags.push(`--seed ${clean(project.seed)}`);
        if (clean(project.negative)) flags.push(`--no ${clean(project.negative)}`);
        out.prompt = `${body} ${flags.join(" ")}`.trim();
        break;
      }
      case "sd": {
        out.prompt = joinParts([
          c.style,
          c.framing,
          c.action,
          c.characters,
          c.setting,
          c.lighting,
          c.mood,
          "highly detailed, sharp focus, masterpiece",
        ]);
        out.negative = negative;
        break;
      }
      case "dalle": {
        const sentences = [];
        let first = c.framing ? `A ${c.framing}` : "An image";
        if (c.action) first += ` of ${lowerFirst(c.action)}`;
        sentences.push(first + ".");
        if (c.characters) sentences.push(`Characters: ${c.characters}.`);
        if (c.setting) sentences.push(`Setting: ${c.setting}.`);
        if (c.lighting || c.mood)
          sentences.push(joinParts([c.lighting && `Lit with ${c.lighting}`, c.mood && `the mood is ${c.mood}`], ", ") + ".");
        if (c.style) sentences.push(`Style: ${c.style}.`);
        sentences.push(`Aspect ratio ${ar}. No text or captions in the image.`);
        out.prompt = sentences.join(" ");
        break;
      }
      case "video": {
        const dur = Number(shot.duration) > 0 ? `${Number(shot.duration)}s` : "";
        out.prompt = joinParts(
          [
            c.framing && cap(c.framing),
            c.movement && `camera: ${c.movement}`,
            c.action,
            c.characters && `characters: ${c.characters}`,
            c.setting && `setting: ${c.setting}`,
            c.lighting && `lighting: ${c.lighting}`,
            c.mood && `mood: ${c.mood}`,
            c.style && `style: ${c.style}`,
            dur && `duration: ${dur}`,
            `aspect ratio ${ar}`,
          ],
          ". "
        ) + ".";
        out.negative = negative;
        break;
      }
      default: {
        out.prompt = joinParts([
          c.framing,
          c.action,
          c.characters,
          c.setting,
          c.lighting && c.lighting + " lighting",
          c.mood && c.mood + " atmosphere",
          c.movement && c.movement !== "static" ? c.movement : "",
          c.style,
          `aspect ratio ${ar}`,
        ]);
        out.negative = negative;
      }
    }
    return out;
  }

  function lowerFirst(s) {
    return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  }
  function cap(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  function buildAll(project, targetOverride) {
    return (project.shots || []).map((shot, i) => ({
      number: i + 1,
      shot,
      ...buildPrompt(project, shot, targetOverride),
    }));
  }

  function toMarkdown(project) {
    const lines = [];
    lines.push(`# ${clean(project.title) || "Untitled storyboard"}`);
    lines.push("");
    lines.push(`- Target: ${TARGETS[project.target] || project.target}`);
    lines.push(`- Style: ${project.style}${clean(project.styleNotes) ? " — " + clean(project.styleNotes) : ""}`);
    lines.push(`- Aspect ratio: ${arFlag(project.aspectRatio)}`);
    if (clean(project.logline)) lines.push(`- Logline: ${clean(project.logline)}`);
    const chars = (project.characters || []).filter((c) => clean(c.name));
    if (chars.length) {
      lines.push("");
      lines.push("## Characters");
      chars.forEach((c) => lines.push(`- **${clean(c.name)}**: ${clean(c.description)}`));
    }
    lines.push("");
    lines.push("## Shots");
    buildAll(project).forEach((r) => {
      lines.push("");
      lines.push(`### Shot ${r.number}${clean(r.shot.title) ? " — " + clean(r.shot.title) : ""}`);
      const meta = joinParts([r.shot.shotType, r.shot.angle, r.shot.movement, Number(r.shot.duration) > 0 ? r.shot.duration + "s" : ""], " · ");
      if (meta) lines.push(`_${meta}_`);
      if (clean(r.shot.dialogue)) lines.push(`> ${clean(r.shot.dialogue)}`);
      lines.push("");
      lines.push("```");
      lines.push(r.prompt);
      lines.push("```");
      if (r.negative) lines.push(`Negative: \`${r.negative}\``);
    });
    return lines.join("\n") + "\n";
  }

  function newShot(overrides) {
    return Object.assign(
      {
        id: Math.random().toString(36).slice(2, 10),
        title: "",
        shotType: "wide shot",
        angle: "eye level",
        movement: "static",
        action: "",
        setting: "",
        timeOfDay: "",
        lighting: "",
        mood: "",
        dialogue: "",
        duration: 3,
        characters: [],
      },
      overrides || {}
    );
  }

  function newProject() {
    return {
      version: 1,
      title: "",
      logline: "",
      target: "generic",
      style: "cinematic",
      styleNotes: "",
      aspectRatio: "16:9",
      setting: "",
      negative: "",
      seed: "",
      mjVersion: "",
      characters: [{ name: "", description: "" }],
      shots: [newShot()],
    };
  }

  /** Validate & normalise imported JSON so a bad file can't break the UI. */
  function normalizeProject(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Not a storyboard project");
    const base = newProject();
    const p = Object.assign(base, pickStrings(data, Object.keys(base).filter((k) => typeof base[k] === "string")));
    if (!TARGETS[p.target]) p.target = "generic";
    if (!STYLES[p.style] && p.style !== "custom") p.style = "cinematic";
    p.characters = Array.isArray(data.characters)
      ? data.characters.map((c) => ({ name: clean(c && c.name), description: clean(c && c.description) }))
      : base.characters;
    p.shots = Array.isArray(data.shots) && data.shots.length
      ? data.shots.map((s) => {
          const shot = newShot(pickStrings(s || {}, ["title", "shotType", "angle", "movement", "action", "setting", "timeOfDay", "lighting", "mood", "dialogue"]));
          const d = Number(s && s.duration);
          shot.duration = Number.isFinite(d) && d >= 0 ? d : 3;
          shot.characters = Array.isArray(s && s.characters) ? s.characters.map(clean).filter(Boolean) : [];
          return shot;
        })
      : base.shots;
    return p;
  }

  function pickStrings(obj, keys) {
    const out = {};
    keys.forEach((k) => {
      if (typeof obj[k] === "string" || typeof obj[k] === "number") out[k] = String(obj[k]);
    });
    return out;
  }

  return {
    SHOT_TYPES,
    ANGLES,
    MOVEMENTS,
    LIGHTING,
    STYLES,
    TARGETS,
    DEFAULT_NEGATIVE,
    buildPrompt,
    buildAll,
    toMarkdown,
    newShot,
    newProject,
    normalizeProject,
    charactersInShot,
  };
});
