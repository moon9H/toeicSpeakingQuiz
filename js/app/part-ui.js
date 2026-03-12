import { buildRangeOptions } from "../utils/range-utils.js";

const PART_IDS = ["part2", "part3", "part4", "part5"];

export function setActivePartButton(elements, activePart) {
  PART_IDS.forEach((part) => {
    const button = elements[`${part}Btn`];
    if (button) {
      button.classList.toggle("active", !button.disabled && part === activePart);
    }
  });
}

export function setPartButtonState(button, { isReady, title }) {
  if (!button) return;

  button.disabled = !isReady;
  button.classList.toggle("is-coming-soon", !isReady);
  button.dataset.status = isReady ? "" : "준비 중";
  button.title = title;
  button.setAttribute("aria-disabled", String(!isReady));
}

export function renderCountFilterOptions(elements, totalCount) {
  const options = buildRangeOptions(totalCount);

  elements.countFilterEl.innerHTML = options
    .map(
      (option) => `<option value="${option.value}">${option.label}</option>`
    )
    .join("");

  elements.countFilterEl.value = "all";
}

export function syncReviewControls(
  elements,
  totalCount,
  reviewMode,
  wrongCount,
  standardSelections = {
    mode: elements.modeEl.value,
    countFilter: elements.countFilterEl.value,
  }
) {
  const wrongOption = Array.from(elements.reviewModeEl.options).find(
    (option) => option.value === "wrong"
  );

  if (wrongOption) {
    wrongOption.textContent = `오답만 다시 보기 (${wrongCount}문제)`;
  }

  if (reviewMode === "wrong") {
    elements.modeEl.value = "random";
    elements.modeEl.disabled = true;
    elements.countFilterEl.disabled = true;
    elements.countFilterEl.innerHTML =
      `<option value="all">누적 오답 ${wrongCount}문제</option>`;
    elements.countFilterEl.value = "all";
    return;
  }

  elements.modeEl.disabled = false;
  elements.countFilterEl.disabled = false;
  elements.modeEl.value = standardSelections.mode;
  renderCountFilterOptions(elements, totalCount);
  const hasSelectedFilter = Array.from(elements.countFilterEl.options).some(
    (option) => option.value === standardSelections.countFilter
  );
  elements.countFilterEl.value = hasSelectedFilter
    ? standardSelections.countFilter
    : "all";
}
