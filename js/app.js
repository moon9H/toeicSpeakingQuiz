
import { QuizApp } from "./quiz.js";
import { getElements } from "./dom.js";

async function loadSentences() {

  const response = await fetch("./data/sentences.json");

  if (!response.ok) {
    throw new Error("문장 데이터를 불러오지 못했습니다.");
  }

  return response.json();
}

async function init() {

  const elements = getElements();

  try {

    const sentences = await loadSentences();

    const app = new QuizApp(elements, sentences);

    app.bindEvents();
    app.applyFilter();

  } catch (error) {

    console.error(error);

    elements.questionTitleEl.textContent = "오류";
    elements.meaningEl.textContent = "문장 데이터를 불러오지 못했습니다.";

  }

}

init();