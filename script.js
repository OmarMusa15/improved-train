const pages = [...document.querySelectorAll(".page")];
const pageLinks = [...document.querySelectorAll("[data-page]")];
const announcement = document.getElementById("page-announcement");
const pageNames = {
  home: "Home",
  about: "About",
  projects: "Projects",
  contact: "Contacts",
};

function showPage(name, updateHistory = true) {
  const page = document.getElementById(name);
  if (!page || !pageNames[name]) return;

  for (const section of pages) {
    const active = section === page;
    section.hidden = !active;
    section.classList.toggle("is-visible", active);
  }

  for (const link of pageLinks) {
    const active = link.dataset.page === name && link.classList.contains("nav-link");
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }

  if (updateHistory && window.location.hash !== `#${name}`) {
    window.history.pushState({ page: name }, "", `#${name}`);
  }

  document.title = `${pageNames[name]} — Omar Musayev`;
  announcement.textContent = `${pageNames[name]} page`;
}

for (const link of pageLinks) {
  link.addEventListener("click", (event) => {
    const name = link.dataset.page;
    if (!pageNames[name]) return;
    event.preventDefault();
    showPage(name);
  });
}

window.addEventListener("popstate", () => {
  showPage(window.location.hash.slice(1) || "home", false);
});

window.addEventListener("hashchange", () => {
  showPage(window.location.hash.slice(1) || "home", false);
});

const initialPage = window.location.hash.slice(1);
showPage(pageNames[initialPage] ? initialPage : "home", false);
document.getElementById("current-year").textContent = new Date().getFullYear();

const storyCards = [...document.querySelectorAll(".story-card")];
const storyProgressLabel = document.getElementById("about-progress-label");
const storyProgressTrack = document.querySelector(".progress-track");
const storyProgressFill = document.getElementById("about-progress-fill");
const storyDialog = document.getElementById("story-dialog");
const storyDialogTitle = document.getElementById("story-dialog-title");
const storyDialogCopy = document.getElementById("story-dialog-copy");
const storyDialogDone = document.getElementById("story-dialog-done");
const storyGuides = {
  who: {
    title: "Who am I?",
    copy: "My name is Omar Musayev, and I’m a motivated and curious student in Information Technology. I enjoy learning new things, exploring technology, and challenging myself. I’m particularly interested in artificial intelligence and its potential to make people’s lives easier. I hope to become an AI specialist and use my knowledge to contribute to the development of my country.",
  },
  background: {
    title: "My background",
    copy: "I am from Kalbajar, Karabakh, and now live in Baku. Growing up in a technological era, observing the world around me, and being exposed to social media have shaped my interests. These influences encouraged me to explore technology, think independently, and develop my own ambitions.",
  },
  qualifications: {
    title: "Qualifications & education",
    copy: "I studied at Ganja School No. 12. My achievements include third place in the “What? Where? When?” intellectual competition, a top-50 result in the Kangaroo Mathematics Olympiad, IELTS 7, SAT 1500, and second place in the US English Olympiad.",
  },
  activities: {
    title: "Activities & experience",
    copy: "I take part in the EmpowHERment Club and have volunteered with ASAN Xidmət and the Ganja American Center. These activities have given me opportunities to get involved and work with others.",
  },
  interests: {
    title: "Interests",
    copy: "I enjoy playing volleyball, playing video games, and spending time with my friends. I would also like to become a professional chess player, and I’m already working toward that goal.",
  },
};

function updateStoryProgress() {
  const collected = storyCards.filter((card) => card.classList.contains("is-collected")).length;
  const total = storyCards.length;
  storyProgressLabel.textContent = `${collected} / ${total} badges`;
  storyProgressTrack.setAttribute("aria-valuemax", String(total));
  storyProgressTrack.setAttribute("aria-valuenow", String(collected));
  storyProgressFill.style.width = `${(collected / total) * 100}%`;
}

