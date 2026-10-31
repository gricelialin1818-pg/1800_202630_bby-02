import { db, auth } from "./firebaseConfig.js";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

console.log("deadline.js loaded");

const saveButton = document.getElementById("save-button");

saveButton.addEventListener("click", async function (event) {
  event.preventDefault();

  const startDate = document.getElementById("start_date").value;
  const endDate = document.getElementById("deadline").value;
  const time = document.getElementById("time").value;
  const reminder = document.getElementById("reminder").value;

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

  try {
    const goalRef = doc(
      db, "users", user.uid, "goals", "deadlineTest"
    );

    await updateDoc(goalRef, {
      startDate: Timestamp.fromDate(start_date),
      endDate: Timestamp.fromDate(deadline),
      reminder: reminder
    });

    window.location.href = "./deadline-saved.html";
  } catch (error) {
    console.error("Failed to save deadline:", error);
    alert("Could not save the deadline. Please try again.");
  }
});

function calculateStepDeadlines(startDate, endDate, stepCount) {
  const deadlines = [];

  if (stepCount <= 0) {
    return deadlines;
  }

  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const interval = (endTime - startTime) / stepCount;

  for (let i = 1; i <= stepCount; i++) {
    const stepDeadline = new Date(startTime + interval * i);
    deadlines.push(stepDeadline);
  }

  return deadlines;
}

const testDeadlines = calculateStepDeadlines(
  new Date("2026-10-24T00:00"),
  new Date("2026-10-30T00:00"),
  3
);

for (const deadline of testDeadlines) {
  console.log(deadline.toLocaleString());
}