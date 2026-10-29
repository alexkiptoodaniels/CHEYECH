// ============ EDIT THESE ============
const CONFIG = {
  name: "My Love",                 // her name, e.g. "Amina"
  from: "Alex",                    // your name

  // Passcode gate: only someone who knows the answer gets in
  gateQuestion: "What's the nickname I call you?",
  gateAnswers: ["babe", "baby"],   // accepted answers (case doesn't matter)
  gateHint: "Hmm, not quite. Think of something only we know 💭",

  // Main letter
  message:
    "I'm sorry this is a little late, but my love for you was never late for a single day.\n" +
    "Thank you for your laughter, your kindness, and for making ordinary days feel special.\n" +
    "I hope your birthday was full of everything that makes you smile, and that this year gives you even more.\n" +
    "I love you more than words can say.",

  // What she sees after she seals her wish
  wishTitle: "Wish received 💫",
  wishReply:
    "Whatever you just wished for, I'm going to do everything I can to help it come true.\n" +
    "And because you deserve to be celebrated a little longer...",
  voucher: {
    title: "Belated Birthday Voucher",
    body: "Good for one date night of your choice, planned by me",
    note: "No expiry date. Redeem anytime 💖"
  }
};
// ====================================

const $ = (id) => document.getElementById(id);

$("name").textContent = CONFIG.name;
$("signature").textContent = "Forever yours, " + CONFIG.from + " ❤️";
$("gateQuestion").textContent = CONFIG.gateQuestion;

function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
}

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

// ---------- Flying hearts ----------
const hearts = ["❤️", "💗", "💖", "💕", "💘", "🩷"];
function spawnHeart() {
  const el = document.createElement("span");
  el.className = "heart";
  el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.fontSize = 16 + Math.random() * 34 + "px";
  el.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
  const dur = 6 + Math.random() * 7;
  el.style.animationDuration = dur + "s";
  $("floaters").appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}
setInterval(spawnHeart, 280);
// a few hearts already on screen at the start
for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 150);

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

let fadeTimer = null;

function fadeIn() {
  clearInterval(fadeTimer);
  try { song.volume = 0; } catch (e) { return; } // some phones don't allow volume changes
  fadeTimer = setInterval(() => {
    song.volume = Math.min(TARGET_VOLUME, song.volume + 0.01);
    if (song.volume >= TARGET_VOLUME) clearInterval(fadeTimer);
  }, 120);
}

function playSong() {
  muteBtn.hidden = false;
  song.load();
  const attempt = song.play();
  if (attempt && attempt.then) {
    attempt.then(() => {
      muteBtn.textContent = "🔊";
      fadeIn();
    }).catch((err) => {
      console.error("Song could not start:", err);
      muteBtn.textContent = "🎵 Tap to play song";
      muteBtn.classList.add("wide");
      muteBtn.dataset.err = err && err.name ? err.name : "unknown";
    });
  }
}

song.addEventListener("error", () => {
  console.error("song.mp3 not found or not a valid mp3");
  muteBtn.textContent = "⚠️ song.mp3 not found";
  muteBtn.classList.add("wide");
});

muteBtn.addEventListener("click", () => {
  if (song.paused) {
    song.play().then(() => {
      muteBtn.classList.remove("wide");
      muteBtn.textContent = "🔊";
      fadeIn();
    }).catch((err) => {
      const name = err && err.name ? err.name : "unknown";
      muteBtn.classList.add("wide");
      muteBtn.textContent =
        name === "NotSupportedError"
          ? "⚠️ Can't read song.mp3 (missing or wrong format)"
          : "⚠️ Song error: " + name;
    });
    return;
  }
  song.muted = !song.muted;
  muteBtn.textContent = song.muted ? "🔇" : "🔊";
});

// ---------- Passcode gate ----------
const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

$("gateForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const answer = normalize($("gateInput").value);
  const ok = CONFIG.gateAnswers.some((a) => normalize(a) === answer);
  if (ok) {
    $("gateError").textContent = "";
    show("intro");
  } else {
    $("gateError").textContent = CONFIG.gateHint;
    const form = $("gateForm");
    form.classList.remove("shake");
    void form.offsetWidth; // restart animation
    form.classList.add("shake");
    $("gateInput").select();
  }
});

// ---------- Open gift ----------
const gift = $("gift");
function openGift() {
  show("message");
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

$("wishBtn").addEventListener("click", () => {
  $("wishPanel").hidden = false;
  $("wishBtn").hidden = true;
  $("wishInput").focus();
  burst(60);
});

// Wish is never stored or sent anywhere
$("wishForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("wishInput").value = "";
  $("wishPanel").hidden = true;

  $("revealTitle").textContent = CONFIG.wishTitle;
  $("revealText").textContent = CONFIG.wishReply;
  $("voucherTitle").textContent = CONFIG.voucher.title;
  $("voucherBody").textContent = CONFIG.voucher.body;
  $("voucherNote").textContent = CONFIG.voucher.note;
  $("reveal").hidden = false;
  $("reveal").scrollIntoView({ behavior: "smooth", block: "center" });

  burst(220);
  setTimeout(() => burst(120), 500);
});