for (const card of storyCards) {
  card.addEventListener("click", () => {
    const collected = !card.classList.contains("is-collected");
    card.classList.toggle("is-collected", collected);
    card.setAttribute("aria-pressed", String(collected));
    updateStoryProgress();

    const guide = storyGuides[card.dataset.story];
    if (!guide) return;
    storyDialogTitle.textContent = guide.title;
    storyDialogCopy.textContent = guide.copy;
    storyDialog.showModal();
  });
}

storyDialogDone.addEventListener("click", () => storyDialog.close());
storyDialog.addEventListener("click", (event) => {
  if (event.target === storyDialog) storyDialog.close();
});

const projectVideoButton = document.getElementById("open-project-video");
const projectVideoDialog = document.getElementById("project-video-dialog");
const projectVideoFrame = document.getElementById("project-video-frame");
const closeProjectVideoButton = document.getElementById("close-project-video");

projectVideoButton.addEventListener("click", () => {
  projectVideoFrame.src = "https://www.youtube-nocookie.com/embed/TnAJ2LDV6SE?autoplay=1&rel=0";
  projectVideoDialog.showModal();
});

closeProjectVideoButton.addEventListener("click", () => projectVideoDialog.close());
projectVideoDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  projectVideoDialog.close();
});
projectVideoDialog.addEventListener("click", (event) => {
  if (event.target === projectVideoDialog) projectVideoDialog.close();
});
projectVideoDialog.addEventListener("close", () => {
  projectVideoFrame.removeAttribute("src");
});

const photoInput = document.getElementById("photo-upload");
const photoPreview = document.getElementById("profile-photo");
const uploadPlaceholder = document.getElementById("upload-placeholder");
const photoStatus = document.getElementById("photo-status");
let currentPhotoUrl = null;

photoInput.addEventListener("change", () => {
  const [file] = photoInput.files || [];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    photoInput.value = "";
    photoStatus.textContent = "Please choose an image file for your profile photo.";
    return;
  }

  photoStatus.textContent = "Your profile photo preview has been updated.";
  if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
  currentPhotoUrl = URL.createObjectURL(file);
  photoPreview.src = currentPhotoUrl;
  photoPreview.hidden = false;
  uploadPlaceholder.hidden = true;
});

const projectPhotoUrls = new Map();
for (const input of document.querySelectorAll(".project-photo-input")) {
  input.addEventListener("change", () => {
    const [file] = input.files || [];
    if (!file) return;

    const status = document.getElementById(input.dataset.status);
    if (!file.type.startsWith("image/")) {
      input.value = "";
      status.textContent = "Please choose an image file for this project.";
      return;
    }

    const preview = document.getElementById(input.dataset.preview);
    const previousUrl = projectPhotoUrls.get(input.id);
    if (previousUrl) URL.revokeObjectURL(previousUrl);
    const url = URL.createObjectURL(file);
    projectPhotoUrls.set(input.id, url);
    preview.src = url;
    preview.hidden = false;
    status.textContent = "Project screenshot preview updated.";
  });
}

const gateDefinitions = {
  AND: {
    symbol: "∧",
    explanation: "An AND gate outputs 1 only when both inputs are 1.",
    output: (a, b) => Number(a === 1 && b === 1),
  },
  OR: {
    symbol: "∨",
    explanation: "An OR gate outputs 1 when at least one input is 1.",
    output: (a, b) => Number(a === 1 || b === 1),
  },
  NOT: {
    symbol: "¬",
    explanation: "A NOT gate flips its input: 0 becomes 1, and 1 becomes 0.",
    output: (a) => Number(a === 0),
  },
};

const gateTabs = [...document.querySelectorAll(".gate-tab")];
const gateConsole = document.querySelector(".gate-console");
const gateInputs = [...document.querySelectorAll(".input-switch")];
const gateGlyph = document.getElementById("gate-glyph");
const gateOutput = document.getElementById("gate-output");
const outputValue = document.getElementById("output-value");
const outputWord = document.getElementById("output-word");
const truthTableBody = document.getElementById("truth-table-body");
const tableGateLabel = document.getElementById("table-gate-label");
const gateExplanation = document.getElementById("gate-explanation");
const challenge = document.querySelector(".logic-challenge");
const challengeMessage = document.getElementById("challenge-message");
const newChallengeButton = document.getElementById("new-challenge");
let selectedGate = "AND";
let inputValues = { A: 0, B: 0 };
let targetOutput = 1;

