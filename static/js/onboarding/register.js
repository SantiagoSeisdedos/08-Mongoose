const formRegister = document.querySelector("form");

formRegister?.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const response = await fetch(`/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(formRegister)),
    });
    if (response.status === 201 || response.status === 200) {
      Swal.fire({
        title: "¡Usuario creado!",
        text: "¡Bienvenido a la plataforma!",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/profile";
      });
    } else {
      const error = await response.json();
      throw new Error(error.message);
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
