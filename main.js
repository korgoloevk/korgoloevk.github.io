const image = document.querySelector("#image");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const setSize = document.querySelector(".setSize");
let currentWidth = canvas.getAttribute("width");
let currentHeight = canvas.getAttribute("height");
let currentSize = "square";
let switcher = 0;
const form = document.querySelector("form");
const strokeText = { 1: "", 2: "", 3: "" };
let stroke1Width = 100;
let stroke2Width = 200;

const testImage = new Image(); // удалить
testImage.src = "/img1x1.jpg"; // удалить

//
//Работа с канвас
//

//Слушатель загрузки для установки в канвас
image.addEventListener("change", () => {
  setImage(1080, 1080);
});

//Устанавливаем размер окна
setSize.addEventListener("click", (e) => {
  const target = e.target;
  if (target && target.type === "button") {
    currentSize = target.id;
    switch (target.id) {
      case "square":
        changeAttr(1080, 1080);
        break;
      case "gorizontal":
        changeAttr(1920, 1080);
        break;
      case "vertical":
        changeAttr(1080, 1920);
        break;
      default:
        changeAttr(1080, 1080);
    }
  }
});

function clearFillCanvas() {
  const width = canvas.getAttribute("width");
  const height = canvas.getAttribute("height");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
}

//Устанавливаем картинку в канвас, каждый раз чистим перед этом всё поле
//start последний аттрибут, так как меняется в зависимости от пожелания
function setImage(
  width,
  height,
  startX = 0,
  startY = 0,
  textX = 73.24,
  textY = 872.84
) {
  const styleSelector = document.querySelector("#styleSelector").value;

  clearFillCanvas();

  try {
    const img = new Image();
    img.src = window.URL.createObjectURL(image.files[0]);
    img.onload = () => {
      ctx.drawImage(img, startX, startY, width, height);
      setGradient();
      setSubstrate(styleSelector, stroke1Width, stroke2Width, startX, startY);
      setText(styleSelector);
    };
  } catch (e) {
    console.log("Какая-то ошибка");
    console.log(e);
  }
}

//Меняем высоту и ширину канваса в html, также меняя глобальные значения
//проверяем на то, какого соотношения выбрано рабочее окно
//switcher отвечает за выбор startX/Y -- в начале поля окна или по центру для квадратных изображений

function changeAttr(width, height) {
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  currentWidth = width;
  currentHeight = height;

  switcher = switcher === 0 ? 1 : 0;

  setImageBeforeChangeAttr(width, height);
}

//устанавливаем картинку после изменений

function setImageBeforeChangeAttr(width, height) {
  if (currentSize === "square") {
    setImage(width, height, 0, 0, 73.24, 872.84);
  }

  if (currentSize === "gorizontal" && switcher === 0) {
    setImage(width, height, 0, 0, 493.24, 872.84);
  } else if (currentSize === "gorizontal" && switcher === 1) {
    setImage(1080, 1080, 420, 0, 493.24, 872.84);
  }

  if (currentSize === "vertical" && switcher === 0) {
    setImage(width, height, 0, 0, 73.24, 1292.84);
  } else if (currentSize === "vertical" && switcher === 1) {
    setImage(1080, 1080, 0, 420, 73.24, 1292.84);
  }
}

//
//Рисуем текст и подложку на картинку
//

function setText(style = "whiteBack") {
  let textX = currentSize === "gorizontal" ? 493.24 : 73.24;
  let textY = currentSize === "vertical" ? 1292.84 : 872.84;

  let textColor = "#ffffff";

  ctx.font = "54.62px UbuntuMedium";
  const strokesList = document.querySelectorAll(".stroke");

  strokesList.forEach((item, i) => {
    strokeText[i + 1] = item.value.toUpperCase();
  });

  if (style === "whiteBack") {
    textColor = "#000000";
  }
  if (style === "gradient") {
    ctx.fillStyle = textColor;
    textX -= 26.24;
    textY -= 23.84;
    ctx.fillText(strokeText[1], textX, textY);
    ctx.fillText(strokeText[2], textX, textY + 70);
    ctx.fillText(strokeText[3], textX, textY + 140);
  } else {
    ctx.fillStyle = textColor;
    ctx.fillText(strokeText[1], textX, textY);
    ctx.fillText(strokeText[2], textX, textY + 70);
  }
}

