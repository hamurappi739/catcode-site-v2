"use strict";

const { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } = require("fs");
const { join, resolve } = require("path");
const { execFileSync } = require("child_process");
const { tmpdir } = require("os");

const siteRoot = resolve(__dirname, "..");
const desktopRoot = resolve(siteRoot, "..", "catcode-source", "desktop");
const v6Root = join(desktopRoot, "renderer", "pet", "assets", "v6");
const ffmpeg = join(desktopRoot, "node_modules", "ffmpeg-static", "ffmpeg.exe");
const outputRoot = join(siteRoot, "assets", "v6", "site-v2");
const frame = (...parts) => join(v6Root, ...parts);

const sequences = {
  typing: { duration: 0.14, frames: ["typing-f0-ready.png", "typing-f1-left.png", "typing-f2-right.png", "typing-f3-fast.png", "typing-f2-right.png", "typing-f1-left.png"].map((file) => frame("typing", file)) },
  sleep: { duration: 0.8, frames: ["sleep-f0-closed.png", "sleep-f1-transition.png", "sleep-f2-peek.png", "sleep-f1-transition.png"].map((file) => frame("sleep", file)) },
  hunt: { duration: 0.11, frames: ["hunt-f0-alert.png", "hunt-f1-shoulder-drop.png", "hunt-f2-forelegs-lower.png", "hunt-f3-half-crouch.png", "hunt-f4-low-crouch.png", "hunt-f5-deep-stalk.png", "hunt-f6-near-hold.png", "hunt-f7-watch-hold.png", "hunt-f8-gaze-ready.png", "hunt-f8-gaze-ready.png", "hunt-f8-gaze-ready.png", "hunt-f8-gaze-ready.png"].map((file) => frame("hunt-smooth", file)) },
  walk: { duration: 0.18, frames: ["walk-left-f0.png", "walk-left-f1.png", "walk-left-f2.png", "walk-left-f3.png", "walk-left-f4.png", "walk-right-f0.png", "walk-right-f1.png", "walk-right-f2.png", "walk-right-f3.png", "walk-right-f4.png"].map((file) => frame("walk", file)) },
  dance: { duration: 0.145, frames: ["drill-f00-ready.png", "drill-f01-left-bounce.png", "drill-f02-left-punch.png", "drill-f03-center-bounce.png", "drill-f04-right-bounce.png", "drill-f05-right-punch.png", "drill-f06-bounce-up.png", "drill-f07-shoulder-pop.png", "drill-f08-settle.png", "drill-f09-loop-return.png"].map((file) => frame("dance", "drill", file)) },
  skins: { duration: 0.85, frames: [frame("idle-master.png"), frame("skins", "ginger-owner-v1.1", "idle-master.png"), frame("skins", "black-owner-v1", "idle-master.png"), frame("skins", "ocean-blue-owner-v1", "idle-master.png"), frame("skins", "amethyst-owner-v1", "idle-master.png")] },
};

function quoteForConcat(filePath) { return `file '${filePath.replace(/\\/g, "/").replace(/'/g, "\\'")}'`; }
function buildVideo(name, sequence) {
  const missing = sequence.frames.filter((file) => !existsSync(file));
  if (missing.length) throw new Error(`${name}: missing source frames\n${missing.join("\n")}`);
  const temp = mkdtempSync(join(tmpdir(), "catcode-v6-demo-"));
  try {
    const list = join(temp, `${name}.txt`);
    const lines = sequence.frames.flatMap((file) => [quoteForConcat(file), `duration ${sequence.duration}`]);
    lines.push(quoteForConcat(sequence.frames[0]));
    writeFileSync(list, `${lines.join("\n")}\n`, "utf8");
    const seconds = (sequence.frames.length * sequence.duration + 0.08).toFixed(3);
    execFileSync(ffmpeg, ["-y", "-f", "concat", "-safe", "0", "-i", list, "-filter_complex", "color=c=0x11181c:s=960x540:r=30[bg];[0:v]fps=30,scale=420:420:flags=neighbor,format=rgba[cat];[bg][cat]overlay=(W-w)/2:(H-h)/2:format=auto", "-t", seconds, "-an", "-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-b:v", "0", "-crf", "35", join(outputRoot, `${name}.webm`)], { stdio: "inherit" });
  } finally { rmSync(temp, { recursive: true, force: true }); }
}
if (!existsSync(ffmpeg)) throw new Error(`ffmpeg not found: ${ffmpeg}`);
mkdirSync(outputRoot, { recursive: true });
copyFileSync(join(desktopRoot, "assets", "catcode-v6-logo.png"), join(siteRoot, "assets", "catcode-v6-logo.png"));
Object.entries(sequences).forEach(([name, sequence]) => buildVideo(name, sequence));
console.log(`Built ${Object.keys(sequences).length} V6 demo videos in ${outputRoot}`);
