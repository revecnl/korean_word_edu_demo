(() => {
  const YEAR = 2026;
  const STORAGE_KEY = "koreanCalendarNotes2026.v1";

  const state = {
    currentMonth: 5,
    selectedKey: "2026-06-02",
    level: 1,
    teacherMode: false,
    showReading: true,
    showMemo: true,
    showAnswer: true,
    notes: loadNotes(),
    quizAnswer: "",
    editingKey: null,
  };

  const WEEKDAYS = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const WEEKDAY_SHORT = ["일", "월", "화", "수", "목", "금", "토"];
  const MONTH_READINGS = [
    "일월", "이월", "삼월", "사월", "오월", "유월",
    "칠월", "팔월", "구월", "시월", "십일월", "십이월"
  ];

  const LEVEL_INFO = {
    1: {
      kicker: "Level 1",
      title: "날짜와 요일",
      description: "날짜를 클릭하고 몇 월 며칠인지, 무슨 요일인지 말해 보세요.",
    },
    2: {
      kicker: "Level 2",
      title: "날짜와 일정",
      description: "교사가 넣은 메모를 보고 날짜와 일정을 함께 말해 보세요.",
    },
    3: {
      kicker: "Level 3",
      title: "일정 찾기",
      description: "달력에서 정보를 찾아 ‘언제’, ‘무슨 요일에’, ‘뭐 해요?’에 대답해 보세요.",
    },
  };

  const SAMPLE_NOTES = {
    "2026-06-05": { shortMemo: "학교", memo: "학교에 가요", icon: "🏫" },
    "2026-06-10": { shortMemo: "병원", memo: "병원에 가요", icon: "🏥" },
    "2026-06-13": { shortMemo: "친구", memo: "친구를 만나요", icon: "👥" },
    "2026-06-20": { shortMemo: "영화", memo: "영화를 봐요", icon: "🎬" },
    "2026-06-24": { shortMemo: "수업", memo: "한국어를 공부해요", icon: "📚" },
  };

  const el = {
    body: document.body,
    calendarGrid: document.getElementById("calendarGrid"),
    monthLabel: document.getElementById("monthLabel"),
    monthReading: document.getElementById("monthReading"),
    prevMonthBtn: document.getElementById("prevMonthBtn"),
    nextMonthBtn: document.getElementById("nextMonthBtn"),
    studentModeBtn: document.getElementById("studentModeBtn"),
    teacherModeBtn: document.getElementById("teacherModeBtn"),
    showReadingToggle: document.getElementById("showReadingToggle"),
    showMemoToggle: document.getElementById("showMemoToggle"),
    showAnswerToggle: document.getElementById("showAnswerToggle"),
    levelButtons: document.querySelectorAll(".level-btn"),
    levelKicker: document.getElementById("levelKicker"),
    levelTitle: document.getElementById("levelTitle"),
    levelDescription: document.getElementById("levelDescription"),
    selectedDateLabel: document.getElementById("selectedDateLabel"),
    selectedDateReading: document.getElementById("selectedDateReading"),
    selectedNoteView: document.getElementById("selectedNoteView"),
    sentenceCard: document.getElementById("sentenceCard"),
    sentenceList: document.getElementById("sentenceList"),
    randomQuizBtn: document.getElementById("randomQuizBtn"),
    quizBox: document.getElementById("quizBox"),
    showQuizAnswerBtn: document.getElementById("showQuizAnswerBtn"),
    quizAnswer: document.getElementById("quizAnswer"),
    loadSampleBtn: document.getElementById("loadSampleBtn"),
    clearNotesBtn: document.getElementById("clearNotesBtn"),
    exportBtn: document.getElementById("exportBtn"),
    importInput: document.getElementById("importInput"),
    noteDialog: document.getElementById("noteDialog"),
    noteForm: document.getElementById("noteForm"),
    dialogDateLabel: document.getElementById("dialogDateLabel"),
    shortMemoInput: document.getElementById("shortMemoInput"),
    memoInput: document.getElementById("memoInput"),
    iconInput: document.getElementById("iconInput"),
    closeDialogBtn: document.getElementById("closeDialogBtn"),
    cancelDialogBtn: document.getElementById("cancelDialogBtn"),
    deleteNoteBtn: document.getElementById("deleteNoteBtn"),
  };

  init();

  function init() {
    bindEvents();
    renderAll();
  }

  function bindEvents() {
    el.prevMonthBtn.addEventListener("click", () => changeMonth(-1));
    el.nextMonthBtn.addEventListener("click", () => changeMonth(1));

    el.studentModeBtn.addEventListener("click", () => setTeacherMode(false));
    el.teacherModeBtn.addEventListener("click", () => setTeacherMode(true));

    el.showReadingToggle.addEventListener("change", (event) => {
      state.showReading = event.target.checked;
      renderAll();
    });

    el.showMemoToggle.addEventListener("change", (event) => {
      state.showMemo = event.target.checked;
      renderAll();
    });

    el.showAnswerToggle.addEventListener("change", (event) => {
      state.showAnswer = event.target.checked;
      renderSidePanel();
    });

    el.levelButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.level = Number(button.dataset.level);
        state.quizAnswer = "";
        renderAll();
      });
    });

    el.randomQuizBtn.addEventListener("click", createRandomQuiz);
    el.showQuizAnswerBtn.addEventListener("click", showQuizAnswer);
    el.loadSampleBtn.addEventListener("click", loadSampleNotes);
    el.clearNotesBtn.addEventListener("click", clearNotes);
    el.exportBtn.addEventListener("click", exportNotes);
    el.importInput.addEventListener("change", importNotes);

    el.noteForm.addEventListener("submit", saveNoteFromDialog);
    el.closeDialogBtn.addEventListener("click", closeDialog);
    el.cancelDialogBtn.addEventListener("click", closeDialog);
    el.deleteNoteBtn.addEventListener("click", deleteNoteFromDialog);
  }

  function changeMonth(delta) {
    const nextMonth = state.currentMonth + delta;
    if (nextMonth < 0 || nextMonth > 11) return;
    state.currentMonth = nextMonth;
    const selected = parseDateKey(state.selectedKey);
    if (selected.month !== state.currentMonth) {
      state.selectedKey = dateKey(YEAR, state.currentMonth, 1);
    }
    renderAll();
  }

  function setTeacherMode(value) {
    state.teacherMode = value;
    renderAll();
  }

  function renderAll() {
    renderLevelTabs();
    renderToolbar();
    renderCalendar();
    renderSidePanel();
  }

  function renderLevelTabs() {
    el.levelButtons.forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.level) === state.level);
    });

    const info = LEVEL_INFO[state.level];
    el.levelKicker.textContent = info.kicker;
    el.levelTitle.textContent = info.title;
    el.levelDescription.textContent = info.description;
  }

  function renderToolbar() {
    el.monthLabel.textContent = `${YEAR}년 ${state.currentMonth + 1}월`;
    el.monthReading.textContent = MONTH_READINGS[state.currentMonth];
    el.prevMonthBtn.disabled = state.currentMonth === 0;
    el.nextMonthBtn.disabled = state.currentMonth === 11;

    el.studentModeBtn.classList.toggle("active", !state.teacherMode);
    el.teacherModeBtn.classList.toggle("active", state.teacherMode);
    document.body.classList.toggle("teacher-mode", state.teacherMode);

    el.showReadingToggle.checked = state.showReading;
    el.showMemoToggle.checked = state.showMemo;
    el.showAnswerToggle.checked = state.showAnswer;
  }

  function renderCalendar() {
    el.calendarGrid.innerHTML = "";

    const firstDay = new Date(YEAR, state.currentMonth, 1).getDay();
    const daysInMonth = new Date(YEAR, state.currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i += 1) {
      const empty = document.createElement("div");
      empty.className = "day-cell empty";
      el.calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = dateKey(YEAR, state.currentMonth, day);
      const note = state.notes[key];
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "day-cell";
      cell.dataset.key = key;
      cell.classList.toggle("selected", key === state.selectedKey);
      cell.classList.toggle("has-note", Boolean(note));
      cell.classList.toggle("today", isTodayKey(key));

      const noteLabel = note ? makeNoteChip(note) : "";
      cell.innerHTML = `
        <span class="day-top">
          <span class="day-number">${day}</span>
          <span class="day-reading-small">${state.showReading ? `${sinoNumber(day)}일` : ""}</span>
        </span>
        ${state.showMemo ? noteLabel : makeIconOnlyChip(note)}
      `;

      cell.addEventListener("click", () => {
        state.selectedKey = key;
        if (state.teacherMode) {
          openNoteDialog(key);
        } else {
          renderAll();
        }
      });

      el.calendarGrid.appendChild(cell);
    }
  }

  function makeNoteChip(note) {
    if (!note) return "";
    const icon = escapeHtml(note.icon || "");
    const text = escapeHtml(note.shortMemo || note.memo || "일정");
    return `<span class="note-chip"><span>${icon}</span><span>${text}</span></span>`;
  }

  function makeIconOnlyChip(note) {
    if (!note || !note.icon) return "";
    return `<span class="note-chip icon-only">${escapeHtml(note.icon)}</span>`;
  }

  function renderSidePanel() {
    const selected = getSelectedInfo();
    const note = state.notes[state.selectedKey];

    if (!selected) {
      el.selectedDateLabel.textContent = "날짜를 선택하세요";
      el.selectedDateReading.textContent = "";
      el.selectedNoteView.textContent = "";
      el.sentenceList.innerHTML = "";
      return;
    }

    el.selectedDateLabel.textContent = `${YEAR}년 ${selected.month + 1}월 ${selected.day}일 ${selected.weekday}`;
    el.selectedDateReading.textContent = `${MONTH_READINGS[selected.month]} ${sinoNumber(selected.day)}일 ${selected.weekday}`;

    if (note) {
      el.selectedNoteView.textContent = `${note.icon ? `${note.icon} ` : ""}${note.memo}`;
    } else if (state.level > 1) {
      el.selectedNoteView.textContent = state.teacherMode ? "이 날짜에 일정을 입력할 수 있어요." : "일정이 없는 날짜예요.";
    } else {
      el.selectedNoteView.textContent = "";
    }

    renderSentences(selected, note);
  }

  function renderSentences(selected, note) {
    el.sentenceCard.classList.toggle("hidden-by-toggle", !state.showAnswer);

    if (!state.showAnswer) {
      el.sentenceList.innerHTML = `<div class="sentence-item muted">문장 보기가 꺼져 있어요.</div>`;
      return;
    }

    const monthDay = `${selected.month + 1}월 ${selected.day}일`;
    const fullDate = `${monthDay} ${selected.weekday}`;
    const sentences = [];

    if (state.level === 1) {
      sentences.push(`${monthDay}이에요.`);
      sentences.push(`${selected.weekday}이에요.`);
      sentences.push(`${monthDay}은/는 ${selected.weekday}이에요.`);
    }

    if (state.level === 2) {
      if (note) {
        sentences.push(`${monthDay}에 ${note.memo}.`);
        sentences.push(`${fullDate}에 ${note.memo}.`);
      } else {
        sentences.push("일정이 없어요.");
        sentences.push("교사 편집 모드에서 일정을 넣어 보세요.");
      }
    }

    if (state.level === 3) {
      if (note) {
        sentences.push(`언제 ${normalizeQuestionMemo(note)}?`);
        sentences.push(`${fullDate}에 ${note.memo}.`);
        sentences.push(`${selected.weekday}에 ${note.memo}.`);
      } else {
        sentences.push("달력에서 일정이 있는 날짜를 찾아보세요.");
      }
    }

    el.sentenceList.innerHTML = sentences
      .map((sentence) => `<div class="sentence-item">${escapeHtml(sentence)}</div>`)
      .join("");
  }

  function createRandomQuiz() {
    const quiz = makeQuizForLevel();
    state.quizAnswer = quiz.answer;

    el.quizBox.innerHTML = `
      <p class="quiz-question">${escapeHtml(quiz.question)}</p>
      <p class="quiz-hint">${escapeHtml(quiz.hint)}</p>
    `;
    el.quizAnswer.textContent = "";
    el.quizAnswer.classList.add("hidden");
    el.showQuizAnswerBtn.classList.remove("hidden");

    if (quiz.key) {
      const parsed = parseDateKey(quiz.key);
      state.currentMonth = parsed.month;
      state.selectedKey = quiz.key;
      renderAllExceptQuiz();
    }
  }

  function renderAllExceptQuiz() {
    renderLevelTabs();
    renderToolbar();
    renderCalendar();
    renderSidePanel();
  }

  function showQuizAnswer() {
    if (!state.quizAnswer) return;
    el.quizAnswer.textContent = state.quizAnswer;
    el.quizAnswer.classList.remove("hidden");
  }

  function makeQuizForLevel() {
    if (state.level === 1) {
      const random = randomDateInYear();
      const info = getDateInfo(random);
      const monthDay = `${info.month + 1}월 ${info.day}일`;
      const templates = [
        {
          question: `${monthDay}은/는 무슨 요일이에요?`,
          answer: `${monthDay}은/는 ${info.weekday}이에요.`,
          hint: "달력에서 날짜를 찾고 요일을 말해 보세요.",
        },
        {
          question: `${info.weekday}을/를 하나 찾아보세요. 선택된 날짜는 몇 월 며칠이에요?`,
          answer: `${monthDay}이에요. ${info.weekday}이에요.`,
          hint: "요일 줄을 보고 같은 칸을 찾아보세요.",
        },
      ];
      return { ...pick(templates), key: random };
    }

    const noteEntries = getNoteEntries();
    if (noteEntries.length === 0) {
      return {
        question: "아직 일정이 없어요.",
        answer: "교사 편집 모드에서 날짜를 클릭하고 일정을 먼저 넣어 주세요.",
        hint: "샘플 일정을 눌러 바로 테스트할 수도 있어요.",
        key: null,
      };
    }

    const entry = pick(noteEntries);
    const info = getDateInfo(entry.key);
    const monthDay = `${info.month + 1}월 ${info.day}일`;
    const fullDate = `${monthDay} ${info.weekday}`;

    if (state.level === 2) {
      const templates = [
        {
          question: `${fullDate}에 뭐 해요?`,
          answer: `${fullDate}에 ${entry.note.memo}.`,
          hint: "날짜 칸의 메모를 보고 문장으로 말해 보세요.",
        },
        {
          question: `${monthDay}은/는 무슨 요일이에요? 그리고 뭐 해요?`,
          answer: `${monthDay}은/는 ${info.weekday}이에요. ${entry.note.memo}.`,
          hint: "요일과 일정을 나누어 말해도 좋아요.",
        },
      ];
      return { ...pick(templates), key: entry.key };
    }

    const sameWeekdayNotes = noteEntries.filter((item) => getDateInfo(item.key).weekday === info.weekday);
    const useWeekdayQuestion = sameWeekdayNotes.length >= 1 && Math.random() < 0.35;

    if (useWeekdayQuestion) {
      const answers = sameWeekdayNotes.map((item) => {
        const itemInfo = getDateInfo(item.key);
        return `${itemInfo.month + 1}월 ${itemInfo.day}일 ${itemInfo.weekday}에 ${item.note.memo}.`;
      });
      return {
        question: `${info.weekday}에 뭐 해요?`,
        answer: answers.join(" / "),
        hint: "같은 요일의 일정들을 찾아 말해 보세요.",
        key: entry.key,
      };
    }

    return {
      question: `언제 ${normalizeQuestionMemo(entry.note)}?`,
      answer: `${fullDate}에 ${entry.note.memo}.`,
      hint: "달력에서 그 일정을 찾고 날짜와 요일까지 말해 보세요.",
      key: entry.key,
    };
  }

  function openNoteDialog(key) {
    state.editingKey = key;
    const info = getDateInfo(key);
    const note = state.notes[key] || {};

    el.dialogDateLabel.textContent = `${YEAR}년 ${info.month + 1}월 ${info.day}일 ${info.weekday}`;
    el.shortMemoInput.value = note.shortMemo || "";
    el.memoInput.value = note.memo || "";
    el.iconInput.value = note.icon || "";

    el.noteDialog.showModal();
  }

  function closeDialog() {
    state.editingKey = null;
    el.noteDialog.close();
  }

  function saveNoteFromDialog(event) {
    event.preventDefault();
    if (!state.editingKey) return;

    const memo = el.memoInput.value.trim();
    const shortMemo = el.shortMemoInput.value.trim();
    const icon = el.iconInput.value;

    if (!memo && !shortMemo && !icon) {
      delete state.notes[state.editingKey];
    } else {
      state.notes[state.editingKey] = {
        shortMemo: shortMemo || memo.slice(0, 8) || "일정",
        memo: memo || shortMemo,
        icon,
      };
    }

    saveNotes();
    closeDialog();
    renderAll();
  }

  function deleteNoteFromDialog() {
    if (!state.editingKey) return;
    delete state.notes[state.editingKey];
    saveNotes();
    closeDialog();
    renderAll();
  }

  function loadSampleNotes() {
    state.notes = { ...state.notes, ...SAMPLE_NOTES };
    saveNotes();
    state.currentMonth = 5;
    state.selectedKey = "2026-06-05";
    renderAll();
  }

  function clearNotes() {
    const ok = window.confirm("저장된 일정을 모두 삭제할까요?");
    if (!ok) return;
    state.notes = {};
    saveNotes();
    renderAll();
  }

  function exportNotes() {
    const payload = JSON.stringify(state.notes, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "korean-calendar-notes-2026.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function importNotes(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        state.notes = sanitizeImportedNotes(parsed);
        saveNotes();
        renderAll();
      } catch (error) {
        window.alert("JSON 파일을 읽을 수 없어요.");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  function sanitizeImportedNotes(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};

    const clean = {};
    Object.entries(value).forEach(([key, note]) => {
      if (!/^2026-\d{2}-\d{2}$/.test(key)) return;
      const info = parseDateKey(key);
      if (info.year !== 2026 || info.month < 0 || info.month > 11) return;
      if (!note || typeof note !== "object") return;

      clean[key] = {
        shortMemo: String(note.shortMemo || "").slice(0, 12),
        memo: String(note.memo || note.shortMemo || "일정").slice(0, 40),
        icon: String(note.icon || "").slice(0, 4),
      };
    });

    return clean;
  }

  function loadNotes() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      return {};
    }
  }

  function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.notes));
  }

  function getSelectedInfo() {
    if (!state.selectedKey) return null;
    return getDateInfo(state.selectedKey);
  }

  function getDateInfo(key) {
    const parsed = parseDateKey(key);
    const date = new Date(parsed.year, parsed.month, parsed.day);
    return {
      ...parsed,
      weekdayIndex: date.getDay(),
      weekday: WEEKDAYS[date.getDay()],
      weekdayShort: WEEKDAY_SHORT[date.getDay()],
    };
  }

  function parseDateKey(key) {
    const [year, month, day] = key.split("-").map(Number);
    return { year, month: month - 1, day };
  }

  function dateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function randomDateInYear() {
    const month = Math.floor(Math.random() * 12);
    const days = new Date(YEAR, month + 1, 0).getDate();
    const day = Math.floor(Math.random() * days) + 1;
    return dateKey(YEAR, month, day);
  }

  function getNoteEntries() {
    return Object.entries(state.notes)
      .filter(([key, note]) => key.startsWith("2026-") && note && note.memo)
      .map(([key, note]) => ({ key, note }));
  }

  function normalizeQuestionMemo(note) {
    const memo = note.memo || note.shortMemo || "일정이 있어요";
    if (memo.endsWith("가요")) return memo;
    if (memo.endsWith("해요")) return memo;
    if (memo.endsWith("봐요")) return memo;
    if (memo.endsWith("만나요")) return memo;
    if (memo.endsWith("있어요")) return memo;
    return `${memo} 해요`;
  }

  function sinoNumber(number) {
    const ones = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
    if (number < 10) return ones[number];
    if (number === 10) return "십";
    if (number < 20) return `십${ones[number - 10]}`;
    const ten = Math.floor(number / 10);
    const one = number % 10;
    return `${ones[ten]}십${ones[one]}`;
  }

  function isTodayKey(key) {
    const today = new Date();
    if (today.getFullYear() !== YEAR) return false;
    return key === dateKey(YEAR, today.getMonth(), today.getDate());
  }

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
