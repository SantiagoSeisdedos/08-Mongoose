const formEdit = document.querySelector("form");
const inputs = document.querySelectorAll("input");
const emailSpan = document.querySelector("span");

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
