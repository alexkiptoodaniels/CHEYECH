// ====== EDIT THESE ======
const CONFIG = {
  name: "My Love",           // her name, e.g. "Amina"
  from: "Alex",              // your name
  message:
    "Another year around the sun, and I'm still the luckiest person alive to be by your side.\n" +
    "Thank you for your laughter, your kindness, and for making ordinary days feel special.\n" +
    "I hope today is filled with everything that makes you smile.\n" +
    "I love you more than words can say."
};
// ========================

const $ = (id) => document.getElementById(id);
const gift = $("gift");
const intro = $("intro");
const message = $("message");

$("name").textContent = CONFIG.name;
$("signature").textContent = "Forever yours, " + CONFIG.from + " ❤️";

// ---------- Floating emojis ----------
const emojis = ["💖", "🎈", "🌸", "✨", "🎀", "💕"];
function spawnFloater() {
  const el = document.createElement("span");
  el.className = "floater";
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.fontSize = 18 + Math.random() * 22 + "px";
  const dur = 7 + Math.random() * 6;
  el.style.animationDuration = dur + "s";
  $("floaters").appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}
setInterval(spawnFloater, 700);

// ---------- Confetti ----------
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let running = false;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const colors = ["#ff5c8a", "#ffb3c7", "#ffd166", "#8ecae6", "#b794f4", "#ffffff"];

function burst(count = 150) {
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2.2,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 0
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.vy += 0.35;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life++;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });
  pieces = pieces.filter((p) => p.y < canvas.height + 20 && p.life < 300);
  if (pieces.length) requestAnimationFrame(tick);
  else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

// ---------- Typewriter ----------
function typeText(el, text, speed = 28) {
  el.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(t);
  }, speed);
}

// ---------- Music ----------
const song = $("song");
const muteBtn = $("muteBtn");
const TARGET_VOLUME = 0.35; // soft; range is 0 to 1

function playSong() {
  song.volume = 0;
  song.play().then(() => {
    muteBtn.hidden = false;
    // gentle fade-in
    const fade = setInterval(() => {
      song.volume = Math.min(TARGET_VOLUME, song.volume + 0.01);
      if (song.volume >= TARGET_VOLUME) clearInterval(fade);
    }, 120);
  }).catch(() => { /* no song.mp3 or playback blocked: page still works */ });
}

muteBtn.addEventListener("click", () => {
  song.muted = !song.muted;
  muteBtn.textContent = song.muted ? "🔇" : "🔊";
});

// ---------- Open gift ----------
function openGift() {
  intro.classList.remove("active");
  message.classList.add("active");
  burst(200);
  typeText($("letter"), CONFIG.message);
  playSong();
}
gift.addEventListener("click", openGift);
gift.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGift(); }
});

// ---------- Buttons ----------
$("confettiBtn").addEventListener("click", () => burst(180));

const wishes = [
  "May all your dreams come true 🌟",
  "A year full of adventures awaits you 🌍",
  "More laughter, more love, more cake 🍰",
  "Your wish is safe with me 🤫💖"
];
$("wishBtn").addEventListener("click", () => {
  $("wishResult").textContent = wishes[Math.floor(Math.random() * wishes.length)];
  burst(120);
});
