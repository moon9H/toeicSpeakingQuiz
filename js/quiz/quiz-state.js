import { getFilterRange } from "../utils/range-utils.js";

export function createQuizState(sentences) {
  return {
    sentences,
    filteredSentences: [...sentences],
    randomQueue: [],
    history: [],
    future: [],
    currentIndex: 0,
    currentQuestion: null,
    currentQuestionResult: null,
    correctCount: 0,
    wrongCount: 0,
  };
}

export function resetQuizState(state, sentences) {
  state.sentences = sentences;
  state.filteredSentences = [...sentences];
  state.randomQueue = [];
  state.history = [];
  state.future = [];
  state.currentIndex = 0;
  state.currentQuestion = null;
  state.currentQuestionResult = null;
  state.correctCount = 0;
  state.wrongCount = 0;
}

export function applyFilterToState(state, filterValue) {
  const [start, end] = getFilterRange(filterValue, state.sentences.length);

  state.filteredSentences = state.sentences.filter(
    (item) => item.no >= start && item.no <= end
  );
  state.currentIndex = 0;
  state.randomQueue = [];
  state.history = [];
  state.future = [];
  state.currentQuestion = null;
  state.currentQuestionResult = null;
  state.correctCount = 0;
  state.wrongCount = 0;
}

export function pickNextQuestion(state, mode) {
  if (state.filteredSentences.length === 0) {
    return null;
  }

  state.currentQuestion =
    mode === "random" ? randomPick(state) : sequentialPick(state);
  state.currentQuestionResult = null;

  return state.currentQuestion;
}

export function pushHistory(state, snapshot) {
  state.history.push(snapshot);
}

export function pushFuture(state, snapshot) {
  state.future.push(snapshot);
}

export function popHistory(state) {
  return state.history.pop();
}

export function popFuture(state) {
  return state.future.pop();
}

export function clearFuture(state) {
  state.future = [];
}

export function updateScore(state, nextResult) {
  if (state.currentQuestionResult === nextResult) {
    return;
  }

  if (state.currentQuestionResult === "correct") {
    state.correctCount--;
  } else if (state.currentQuestionResult === "wrong") {
    state.wrongCount--;
  }

  if (nextResult === "correct") {
    state.correctCount++;
  } else if (nextResult === "wrong") {
    state.wrongCount++;
  }

  state.currentQuestionResult = nextResult;
}

export function createSnapshot(state, viewState) {
  return {
    currentQuestion: state.currentQuestion,
    currentIndex: state.currentIndex,
    currentQuestionResult: state.currentQuestionResult,
    randomQueue: [...state.randomQueue],
    correctCount: state.correctCount,
    wrongCount: state.wrongCount,
    viewState,
  };
}

export function restoreSnapshot(state, snapshot) {
  state.currentQuestion = snapshot.currentQuestion;
  state.currentIndex = snapshot.currentIndex;
  state.currentQuestionResult = snapshot.currentQuestionResult;
  state.randomQueue = [...snapshot.randomQueue];
  state.correctCount = snapshot.correctCount;
  state.wrongCount = snapshot.wrongCount;
}

function randomPick(state) {
  if (state.randomQueue.length === 0) {
    state.randomQueue = shuffleArray([...state.filteredSentences]);
  }

  return state.randomQueue.shift();
}

function sequentialPick(state) {
  const question =
    state.filteredSentences[state.currentIndex % state.filteredSentences.length];

  state.currentIndex++;
  return question;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
