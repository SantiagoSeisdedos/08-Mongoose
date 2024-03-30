const formLogin = document.querySelector("form");

formLogin?.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();

    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(formLogin)),
    });

    if (response.status === 201) {
      const sesion = await response.json();
      Swal.fire({
        title: "Bienvenido " + sesion.name + "!",
        icon: "success",
        confirmButtonText: "Ingresar",
      }).then((result) => {
        window.location.href = "/profile";
      });
    } else {
      const error = await response.json();
      throw new Error(error.message || error);
    }
  } catch (error) {
    alert(error);
  }
});
