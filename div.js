const btn= document.querySelector(".colorChanger");
const div= document.querySelector(".divColor")
const undoBtn=document.querySelector(".undo");
const redoBtn=document.querySelector(".redo");

//undo stores the previous color
//redo stores any action that was undone by undo


const undo = [];
const redo=[];

btn.addEventListener("click", () => {
  
    const prevColor = div.style.backgroundColor;
    if (prevColor) {
        undo.push(prevColor);
    }
    // Clear the redo when a new color is set
    redo.length = 0;

    const color = getRandomColor();
    div.style.backgroundColor = color;
});


undoBtn.addEventListener("click", () => {
    if (undo.length > 0) {

           // Store the current color in redo
           redo.push(div.style.backgroundColor);

        const previousColor = undo.pop();
        div.style.backgroundColor = previousColor;
    }
});

redoBtn.addEventListener("click", () => {
    if (redo.length > 0) {

        // Store the current color in undo
        undo.push(div.style.backgroundColor);
        const nextColor = redo.pop();
        div.style.backgroundColor = nextColor;
    }
});


function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 20) + 80;
    const lightness = Math.floor(Math.random() * 20) + 80;
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
