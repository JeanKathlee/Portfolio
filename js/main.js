const FORM_ENDPOINT = "9d96109c6447c65741d0e515f635f584";

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector("#contact-form");
const portraitCard = document.querySelector("#portrait-card");
const changingRole = document.querySelector("#changing-role");

function toggleMenu() {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
}

function closeMenu(event) {
  if (!event.target.matches("a")) return;
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

function sendEmail(event) {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const formStatus = document.querySelector("#form-status");
  const data = new FormData(contactForm);

  submitButton.disabled = true;
  submitButton.textContent = "Sending…";
  formStatus.className = "form-status";
  formStatus.textContent = "Sending your message…";

  fetch(`https://formsubmit.co/ajax/${FORM_ENDPOINT}`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: data
  })
    .then((response) => {
      if (!response.ok) throw new Error("Message could not be sent");
      return response.json();
    })
    .then(() => {
      contactForm.reset();
      formStatus.className = "form-status success";
      formStatus.textContent = "Thank you! Your message has been sent.";
    })
    .catch(() => {
      formStatus.className = "form-status error";
      formStatus.textContent = "Sorry, your message could not be sent. Please try again.";
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = "Send message";
    });
}

function movePortrait(event) {
  const bounds = portraitCard.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  portraitCard.style.setProperty("--rotate-x", `${(0.5 - y) * 12}deg`);
  portraitCard.style.setProperty("--rotate-y", `${(x - 0.5) * 14}deg`);
  portraitCard.style.setProperty("--shine-x", `${x * 100}%`);
  portraitCard.style.setProperty("--shine-y", `${y * 100}%`);
  portraitCard.classList.add("is-active");
}

function resetPortrait() {
  portraitCard.style.setProperty("--rotate-x", "0deg");
  portraitCard.style.setProperty("--rotate-y", "0deg");
  portraitCard.style.setProperty("--shine-x", "50%");
  portraitCard.style.setProperty("--shine-y", "35%");
  portraitCard.classList.remove("is-active");
}

document.querySelector("#year").textContent = new Date().getFullYear();
menuButton.addEventListener("click", toggleMenu);
navLinks.addEventListener("click", closeMenu);
contactForm.addEventListener("submit", sendEmail);

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.matchMedia("(pointer: fine)").matches) {
  portraitCard.addEventListener("pointermove", movePortrait);
  portraitCard.addEventListener("pointerleave", resetPortrait);
  portraitCard.addEventListener("blur", resetPortrait);
}

const roles = ["Developer", "Problem Solver"];
let roleIndex = 0;

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setInterval(() => {
    changingRole.classList.add("role-exit");
    window.setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      changingRole.textContent = roles[roleIndex];
      changingRole.classList.remove("role-exit");
    }, 220);
  }, 2400);
}

// Project screenshot previews
document.querySelectorAll(".screen-thumb").forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const showcase = thumb.closest(".project-showcase");
    const mainImage = showcase.querySelector(".project-main-image");
    const thumbs = [...showcase.querySelectorAll(".screen-thumb")];
    const projectTotal = showcase.dataset.project === "tle" ? 7 : 13;
    mainImage.classList.add("changing");
    window.setTimeout(() => {
      mainImage.src = thumb.dataset.src;
      mainImage.alt = thumb.dataset.alt;
      mainImage.classList.remove("changing");
    }, 160);
    thumbs.forEach((item) => item.classList.toggle("active", item === thumb));
    showcase.querySelector(".screen-count").textContent = `${String(thumbs.indexOf(thumb) + 1).padStart(2, "0")} / ${String(projectTotal).padStart(2, "0")}`;
  });
});

