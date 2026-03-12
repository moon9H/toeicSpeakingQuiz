import { getAnswerComparison, escapeHtml } from "../utils/answer-utils.js";
import {
  captureViewState,
  hideResult,
  renderQuestion,
  restoreViewState,
  showResult,
  updateStats,
} from "./quiz-renderer.js";
import {
  applyFilterToState,
  clearFuture,
  createQuizState,
  createSnapshot,
  pickNextQuestion,
  popFuture,
  popHistory,
  pushFuture,
  pushHistory,
  resetQuizState,
  restoreSnapshot,
  updateScore,
} from "./quiz-state.js";

export class QuizApp {
  constructor(elements, sentences) {
    this.elements = elements;
    this.state = createQuizState(sentences);
    this.autoNextTimeoutId = null;
  }

  setSentences(sentences) {
    this.clearPendingAutoNext();
    resetQuizState(this.state, sentences);
    hideResult(this.elements);
    this.applyFilter();
  }

  bindEvents() {
    this.elements.checkBtn.addEventListener("click", () => this.checkAnswer());
    this.elements.showAnswerBtn.addEventListener("click", () => this.revealAnswer());
    this.elements.prevBtn.addEventListener("click", () => {this.prevQuestion();});
    this.elements.nextBtn.addEventListener("click", () => this.nextQuestion());
    this.elements.resetStatsBtn.addEventListener("click", () => this.resetStats());

    this.elements.modeEl.addEventListener("change", () => this.applyFilter());
    this.elements.countFilterEl.addEventListener("change", () => this.applyFilter());
    this.elements.showCategoryEl.addEventListener("change", () => this.renderQuestion());

    this.elements.answerInputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.checkAnswer();
      }
    });
  }

  applyFilter() {
    this.clearPendingAutoNext();
    applyFilterToState(this.state, this.elements.countFilterEl.value);
    this.pickQuestion(false);
    updateStats(this.elements, this.state);
  }

  pickQuestion(saveHistory = true) {
    this.clearPendingAutoNext();

    if (this.state.filteredSentences.length === 0) return;

    if (saveHistory && this.state.currentQuestion) {
      pushHistory(this.state, this.captureCurrentState());
    }

    if (saveHistory) {
      clearFuture(this.state);
    }

    pickNextQuestion(this.state, this.elements.modeEl.value);
    this.renderQuestion();
    updateStats(this.elements, this.state);
  }

  prevQuestion() {
    this.clearPendingAutoNext();

    if (this.state.history.length === 0) return;

    pushFuture(this.state, this.captureCurrentState());
    const prevState = popHistory(this.state);
    this.restoreState(prevState);
  }

  nextQuestion() {
    this.clearPendingAutoNext();

    if (this.state.future.length > 0 && this.state.currentQuestion) {
      pushHistory(this.state, this.captureCurrentState());
      const nextState = popFuture(this.state);
      this.restoreState(nextState);
      return;
    }

    this.pickQuestion();
  }

  clearPendingAutoNext() {
    if (this.autoNextTimeoutId) {
      clearTimeout(this.autoNextTimeoutId);
      this.autoNextTimeoutId = null;
    }
  }

  updateScore(nextResult) {
    updateScore(this.state, nextResult);
  }

  captureCurrentState() {
    return createSnapshot(this.state, captureViewState(this.elements));
  }

  restoreState(state) {
    restoreSnapshot(this.state, state);
    this.renderQuestion(false);
    restoreViewState(this.elements, state.viewState);
    updateStats(this.elements, this.state);
  }

  renderQuestion(resetView = true) {
    renderQuestion(this.elements, this.state, {
      resetView,
      showCategory: this.elements.showCategoryEl.checked,
    });
  }

  showResult(type, title, bodyHtml) {
    showResult(this.elements, type, title, bodyHtml);
  }

  hideResult() {
    hideResult(this.elements);
  }

  checkAnswer() {
    if (!this.state.currentQuestion) return;

    clearFuture(this.state);

    const userAnswer = this.elements.answerInputEl.value.trim();

    if (!userAnswer) {
      this.showResult(
        "wrong",
        "입력된 답이 없습니다",
        "문장을 입력하세요."
      );
      return;
    }

    const comparison = getAnswerComparison(
      userAnswer,
      this.state.currentQuestion.english
    );

    if (comparison.isMatch) {
      this.updateScore("correct");
      updateStats(this.elements, this.state);

      this.showResult(
        "correct",
        "정답입니다!",
        `<div>아주 좋아요. 문장을 정확하게 입력했습니다.</div>
         <div class="answer-box">${this.state.currentQuestion.english}</div>`
      );

      if (this.elements.autoNextEl.checked) {
        this.clearPendingAutoNext();
        this.autoNextTimeoutId = setTimeout(() => {
          this.autoNextTimeoutId = null;
          this.pickQuestion();
        }, 700);
      }

      return;
    }

    this.updateScore("wrong");
    updateStats(this.elements, this.state);

    this.showResult(
      "wrong",
      "오답입니다",
      `<div>핵심 단어 또는 문장 순서가 정답과 다릅니다.</div>
       <div class="sub">대소문자, 공백, apostrophe, 따옴표, 기본 문장부호 차이는 자동으로 보정됩니다.</div>
       <div class="sub"><strong>내 답안</strong><br>${escapeHtml(userAnswer)}</div>
       <div class="answer-box"><strong>정답</strong><br>${this.state.currentQuestion.english}</div>`
    );
  }

  revealAnswer() {
    if (!this.state.currentQuestion) return;

    clearFuture(this.state);

    this.showResult(
      "wrong",
      "정답 보기",
      `<div class="answer-box">${this.state.currentQuestion.english}</div>`
    );
  }

  resetStats() {
    this.clearPendingAutoNext();
    this.state.correctCount = 0;
    this.state.wrongCount = 0;
    this.state.currentQuestionResult = null;
    clearFuture(this.state);

    this.hideResult();
    updateStats(this.elements, this.state);
    this.elements.answerInputEl.focus();
  }
}
