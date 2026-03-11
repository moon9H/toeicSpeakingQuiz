# 🚀 TOEIC Speaking Sentence Quiz

<p align="center">
토익 스피킹 만능 문장을  
<strong>한글 → 영어로 직접 타이핑하며 암기하는 학습 웹앱</strong>
</p>

<p align="center">
<img src="https://img.shields.io/badge/HTML-5-orange">
<img src="https://img.shields.io/badge/CSS-3-blue">
<img src="https://img.shields.io/badge/JavaScript-ES6-yellow">
<img src="https://img.shields.io/badge/Data-JSON-green">
</p>

---

# 🖥 Preview

| 문제 화면 | 정답 화면 | 오답 화면 |
|----------|----------|----------|
| ![](docs/img/preview.png) | ![](docs/img/correct.png) | ![](docs/img/wrong.png) |

---

# 🧠 About Project

토익 스피킹 공부를 하다 보면 **만능 문장 50개**를 외워야 하는 경우가 많습니다.

하지만 단순히 읽는 방식은 기억에 오래 남지 않기 때문에

> **한글 뜻을 보고 영어 문장을 직접 타이핑하는 방식**

으로 학습할 수 있는 웹앱을 만들었습니다.

이 프로젝트는 **능동적인 암기 학습**을 목표로 합니다.

---

# ✨ Demo

📌 한글 뜻을 보고 영어 문장을 입력

```
이 것은 나의 스트레스를 풀어 준다.
나는 요즘 스트레스를 많이 받았다.
그래서 이것이 필요하다.
```

사용자가 입력

```
It relieves my stress. I'm stressed out these days. So, I need this.
```

결과

```
✔ 정답
```

또는

```
❌ 오답
정답: It relieves my stress...
```

---

# 🎯 Features

### 📘 한글 기반 학습
- 영어 문장을 바로 보여주지 않음
- 한글 뜻을 보고 직접 타이핑

### ⚡ 즉시 채점
다음 요소 자동 보정

- 대소문자
- 공백
- 문장부호

### 🎲 문제 출제 방식

- 랜덤 출제
- 순차 출제

### 📚 범위 학습

- 전체 50문장
- 1~10
- 11~20
- 21~30
- 31~40
- 41~50

### 📊 학습 통계

실시간 표시

- 현재 문제 번호
- 정답 수
- 오답 수
- 정확도

---

# 🛠 Tech Stack

| 기술 | 설명 |
|-----|-----|
| HTML | 페이지 구조 |
| CSS | UI 스타일 |
| JavaScript | 퀴즈 로직 |
| JSON | 문장 데이터 관리 |

---

# 📂 Project Structure

```
toeic-speaking-quiz
│
├── index.html
│
├── css
│   ├── reset.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
│
├── js
│   ├── app.js
│   ├── quiz.js
│   ├── dom.js
│   └── utils.js
│
└── data
    └── sentences.json
```

---

# ⚙️ How to Run

JSON 데이터를 `fetch()`로 읽기 때문에  
**로컬 서버 환경에서 실행해야 합니다**

### 방법 1️⃣ VSCode Live Server

```
index.html 우클릭
→ Open with Live Server
```

### 방법 2️⃣ Python 서버

```
python -m http.server 5500
```

브라우저 접속

```
http://localhost:5500
```

---

# 🧩 Core Logic

퀴즈 동작 구조

```
sentences.json
        ↓
app.js (데이터 로드)
        ↓
QuizApp 생성
        ↓
문제 출제
        ↓
사용자 입력
        ↓
정답 비교
        ↓
통계 업데이트
```

---

# 🎯 Motivation

토익 스피킹 학습에서 중요한 것은

> **문장을 읽는 것보다 직접 만들어 보는 것**

이 프로젝트는  
**능동적인 문장 암기 훈련을 위해 제작되었습니다.**

---

# 👨‍💻 Author

**Moongyu Hwang**

- GitHub: https://github.com/moon9H
- Email: moongye2202@knu.ac.kr
