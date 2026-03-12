export function renderQuestion(elements, state, options = {}) {
  const { resetView = true, showCategory = true } = options;

  if (!state.currentQuestion) return;

  const categoryText = showCategory ? ` ${state.currentQuestion.category}` : "";

  elements.questionTitleEl.textContent =
    `${state.currentQuestion.no}.${categoryText}`;
  elements.meaningEl.textContent = state.currentQuestion.korean;
  elements.hintEl.textContent =
    `총 ${state.filteredSentences.length}문장 범위에서 출제 중`;

  elements.prevBtn.disabled = state.history.length === 0;
  elements.nextBtn.textContent =
    state.future.length > 0 ? "다음으로" : "다음 문제";

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
