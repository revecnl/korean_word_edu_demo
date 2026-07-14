const programCards = [
  {
    id: "cart-game",
    title: "장바구니 게임",
    englishTitle: "Shopping Cart Practice",
    description:
      "상품을 직접 장바구니에 담으며 물건 이름, 수량, 단위 명사와 가격 표현을 단계별로 연습합니다.",
    englishDescription:
      "Add products to the cart and practice Korean vocabulary, quantities, counters, and price expressions step by step.",
    tags: ["물건", "수량·단위 명사", "가격", "말하기"],
    level: "초급",
    preview: "./assets/preview/cart-game.png",
    previewAlt: "장바구니 게임 데모 화면",
    href: "./cart-game.html"
  },
  {
    id: "calendar-game",
    title: "날짜와 요일 연습",
    englishTitle: "Calendar Speaking Practice",
    description:
      "달력에서 날짜와 일정을 선택하고, 날짜·요일·일정 정보를 활용해 완전한 한국어 문장으로 말합니다.",
    englishDescription:
      "Select dates and schedules on the calendar, then practice speaking in complete Korean sentences using date, day, and schedule information.",
    tags: ["날짜", "요일", "일정", "질문·대답"],
    level: "초급",
    preview: "./assets/preview/calendar-game.png",
    previewAlt: "날짜와 요일 연습 데모 화면",
    href: "./calendar-game.html"
  }
];

function createTag(text) {
  const tag = document.createElement("span");
  tag.className = "program-tag";
  tag.textContent = text;
  return tag;
}

function createProgramCard(program, index) {
  const article = document.createElement("article");
  article.className = "program-card";

  const previewLink = document.createElement("a");
  previewLink.className = "preview-link";
  previewLink.href = program.href;
  previewLink.setAttribute("aria-label", `${program.title} 데모 체험하기`);

  const image = document.createElement("img");
  image.className = "program-preview";
  image.src = program.preview;
  image.alt = program.previewAlt;
  image.loading = index === 0 ? "eager" : "lazy";
  previewLink.appendChild(image);

  const body = document.createElement("div");
  body.className = "program-body";

  const meta = document.createElement("div");
  meta.className = "program-meta";
  meta.innerHTML = `<span class="status-dot">● 데모 공개</span><span>${program.level}</span>`;

  const title = document.createElement("h3");
  title.textContent = program.title;

  const englishTitle = document.createElement("p");
  englishTitle.className = "english-title";
  englishTitle.textContent = program.englishTitle;

  const description = document.createElement("p");
  description.className = "program-description";
  description.textContent = program.description;

  const englishDescription = document.createElement("p");
  englishDescription.className = "program-description-en";
  englishDescription.lang = "en";
  englishDescription.textContent = program.englishDescription;

  const tags = document.createElement("div");
  tags.className = "program-tags";
  program.tags.forEach((tag) => tags.appendChild(createTag(tag)));

  const footer = document.createElement("div");
  footer.className = "program-footer";

  const link = document.createElement("a");
  link.className = "demo-button";
  link.href = program.href;
  link.innerHTML = "데모 체험하기 <span aria-hidden=\"true\">→</span>";
  footer.appendChild(link);

  body.append(meta, title, englishTitle, description, englishDescription, tags, footer);
  article.append(previewLink, body);
  return article;
}

function renderPrograms() {
  const grid = document.getElementById("programGrid");
  const count = document.getElementById("demoCount");

  if (!grid || !count) {
    console.error("데모 목록을 표시할 요소를 찾을 수 없습니다.");
    return;
  }

  grid.replaceChildren(...programCards.map(createProgramCard));
  count.textContent = String(programCards.length);
}

document.addEventListener("DOMContentLoaded", renderPrograms);
