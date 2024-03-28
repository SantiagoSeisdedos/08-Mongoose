document.addEventListener("DOMContentLoaded", () => {
    const recoverAccountForm = document.getElementById("recoverAccountForm");
  
    recoverAccountForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
  
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
  
      const response = await fetch("/api/users/recoverAccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, token }),
      });
  
      if (response.status === 200) {
        alert("Password updated successfully");
        window.location.href = "/login"; 
      } else {
        const error = await response.json();
        alert(error.message);
      }
    });
  });
  