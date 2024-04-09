const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Realizar la solicitud POST al servidor para cargar la imagen
  const formData = new FormData(form);
  const response = await fetch("/images", {
    method: "POST",
    body: formData,
  });

  const { url } = await response.json();
  // Mostrar la imagen en una nueva pestaña si la URL e xiste
  if (url) {
    return window.open(`/${url}`, "_blank");
  } else {
    return alert("No se ha recibido la URL de la imagen");
  }
});
