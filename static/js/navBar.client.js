const navBarProfileButton = document.getElementById("navBarProfileButton");
const navBarRealTimeButton = document.getElementById("navBarRealTimeButton");
const navBarChatButton = document.getElementById("navBarChatButton");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/users/current");
    if (response.status === 200) {
      navBarProfileButton.removeAttribute("hidden");
      navBarRealTimeButton.removeAttribute("hidden");
      navBarChatButton.removeAttribute("hidden");
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Error",
      text: "Algo salio mal. Por favor, contacte el admin del sitio.",
      icon: "error",
      confirmButtonText: "Ok",
    }).then(() => {
      console.log("Error", error);
    });
  }
});
