import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "/styles/style.css";

const stepsContainer = document.getElementById("steps-container");
const addStepButton = document.getElementById("add-step-button");

function updateStepLabels() {
  const stepEntries = stepsContainer.querySelectorAll(".goal-step-entry");

  stepEntries.forEach((entry, index) => {
    const stepNumber = index + 1;
    const label = entry.querySelector("label");
    const input = entry.querySelector("input");
    const removeButton = entry.querySelector(".remove-step");

    label.textContent = `Step ${stepNumber}`;
    label.htmlFor = `goal-step-${stepNumber}`;
    input.id = `goal-step-${stepNumber}`;
    removeButton.setAttribute("aria-label", `Remove step ${stepNumber}`);
    removeButton.hidden = stepEntries.length === 1;
  });
}

updateStepLabels();

addStepButton.addEventListener("click", () => {
  const stepEntry = document.createElement("div");
  stepEntry.className = "goal-step-entry mb-3";
  stepEntry.innerHTML = `
    <label class="form-label"></label>
    <div class="input-group">
      <input
        type="text"
        class="form-control goal-step-input"
        placeholder="e.g., Run for 20 minutes..."
      />
      <button class="btn btn-outline-secondary remove-step" type="button">
        Remove
      </button>
    </div>
  `;

  stepsContainer.appendChild(stepEntry);
  updateStepLabels();
  stepEntry.querySelector("input").focus();
});

stepsContainer.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-step");

  if (!removeButton) {
    return;
  }

  const stepEntries = stepsContainer.querySelectorAll(".goal-step-entry");
  const stepEntry = removeButton.closest(".goal-step-entry");

  if (stepEntries.length === 1) {
    stepEntry.querySelector("input").value = "";
    return;
  }

  stepEntry.remove();
  updateStepLabels();
});
