import { QuizApp } from "./quiz.js";
import { getElements } from "./dom.js";
import { buildRangeOptions } from "./utils.js";

async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`${path} 데이터를 불러오지 못했습니다.`);
  }

  return response.json();
}

function normalizeDataset(sentences) {
  return sentences.map((item, index) => ({
    ...item,
    no: index + 1,
  }));
}

function setActivePartButton(elements, part) {
  elements.part3Btn.classList.toggle("active", part === "part3");
  elements.part5Btn.classList.toggle("active", part === "part5");
}

function renderCountFilterOptions(elements, totalCount) {
  const options = buildRangeOptions(totalCount);

  elements.countFilterEl.innerHTML = options
    .map(
      (option) => `<option value="${option.value}">${option.label}</option>`
    )
    .join("");

  elements.countFilterEl.value = "all";
}

async function init() {
  const elements = getElements();

  try {
    const [part3Sentences, part5Sentences] = await Promise.all([
      loadJson("./data/sentences.json"),
      loadJson("./data/sentences2.json"),
    ]);

    const datasets = {
      part3: normalizeDataset(part3Sentences),
      part5: normalizeDataset(part5Sentences),
    };

    renderCountFilterOptions(elements, datasets.part3.length);

    const app = new QuizApp(elements, datasets.part3);

    app.bindEvents();
    app.applyFilter();

    elements.part3Btn.addEventListener("click", () => {
      setActivePartButton(elements, "part3");
      renderCountFilterOptions(elements, datasets.part3.length);
      app.setSentences(datasets.part3);
    });

    elements.part5Btn.addEventListener("click", () => {
      setActivePartButton(elements, "part5");
      renderCountFilterOptions(elements, datasets.part5.length);
      app.setSentences(datasets.part5);
    });
  } catch (error) {
    console.error(error);
    elements.questionTitleEl.textContent = "오류";
    elements.meaningEl.textContent = "문장 데이터를 불러오지 못했습니다.";
    elements.hintEl.textContent = "localhost 환경에서 실행했는지 확인해 주세요.";
  }
}

init();