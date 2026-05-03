const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let currentInput = "";

// Helper function to keep the cursor and focus in the right place
function updateCursor(pos) {
  setTimeout(() => {
    display.setSelectionRange(pos, pos);
    display.focus();
  }, 0);
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    let value = button.innerText.trim();
    
    const start = display.selectionStart;
    const end = display.selectionEnd;

    // 1. CLEAR
    if (button.classList.contains("clear")) {
      currentInput = "";
      display.value = "";
    }

    // 2. BACKSPACE
    else if (button.classList.contains("backspace") || value === "⌫") {
      if (start !== null) {
        if (start === end) {
          currentInput = currentInput.slice(0, start - 1) + currentInput.slice(start);
          display.value = currentInput;
          updateCursor(start - 1);
        } else {
          currentInput = currentInput.slice(0, start) + currentInput.slice(end);
          display.value = currentInput;
          updateCursor(start);
        }
      }
    }

    // 3. EQUAL (Updated with Cursor Fix)
    else if (value === "=") {
      try {
        currentInput = eval(currentInput).toString();
        display.value = currentInput;
        // Moves cursor to the end of the new result
        updateCursor(currentInput.length);
      } catch {
        display.value = "Error";
        currentInput = "";
      }
    }

    // 4. SQUARE (x²)
    else if (value.includes("²") && !value.includes("√")) {
      if (!currentInput) return;
      currentInput = Math.pow(parseFloat(currentInput), 2).toString();
      display.value = currentInput;
      updateCursor(currentInput.length);
    }

    // 5. RECIPROCAL (¹⁄x)
    else if (value.includes("¹")) {
      if (!currentInput || parseFloat(currentInput) === 0) {
        display.value = "Error";
        currentInput = "";
      } else {
        currentInput = (1 / parseFloat(currentInput)).toString();
        display.value = currentInput;
        updateCursor(currentInput.length);
      }
    }

    // 6. SQUARE ROOT (²√x)
    else if (button.classList.contains("root-btn")) {
      if (!currentInput) return;
      let num = parseFloat(currentInput);
      if (num < 0) {
        display.value = "Error";
        currentInput = "";
      } else {
        currentInput = Math.sqrt(num).toString();
        display.value = currentInput;
        updateCursor(currentInput.length);
      }
    }

    // 7. PLUS / MINUS
    else if (button.classList.contains("pm-fraction")) {
      if (!currentInput) return;
      currentInput = (parseFloat(currentInput) * -1).toString();
      display.value = currentInput;
      updateCursor(currentInput.length);
    }

    // 8. PERCENTAGE
    else if (value === "%") {
      if (!currentInput) return;
      currentInput = (parseFloat(currentInput) / 100).toString();
      display.value = currentInput;
      updateCursor(currentInput.length);
    }

    // 9. NUMBERS & OPERATORS
    else {
      const specialSigns = ["²√x", "¹⁄x", "x²", "C", "=", "+/-", "⌫", "backspace"];
      
      if (!specialSigns.includes(value) && !button.classList.contains("backspace")) {
        currentInput = currentInput.slice(0, start) + value + currentInput.slice(end);
        display.value = currentInput;
        updateCursor(start + value.length);
      }
    }
  });
});

// Listen for keyboard presses on the display input
display.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevents the default form submission behavior
    
    try {
      // Perform the same calculation logic as the "=" button
      currentInput = eval(display.value).toString();
      display.value = currentInput;

      // Move cursor to the end of the new result
      updateCursor(currentInput.length);
    } catch {
      display.value = "Error";
      currentInput = "";
    }
  }
});

// Optional: Sync currentInput if the user types directly into the box
display.addEventListener("input", () => {
  currentInput = display.value;
});