export function getPartConfigs(elements) {
  return {
    part2: {
      button: elements.part2Btn,
      path: "./data/sentences_part2.json",
    },
    part3: {
      button: elements.part3Btn,
      path: "./data/sentences_part3.json",
    },
    part4: {
      button: elements.part4Btn,
      path: "./data/sentences_part4.json",
    },
    part5: {
      button: elements.part5Btn,
      path: "./data/sentences_part5.json",
    },
  };
}

export async function loadPartDatasets(partConfigs, onPartReady, onPartUnavailable) {
  const datasets = {};

  for (const [part, config] of Object.entries(partConfigs)) {
    try {
      const data = await loadJson(config.path);
      datasets[part] = normalizeDataset(data);
      onPartReady(part, config, datasets[part]);
    } catch (error) {
      datasets[part] = null;
      onPartUnavailable(part, config, error);
    }
  }

  return datasets;
}

export function getDefaultPart(datasets, preferredPart = "part3") {
  if (datasets[preferredPart]) {
    return preferredPart;
  }

  return Object.keys(datasets).find((part) => datasets[part]);
}

async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`${path} 데이터를 불러오지 못했습니다.`);
  }

  return response.json();
}

function normalizeDataset(sentences) {
  return sentences.map((item, index) => ({
    ...item,
    no: index + 1,
  }));
}
