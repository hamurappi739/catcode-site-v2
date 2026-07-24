"use strict";

// Generates the website's Misty SVG poses from the same source artwork and
// cell mappings that the desktop app uses. Run this after changing a pose,
// a mapping, or Misty's pattern.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const siteRoot = path.resolve(__dirname, "..");
const desktopRoot = path.resolve(siteRoot, "..", "catcode-source", "desktop");
const assetsRoot = path.join(siteRoot, "assets");
const patternFile = path.join(
  desktopRoot,
  "presets",
  "patterns",
  "comnyang-pattern-misty.json",
);
const mappingsFile = path.join(desktopRoot, "renderer", "pet", "cell-mappings.js");
const svgRoot = path.join(desktopRoot, "svg");

const legacyPartCells = {
  head: { x: 22, y: 18 },
  body: { x: 22, y: 15 },
  tail: { x: 13, y: 10 },
  legFl: { x: 8, y: 11 },
  legFr: { x: 8, y: 11 },
  legRl: { x: 8, y: 8 },
  legRr: { x: 8, y: 8 },
  earL: { x: 6, y: 8 },
  earR: { x: 5, y: 8 },
};

const parts = {
  head: "head",
  body: "body",
  tail: "tail",
  legFl: "leg-fl",
  legFr: "leg-fr",
  legRl: "leg-rl",
  legRr: "leg-rr",
  earL: "ear-left",
  earR: "ear-right",
};

const tailPath =
  "M0 8V7H6V6H8V5H9V4H8V1H9V0H11V1H12V2H13V7H12V8H11V9H9V10H4V9H1V8H0Z";
const earPaths = {
  "ear-left": "M0 7V4H1V2H2V1H3V0H4V2H5V3H6V7H5V8H1V7H0Z",
  "ear-right": "M1 3H0V7H1V8H4V7H5V2H4V1H3V0H2V1H1V3Z",
};

const poses = [
  ["cat-idle-follow-v2.svg", "cat-misty-idle.svg", "cat-idle-follow-v2", "idle-animated"],
  ["cat-idle-follow-v2.svg", "cat-misty-purring.svg", "cat-idle-follow-v2", "purring"],
  ["cat-idle-follow-v2.svg", "cat-misty-sleep.svg", "cat-idle-follow-v2", "idle-animated"],
  ["cat-idle-follow-v2.svg", "cat-misty-attention.svg", "cat-idle-follow-v2", "idle-animated"],
  ["press-left.svg", "cat-misty-press-left.svg", "press-left", ""],
  ["press-right.svg", "cat-misty-press-right.svg", "press-right", ""],
  ["scroll-unroll.svg", "cat-misty-scroll.svg", "scroll-unroll", ""],
  ["jump-start.svg", "cat-misty-jump-start.svg", "jump-start", ""],
  ["jump-ing.svg", "cat-misty-jump-ing.svg", "jump-ing", ""],
];

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function compactNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function loadMappings() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(mappingsFile, "utf8"), sandbox, {
    filename: mappingsFile,
  });
  return sandbox.window.cellMappings.MAPPINGS;
}

function normalizePattern(rawPattern) {
  const pattern = rawPattern && typeof rawPattern === "object" ? rawPattern : {};
  if (Number(pattern.pixelResolution) === 2) return pattern;

  const expanded = { ...pattern, pixelResolution: 2 };
  for (const [part, dimensions] of Object.entries(legacyPartCells)) {
    const seen = new Map();
    for (const spot of Array.isArray(pattern[part]) ? pattern[part] : []) {
      const x = asNumber(spot?.x);
      const y = asNumber(spot?.y);
      if (x < 0 || y < 0 || x >= dimensions.x || y >= dimensions.y || typeof spot?.color !== "string") continue;
      for (const dx of [0, 1]) {
        for (const dy of [0, 1]) {
          seen.set(`${x * 2 + dx},${y * 2 + dy}`, {
            x: x * 2 + dx,
            y: y * 2 + dy,
            color: spot.color,
          });
        }
      }
    }
    expanded[part] = [...seen.values()];
  }
  return expanded;
}

function installDynamicParts(svg) {
  svg = svg.replace(
    /<g id="tail"([^>]*)><\/g>/,
    (fullMatch, attributes) => {
      const frame = attributes.match(/data-patch-frame="([^"]+)"/)?.[1]
        .split(/\s+/)
        .map(asNumber) || [0, 0, 1, 1];
      const transform =
        frame[2] === 1 && frame[3] === 1
          ? `translate(${frame[0]} ${frame[1]})`
          : `translate(${frame[0]} ${frame[1]}) scale(${frame[2]} ${frame[3]})`;
      return `<g id="tail"${attributes}><path transform="${transform}" d="${tailPath}" fill="var(--cat-color)"/><g class="patches" clip-path="url(#tail-clip)" shape-rendering="crispEdges"></g></g>`;
    },
  );

  for (const [id, d] of Object.entries(earPaths)) {
    const position = id === "ear-left" ? "5 2" : "17 2";
    const clipId = `${id}-clip`;
    const match = new RegExp(`<g id="${id}"[^>]*><\\/g>`);
    svg = svg.replace(
      match,
      `<g id="${id}" data-ear-position="${position}" data-patch-frame="${position} 1 1"><path transform="translate(${position})" d="${d}" fill="var(--cat-color)"/><g class="patches" clip-path="url(#${clipId})" shape-rendering="crispEdges"></g></g>`,
    );
  }

  const tailOpening = svg.match(/<g id="tail"([^>]*)>/)?.[1] || "";
  const tailFrame = tailOpening.match(/data-patch-frame="([^"]+)"/)?.[1]
    .split(/\s+/)
    .map(asNumber) || [0, 0, 1, 1];
  const tailTransform =
    tailFrame[2] === 1 && tailFrame[3] === 1
      ? `translate(${tailFrame[0]} ${tailFrame[1]})`
      : `translate(${tailFrame[0]} ${tailFrame[1]}) scale(${tailFrame[2]} ${tailFrame[3]})`;
  const clipPaths = [
    `<clipPath id="tail-clip"><path transform="${tailTransform}" d="${tailPath}"/></clipPath>`,
    ...Object.entries(earPaths).map(([id, d]) => {
      const position = id === "ear-left" ? "5 2" : "17 2";
      return `<clipPath id="${id}-clip"><path transform="translate(${position})" d="${d}"/></clipPath>`;
    }),
  ].join("");
  return svg.replace("</defs>", `${clipPaths}</defs>`);
}

