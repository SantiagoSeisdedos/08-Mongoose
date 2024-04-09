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
      const session = await response.json();
      Swal.fire({
        title: "Bienvenido " + (session.name || session.email) + "!",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then((result) => {
        window.location.href = "/profile";
      });
    } else {
      const error = await response.json();
      if (error.message.includes("UNAUTHORIZED")) {
        Swal.fire({
          title: "Error!",
          text: "Error al iniciar sesión. Por favor, inténtelo de nuevo",
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else throw new Error(error.message || error);
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Algo salio mal. Por favor, inténtelo de nuevo",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
});
