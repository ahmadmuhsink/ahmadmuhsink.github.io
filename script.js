(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;

  // Theme

  const themeButton = document.querySelector(".theme-toggle");
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function applyTheme(theme) {
    root.dataset.theme = theme;
    themeButton.setAttribute("aria-pressed", String(theme === "dark"));
  }

  applyTheme(storedTheme || (prefersDark ? "dark" : "light"));
  themeButton.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });

  // Toast

  const toast = document.querySelector(".toast");
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 3200);
  }

  // Confetti

  const canvas = document.querySelector(".confetti");
  const ctx = canvas.getContext("2d");
  const colors = ["#3ddc97", "#5aa9ff", "#ff7eb6", "#ff8a4c", "#ffd23f", "#b69cff"];
  let pieces = [];
  let confettiFrame = 0;

  function burst(count = 140, glyphs = null) {
    if (reducedMotion.matches) return;
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.5,
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 3,
        size: 6 + Math.random() * 8,
        spin: Math.random() * Math.PI,
        vspin: (Math.random() - 0.5) * 0.3,
        color: colors[i % colors.length],
        glyph: glyphs ? glyphs[i % glyphs.length] : null,
      });
    }
    if (!confettiFrame) confettiFrame = requestAnimationFrame(drawConfetti);
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces = pieces.filter((p) => p.y < window.innerHeight + 40);
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.spin += p.vspin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      if (p.glyph) {
        ctx.font = `${p.size * 2.2}px serif`;
        ctx.fillText(p.glyph, 0, 0);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    }
    confettiFrame = pieces.length ? requestAnimationFrame(drawConfetti) : 0;
  }

  // Years of mobile

  document.querySelectorAll("[data-years-since]").forEach((el) => {
    const [year, month] = el.dataset.yearsSince.split("-").map(Number);
    const now = new Date();
    const years = now.getFullYear() - year - (now.getMonth() + 1 < month ? 1 : 0);
    el.textContent = String(years);
  });

  // Typer

  const typerText = document.querySelector(".typer__text");
  const lines = [
    "make checkouts less scary.",
    "teach servers to draw screens.",
    "turn coupons into a catalog.",
    "build prize wheels for a living.",
    "make apps work with TalkBack.",
    "move old code into clean layers.",
  ];

  if (!reducedMotion.matches) {
    let line = 0;
    let char = lines[0].length;
    let deleting = true;

    const tick = () => {
      const text = lines[line];
      char += deleting ? -1 : 1;
      typerText.textContent = text.slice(0, char);
      let delay = deleting ? 30 : 60;
      if (!deleting && char === text.length) {
        deleting = true;
        delay = 2200;
      } else if (deleting && char === 0) {
        deleting = false;
        line = (line + 1) % lines.length;
        delay = 300;
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2500);
  }

  // Robot eyes follow the pointer

  const pupils = document.querySelectorAll(".bot__pupil");
  const bot = document.querySelector(".bot");
  window.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches) return;
    const box = bot.getBoundingClientRect();
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height * 0.37);
    const angle = Math.atan2(dy, dx);
    const reach = Math.min(6, Math.hypot(dx, dy) / 40);
    const x = Math.cos(angle) * reach;
    const y = Math.sin(angle) * reach;
    pupils.forEach((pupil) => {
      pupil.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  bot.addEventListener("click", () => {
    showToast("Beep boop. I run on Kotlin and coffee.");
    burst(40);
  });

  // Prize wheel

  const prizes = [
    { label: "Kotlin", color: "#3ddc97", title: "Kotlin all the way", text: "At Blendle I moved the old codebase to Kotlin and Clean Architecture. Faster to build, easier to test." },
    { label: "SDUI", color: "#5aa9ff", title: "Server-Driven UI, three times", text: "GoFood, Blendle and Albert Heijn: screens that the backend draws, so teams change layouts without an app store release." },
    { label: "Payments", color: "#ff8a4c", title: "Money moves", text: "iDEAL, debit card tokenization, Stripe subscriptions, and one omnipayment flow for many payment methods at Backbase." },
    { label: "World Cup", color: "#ff7eb6", title: "Kick-off: World Cup 2026", text: "I built the opt-in flow for the World Cup 2026 campaign in the Albert Heijn app, and the bridge that lets its web pages talk to the app." },
    { label: "3M orders", color: "#ffd23f", title: "Lunch rush, every day", text: "GoFood handled 3 million orders a day. I built order placement and live driver tracking for it." },
    { label: "Wheel!", color: "#b69cff", title: "Wheel inception", text: "You spin a prize wheel made by someone who built the real Prijzenrad in the Albert Heijn app." },
    { label: "Speaker", color: "#3ddc97", title: "On stage", text: "I talked about unidirectional data flow in iOS at SwiftyID Meetup #2, and gave a guest lecture on Agile." },
    { label: "Scrum", color: "#5aa9ff", title: "Professional Scrum Master I", text: "Certified by Scrum.org in October 2017. I still like a short stand-up." },
  ];

  const disc = document.querySelector(".wheel__disc");
  const spinButton = document.querySelector(".wheel__spin");
  const prizeBox = document.querySelector(".wheel__prize");
  const prizeTitle = document.querySelector(".wheel__prize-title");
  const prizeText = document.querySelector(".wheel__prize-text");
  const svgNs = "http://www.w3.org/2000/svg";
  const slice = 360 / prizes.length;
  const radius = 104;

  function point(angleDeg, r) {
    // 0 degrees is the top of the wheel, and angles grow clockwise.
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return [Math.cos(rad) * r, Math.sin(rad) * r];
  }

  prizes.forEach((prize, i) => {
    const start = i * slice;
    const end = start + slice;
    const [x1, y1] = point(start, radius);
    const [x2, y2] = point(end, radius);
    const path = document.createElementNS(svgNs, "path");
    path.setAttribute("d", `M0 0 L${x1} ${y1} A${radius} ${radius} 0 0 1 ${x2} ${y2} Z`);
    path.setAttribute("fill", prize.color);
    path.setAttribute("stroke", "#1d1b2f");
    path.setAttribute("stroke-width", "3");
    disc.appendChild(path);

    const mid = start + slice / 2;
    const [tx, ty] = point(mid, radius * 0.66);
    const text = document.createElementNS(svgNs, "text");
    text.setAttribute("x", tx);
    text.setAttribute("y", ty);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("transform", `rotate(${mid} ${tx} ${ty})`);
    text.textContent = prize.label;
    disc.appendChild(text);
  });

  const rim = document.createElementNS(svgNs, "circle");
  rim.setAttribute("r", radius);
  rim.setAttribute("fill", "none");
  rim.setAttribute("stroke", "#1d1b2f");
  rim.setAttribute("stroke-width", "6");
  disc.appendChild(rim);

  let rotation = 0;
  let lastPrize = -1;
  const seenPrizes = new Set();

  function revealPrize(index) {
    const prize = prizes[index];
    prizeTitle.textContent = prize.title;
    prizeText.textContent = prize.text;
    prizeBox.classList.remove("is-revealed");
    void prizeBox.offsetWidth;
    prizeBox.classList.add("is-revealed");
    spinButton.disabled = false;
    seenPrizes.add(index);
    if (seenPrizes.size === prizes.length) {
      showToast("You won every prize. Jackpot!");
      burst();
    }
  }

  const normalize = (angle) => ((angle % 360) + 360) % 360;

  // direction is 1 for clockwise and -1 for counterclockwise.
  function spin(direction = 1, turns = 5) {
    let index;
    do {
      index = Math.floor(Math.random() * prizes.length);
    } while (index === lastPrize);
    lastPrize = index;

    const target = (360 - (index * slice + slice / 2)) % 360;
    const delta = direction > 0 ? normalize(target - rotation) : normalize(rotation - target);
    rotation += direction * (360 * turns + delta);
    spinButton.disabled = true;
    prizeTitle.textContent = "Spinning…";
    prizeText.textContent = "Wait for it.";
    disc.style.transform = `rotate(${rotation}deg)`;

    if (reducedMotion.matches) {
      revealPrize(index);
    } else {
      disc.addEventListener("transitionend", () => revealPrize(index), { once: true });
    }
  }

  spinButton.addEventListener("click", () => spin());

  // Swipe the wheel: it follows the pointer, and a fast release spins it.

  let drag = null;

  function pointerAngle(event) {
    const box = disc.getBoundingClientRect();
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  disc.addEventListener("pointerdown", (event) => {
    if (spinButton.disabled) return;
    disc.setPointerCapture(event.pointerId);
    disc.classList.add("is-dragging");
    drag = { angle: pointerAngle(event), samples: [{ rotation, time: event.timeStamp }] };
  });

  disc.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const angle = pointerAngle(event);
    // Takes the short way around, so that the step does not jump by 360 degrees at the left of the wheel.
    rotation += ((angle - drag.angle + 540) % 360) - 180;
    drag.angle = angle;
    drag.samples.push({ rotation, time: event.timeStamp });
    disc.style.transform = `rotate(${rotation}deg)`;
  });

  function endDrag(event) {
    if (!drag) return;
    const recent = drag.samples.filter((sample) => event.timeStamp - sample.time < 100);
    const first = recent[0] || drag.samples[drag.samples.length - 1];
    const elapsed = event.timeStamp - first.time;
    const speed = elapsed > 0 ? (rotation - first.rotation) / elapsed : 0;
    drag = null;
    disc.classList.remove("is-dragging");
    // Starts the spin transition from the position of the drag.
    disc.getBoundingClientRect();
    // 0.3 degrees per millisecond is a flick. A slower release only turns the wheel.
    if (event.type === "pointerup" && Math.abs(speed) >= 0.3) {
      spin(Math.sign(speed), Math.min(8, Math.max(3, Math.round(Math.abs(speed) * 3))));
    }
  }

  disc.addEventListener("pointerup", endDrag);
  disc.addEventListener("pointercancel", endDrag);

  // Train on the journey track

  const journey = document.querySelector(".journey");
  const track = document.querySelector(".track");
  const buffer = document.querySelector(".track__buffer");
  const train = document.querySelector(".train");
  const openStops = [];

  function isOpen(details) {
    return details.open && !details.classList.contains("is-closing");
  }

  function moveTrain(turn = false) {
    const rem = parseFloat(getComputedStyle(root).fontSize);
    // The train is positioned from inside the border of the section.
    const box = journey.getBoundingClientRect();
    const origin = { left: box.left + journey.clientLeft, top: box.top + journey.clientTop };
    const target = openStops.findLast(isOpen);
    // The track and the dots are centered 1rem from the left of the list.
    const x = track.getBoundingClientRect().left - origin.left + rem - train.offsetWidth / 2;
    let y;
    if (target) {
      // A dot is 1.3rem high, 1.1rem below the top of its stop.
      y = target.getBoundingClientRect().top - origin.top + 1.75 * rem - train.offsetHeight / 2;
    } else {
      y = buffer.getBoundingClientRect().top - origin.top - train.offsetHeight;
    }
    // Compares with the drawn position, because a move can start while the train is still driving.
    const current = train.getBoundingClientRect().top - origin.top;
    if (turn && Math.abs(y - current) > 2) train.dataset.direction = y < current ? "up" : "down";
    train.style.transform = `translate(${x}px, ${y}px)`;
  }

  function trainFollows(details) {
    const index = openStops.indexOf(details);
    if (index !== -1) openStops.splice(index, 1);
    if (isOpen(details)) openStops.push(details);
    moveTrain(true);
  }

  moveTrain();
  train.getBoundingClientRect();
  train.classList.add("is-ready");
  // Stops change height when they open, close or wrap, so the train follows its target.
  new ResizeObserver(() => moveTrain()).observe(track);

  // Journey stops slide open and closed

  document.querySelectorAll(".stop details").forEach((details) => {
    const summary = details.querySelector("summary");
    let animation = null;

    // Covers the open and close without animation, for example with reduced motion.
    details.addEventListener("toggle", () => trainFollows(details));

    summary.addEventListener("click", (event) => {
      if (reducedMotion.matches) return;
      event.preventDefault();

      const opening = !details.open || details.classList.contains("is-closing");
      const from = details.offsetHeight;
      animation?.cancel();

      // Sets the end state for one synchronous layout, to measure its height without a paint.
      details.open = opening;
      const to = details.offsetHeight;
      details.open = true;

      details.classList.toggle("is-closing", !opening);
      trainFollows(details);
      details.style.overflow = "hidden";
      animation = details.animate({ height: [`${from}px`, `${to}px`] }, { duration: 280, easing: "ease-out" });
      animation.onfinish = () => {
        animation = null;
        details.open = opening;
        details.classList.remove("is-closing");
        details.style.overflow = "";
      };
    });
  });

  // Coupons

  const coupons = document.querySelectorAll(".coupon");
  const couponCount = document.querySelector(".coupons__count");

  coupons.forEach((coupon) => {
    coupon.addEventListener("click", () => {
      const clipped = coupon.getAttribute("aria-pressed") !== "true";
      coupon.setAttribute("aria-pressed", String(clipped));
      const count = document.querySelectorAll('.coupon[aria-pressed="true"]').length;
      couponCount.textContent =
        count === coupons.length
          ? "All coupons clipped. You need the full package. Scroll down to say hoi."
          : `${count} coupon${count === 1 ? "" : "s"} clipped`;
      if (count === coupons.length) burst(80);
    });
  });

  // Stamp card

  const stampcard = document.querySelector(".stampcard");
  const stampHint = document.querySelector(".stampcard__hint");
  const stamps = new Map(
    [...document.querySelectorAll("[data-stamp]")].map((el) => [el.dataset.stamp, el])
  );
  let stampCount = 0;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const stamp = stamps.get(entry.target.dataset.section);
        observer.unobserve(entry.target);
        if (!stamp || stamp.classList.contains("is-stamped")) continue;
        stamp.classList.add("is-stamped");
        stampCount++;
        stampHint.textContent = `${stampCount} of ${stamps.size}`;
        if (stampCount === stamps.size) {
          stampcard.classList.add("is-full");
          stampHint.textContent = "Card full!";
          showToast("Stamp card full! Your reward: a reply from me. ahmadmuhsink@gmail.com");
          burst();
        }
      }
    },
    { threshold: 0.35 }
  );

  document.querySelectorAll("[data-section]").forEach((section) => observer.observe(section));

  // Konami code

  const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let progress = 0;

  window.addEventListener("keydown", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    progress = key === konami[progress] ? progress + 1 : key === konami[0] ? 1 : 0;
    if (progress === konami.length) {
      progress = 0;
      document.body.classList.toggle("is-robot");
      showToast(document.body.classList.contains("is-robot") ? "Robot mode on. Beep." : "Robot mode off. Human again.");
      burst(60, ["🤖", "🛒", "🎟️", "⭐", "🥦"]);
    }
  });
})();
