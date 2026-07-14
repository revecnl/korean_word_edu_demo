const IMAGE_BASE_PATH = "./assets/pic/object/";
const CHARACTER_BASE_PATH = "./assets/pic/character/";

const products = [
  {
    id: "apple",
    name: "사과",
    image: "apple.png",
    price: 1000,
    unit: "개"
  },
  {
    id: "bread",
    name: "빵",
    image: "bread.png",
    price: 1250,
    unit: "개"
  },
  {
    id: "milk",
    name: "우유",
    image: "milk.png",
    price: 720,
    unit: "병"
  },
  {
    id: "water",
    name: "물",
    image: "water.png",
    price: 550,
    unit: "병"
  },
  {
    id: "book",
    name: "책",
    image: "book.png",
    price: 800,
    unit: "권"
  },
  {
    id: "bag",
    name: "가방",
    image: "bag.png",
    price: 15000,
    unit: "개"
  },
  {
    id: "pen",
    name: "볼펜",
    image: "pen.png",
    price: 740,
    unit: "자루"
  },
  {
    id: "wallet",
    name: "지갑",
    image: "wallet.png",
    price: 12300,
    unit: "개"
  }
];

const npcs = [
  {
    id: "clerk-male",
    name: "이준호",
    role: "친절한 점원",
    image: "clerk-male.png",
    greetings: [
      "어서 오세요! 필요한 물건을 골라 보세요.",
      "오늘은 무엇을 사요?",
      "장바구니에 물건을 담아 보세요!"
    ],
    emptyMessages: [
      "아직 장바구니가 비어 있어요. 물건을 하나 골라 볼까요?",
      "상품의 + 버튼을 눌러 보세요.",
      "필요한 물건을 장바구니에 담아 주세요."
    ],
    cartMessages: [
      "좋아요! 이렇게 말해 볼까요?",
      "잘했어요. 문장으로 말해 보세요.",
      "장바구니에 담았어요. 같이 읽어 볼까요?"
    ],
    priceMessages: [
      "좋아요! 이제 가격도 같이 말해 볼까요?",
      "총 가격을 확인해 보세요.",
      "물건과 가격을 같이 말해 봅시다."
    ],
    clearMessages: [
      "장바구니를 비웠어요. 다시 골라 볼까요?",
      "초기화했어요. 새로 담아 보세요.",
      "좋아요. 다시 쇼핑을 시작해 볼까요?"
    ],
    levelMessages: {
      1: "레벨 1이에요. 물건 이름을 넣어 말해 보세요.",
      2: "레벨 2예요. 한 개, 두 개, 세 개를 같이 연습해요.",
      3: "레벨 3이에요. 물건의 가격과 총 가격을 같이 말해 보세요."
    }
  },
  {
    id: "clerk-female",
    name: "김수연",
    role: "상냥한 점원",
    image: "clerk-female.png",
    greetings: [
      "안녕하세요! 천천히 둘러보세요.",
      "무엇을 사요? 필요한 물건을 골라 보세요.",
      "어서 오세요! 장바구니에 물건을 담아 보세요."
    ],
    emptyMessages: [
      "아직 담은 물건이 없어요. 하나 골라 볼까요?",
      "왼쪽 상품에서 + 버튼을 눌러 주세요.",
      "먼저 사고 싶은 물건을 선택해 보세요."
    ],
    cartMessages: [
      "좋아요! 이 문장을 말해 보세요.",
      "아주 좋아요. 무엇을 사요?",
      "장바구니에 담았어요. 문장으로 연습해 볼까요?"
    ],
    priceMessages: [
      "좋아요! 모두 얼마예요?",
      "가격도 같이 확인해 볼까요?",
      "총 가격을 한국어로 읽어 봅시다."
    ],
    clearMessages: [
      "장바구니를 비웠어요. 다시 시작해요!",
      "좋아요. 다시 물건을 골라 보세요.",
      "초기화했어요. 이번에는 무엇을 살까요?"
    ],
    levelMessages: {
      1: "레벨 1이에요. ‘사과를 사요’처럼 말해 보세요.",
      2: "레벨 2예요. ‘사과 한 개를 사요’처럼 말해 보세요.",
      3: "레벨 3이에요. ‘모두 얼마예요?’를 같이 연습해요."
    }
  }
];

