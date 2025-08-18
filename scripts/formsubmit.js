document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("displayName").value.trim();
      const email = document.getElementById("displayEmail").value.trim();

      if (!name || !email) {
        alert("Both fields are required.");
        return;
      }

      localStorage.setItem("visitorName", name);
      localStorage.setItem("visitorEmail", email);

      
      window.location.href = "questionform.html";
    });
  }
});
