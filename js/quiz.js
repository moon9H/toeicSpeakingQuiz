import { normalizeText, escapeHtml, getFilterRange } from "./utils.js";

export class QuizApp {
  constructor(elements, sentences) {
    this.elements = elements;
    this.sentences = sentences;

    this.filteredSentences = [...sentences];
    this.randomQueue = [];
    this.history = [];

    this.currentIndex = 0;
    this.currentQuestion = null;
    this.currentQuestionResult = null;

    this.correctCount = 0;
    this.wrongCount = 0;
    this.autoNextTimeoutId = null;
  }

  setSentences(sentences) {
    this.clearPendingAutoNext();
    this.sentences = sentences;
    this.filteredSentences = [...sentences];
    this.currentIndex = 0;
    this.currentQuestion = null;
    this.currentQuestionResult = null;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.randomQueue = [];
    this.history = [];

    this.hideResult();
    this.applyFilter();
  }

  bindEvents() {
    this.elements.checkBtn.addEventListener("click", () => this.checkAnswer());
    this.elements.showAnswerBtn.addEventListener("click", () => this.revealAnswer());
    this.elements.prevBtn.addEventListener("click", () => {this.prevQuestion();});
    this.elements.nextBtn.addEventListener("click", () => this.pickQuestion());
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
    const [start, end] = getFilterRange(
      this.elements.countFilterEl.value,
      this.sentences.length
    );

    this.filteredSentences = this.sentences.filter(
      (item) => item.no >= start && item.no <= end
    );

    this.currentIndex = 0;
    this.randomQueue = [];
    this.history = [];
    this.correctCount = 0;
    this.wrongCount = 0;

    this.pickQuestion(false);
    this.updateStats();
  }

  pickQuestion(saveHistory = true) {
    this.clearPendingAutoNext();

    if (this.filteredSentences.length === 0) return;

    if (saveHistory && this.currentQuestion) {
      this.history.push({
        currentQuestion: this.currentQuestion,
        currentIndex: this.currentIndex,
        randomQueue: [...this.randomQueue]
      });
    }

    if (this.elements.modeEl.value === "random") {
      this.currentQuestion = this.randomPick();
    } else {
      this.currentQuestion = this.sequentialPick();
    }

    this.renderQuestion();
    this.updateStats();
  }

  randomPick() {
    if (this.randomQueue.length === 0) {
      this.randomQueue = this.shuffleArray([...this.filteredSentences]);
    }

    return this.randomQueue.shift();
  }

  sequentialPick() {
    const question =
      this.filteredSentences[this.currentIndex % this.filteredSentences.length];

    this.currentIndex++;
    return question;
  }

  prevQuestion() {
    this.clearPendingAutoNext();

    if (this.history.length === 0) return;

    const prevState = this.history.pop();
    this.currentQuestion = prevState.currentQuestion;
    this.currentIndex = prevState.currentIndex;
    this.randomQueue = [...prevState.randomQueue];

    this.renderQuestion();
    this.updateStats();
  }

  clearPendingAutoNext() {
    if (this.autoNextTimeoutId) {
      clearTimeout(this.autoNextTimeoutId);
      this.autoNextTimeoutId = null;
    }
  }

  updateScore(nextResult) {
    if (this.currentQuestionResult === nextResult) {
      return;
    }

    if (this.currentQuestionResult === "correct") {
      this.correctCount--;
    } else if (this.currentQuestionResult === "wrong") {
      this.wrongCount--;
    }

    if (nextResult === "correct") {
      this.correctCount++;
    } else if (nextResult === "wrong") {
      this.wrongCount++;
    }

    this.currentQuestionResult = nextResult;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  renderQuestion() {
    if (!this.currentQuestion) return;

    this.currentQuestionResult = null;

    const categoryText = this.elements.showCategoryEl.checked
      ? ` ${this.currentQuestion.category}`
      : "";

    this.elements.questionTitleEl.textContent =
      `${this.currentQuestion.no}.${categoryText}`;

    this.elements.meaningEl.textContent = this.currentQuestion.korean;
    this.elements.hintEl.textContent =
      `총 ${this.filteredSentences.length}문장 범위에서 출제 중`;

    this.elements.answerInputEl.value = "";
    this.elements.answerInputEl.focus();

    this.elements.prevBtn.disabled = this.history.length === 0;

    this.hideResult();
  }

  updateStats() {
    const total = this.correctCount + this.wrongCount;
    const accuracy =
      total === 0 ? 0 : Math.round((this.correctCount / total) * 100);

    this.elements.progressPillEl.textContent =
      `현재 ${this.currentQuestion ? this.currentQuestion.no : "-"}번`;

    this.elements.scorePillEl.textContent =
      `정답 ${this.correctCount} · 오답 ${this.wrongCount}`;

    this.elements.accuracyPillEl.textContent =
      `정확도 ${accuracy}%`;
  }

  showResult(type, title, bodyHtml) {
    this.elements.resultBoxEl.className = `result show ${type}`;
    this.elements.resultTitleEl.textContent = title;
    this.elements.resultBodyEl.innerHTML = bodyHtml;
  }

  hideResult() {
    this.elements.resultBoxEl.className = "result";
    this.elements.resultTitleEl.textContent = "";
    this.elements.resultBodyEl.innerHTML = "";
  }

  checkAnswer() {
    if (!this.currentQuestion) return;

    const userAnswer = this.elements.answerInputEl.value.trim();

    if (!userAnswer) {
      this.showResult(
        "wrong",
        "입력된 답이 없습니다",
        "문장을 입력하세요."
      );
      return;
    }

    const normalizedUser = normalizeText(userAnswer);
    const normalizedAnswer = normalizeText(this.currentQuestion.english);

    if (normalizedUser === normalizedAnswer) {
      this.updateScore("correct");
      this.updateStats();

      this.showResult(
        "correct",
        "정답입니다!",
        `<div>아주 좋아요. 문장을 정확하게 입력했습니다.</div>
         <div class="answer-box">${this.currentQuestion.english}</div>`
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
    this.updateStats();

    this.showResult(
      "wrong",
      "오답입니다",
      `<div>입력한 문장과 정답이 다릅니다.</div>
       <div class="sub"><strong>내 답안</strong><br>${escapeHtml(userAnswer)}</div>
       <div class="answer-box"><strong>정답</strong><br>${this.currentQuestion.english}</div>`
    );
  }

  revealAnswer() {
    if (!this.currentQuestion) return;

    this.showResult(
      "wrong",
      "정답 보기",
      `<div class="answer-box">${this.currentQuestion.english}</div>`
    );
  }

  resetStats() {
    this.clearPendingAutoNext();
    this.correctCount = 0;
    this.wrongCount = 0;
    this.currentQuestionResult = null;

    this.hideResult();
    this.updateStats();
    this.elements.answerInputEl.focus();
  }
}
