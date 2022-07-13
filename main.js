const image = document.querySelector("#image");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

image.addEventListener("change", () => {
  const img = new Image();
  img.src = window.URL.createObjectURL(image.files[0]);
  img.onload = () => {
    try {
      ctx.drawImage(img, 0, 0);
    } catch {
      alert("Попробуй ещё раз, какая-то ошибка");
    }
  };
});
