"use strict";
const { existsSync, readFileSync, statSync } = require("fs");
const { join, resolve } = require("path");
const root = resolve(__dirname, "..");
const text = ["index.html", "styles.css", "script.js"].map((name) => readFileSync(join(root, name), "utf8")).join("\n");
const checks = [
  [text.includes("500 ₽"), "price is present"],
  [text.includes("https://t.me/catcodeapp"), "Telegram CTA is present"],
  [text.includes("Охотится по вашему жесту"), "hunt explanation is present"],
  [text.includes("не читает содержимое документов"), "privacy explanation is present"],
  [!/(catcode-tabby|cat-misty|catcode-real|создать кота по фото)/i.test(text), "old cat assets and photo-skin claims are absent"],
];
const videos = ["typing", "sleep", "hunt", "walk", "dance", "skins"].map((name) => join(root, "assets", "v6", "site-v2", `${name}.webm`));
videos.forEach((file) => checks.push([existsSync(file) && statSync(file).size > 1024, `video exists: ${file}`]));
const failures = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (failures.length) throw new Error(`Site verification failed:\n- ${failures.join("\n- ")}`);
console.log(`Site verification passed: ${videos.length} demo videos and ${checks.length - videos.length} content checks.`);