let cart = [];
let currentNpc = null;
let currentLevel = getSavedLevel();

let productGrid = null;
let cartList = null;
let cartStatus = null;
let answerPreview = null;
let clearCartButton = null;
let levelButtons = [];

let npcImage = null;
let npcName = null;
let npcRole = null;
let npcDialogue = null;

let speechQuestion = null;
let cartTotalBox = null;
let cartTotalNumber = null;
let cartTotalKorean = null;

function getSavedLevel() {
  const savedLevel = Number(localStorage.getItem("cartGameLevel"));

  if ([1, 2, 3].includes(savedLevel)) {
    return savedLevel;
  }

  return 1;
}

function makeImagePath(fileName) {
  return `${IMAGE_BASE_PATH}${fileName}`;
}

function makeCharacterPath(fileName) {
  return `${CHARACTER_BASE_PATH}${fileName}`;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function formatPrice(price) {
  return `${price.toLocaleString("ko-KR")}원`;
}

function convertUnderTenThousandToKorean(number) {
  const koreanNumbers = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  const units = ["", "십", "백", "천"];

  let result = "";
  let remaining = number;

  for (let i = 3; i >= 0; i -= 1) {
    const unitValue = 10 ** i;
    const digit = Math.floor(remaining / unitValue);

    if (digit > 0) {
      const unit = units[i];

      if (digit === 1 && unit !== "") {
        result += unit;
      } else {
        result += `${koreanNumbers[digit]}${unit}`;
      }

      remaining %= unitValue;
    }
  }

  return result;
}

function numberToKorean(number) {
  if (number === 0) {
    return "영";
  }

  const bigUnits = ["", "만", "억"];
  let result = "";
  let remaining = number;
  let unitIndex = 0;

  while (remaining > 0) {
    const chunk = remaining % 10000;

    if (chunk > 0) {
      let chunkText = convertUnderTenThousandToKorean(chunk);

      if (chunk === 1 && unitIndex > 0) {
        chunkText = "";
      }

      result = `${chunkText}${bigUnits[unitIndex]}${result}`;
    }

    remaining = Math.floor(remaining / 10000);
    unitIndex += 1;
  }

  return result;
}

function priceToKorean(price) {
  return `${numberToKorean(price)} 원`;
}

function makePlaceholderImage(name) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">
      <rect width="240" height="180" rx="28" fill="#fff3e4"/>
      <circle cx="120" cy="76" r="34" fill="#f08a5d" opacity="0.82"/>
      <text x="120" y="132" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#5f4634">
        ${name}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function hasFinalConsonant(word) {
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);

  if (code < 0xac00 || code > 0xd7a3) {
    return false;
  }

  return (code - 0xac00) % 28 !== 0;
}

function getObjectParticle(word) {
  return hasFinalConsonant(word) ? "을" : "를";
}

function getNativeNumber(count) {
  const nativeNumbers = {
    1: "한",
    2: "두",
    3: "세",
    4: "네",
    5: "다섯",
    6: "여섯",
    7: "일곱",
    8: "여덟",
    9: "아홉",
    10: "열"
  };

  return nativeNumbers[count] || String(count);
}

function getCountPhrase(count, unit = "개") {
  const countText = getNativeNumber(count);

  if (count <= 10) {
    return `${countText} ${unit}`;
  }

  return `${count} ${unit}`;
}

function getTotalPrice() {
  return cart.reduce((sum, item) => {
    return sum + item.price * item.count;
  }, 0);
}

