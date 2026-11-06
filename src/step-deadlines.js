import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

export async function getStepDeadlines(userId, goalId) {
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

export function calculateStepDeadlines(startDate, endDate, stepCount) {
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