function getGateOutput(a, b) {
  return gateDefinitions[selectedGate].output(a, b);
}

function renderTruthTable() {
  const rows = selectedGate === "NOT"
    ? [[0, 0], [1, 0]]
    : [[0, 0], [0, 1], [1, 0], [1, 1]];
  const currentOutput = getGateOutput(inputValues.A, inputValues.B);
  const fragment = document.createDocumentFragment();

  for (const [a, b] of rows) {
    const row = document.createElement("tr");
    const rowOutput = selectedGate === "NOT" ? getGateOutput(a, 0) : getGateOutput(a, b);
    const values = selectedGate === "NOT" ? [a, rowOutput] : [a, b, rowOutput];

    for (const value of values) {
      const cell = document.createElement("td");
      cell.textContent = String(value);
      row.append(cell);
    }

    const matchesInputs = selectedGate === "NOT"
      ? a === inputValues.A
      : a === inputValues.A && b === inputValues.B;
    if (matchesInputs && rowOutput === currentOutput) row.classList.add("is-current");
    fragment.append(row);
  }

  truthTableBody.replaceChildren(fragment);
  document.querySelector(".input-b-heading").hidden = selectedGate === "NOT";
}

function renderGate() {
  const definition = gateDefinitions[selectedGate];
  const output = getGateOutput(inputValues.A, inputValues.B);

  for (const tab of gateTabs) {
    const selected = tab.dataset.gate === selectedGate;
    tab.classList.toggle("is-selected", selected);
    tab.setAttribute("aria-pressed", String(selected));
  }

  for (const input of gateInputs) {
    const name = input.dataset.input;
    const value = inputValues[name];
    input.hidden = selectedGate === "NOT" && name === "B";
    input.setAttribute("aria-pressed", String(value === 1));
    input.setAttribute("aria-label", `Input ${name} is ${value}, toggle to ${value === 1 ? 0 : 1}`);
    input.querySelector(".input-value").textContent = String(value);
  }

  gateConsole.classList.toggle("is-not", selectedGate === "NOT");
  gateGlyph.classList.add("is-changing");
  window.setTimeout(() => gateGlyph.classList.remove("is-changing"), 180);
  gateGlyph.textContent = definition.symbol;
  gateOutput.dataset.output = String(output);
  outputValue.textContent = String(output);
  outputWord.textContent = output === 1 ? "HIGH" : "LOW";
  tableGateLabel.textContent = `${selectedGate} gate`;
  gateExplanation.textContent = definition.explanation;
  renderTruthTable();

  const challengeComplete = output === targetOutput;
  challenge.classList.toggle("is-complete", challengeComplete);
  challengeMessage.textContent = challengeComplete
    ? `You got it! The output is ${targetOutput === 1 ? "HIGH" : "LOW"} ✨`
    : `Challenge: make the output ${targetOutput === 1 ? "HIGH" : "LOW"}.`;
}

for (const tab of gateTabs) {
  tab.addEventListener("click", () => {
    selectedGate = tab.dataset.gate;
    renderGate();
  });
}

for (const input of gateInputs) {
  input.addEventListener("click", () => {
    const name = input.dataset.input;
    inputValues[name] = inputValues[name] === 1 ? 0 : 1;
    renderGate();
  });
}

newChallengeButton.addEventListener("click", () => {
  targetOutput = getGateOutput(inputValues.A, inputValues.B) === 1 ? 0 : 1;
  renderGate();
});

renderGate();

document.querySelector(".portrait-upload").addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    photoInput.click();
  }
});

const emailLink = document.querySelector(".email-link");
const contactEmail = emailLink.dataset.email;
emailLink.href = `mailto:${contactEmail}`;
const contactForm = document.getElementById("contact-form");
const formHint = document.getElementById("form-hint");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const subject = `Hello from ${formData.get("name")}`;
  const body = formData.get("message");
  const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  formHint.textContent = "Your email app should open with your message ready to send.";
  window.location.href = mailto;
});