function cacheDomElements() {
  productGrid = document.getElementById("productGrid");
  cartList = document.getElementById("cartList");
  cartStatus = document.getElementById("cartStatus");
  answerPreview = document.getElementById("answerPreview");
  clearCartButton = document.getElementById("clearCartButton");
  levelButtons = Array.from(document.querySelectorAll(".level-button"));

  npcImage = document.getElementById("npcImage");
  npcName = document.getElementById("npcName");
  npcRole = document.getElementById("npcRole");
  npcDialogue = document.getElementById("npcDialogue");

  speechQuestion = document.getElementById("speechQuestion");
  cartTotalBox = document.getElementById("cartTotalBox");
  cartTotalNumber = document.getElementById("cartTotalNumber");
  cartTotalKorean = document.getElementById("cartTotalKorean");
}

function setLevelVisualState() {
  document.body.setAttribute("data-cart-level", String(currentLevel));

  levelButtons.forEach((button) => {
    const buttonLevel = Number(button.dataset.level);
    button.classList.toggle("active", buttonLevel === currentLevel);
  });

  if (speechQuestion) {
    speechQuestion.textContent =
      currentLevel === 3 ? "무엇을 사요? 모두 얼마예요?" : "무엇을 사요?";
  }
}

function setupLevelButtons() {
  if (levelButtons.length === 0) {
    return;
  }

  setLevelVisualState();

  levelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedLevel = Number(button.dataset.level);

      if (![1, 2, 3].includes(selectedLevel)) {
        return;
      }

      currentLevel = selectedLevel;
      localStorage.setItem("cartGameLevel", String(currentLevel));

      setLevelVisualState();
      renderProducts();
      renderCart();

      if (cart.length > 0) {
        updateNpcDialogue("cart");
      } else {
        updateNpcDialogue("level");
      }
    });
  });
}

function renderRandomNpc() {
  if (!npcImage || !npcName || !npcRole || !npcDialogue) {
    return;
  }

  currentNpc = getRandomItem(npcs);

  npcImage.src = makeCharacterPath(currentNpc.image);
  npcImage.alt = `${currentNpc.name} 점원`;
  npcName.textContent = currentNpc.name;
  npcRole.textContent = currentNpc.role;
  npcDialogue.textContent = getRandomItem(currentNpc.greetings);

  npcImage.addEventListener("error", () => {
    npcImage.style.display = "none";
  });
}

function updateNpcDialogue(type) {
  if (!currentNpc || !npcDialogue) {
    return;
  }

  if (type === "empty") {
    npcDialogue.textContent = getRandomItem(currentNpc.emptyMessages);
    return;
  }

  if (type === "cart") {
    const messages = currentLevel === 3 ? currentNpc.priceMessages : currentNpc.cartMessages;
    npcDialogue.textContent = `${getRandomItem(messages)} “${makeAnswerSentence()}”`;
    return;
  }

  if (type === "clear") {
    npcDialogue.textContent = getRandomItem(currentNpc.clearMessages);
    return;
  }

  if (type === "level") {
    npcDialogue.textContent =
      currentNpc.levelMessages[currentLevel] ||
      "레벨을 바꿨어요. 다시 연습해 볼까요?";
  }
}

