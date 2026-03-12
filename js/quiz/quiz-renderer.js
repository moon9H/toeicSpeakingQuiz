export function renderQuestion(elements, state, options = {}) {
  const { resetView = true, showCategory = true } = options;

  if (!state.currentQuestion) {
    renderEmptyQuestion(elements, state);
    return;
  }

  const categoryText = showCategory ? ` ${state.currentQuestion.category}` : "";

  elements.questionTitleEl.classList.remove("empty-warning");
  elements.meaningEl.classList.remove("empty-warning");
  elements.hintEl.classList.remove("empty-warning-sub");

  elements.questionTitleEl.textContent =
    `${state.currentQuestion.no}.${categoryText}`;
  elements.meaningEl.textContent = state.currentQuestion.korean;
  elements.hintEl.textContent =
    `총 ${state.filteredSentences.length}문장 범위에서 출제 중`;

  elements.prevBtn.disabled = state.history.length === 0;
  elements.nextBtn.textContent =
    state.future.length > 0 ? "다음으로" : "다음 문제";
  elements.nextBtn.disabled = false;
  elements.answerInputEl.disabled = false;
  elements.checkBtn.disabled = false;
  elements.showAnswerBtn.disabled = false;

  if (resetView) {
    elements.answerInputEl.value = "";
    hideResult(elements);
  }

  elements.answerInputEl.focus();
}

export function updateStats(elements, state) {
  const total = state.correctCount + state.wrongCount;
  const accuracy =
    total === 0 ? 0 : Math.round((state.correctCount / total) * 100);

  elements.progressPillEl.textContent =
    `현재 ${state.currentQuestion ? state.currentQuestion.no : "-"}번`;
  elements.scorePillEl.textContent =
    `정답 ${state.correctCount} · 오답 ${state.wrongCount}`;
  elements.accuracyPillEl.textContent = `정확도 ${accuracy}%`;
}

export function showResult(elements, type, title, bodyHtml) {
  elements.resultBoxEl.className = `result show ${type}`;
  elements.resultTitleEl.textContent = title;
  elements.resultBodyEl.innerHTML = bodyHtml;
}

export function hideResult(elements) {
  elements.resultBoxEl.className = "result";
  elements.resultTitleEl.textContent = "";
  elements.resultBodyEl.innerHTML = "";
}

export function captureViewState(elements) {
  return {
    answerInputValue: elements.answerInputEl.value,
    resultClassName: elements.resultBoxEl.className,
    resultTitle: elements.resultTitleEl.textContent,
    resultBodyHtml: elements.resultBodyEl.innerHTML,
  };
}

export function restoreViewState(elements, viewState) {
  elements.answerInputEl.value = viewState.answerInputValue;
  elements.resultBoxEl.className = viewState.resultClassName;
  elements.resultTitleEl.textContent = viewState.resultTitle;
  elements.resultBodyEl.innerHTML = viewState.resultBodyHtml;
  elements.answerInputEl.focus();
}

function renderEmptyQuestion(elements, state) {
  const isWrongMode = state.reviewMode === "wrong";

  elements.questionTitleEl.textContent = isWrongMode
    ? "오답 노트 비어 있음"
    : "문제가 없습니다";
  elements.questionTitleEl.classList.toggle("empty-warning", isWrongMode);
  elements.meaningEl.textContent = isWrongMode
    ? "아직 틀린 문제가 없습니다. 문제를 틀리면 여기에서 다시 볼 수 있습니다."
    : "현재 조건에 맞는 문제가 없습니다.";
  elements.meaningEl.classList.toggle("empty-warning", isWrongMode);
  elements.hintEl.textContent = isWrongMode
    ? `오답으로 기록된 문제 ${state.wrongQuestionNos.length}개`
    : "출제 범위를 다시 선택해 보세요.";
  elements.hintEl.classList.toggle("empty-warning-sub", isWrongMode);
  elements.answerInputEl.value = "";
  elements.answerInputEl.disabled = true;
  elements.checkBtn.disabled = true;
  elements.showAnswerBtn.disabled = true;
  elements.prevBtn.disabled = state.history.length === 0;
  elements.nextBtn.disabled = true;
  elements.nextBtn.textContent = "다음 문제";
  hideResult(elements);
}
