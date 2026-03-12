export function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/'/g, "")
    .replace(/"/g, "")
    .replace(/[.,!?;:()\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function getAnswerComparison(userAnswer, answer) {
  const normalizedUser = normalizeText(userAnswer);
  const normalizedAnswer = normalizeText(answer);

  return {
    normalizedUser,
    normalizedAnswer,
    isMatch: normalizedUser === normalizedAnswer,
  };
}
