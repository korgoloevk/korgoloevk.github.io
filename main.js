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

  ctx.clearRect(
    0,
    0,
    canvas.getAttribute("width"),
    canvas.getAttribute("height")
  );
  try {
    const img = new Image();
    img.src = window.URL.createObjectURL(image.files[0]);
    img.onload = () => {
      ctx.drawImage(img, startX, startY, width, height);
      setSubstrate(styleSelector, stroke1Width, stroke2Width);
      setText(textX, textY, styleSelector);
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

function setText(startX, startY, style = "whiteBack") {
  let textColor = "#ffffff";

  ctx.font = "54.62px UbuntuMedium";
  const strokesList = document.querySelectorAll(".stroke");

  strokesList.forEach((item, i) => {
    strokeText[i + 1] = item.value.toUpperCase();
  });

  if (style === "whiteBack") {
    textColor = "#000000";
  }

  ctx.fillStyle = textColor;
  ctx.fillText(strokeText[1], startX, startY);
  ctx.fillText(strokeText[2], startX, startY + 70);
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
  ctx.fillStyle = currentColor;
  ctx.fillRect(0, 1051, 1080, 29);

  if (style === "colorBack") {
    ctx.fillRect(50, 807, width1, 88);
    ctx.fillRect(50, 882, width2, 88);
  } else if (style === "whiteBack") {
    ctx.fillStyle = "white";
    ctx.fillRect(50, 807, width1, 88);
    ctx.fillRect(50, 882, width2, 88);
    ctx.fillStyle = currentColor;
    ctx.fillRect(50, 983, 1000, 14);
  } else if (style === "gradient") {
  }
}

canvas.addEventListener("click", (e) => {
  const proportions = 1080 / canvas.offsetWidth;
  const yPos = e.offsetY * proportions;
  console.log(yPos);

  if (currentSize === "square" && yPos > 802 && yPos < 876) {
    const width1 = e.offsetX * proportions - 30;
    stroke1Width = width1;
  } else if (currentSize === "square" && yPos > 879 && yPos < 962) {
    const width2 = e.offsetX * proportions - 30;
    stroke2Width = width2;
  }
  if (switcher === 0) {
    setImageBeforeChangeAttr(currentWidth, currentHeight);
  } else {
    setImageBeforeChangeAttr(1080, 1080);
  }
});
