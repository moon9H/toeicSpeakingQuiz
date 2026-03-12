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