function renderProducts() {
  if (!productGrid) {
    return;
  }

  productGrid.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${makeImagePath(product.image)}"
          alt="${product.name}"
        />
      </div>

      <div class="product-info">
        <p class="product-name">${product.name}</p>
        <button
          class="add-button"
          type="button"
          aria-label="${product.name} 담기"
          data-id="${product.id}"
        >
          +
        </button>
      </div>

      <div class="product-price">
        <p class="product-price-number">${formatPrice(product.price)}</p>
        <p class="product-price-korean">${priceToKorean(product.price)}</p>
      </div>
    `;

    const image = card.querySelector(".product-image");
    image.addEventListener("error", () => {
      image.src = makePlaceholderImage(product.name);
    });

    const addButton = card.querySelector(".add-button");
    addButton.addEventListener("click", () => {
      addToCart(product.id);
    });

    productGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.count += 1;
  } else {
    cart.push({
      ...product,
      count: 1
    });
  }

  renderCart();
  updateNpcDialogue("cart");
}

function clearCart() {
  cart = [];
  renderCart();
  updateNpcDialogue("clear");
}

function renderCart() {
  if (!cartList || !cartStatus || !answerPreview) {
    return;
  }

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.classList.add("empty");
    cartList.innerHTML = `<p class="empty-message">상품을 담아 보세요.</p>`;
    cartStatus.textContent = "아직 담은 물건이 없어요.";
    answerPreview.textContent = "아직 없어요.";
    updateCartTotal();
    return;
  }

  cartList.classList.remove("empty");

  const totalCount = cart.reduce((sum, item) => sum + item.count, 0);
  cartStatus.textContent = `담은 상품: ${totalCount}개`;

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img
        class="cart-item-image"
        src="${makeImagePath(item.image)}"
        alt="${item.name}"
      />

      <div>
        <p class="cart-item-name">${item.name}</p>
        ${
          currentLevel === 3
            ? `<p class="cart-item-price">${formatPrice(item.price)} × ${item.count}</p>`
            : ""
        }
      </div>

      <span class="cart-item-count">x ${item.count}</span>
    `;

    const image = cartItem.querySelector(".cart-item-image");
    image.addEventListener("error", () => {
      image.src = makePlaceholderImage(item.name);
    });

    cartList.appendChild(cartItem);
  });

  answerPreview.textContent = makeAnswerSentence();
  updateCartTotal();
}

function updateCartTotal() {
  if (!cartTotalBox || !cartTotalNumber || !cartTotalKorean) {
    return;
  }

  const totalPrice = getTotalPrice();

  if (currentLevel !== 3 || cart.length === 0) {
    cartTotalBox.classList.add("hidden");
    cartTotalNumber.textContent = "0원";
    cartTotalKorean.textContent = "영 원";
    return;
  }

  cartTotalBox.classList.remove("hidden");
  cartTotalNumber.textContent = formatPrice(totalPrice);
  cartTotalKorean.textContent = priceToKorean(totalPrice);
}

function makeLevelOneSentence() {
  if (cart.length === 1) {
    const item = cart[0];
    return `${item.name}${getObjectParticle(item.name)} 사요.`;
  }

  const phrases = cart.map((item) => {
    return `${item.name}${getObjectParticle(item.name)}`;
  });

  return `${phrases.join(", ")} 사요.`;
}

function makeLevelTwoSentence() {
  if (cart.length === 1) {
    const item = cart[0];
    const unit = item.unit || "개";
    const countPhrase = getCountPhrase(item.count, unit);

    return `${item.name} ${countPhrase}${getObjectParticle(unit)} 사요.`;
  }

  const phrases = cart.map((item, index) => {
    const unit = item.unit || "개";
    const countPhrase = getCountPhrase(item.count, unit);
    const phrase = `${item.name} ${countPhrase}`;

    if (index === cart.length - 1) {
      return `${phrase}${getObjectParticle(unit)}`;
    }

    return phrase;
  });

  return `${phrases.join(", ")} 사요.`;
}

function makeLevelThreeSentence() {
  const totalPrice = getTotalPrice();
  const shoppingSentence = makeLevelTwoSentence();

  return `${shoppingSentence} 모두 ${formatPrice(totalPrice)}이에요. (${priceToKorean(totalPrice)}이에요.)`;
}

function makeAnswerSentence() {
  if (cart.length === 0) {
    return "아직 없어요.";
  }

  if (currentLevel === 1) {
    return makeLevelOneSentence();
  }

  if (currentLevel === 2) {
    return makeLevelTwoSentence();
  }

  if (currentLevel === 3) {
    return makeLevelThreeSentence();
  }

  return makeLevelOneSentence();
}

function setupEvents() {
  if (clearCartButton) {
    clearCartButton.addEventListener("click", clearCart);
  }
}

function initCartGame() {
  cacheDomElements();
  setupEvents();
  setupLevelButtons();
  renderRandomNpc();
  renderProducts();
  renderCart();
  setLevelVisualState();
}

document.addEventListener("DOMContentLoaded", initCartGame);