// Subtle pointer-driven 3D perspective
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.setProperty("--mx", `${-y * 7}deg`);
      card.style.setProperty("--my", `${x * 9}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--mx", "0deg");
      card.style.setProperty("--my", "0deg");
    });
  });
}

// Fullscreen, keyboard-accessible galleries
const galleries = {
  tle: { title: "TLE Laboratory Reservation", files: [1, 2, 3, 4, 5, 6, 7].map((n) => `projects/1/${n}.png`) },
  foodjs: { title: "FoodJS Ordering System", files: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21].map((n) => `projects/2/${n}.png`) }
};

function updateCoverflowSides(showcase, activeIndex) {
  const files = galleries[showcase.dataset.project].files;
  const previousIndex = (activeIndex - 1 + files.length) % files.length;
  const nextIndex = (activeIndex + 1) % files.length;
  showcase.querySelector(".coverflow-prev").src = files[previousIndex];
  showcase.querySelector(".coverflow-next").src = files[nextIndex];
}

function addIncomingSlide(frame, source) {
  frame.querySelector(".swipe-incoming")?.remove();
  const incoming = document.createElement("img");
  incoming.className = "swipe-incoming";
  incoming.src = source;
  incoming.alt = "";
  frame.appendChild(incoming);
}

// Build a complete cover-flow strip for every project.
document.querySelectorAll(".project-showcase").forEach((showcase) => {
  const project = galleries[showcase.dataset.project];
  const strip = showcase.querySelector(".screen-strip");
  const mainImage = showcase.querySelector(".project-main-image");
  const count = showcase.querySelector(".screen-count");
  const frame = showcase.querySelector(".browser-frame");
  const previousImage = document.createElement("img");
  const nextImage = document.createElement("img");
  previousImage.className = "coverflow-side coverflow-prev";
  nextImage.className = "coverflow-side coverflow-next";
  previousImage.alt = "Previous project screen";
  nextImage.alt = "Next project screen";
  frame.insertBefore(previousImage, mainImage);
  frame.insertBefore(nextImage, mainImage.nextSibling);
  strip.innerHTML = "";

  project.files.forEach((file, index) => {
    const button = document.createElement("button");
    button.className = `screen-thumb${index === 0 ? " active" : ""}`;
    button.type = "button";
    button.dataset.src = file;
    button.dataset.alt = `${project.title}, screen ${index + 1}`;
    button.setAttribute("aria-label", `Show screen ${index + 1} of ${project.files.length}`);
    button.innerHTML = `<img src="${file}" alt="" loading="lazy">`;
    button.addEventListener("click", () => {
      const currentIndex = Math.max(0, project.files.findIndex((item) => mainImage.src.endsWith(item)));
      if (currentIndex === index) return;
      const isPrevious = index === (currentIndex - 1 + project.files.length) % project.files.length;
      addIncomingSlide(frame, file);
      frame.classList.add(isPrevious ? "swipe-prev" : "swipe-next");
      window.setTimeout(() => {
        mainImage.src = file;
        mainImage.alt = button.dataset.alt;
        updateCoverflowSides(showcase, index);
        frame.classList.remove("swipe-prev", "swipe-next");
        frame.querySelector(".swipe-incoming")?.remove();
      }, 620);
      [...strip.children].forEach((item) => item.classList.toggle("active", item === button));
      count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(project.files.length).padStart(2, "0")}`;
      button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
    strip.appendChild(button);
  });
  updateCoverflowSides(showcase, 0);
  previousImage.addEventListener("click", () => {
    const current = Math.max(0, project.files.findIndex((file) => mainImage.src.endsWith(file)));
    strip.children[(current - 1 + project.files.length) % project.files.length].click();
  });
  nextImage.addEventListener("click", () => {
    const current = Math.max(0, project.files.findIndex((file) => mainImage.src.endsWith(file)));
    strip.children[(current + 1) % project.files.length].click();
  });
});
const galleryModal = document.querySelector("#project-gallery");
const galleryImage = document.querySelector("#gallery-image");
const galleryTitle = document.querySelector("#gallery-title");
const galleryCaption = document.querySelector("#gallery-caption");
const galleryPosition = document.querySelector("#gallery-position");
let activeGallery;
let galleryIndex = 0;

