import { QuizApp } from "./quiz/quiz.js";
import {
  getDefaultPart,
  getPartConfigs,
  loadPartDatasets,
} from "./app/part-datasets.js";
import {
  renderCountFilterOptions,
  setActivePartButton,
  setPartButtonState,
} from "./app/part-ui.js";
import { getElements } from "./dom.js";

async function init() {
  const elements = getElements();
  const partConfigs = getPartConfigs(elements);

  try {
    const datasets = await loadPartDatasets(
      partConfigs,
      (part, config, dataset) => {
        setPartButtonState(config.button, {
          isReady: true,
          title: `${config.button.textContent} 문장 학습 시작`,
        });
      },
      (part, config) => {
        setPartButtonState(config.button, {
          isReady: false,
          title: `${config.button.textContent} 데이터 준비 중`,
        });
      }
    );

    const defaultPart = getDefaultPart(datasets);

    if (!defaultPart) {
      throw new Error("불러올 수 있는 문장 데이터가 없습니다.");
    }

    setActivePartButton(elements, defaultPart);
    renderCountFilterOptions(elements, datasets[defaultPart].length);

    const app = new QuizApp(elements, datasets[defaultPart]);
    bindPartButtons(elements, partConfigs, datasets, app);

    app.bindEvents();
    app.applyFilter();
  } catch (error) {
    console.error(error);
    elements.questionTitleEl.textContent = "오류";
    elements.meaningEl.textContent = "문장 데이터를 불러오지 못했습니다.";
    elements.hintEl.textContent = "localhost 환경에서 실행했는지 확인해 주세요.";
  }
}

function bindPartButtons(elements, partConfigs, datasets, app) {
  for (const [part, config] of Object.entries(partConfigs)) {
    if (!datasets[part]) continue;

    config.button.addEventListener("click", () => {
      setActivePartButton(elements, part);
      renderCountFilterOptions(elements, datasets[part].length);
      app.setSentences(datasets[part]);
    });
  }
}

init();
