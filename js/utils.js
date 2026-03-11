export function normalizeText(text) {

  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/'/g, "")        // apostrophe 제거
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();

}

export function escapeHtml(text) {

  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;

}

export function getFilterRange(value) {

  if (value === "all") {
    return [1, 50];
  }

  const [start, end] = value.split("-").map(Number);

  return [start, end];

}