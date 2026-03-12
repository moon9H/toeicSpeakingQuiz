const STORAGE_KEY = "toeic-speaking-quiz:learning-session";

export function loadLearningSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("학습 기록을 불러오지 못했습니다.", error);
    return null;
  }
}

export function saveLearningSession(session) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("학습 기록을 저장하지 못했습니다.", error);
  }
}