function renderGallery() {
  const gallery = galleries[activeGallery];
  galleryImage.src = gallery.files[galleryIndex];
  galleryImage.alt = `${gallery.title}, screen ${galleryIndex + 1}`;
  galleryTitle.textContent = gallery.title;
  galleryCaption.textContent = galleryIndex === 0 ? "Opening screen" : `Product screen ${galleryIndex + 1}`;
  galleryPosition.textContent = `${String(galleryIndex + 1).padStart(2, "0")} / ${String(gallery.files.length).padStart(2, "0")}`;
}
function moveGallery(direction) {
  galleryIndex = (galleryIndex + direction + galleries[activeGallery].files.length) % galleries[activeGallery].files.length;
  renderGallery();
}
document.querySelectorAll("[data-open-gallery]").forEach((button) => button.addEventListener("click", () => {
  activeGallery = button.dataset.openGallery;
  galleryIndex = 0;
  renderGallery();
  galleryModal.showModal();
}));
document.querySelector(".gallery-close").addEventListener("click", () => galleryModal.close());
document.querySelector(".gallery-prev").addEventListener("click", () => moveGallery(-1));
document.querySelector(".gallery-next").addEventListener("click", () => moveGallery(1));
galleryModal.addEventListener("click", (event) => { if (event.target === galleryModal) galleryModal.close(); });
galleryModal.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveGallery(-1);
  if (event.key === "ArrowRight") moveGallery(1);
});

// Reveal each full project presentation as the visitor scrolls to it.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".project-showcase").forEach((showcase) => {
    showcase.classList.add("reveal-ready");
    revealObserver.observe(showcase);
  });
}

// Automatically present every project screen while its showcase is visible.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".project-showcase").forEach((showcase) => {
    const files = galleries[showcase.dataset.project].files;
    const mainImage = showcase.querySelector(".project-main-image");
    const count = showcase.querySelector(".screen-count");
    const thumbs = [...showcase.querySelectorAll(".screen-thumb")];
    let timer;
    let visible = false;
    let paused = false;

    function restartProgress() {
      showcase.classList.remove("is-playing");
      void showcase.offsetWidth;
      if (visible && !paused) showcase.classList.add("is-playing");
    }

    function showNextScreen() {
      const currentPath = new URL(mainImage.src).pathname.replace(/^.*\/projects/, "projects");
      const currentIndex = Math.max(0, files.findIndex((file) => currentPath.endsWith(file)));
      const nextIndex = (currentIndex + 1) % files.length;
      const frame = showcase.querySelector(".browser-frame");
      if (frame.classList.contains("swipe-next") || frame.classList.contains("swipe-prev")) return;
      addIncomingSlide(frame, files[nextIndex]);
      frame.classList.add("swipe-next");
      window.setTimeout(() => {
        mainImage.src = files[nextIndex];
        mainImage.alt = `${galleries[showcase.dataset.project].title}, screen ${nextIndex + 1}`;
        count.textContent = `${String(nextIndex + 1).padStart(2, "0")} / ${String(files.length).padStart(2, "0")}`;
        updateCoverflowSides(showcase, nextIndex);
        frame.classList.remove("swipe-next");
        frame.querySelector(".swipe-incoming")?.remove();
        thumbs.forEach((thumb) => thumb.classList.toggle("active", thumb.dataset.src === files[nextIndex]));
        const activeThumb = thumbs.find((thumb) => thumb.dataset.src === files[nextIndex]);
        activeThumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        restartProgress();
      }, 620);
    }

    function startAutoplay() {
      if (timer || paused || !visible) return;
      restartProgress();
      timer = window.setInterval(showNextScreen, 4500);
    }

    function stopAutoplay() {
      window.clearInterval(timer);
      timer = undefined;
      showcase.classList.remove("is-playing");
    }

    const interactionArea = showcase.querySelector(".project-demo");
    interactionArea.addEventListener("pointerenter", () => { paused = true; stopAutoplay(); });
    interactionArea.addEventListener("pointerleave", () => { paused = false; startAutoplay(); });
    interactionArea.addEventListener("focusin", () => { paused = true; stopAutoplay(); });
    interactionArea.addEventListener("focusout", () => { paused = false; startAutoplay(); });

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startAutoplay(); else stopAutoplay();
    }, { threshold: 0.3 }).observe(showcase);
  });
}
