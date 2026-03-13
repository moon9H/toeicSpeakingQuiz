# TOEIC Speaking Sentence Quiz

<p align="center">
  <a href="https://moon9H.github.io/toeicSpeakingQuiz/">
    <img src="https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2ea44f?style=for-the-badge&logo=githubpages" alt="Live Demo">
  </a>
</p>

<p align="center">
  토익 스피킹 만능 문장을 빠르게 반복 연습할 수 있는 정적 웹 퀴즈입니다.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML-5-orange" alt="HTML 5">
  <img src="https://img.shields.io/badge/CSS-3-blue" alt="CSS 3">
  <img src="https://img.shields.io/badge/JavaScript-ES6-yellow" alt="JavaScript ES6">
  <img src="https://img.shields.io/badge/Data-JSON-green" alt="Data JSON">
  <img src="https://img.shields.io/badge/version-v1.6-brightgreen" alt="version v1.6">
</p>

---

## 🖼️ Preview

| 문제 화면 | 정답 화면 | 오답 화면 |
| --- | --- | --- |
| ![](docs/img/preview.png) | ![](docs/img/correct.png) | ![](docs/img/wrong.png) |

---

## 🔗 Live

- https://moon9H.github.io/toeicSpeakingQuiz/

---

## 📘 About

토익 스피킹을 준비하다 보면 자주 쓰는 만능 문장을 반복해서 익혀야 할 때가 많습니다.

이 프로젝트는

> 한글 뜻을 보고 영어 문장을 직접 입력하는 방식

으로 빠르게 반복 연습할 수 있도록 만든 가벼운 학습 도구입니다.

---

## ✨ Features

### 입력 기반 학습
- 한글 뜻을 보고 영어 문장을 직접 입력
- 영어 문장을 바로 보여주지 않고 회상 중심으로 연습

### 즉시 채점
- 입력 직후 바로 정답 여부 확인
- 대소문자, 따옴표, 문장부호, 여분 공백 차이는 자동 보정

### 출제 방식
- 랜덤 출제
- 순차 출제

### 출제 범위 선택
- 전체 범위 학습
- 10문장 단위 범위 선택

### 학습 상태 저장
- localStorage 기반 학습 상태 저장
- 새로고침 이후에도 Part, 범위, 옵션, 현재 문제 상태 복원

### 오답 다시 보기
- 틀린 문제를 누적 기록
- 오답만 다시 보기 모드 지원

### 진행도 표시
- 현재 범위 기준 진행도 표시
- 진행 프로그레스 바 제공

### Part 전환
- Part 2: 준비 중
- Part 3: 지원
- Part 4: 지원
- Part 5: 지원

### 기타 UX
- 카테고리 표시 on/off
- 정답 시 자동 다음 문제
- Enter로 채점
- Shift + Enter로 줄바꿈
- 이전/다음 문제 이동 및 상태 복원

---

## 🛠️ Tech Stack

| 기술 | 설명 |
| --- | --- |
| HTML | 페이지 구조 |
| CSS | 레이아웃 및 스타일 |
| JavaScript | 퀴즈 로직 |
| JSON | 문장 데이터 관리 |

---

## 📂 Project Structure

```text
toeicSpeakingQuiz
├─ index.html
├─ README.md
├─ css
│  ├─ reset.css
│  ├─ layout.css
│  ├─ components.css
│  └─ responsive.css
├─ data
│  ├─ sentences_part3.json
│  ├─ sentences_part4.json
│  └─ sentences_part5.json
├─ docs
│  └─ img
│     ├─ correct.png
│     ├─ preview.png
│     └─ wrong.png
└─ js
   ├─ app.js
   ├─ dom.js
   ├─ utils.js
   ├─ app
   │  ├─ part-datasets.js
   │  └─ part-ui.js
   ├─ quiz
   │  ├─ quiz.js
   │  ├─ quiz-state.js
   │  ├─ quiz-renderer.js
   │  └─ quiz-persistence.js
   ├─ storage
   │  └─ learning-session.js
   └─ utils
      ├─ answer-utils.js
      └─ range-utils.js
```

---

## 🔄 Core Flow

```text
sentences_partX.json
        ↓
app.js
  - 초기화
  - Part 데이터 로드
  - 저장된 학습 상태 복원
        ↓
QuizApp
  - 문제 출제
  - 정답 비교
  - 이동/복원 처리
        ↓
quiz-state / quiz-renderer / quiz-persistence
  - 상태 관리
  - 화면 반영
  - 세션 직렬화/복원
```

---

## 📦 Version History

<details>
<summary><strong>v1.6</strong></summary>

- Part 4 데이터 추가
- 진행도 프로그레스 바 추가
- QuizApp persistence 책임 분리
- 헤더 및 상단 UI 정리

</details>

<details>
<summary><strong>v1.5</strong></summary>

- localStorage 기반 학습 기록 저장 및 복원
- 오답만 다시 보기 모드 추가
- 상태/렌더링/유틸 로직 분리

</details>

<details>
<summary><strong>v1.4</strong></summary>

- 이전 문제 이동 복원 개선
- 자동 다음 문제 흐름 정리
- Part 준비 상태 표시 개선

</details>

<details>
<summary><strong>v1.3</strong></summary>

- Enter 채점, Shift + Enter 줄바꿈 지원
- Part 2 / Part 4 UI 추가

</details>

<details>
<summary><strong>v1.2</strong></summary>

- 이전 문제 버튼 추가
- 직전 문제 상태 복원 기능 추가

</details>

<details>
<summary><strong>v1.1</strong></summary>

- Part 3 / Part 5 데이터 전환 기능
- Part 선택 버튼 UI 추가

</details>

<details>
<summary><strong>v1.0</strong></summary>

- 초기 릴리즈

</details>

---

## 💡 Motivation

토익 스피킹 학습에서 중요한 것은 문장을 눈으로 읽는 것보다 직접 떠올리고 입력해 보는 것이라고 생각했습니다.

이 프로젝트는 그런 반복 입력 훈련을 더 가볍고 빠르게 하기 위해 시작했습니다.

---

## 👤 Author

**Moongyu Hwang**

- GitHub: https://github.com/moon9H
- Email: moongye2202@knu.ac.kr
