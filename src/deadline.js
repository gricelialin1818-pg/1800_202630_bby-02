import { db, auth } from "./firebaseConfig.js";
import { getStepDeadlines } from "./step-deadlines.js";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

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
    const goalId = sessionStorage.getItem("newGoalId");
    const goalRef = doc(db, "users", user.uid, "goals", goalId);

    // Save the details using updateDoc
    await updateDoc(goalRef, {
      startDate: Timestamp.fromDate(start_date),
      endDate: Timestamp.fromDate(deadline),
      reminder: reminder,
      // Optional: If you want your steps logic to work later, 
      // you should initialize an empty array for steps here.
    });

    const stepDeadlines = await getStepDeadlines(user.uid, goalId);
    console.log("Step deadlines:", stepDeadlines);

  } catch (error) {
    console.error("Failed to save deadline:", error);
    alert("Could not save the deadline. Please try again.");
  }

  window.location.href = "main-goals-listed.html";
});


