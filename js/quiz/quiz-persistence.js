import { captureViewState } from "./quiz-renderer.js";

function createFallbackViewState() {
  return {
    answerInputValue: "",
    resultClassName: "result",
    resultTitle: "",
    resultBodyHtml: "",
  };
}

export function getPersistedQuizState(state, elements) {
  return {
    currentIndex: state.currentIndex,
    currentQuestionNo: state.currentQuestion?.no ?? null,
    currentQuestionResult: state.currentQuestionResult,
    randomQueueNos: state.randomQueue.map((item) => item.no),
    correctCount: state.correctCount,
    wrongCount: state.wrongCount,
    wrongQuestionNos: [...state.wrongQuestionNos],
    reviewMode: state.reviewMode,
    history: state.history.map((snapshot) => serializeSnapshot(snapshot, state)),
    future: state.future.map((snapshot) => serializeSnapshot(snapshot, state)),
    viewState: captureViewState(elements),
  };
}

export function restorePersistedQuizState(state, savedState, helpers) {
  if (!savedState) {
    return false;
  }

  state.currentIndex = savedState.currentIndex ?? 0;
  state.currentQuestion = helpers.findQuestionByNo(savedState.currentQuestionNo);
  state.currentQuestionResult = savedState.currentQuestionResult ?? null;
  state.randomQueue = mapQuestionNos(savedState.randomQueueNos, helpers);
  state.correctCount = savedState.correctCount ?? 0;
  state.wrongCount = savedState.wrongCount ?? 0;
  state.wrongQuestionNos = savedState.wrongQuestionNos ?? [];
  state.reviewMode = savedState.reviewMode ?? "all";
  state.history = (savedState.history ?? [])
    .map((snapshot) => deserializeSnapshot(snapshot, helpers))
    .filter(Boolean);
  state.future = (savedState.future ?? [])
    .map((snapshot) => deserializeSnapshot(snapshot, helpers))
    .filter(Boolean);

  return true;
}

function serializeSnapshot(snapshot, state) {
  return {
    currentQuestionNo: snapshot.currentQuestion?.no ?? null,
    currentIndex: snapshot.currentIndex,
    currentQuestionResult: snapshot.currentQuestionResult,
    randomQueueNos: snapshot.randomQueue.map((item) => item.no),
    correctCount: snapshot.correctCount,
    wrongCount: snapshot.wrongCount,
    wrongQuestionNos: [...state.wrongQuestionNos],
    reviewMode: state.reviewMode,
    viewState: snapshot.viewState,
  };
}

function deserializeSnapshot(snapshot, helpers) {
  const currentQuestion = helpers.findQuestionByNo(snapshot.currentQuestionNo);

  if (!currentQuestion) {
    return null;
  }

  return {
    currentQuestion,
    currentIndex: snapshot.currentIndex ?? 0,
    currentQuestionResult: snapshot.currentQuestionResult ?? null,
    randomQueue: mapQuestionNos(snapshot.randomQueueNos, helpers),
    correctCount: snapshot.correctCount ?? 0,
    wrongCount: snapshot.wrongCount ?? 0,
    viewState: snapshot.viewState ?? createFallbackViewState(),
  };
}

function mapQuestionNos(questionNos = [], helpers) {
  return questionNos
    .map((no) => helpers.findQuestionByNo(no))
    .filter(Boolean);
}
