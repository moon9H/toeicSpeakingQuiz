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

export function getFilterRange(value, totalCount) {
  if (value === "all") {
    return [1, totalCount];
  }

  const [start, end] = value.split("-").map(Number);
  return [start, end];
}

export function buildRangeOptions(totalCount, step = 10) {
  const options = [
    { value: "all", label: `전체 ${totalCount}문장` }
  ];

  for (let start = 1; start <= totalCount; start += step) {
    const end = Math.min(start + step - 1, totalCount);
    options.push({
      value: `${start}-${end}`,
      label: `${start}~${end}번`
    });
  }

  return options;
}