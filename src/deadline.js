import { db, auth } from "./firebaseConfig.js";
// Added 'collection' and 'setDoc' to the imports
import { collection, doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

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
    // 1. Reference the user's goals subcollection
    const goalsCollectionRef = collection(db, "users", user.uid, "goals");

    // 2. Generate a new document slot with a completely unique random ID
    const goalRef = doc(goalsCollectionRef);

    // 3. Save the details using updateDoc
    await updateDoc(goalRef, {
      startDate: Timestamp.fromDate(start_date),
      endDate: Timestamp.fromDate(deadline),
      reminder: reminder,
      // Optional: If you want your steps logic to work later, 
      // you should initialize an empty array for steps here.
      goalSteps: [] 
    });

    window.location.href = "./deadline-saved.html";
  } catch (error) {
    console.error("Failed to save deadline:", error);
    alert("Could not save the deadline. Please try again.");
  }
});

async function getStepDeadlines(userId, goalId) {
  const goalRef = doc(db, "users", userId, "goals", goalId);
  const goalSnapshot = await getDoc(goalRef);

  if (!goalSnapshot.exists()) {
    throw new Error("Goal not found.");
  }

  const goal = goalSnapshot.data();

  return calculateStepDeadlines(
    goal.startDate.toDate(),
    goal.endDate.toDate(),
    goal.goalSteps ? goal.goalSteps.length : 0
  );
}

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
  new Date("2026-11-04T00:00"),
  new Date("2026-11-10T00:00"),
  3
);

for (const deadline of testDeadlines) {
  console.log(deadline.toLocaleString());
}