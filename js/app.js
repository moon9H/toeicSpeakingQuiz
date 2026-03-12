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

function setActivePartButton(elements, activePart) {
  ["part2", "part3", "part4", "part5"].forEach((part) => {
    const button = elements[`${part}Btn`];
    if (button) {
      button.classList.toggle("active", part === activePart);
    }
  });
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

  const partConfigs = {
    part2: {
      button: elements.part2Btn,
      path: "./data/sentences_part2.json",
    },
    part3: {
      button: elements.part3Btn,
      path: "./data/sentences_part3.json",
    },
    part4: {
      button: elements.part4Btn,
      path: "./data/sentences_part4.json",
    },
    part5: {
      button: elements.part5Btn,
      path: "./data/sentences_part5.json",
    },
  };

  try {
    const datasets = {};
    const loadTargets = Object.entries(partConfigs);

    for (const [part, config] of loadTargets) {
      try {
        const data = await loadJson(config.path);
        datasets[part] = normalizeDataset(data);

        config.button.addEventListener("click", () => {
          setActivePartButton(elements, part);
          renderCountFilterOptions(elements, datasets[part].length);
          app.setSentences(datasets[part]);
        });
      } catch (error) {
        datasets[part] = null;
        config.button.disabled = true;
        config.button.title = "데이터 준비 중";
      }
    }

    const defaultPart = datasets.part3 ? "part3" : Object.keys(datasets).find((part) => datasets[part]);

    if (!defaultPart) {
      throw new Error("불러올 수 있는 문장 데이터가 없습니다.");
    }

    setActivePartButton(elements, defaultPart);
    renderCountFilterOptions(elements, datasets[defaultPart].length);

    const app = new QuizApp(elements, datasets[defaultPart]);

    app.bindEvents();
    app.applyFilter();
  } catch (error) {
    console.error(error);
    elements.questionTitleEl.textContent = "오류";
    elements.meaningEl.textContent = "문장 데이터를 불러오지 못했습니다.";
    elements.hintEl.textContent = "localhost 환경에서 실행했는지 확인해 주세요.";
  }
}

init();