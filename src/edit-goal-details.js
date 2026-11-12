import { calculateStepDeadlines } from "./step-deadlines.js";
import { db } from "./firebaseConfig.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthReady } from "./authentication.js";

// Which goal?
// 1. From the address, e.g. goal-details.html?id=pFXuH8nTrXrnl9wWnrMb
// 2. Otherwise the goal just created (saved by main.js / add-goal-details.js / deadline.js)
const params = new URLSearchParams(window.location.search);
const goalID = params.get("id") || sessionStorage.getItem("newGoalId");

// Show a message on the page instead of only in the console
function showError(message) {
    console.error(message);
    document.getElementById("goalName").textContent = message;
    document.getElementById("goalDescription").textContent = "";
}

// Firestore Timestamp -> readable date (or "Not set" if missing)
function formatDate(value) {
    if (value && typeof value.toDate === "function") {
        return value.toDate().toLocaleDateString();
    }
    return "Not set";
}

// Wait until Firebase knows who is logged in
onAuthReady(async (user) => {
    if (!user) return;  // not logged in, authentication.js redirects them

    if (!goalID) {
        showError("No goal selected.");
        return;
    }

    try {
        const goalDetails = doc(db, "users", user.uid, "goals", goalID);
        const goalDoc = await getDoc(goalDetails);

        if (!goalDoc.exists()) {
            showError("Goal not found.");
            return;
        }

        displayGoalDetails(goalDoc.data());
        // Link to the deadline form
        const editDeadlineLink = document.getElementById("editDeadlineLink");
        if (editDeadlineLink) {
            editDeadlineLink.href = `deadline.html?id=${encodeURIComponent(goalID)}`;
            editDeadlineLink.hidden = false;
        }
        setupUpdateButton(goalDetails, goalDoc.data());
    } catch (error) {
        showError("Could not load goal: " + error.message);
    }
});

function displayGoalDetails(getGoal) {
    const getGoalName = getGoal["goal-name"];
    const getGoalDescription = getGoal["goal-description"];
    const getGoalStartDate = getGoal.startDate;
    const getGoalEndDate = getGoal.endDate;
    const getGoalReminder = getGoal.reminder;
    const getGoalSteps = getGoal.goalSteps || [];
    const getStepsDone = getGoal.stepsDone || [];
    // Calculate step deadlines
    const start = getGoalStartDate?.toDate?.();
    const end = getGoalEndDate?.toDate?.();
    const stepDeadlines = start && end && end > start
        ? calculateStepDeadlines(start, end, getGoalSteps.length)
        : [];

    document.getElementById("goalName").textContent = getGoalName || "Untitled goal";
    document.getElementById("goalDescription").textContent = getGoalDescription || "";
    document.getElementById("goalStartDate").textContent = formatDate(getGoalStartDate);
    document.getElementById("goalEndDate").textContent = formatDate(getGoalEndDate);
    document.getElementById("goalReminder").textContent = getGoalReminder || "None";

    const goal_steps = document.getElementById("goalSteps");
    goal_steps.innerHTML = "";

    if (getGoalSteps.length === 0) {
        goal_steps.textContent = "No steps added yet.";
        return;
    }
    const path = window.location.pathname.split("/").pop();

    let checkboxState = "";
    if (path === "update-progress.html") {
        checkboxState = "disabled";
    }

    getGoalSteps.forEach((step, index) => {
        let checkedState = "";
        if (getStepsDone[index] === true) {
            checkedState = "checked";
        }

        goal_steps.insertAdjacentHTML("beforeend", `<div class="form-field">
    <input type="checkbox" id="step${index}" class="check" ${checkboxState} ${checkedState} />
    <label for="step${index}"></label>
  </div>`);
        // textContent so step text typed by the user can't break the HTML
        const label = document.querySelector(`label[for="step${index}"]`);
        label.textContent = step;
        // Show the step deadline
        if (stepDeadlines[index]) {
            const due = document.createElement("small");
            due.className = "d-block text-muted";
            due.textContent = `Due ${stepDeadlines[index].toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}`;
            label.appendChild(due);
        }
    });
}

function setupUpdateButton(goalDetails, getGoal) {
    const updateBtn = document.getElementById("updateBtn");
    if (!updateBtn) return;  // update-progress page has no save button

    updateBtn.addEventListener("click", async () => {
        const newStepsDone = [];

        (getGoal.goalSteps || []).forEach((step, index) => {
            const box = document.getElementById(`step${index}`);
            newStepsDone.push(box.checked);
        });

        try {
            await updateDoc(goalDetails, { stepsDone: newStepsDone });
        } catch (error) {
            console.error("save failed:", error);
            alert("Save failed: " + error.message);
            return;
        }

        // Keep the goal ID so the next page knows which goal to show
        window.location.href = `update-progress.html?id=${goalID}`;
    });
}