form.addEventListener("input", (e) => {
  if (switcher === 0) {
    setImageBeforeChangeAttr(currentWidth, currentHeight);
  } else {
    setImageBeforeChangeAttr(1080, 1080);
  }
});

//устанавливаем подложку

function setSubstrate(style, width1 = 0, width2 = 0) {
  const currentColor = document.querySelector("#currentColor").value;
  const startX = currentSize === "gorizontal" ? 470 : 50;
  const startY = currentSize === "vertical" ? 1227 : 807;
  ctx.fillStyle = currentColor;
  ctx.fillRect(startX - 50, startY + 244, 1080, 29);

  if (style === "colorBack") {
    ctx.fillRect(startX, startY, width1, 88);
    ctx.fillRect(startX, startY + 75, width2, 88);
  } else if (style === "whiteBack") {
    ctx.fillStyle = "white";
    ctx.fillRect(startX, startY, width1, 88);
    ctx.fillRect(startX, startY + 75, width2, 88);
    ctx.fillStyle = currentColor;
    ctx.fillRect(startX, startY + 176, width2, 14);
  } else if (style === "gradient") {
  }
}

canvas.addEventListener("click", (e) => {
  let yPos = 0;
  let proportions = 0;
  if (currentSize !== "gorizontal") {
    proportions = 1080 / canvas.offsetWidth;
    yPos = e.offsetY * proportions;
  } else {
    proportions = 1920 / canvas.offsetWidth;
    yPos = e.offsetY * proportions;
  }

  if (currentSize === "square" && yPos > 802 && yPos < 876) {
    const width1 = e.offsetX * proportions - 50;
    stroke1Width = width1;
  } else if (currentSize === "square" && yPos > 879 && yPos < 962) {
    const width2 = e.offsetX * proportions - 50;
    stroke2Width = width2;
  }

  if (currentSize === "gorizontal" && yPos > 802 && yPos < 876) {
    const width1 = e.offsetX * proportions - 470;
    stroke1Width = width1;
  } else if (currentSize === "gorizontal" && yPos > 879 && yPos < 962) {
    const width2 = e.offsetX * proportions - 470;
    stroke2Width = width2;
  }

  if (currentSize === "vertical" && yPos > 802 + 420 && yPos < 876 + 420) {
    const width1 = e.offsetX * proportions - 50;
    stroke1Width = width1;
  } else if (
    currentSize === "vertical" &&
    yPos > 879 + 420 &&
    yPos < 962 + 420
  ) {
    const width2 = e.offsetX * proportions - 50;
    stroke2Width = width2;
  }
  if (switcher === 0) {
    setImageBeforeChangeAttr(currentWidth, currentHeight);
  } else {
    setImageBeforeChangeAttr(1080, 1080);
  }
});

function setGradient() {
  const styleSelector = document.querySelector("#styleSelector").value;
  const startX = currentSize !== "gorizontal" ? 0 : 420;
  const startY = currentSize !== "vertical" ? 0 : 420;
  if (styleSelector === "gradient") {
    const gradient = ctx.createLinearGradient(
      0,
      1080 + startY,
      0,
      600 + startY
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.999)");
    gradient.addColorStop(0.2, "rgba(0, 0, 0, 0.900)");
    gradient.addColorStop(0.4, "rgba(0, 0, 0, 0.750)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.000)");
    ctx.fillStyle = gradient;
    ctx.fillRect(startX, startY, 1080, 1080);
  } else {
    const gradient = ctx.createLinearGradient(0, 1080, 0, 600);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.299)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.250)");
    gradient.addColorStop(1, "rgba(229, 229, 229, 0.020)");
    ctx.fillStyle = gradient;
    ctx.fillRect(startX, startY, 1080, 1080);
  }
}

document.querySelector("#download").addEventListener("click", () => {
  const width = canvas.getAttribute("width");
  const height = canvas.getAttribute("height");
  Canvas2Image.saveAsPNG(canvas, width, height);
});
