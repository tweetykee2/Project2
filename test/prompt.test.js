const test = require("node:test");
const assert = require("node:assert");
const SP = require("../prompt.js");

function sample(target) {
  const p = SP.newProject();
  p.target = target;
  p.aspectRatio = "2.39:1";
  p.characters = [{ name: "Mina", description: "silver hair, navy coat" }, { name: "Jo", description: "red cap" }];
  p.shots = [SP.newShot({ shotType: "close-up", angle: "low angle", movement: "orbit", action: "Mina opens the bottle", lighting: "moonlight", mood: "tense", duration: 4 })];
  return p;
}

test("injects only mentioned characters' descriptions", () => {
  const r = SP.buildPrompt(sample("generic"), sample("generic").shots[0]);
  assert.match(r.prompt, /Mina \(silver hair, navy coat\)/);
  assert.doesNotMatch(r.prompt, /red cap/);
});

test("character name matching is whole-word", () => {
  const p = sample("generic");
  p.shots[0].action = "Joanna walks in";
  assert.doesNotMatch(SP.buildPrompt(p, p.shots[0]).prompt, /red cap/);
});

test("midjourney gets --ar flag and optional --v/--seed/--no", () => {
  const p = sample("midjourney");
  p.mjVersion = "7"; p.seed = "42"; p.negative = "text";
  const r = SP.buildPrompt(p, p.shots[0]);
  assert.match(r.prompt, /--ar 2\.39:1 --v 7 --seed 42 --no text$/);
  assert.strictEqual(r.negative, "");
});

test("stable diffusion has default negative prompt", () => {
  const p = sample("sd");
  assert.strictEqual(SP.buildPrompt(p, p.shots[0]).negative, SP.DEFAULT_NEGATIVE);
});

test("dalle produces natural sentences", () => {
  const r = SP.buildPrompt(sample("dalle"), sample("dalle").shots[0]);
  assert.match(r.prompt, /^A close-up, low angle of mina opens the bottle\./);
  assert.match(r.prompt, /Aspect ratio 2\.39:1/);
});

test("video target includes camera move and duration", () => {
  const r = SP.buildPrompt(sample("video"), sample("video").shots[0]);
  assert.match(r.prompt, /camera: orbit/);
  assert.match(r.prompt, /duration: 4s/);
});

test("invalid aspect ratio falls back to 16:9", () => {
  const p = sample("midjourney"); p.aspectRatio = "wide";
  assert.match(SP.buildPrompt(p, p.shots[0]).prompt, /--ar 16:9/);
});

test("normalizeProject sanitises bad input", () => {
  assert.throws(() => SP.normalizeProject([]));
  const p = SP.normalizeProject({ target: "nope", style: 5, shots: [{ action: "x", duration: "abc" }, null] });
  assert.strictEqual(p.target, "generic");
  assert.strictEqual(p.style, "cinematic");
  assert.strictEqual(p.shots.length, 2);
  assert.strictEqual(p.shots[0].duration, 3);
});

test("markdown export lists every shot", () => {
  const p = sample("sd");
  p.shots.push(SP.newShot({ action: "Jo waves" }));
  const md = SP.toMarkdown(p);
  assert.match(md, /### Shot 1/);
  assert.match(md, /### Shot 2/);
  assert.match(md, /Negative:/);
});
