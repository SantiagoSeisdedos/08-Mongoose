const formLogout = document.querySelector("form");
const spans = document.querySelectorAll("span");
const logoutButton = document.getElementById("logoutButton");

window.addEventListener("load", async () => {
  try {
    const response = await fetch("/api/users/current");

    if (response.status === 403 || response.status === 401) {
      alert("No autorizado!");
      return (window.location.href = "/login");
    }

    const result = await response.json();
    const user = result.data; // Cambiado de result.payload a result.data

    spans[0].innerHTML = user.name;
    spans[1].innerHTML = user.lastName;
    spans[2].innerHTML = user.email;
    spans[3].innerHTML = user.rol;

    const ul = document.getElementById("profileUL");
    // const liLogout = document.createElement("li");
    // ul?.appendChild(liLogout);
    // const aLogout = document.createElement("a");
    // liLogout.appendChild(aLogout);
    // aLogout.innerHTML = "Logout";
    // aLogout.href = "#";
    logoutButton.addEventListener("click", logout);
  } catch (error) {
    if (error.message === "Unauthorized") {
      alert("No autorizado!");
      return (window.location.href = "/login");
    } else {
      alert("Error loading /profile" + error.message || error);
    }
  }
});

const logout = async (event) => {
  try {
    const response = await fetch("/api/sessions/current", {
      method: "DELETE",
    });

    if (response.status === 200) {
      alert("Logout successful!");
      window.location.href = "/login";
    } else {
      const error = await response.json();
      throw new Error(error);
    }
  } catch (error) {
    console.error("profile catch", error);
    alert(error.message);
  }
};
