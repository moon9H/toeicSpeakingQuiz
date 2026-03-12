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
import {
  loadLearningSession,
  saveLearningSession,
} from "./storage/learning-session.js";

async function init() {
  const elements = getElements();
  const partConfigs = getPartConfigs(elements);
  const savedSession = loadLearningSession();

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

    const activePart = getInitialPart(datasets, savedSession);

    if (!activePart) {
      throw new Error("불러올 수 있는 문장 데이터가 없습니다.");
    }

    applySessionControls(elements, savedSession);
    setActivePartButton(elements, activePart);
    renderCountFilterOptions(elements, datasets[activePart].length);

    const app = new QuizApp(elements, datasets[activePart], {
      onStateChange: (quizState) =>
        saveLearningSession(buildLearningSession(activePartRef.current, elements, quizState)),
    });
    const activePartRef = { current: activePart };

    bindPartButtons(elements, partConfigs, datasets, app, activePartRef);

    app.bindEvents();

    if (savedSession && savedSession.activePart === activePart) {
      restoreLearningSession(elements, datasets, app, activePart, savedSession);
    } else {
      app.applyFilter();
    }
  } catch (error) {
    console.error(error);
    elements.questionTitleEl.textContent = "오류";
    elements.meaningEl.textContent = "문장 데이터를 불러오지 못했습니다.";
    elements.hintEl.textContent = "localhost 환경에서 실행했는지 확인해 주세요.";
  }
}

function bindPartButtons(elements, partConfigs, datasets, app, activePartRef) {
  for (const [part, config] of Object.entries(partConfigs)) {
    if (!datasets[part]) continue;

    config.button.addEventListener("click", () => {
      activePartRef.current = part;
      setActivePartButton(elements, part);
      renderCountFilterOptions(elements, datasets[part].length);
      app.setSentences(datasets[part]);
      saveLearningSession(buildLearningSession(part, elements, app.getPersistedState()));
    });
  }
}

function getInitialPart(datasets, savedSession) {
  if (savedSession?.activePart && datasets[savedSession.activePart]) {
    return savedSession.activePart;
  }

  return getDefaultPart(datasets);
}

function applySessionControls(elements, savedSession) {
  if (!savedSession) return;

  if (savedSession.mode) {
    elements.modeEl.value = savedSession.mode;
  }

  if (savedSession.showCategory !== undefined) {
    elements.showCategoryEl.checked = savedSession.showCategory;
  }

  if (savedSession.autoNext !== undefined) {
    elements.autoNextEl.checked = savedSession.autoNext;
  }
}

function restoreLearningSession(elements, datasets, app, activePart, savedSession) {
  const dataset = datasets[activePart];
  const desiredFilter = savedSession.countFilter;
  const hasDesiredFilter = Array.from(elements.countFilterEl.options).some(
    (option) => option.value === desiredFilter
  );

  elements.countFilterEl.value = hasDesiredFilter ? desiredFilter : "all";
  app.applyFilter();

  if (!savedSession.quizState) {
    return;
  }

  app.restorePersistedState(savedSession.quizState);
}

function buildLearningSession(activePart, elements, quizState) {
  return {
    activePart,
    mode: elements.modeEl.value,
    countFilter: elements.countFilterEl.value,
    showCategory: elements.showCategoryEl.checked,
    autoNext: elements.autoNextEl.checked,
    quizState,
  };
}

init();
