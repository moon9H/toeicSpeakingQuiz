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
  syncReviewControls,
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
  const controlStateRef = {
    standardMode:
      savedSession?.standardMode ?? savedSession?.mode ?? elements.modeEl.value,
    standardCountFilter:
      savedSession?.standardCountFilter ?? savedSession?.countFilter ?? "all",
  };

  try {
    const datasets = await loadPartDatasets(
      partConfigs,
      (part, config) => {
        setPartButtonState(config.button, {
          isReady: true,
          title: `${config.button.textContent} 문장 학습 시작`,
        });
      },
      (part, config) => {
        setPartButtonState(config.button, {
          isReady: false,
          status: "준비 중",
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
    syncLearningControls(
      elements,
      datasets[activePart].length,
      savedSession?.quizState ?? {
        reviewMode: elements.reviewModeEl.value,
        wrongQuestionNos: [],
      },
      controlStateRef
    );

    const app = new QuizApp(elements, datasets[activePart], {
      onStateChange: (quizState) => {
        syncLearningControls(
          elements,
          datasets[activePartRef.current].length,
          quizState,
          controlStateRef
        );
        saveLearningSession(
          buildLearningSession(
            activePartRef.current,
            elements,
            quizState,
            controlStateRef
          )
        );
      },
    });
    const activePartRef = { current: activePart };

    bindPartButtons(
      elements,
      partConfigs,
      datasets,
      app,
      activePartRef,
      controlStateRef
    );

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
    elements.hintEl.textContent = "localhost 환경에서 실행 중인지 확인해 주세요.";
  }
}

function bindPartButtons(
  elements,
  partConfigs,
  datasets,
  app,
  activePartRef,
  controlStateRef
) {
  for (const [part, config] of Object.entries(partConfigs)) {
    if (!datasets[part]) continue;

    config.button.addEventListener("click", () => {
      activePartRef.current = part;
      elements.reviewModeEl.value = "all";
      setActivePartButton(elements, part);
      renderCountFilterOptions(elements, datasets[part].length);
      app.setSentences(datasets[part]);
      syncLearningControls(
        elements,
        datasets[part].length,
        app.getPersistedState(),
        controlStateRef
      );
      saveLearningSession(
        buildLearningSession(
          part,
          elements,
          app.getPersistedState(),
          controlStateRef
        )
      );
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

  if (savedSession.reviewMode) {
    elements.reviewModeEl.value = savedSession.reviewMode;
  }
}

function restoreLearningSession(elements, datasets, app, activePart, savedSession) {
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

function buildLearningSession(activePart, elements, quizState, controlStateRef) {
  return {
    activePart,
    mode: elements.modeEl.value,
    countFilter: elements.countFilterEl.value,
    reviewMode: elements.reviewModeEl.value,
    standardMode: controlStateRef.standardMode,
    standardCountFilter: controlStateRef.standardCountFilter,
    showCategory: elements.showCategoryEl.checked,
    autoNext: elements.autoNextEl.checked,
    quizState,
  };
}

function syncLearningControls(elements, totalCount, quizState, controlStateRef) {
  const reviewMode = quizState.reviewMode ?? elements.reviewModeEl.value;

  if (
    reviewMode === "all" &&
    !elements.modeEl.disabled &&
    !elements.countFilterEl.disabled
  ) {
    controlStateRef.standardMode = elements.modeEl.value;
    controlStateRef.standardCountFilter = elements.countFilterEl.value;
  }

  syncReviewControls(
    elements,
    totalCount,
    reviewMode,
    quizState.wrongQuestionNos?.length ?? 0,
    {
      mode: controlStateRef.standardMode,
      countFilter: controlStateRef.standardCountFilter,
    }
  );
}

init();