function rootStyle(pattern) {
  const eyeLeft = pattern.oddEye ? pattern.eyeColorLeft : pattern.eyeColor;
  const eyeRight = pattern.oddEye ? pattern.eyeColorRight : pattern.eyeColor;
  return [
    `--cat-color:${pattern.baseColor || "#1A1A1A"}`,
    `--eye-color:${pattern.eyeColor || "#1A1A1A"}`,
    `--eye-bg-color:${pattern.eyeBgColor || "#FFFFFF"}`,
    `--eye-color-left:${eyeLeft || "#1A1A1A"}`,
    `--eye-color-right:${eyeRight || "#1A1A1A"}`,
    `--eye-pupil-scale:${asNumber(pattern.eyePupilScale) || 100}%`,
  ].join(";");
}

function renderPatches(svg, pattern, mappings, svgName) {
  for (const [part, elementId] of Object.entries(parts)) {
    const element = new RegExp(`<g\\b[^>]*\\bid="${elementId}"[^>]*>`, "i");
    const opening = svg.match(element)?.[0];
    if (!opening) continue;

    const frame = opening.match(/data-patch-frame="([^"]+)"/)?.[1].split(/\s+/).map(asNumber);
    if (!frame || frame.length !== 4) continue;
    const mirrorX = opening.match(/data-patch-mirror-x="([^"]+)"/)?.[1];
    const dimensions = legacyPartCells[part];
    const entries = Array.isArray(pattern[part]) ? pattern[part] : [];
    let output = "";

    for (const spot of entries) {
      if (!spot || typeof spot.color !== "string") continue;
      let detailX = asNumber(spot.x);
      const detailY = asNumber(spot.y);
      if (mirrorX === "true") detailX = dimensions.x * 2 - 1 - detailX;
      const cellX = Math.floor(detailX / 2);
      const cellY = Math.floor(detailY / 2);
      const subX = (detailX % 2) * 0.5;
      const subY = (detailY % 2) * 0.5;
      const mapping = mappings[`${svgName}:${elementId}`];
      const pixels = mapping?.cells?.[`${cellX},${cellY}`];
      const origin = mapping?.origin || [0, 0];

      if (Array.isArray(pixels)) {
        for (const [x, y] of pixels) {
          output += `<rect x="${compactNumber(origin[0] + x + subX)}" y="${compactNumber(origin[1] + y + subY)}" width="0.5" height="0.5" fill="${spot.color}" shape-rendering="crispEdges"/>`;
        }
      } else {
        output += `<rect x="${compactNumber(frame[0] + detailX * frame[2] * 0.5)}" y="${compactNumber(frame[1] + detailY * frame[3] * 0.5)}" width="${compactNumber(frame[2] * 0.5)}" height="${compactNumber(frame[3] * 0.5)}" fill="${spot.color}" shape-rendering="crispEdges"/>`;
      }
    }

    const slot = new RegExp(`(<g\\b[^>]*\\bid="${elementId}"[^>]*>[\\s\\S]*?<g\\b[^>]*\\bclass="patches"[^>]*>)[\\s\\S]*?(<\\/g>)`, "i");
    svg = svg.replace(slot, `$1${output}$2`);
  }
  return svg;
}

function renderPose(sourceFile, outputFile, svgName, className, pattern, mappings) {
  let svg = fs.readFileSync(path.join(svgRoot, sourceFile), "utf8");
  svg = installDynamicParts(svg);
  svg = svg.replace(
    "<svg ",
    `<svg${className ? ` class="${className}"` : ""} data-pattern-resolution="2" style="${rootStyle(pattern)}" `,
  );
  svg = renderPatches(svg, pattern, mappings, svgName);
  fs.writeFileSync(path.join(assetsRoot, outputFile), svg);
}

function main() {
  const exported = JSON.parse(fs.readFileSync(patternFile, "utf8"));
  const pattern = normalizePattern(exported.preset?.pattern || exported.pattern);
  const mappings = loadMappings();
  fs.mkdirSync(assetsRoot, { recursive: true });
  for (const pose of poses) renderPose(...pose, pattern, mappings);
  console.log(`Synced ${poses.length} Misty poses at 64x64 pattern density.`);
}

main();
