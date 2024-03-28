const resetPasswordForm = document.getElementById("resetPasswordForm");

resetPasswordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch("/api/users/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body: new URLSearchParams(new FormData(resetPasswordForm)),
  });

  if (response.status === 200) {
    alert("We have sent you an email to reset your password.");
    window.location.href = "/login";
  } else {
    const error = await response.json();
    alert(error.message);
  }
});
