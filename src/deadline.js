console.log("deadline.js loaded");

const saveButton = document.getElementById("save-button");

saveButton.addEventListener("click", function (event) {
  const date = document.getElementById("deadline").value;
  const time = document.getElementById("time").value;
  const reminder = document.getElementById("reminder").value;

  console.log("Date:", date);
  console.log("Time:", time);
  console.log("Reminder:", reminder);
});