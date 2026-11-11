import { db, auth } from "./firebaseConfig.js";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

const saveButton = document.getElementById("save-button");

// Get the goal ID
const editGoalId = new URLSearchParams(window.location.search).get("id");
const goalId = editGoalId || sessionStorage.getItem("newGoalId");
const startInput = document.getElementById("start_date");
const endInput = document.getElementById("deadline");
const timeInput = document.getElementById("time");
const reminderInput = document.getElementById("reminder");

function localDateValue(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Fill in saved settings
async function loadDeadlineSettings() {
  document.getElementById("deadline-title").textContent = "Edit Deadline";
  saveButton.disabled = true;

  try {
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first.");
      return;
    }

    const goalSnapshot = await getDoc(doc(db, "users", user.uid, "goals", editGoalId));
    if (!goalSnapshot.exists()) {
      alert("Goal not found.");
      return;
    }

    const goal = goalSnapshot.data();
    const start = goal.startDate?.toDate?.();
    const end = goal.endDate?.toDate?.();
    if (start) startInput.value = localDateValue(start);
    if (end) {
      endInput.value = localDateValue(end);
      const hours = String(end.getHours()).padStart(2, "0");
      const minutes = String(end.getMinutes()).padStart(2, "0");
      timeInput.value = `${hours}:${minutes}`;
    }
    reminderInput.value = goal.reminder || "None";
    if (reminderInput.selectedIndex === -1) reminderInput.value = "None";
    saveButton.disabled = false;
  } catch (error) {
    console.error("Failed to load deadline:", error);
    alert("Could not load deadline settings. Please refresh to try again.");
  }
}

if (editGoalId) loadDeadlineSettings();

saveButton.addEventListener("click", async function (event) {
  event.preventDefault();

  const startDate = startInput.value;
  const endDate = endInput.value;
  const time = timeInput.value;
  const reminder = reminderInput.value;

  if (!goalId) {
    alert("Please select a goal first.");
    return;
  }

  if (!startDate || !endDate || !time) {
    alert("Please select a date and time.");
    return;
  }

  // Wait until Firebase finishes restoring the login state.
  await auth.authStateReady();
  const user = auth.currentUser;

  if (!user) {
    alert("Please log in first.");
    return;
  }

  const start_date = new Date(`${startDate}T00:00`);
  const deadline = new Date(`${endDate}T${time}`);

  if (deadline <= start_date) {
    alert("The deadline must be after the start date.");
    return;
  }

  if (Number.isNaN(deadline.getTime()) || Number.isNaN(start_date.getTime())) {
    alert("Please enter a valid date and time.");
    return;
  }

  saveButton.disabled = true;
  try {
    const goalRef = doc(db, "users", user.uid, "goals", goalId);
    // Save to the same goal
    await updateDoc(goalRef, {
      startDate: Timestamp.fromDate(start_date),
      endDate: Timestamp.fromDate(deadline),
      reminder: reminder,
    });
  } catch (error) {
    console.error("Failed to save deadline:", error);
    alert("Could not save the deadline. Please try again.");
    saveButton.disabled = false;
    return;
  }

  // Go back after saving
  window.location.href = editGoalId
    ? `goal-details.html?id=${encodeURIComponent(goalId)}`
    : "main-goals-listed.html";
});
