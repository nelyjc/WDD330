document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("visitorName") || "Guest";
  const email = localStorage.getItem("visitorEmail") || "No email provided";

  const nameEl = document.getElementById("displayName");
  const emailEl = document.getElementById("displayEmail");

  if (nameEl) nameEl.textContent = name;
  if (emailEl) emailEl.textContent = email;
});
