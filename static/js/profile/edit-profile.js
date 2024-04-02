const formEdit = document.querySelector("form");
const inputs = document.querySelectorAll("input");
const emailSpan = document.querySelector("span");
const toggleRoleButton = document.getElementById("toggleRoleButton");

window.addEventListener("load", async (event) => {
  try {
    const response = await fetch("/api/users/current");
    if (response.status === 403) {
      alert("necesitas loguearte para modificar tus datos!");
      return (window.location.href = "/login");
    }

    const result = await response.json();
    const user = result.data; // Cambiado de result.payload a result.data

    inputs[0].innerHTML = user.name;
    inputs[1].innerHTML = user.lastName;
    emailSpan.innerHTML = user.email;
    rolSpan.innerHTML = user.rol;

    toggleRoleButton.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        const response = await fetch(`/api/users/premium/${user.email}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rol: user.rol === "user" ? "premium" : "user",
          }),
        });

        if (response.ok) {
          alert("Rol cambiado exitosamente");
          window.location.reload();
        } else {
          const error = await response.json();
          alert(error.message);
        }
      } catch (error) {
        console.log(error);
        alert("Error al cambiar el rol");
      }
    });
  } catch (error) {
    alert("Error loading /edit");
  }
});

formEdit?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = inputs[0].value;
  const lastName = inputs[1].value;
  const email = emailSpan.textContent;

  const formData = new FormData();
  formData.append("name", name);
  formData.append("lastName", lastName);
  formData.append("email", email);

  const body = new URLSearchParams(formData);

  const response = await fetch(`/api/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (response.status === 200) {
    window.location.href = "/profile";
  } else {
    const error = await response.json();
    alert(error.message);
  }
});
