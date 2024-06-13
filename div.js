const btn = document.querySelector(".colorChanger");
const div = document.querySelector(".divColor");
const undoBtn = document.querySelector(".undo");
const redoBtn = document.querySelector(".redo");

let undo = [];
let redo = [];

const undoDiv = document.querySelector(".undoColors");
const redoDiv = document.querySelector(".redoColors");

const MAX_SIZE = 5;

btn.addEventListener("click", () => {
  const prevColor = div.style.backgroundColor;
  if (prevColor) {
    if (undo.length >= MAX_SIZE) {
      undo.shift(); // Remove the oldest element from the start of array
    }
    undo.push(prevColor);
  }
  // Clear the redo stack when a new color is set
  redo.length = 0;

  const color = getRandomColor();
  div.style.backgroundColor = color;

  updateArrays();
});

undoBtn.addEventListener("click", () => {
  handleUndo();
});

redoBtn.addEventListener("click", () => {
  handleRedo();
});

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 20) + 80;
  const lightness = Math.floor(Math.random() * 20) + 80;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function handleUndo() {
  if (undo.length > 0) {
    if (redo.length >= MAX_SIZE) {
      redo.shift(); // Remove the oldest element from the start of array
    }
    redo.push(div.style.backgroundColor);

    const previousColor = undo.pop();
    div.style.backgroundColor = previousColor;

    updateArrays();
  }
}

function handleRedo() {
  if (redo.length > 0) {
    if (undo.length >= MAX_SIZE) {
      undo.shift(); // Remove the oldest element from the start of array
    }
    undo.push(div.style.backgroundColor);

    const nextColor = redo.pop();
    div.style.backgroundColor = nextColor;

    updateArrays();
  }
}

function updateArrays() {
  undoDiv.innerHTML = undo
    .map(
      (color, index) =>
        `<div class="undo-color" style="background-color: ${color};">${index} ${color}</div>`
    )
    .join("");
  redoDiv.innerHTML = redo
    .map(
      (color, index) =>
        `<div class="redo-color" style="background-color: ${color};">${index} ${color}</div>`
    )
    .join("");

  const undoElements = document.querySelectorAll(".undo-color");
  const redoElements = document.querySelectorAll(".redo-color");

  undoElements.forEach((el, index) => {
    el.addEventListener("click", () => {
      let actualColor = div.style.backgroundColor;

      const clickedColor = undo[index];

      div.style.backgroundColor = clickedColor;
      redo.push(actualColor);
      // Remove the clicked color from the undo
      undo.splice(index, 1);
      // Move colors below the selected one to the redo
      for (let i = undo.length - 1; i >= index; i--) {
        redo.push(undo.pop());
      }

      updateArrays();
    });

    el.setAttribute("draggable", "true");
    el.addEventListener("dragstart", dragStartHandler);
  });

  redoElements.forEach((el, index) => {
    el.addEventListener("click", () => {
      const actualColor = div.style.backgroundColor;

      var clickedColor = redo[index];
      div.style.backgroundColor = clickedColor;

      undo.push(actualColor);
      // Remove the clicked color from the redo
      redo.splice(index, 1);

      // Move colors below the selected one to the undo
      for (let i = redo.length - 1; i >= index; i--) {
        undo.push(redo.pop());
      }
      updateArrays();
    });

    el.setAttribute("draggable", "true");
    el.addEventListener("dragstart", dragStartHandler);

  });

  undoDiv.addEventListener("dragover", dragOverHandler);
  redoDiv.addEventListener("dragover", dragOverHandler);

  undoDiv.addEventListener("drop", dropHandler);
  redoDiv.addEventListener("drop", dropHandler);
}

function dragStartHandler(event) {
  const sourceContainer = event.target.closest(".undoColors") ? "undo" : "redo";
  const index = Array.from(event.target.parentElement.children).indexOf(
    event.target
  );

  const data = `${index},${sourceContainer}`;
  event.dataTransfer.setData("text/plain", data);
}

function dragOverHandler(event) {
  event.preventDefault();
}

function dropHandler(event) {
  event.preventDefault();

  const dataString = event.dataTransfer.getData("text/plain");
  const dataParts = dataString.split(",");
  const index = parseInt(dataParts[0]);
  const sourceContainer = dataParts[1];

  const targetContainer = event.currentTarget === undoDiv ? "undo" : "redo";
  const targetIndex = Array.from(event.currentTarget.children).indexOf(
    event.target
  );

  let sourceArray, targetArray;

  if (sourceContainer === "undo" && targetContainer === "redo") {
    sourceArray = undo;
    targetArray = redo;
  } else if (sourceContainer === "redo" && targetContainer === "undo") {
    sourceArray = redo;
    targetArray = undo;
  } else {
    // Drop in the same container
    const container = targetContainer === "undo" ? undo : redo;
    sourceArray = container;
    targetArray = container;
  }

  if (!targetArray || targetArray.length >= MAX_SIZE) {
    return;
  }

  const color = sourceArray.splice(index, 1)[0];
  targetArray.splice(targetIndex, 0, color);

  updateArrays();
}
