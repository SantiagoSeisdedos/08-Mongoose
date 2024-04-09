const formLogout = document.querySelector("form");
const spans = document.querySelectorAll("span");
const logoutButton = document.getElementById("logoutButton");
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.querySelector('input[type="file"]');
const uploadButton = document.getElementById("uploadButton");
const documentsList = document.getElementById("documentsList");
let user;

window.addEventListener("load", async () => {
  try {
    const response = await fetch("/api/users/current");

    if (response.status === 403 || response.status === 401) {
      Swal.fire({
        title: "Error!",
        text: "No autorizado!",
        icon: "error",
        confirmButtonText: "Ok",
      }).then(() => {
        window.location.href = "/login";
      });

      return (window.location.href = "/login");
    }

    const result = await response.json();
    user = result.data;

    document.getElementById("name").textContent = user.name;
    document.getElementById("lastName").textContent = user.lastName;
    document.getElementById("email").textContent = user.email;
    document.getElementById("rol").textContent = user.rol;
    document.getElementById("profilePicture").src = user.profilePicture;

    documentsList.innerHTML = "";

    for (const userDocument of user.documents) {
      const docItem = document.createElement("div");
      docItem.classList.add("documentItem");

      const documentDataContainer = document.createElement("div");
      documentDataContainer.classList.add("documentDataContainer");

      const docImage = document.createElement("img");
      docImage.classList.add("documentImage");

      const imagePath = userDocument.reference.replace(/\\/g, "/");
      const parts = imagePath.split(/[\\/]/);
      const relativePath = parts.slice(parts.indexOf("public") + 1).join("/");
      docImage.src = `/${relativePath}`;
      docImage.alt = userDocument.name;
      docImage.width = 100;
      docImage.height = 100;

      const docName = document.createElement("span");
      docName.textContent = userDocument.name;
      docName.classList.add("documentName");

      documentDataContainer.appendChild(docName);

      documentsList.appendChild(docItem);
      docItem.appendChild(docImage);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.classList.add("deleteButton");
      deleteButton.addEventListener("click", async () => {
        try {
          const response = await fetch(
            `/api/users/${user._id}/documents/${userDocument._id}`,
            {
              method: "DELETE",
            }
          );

          if (response.status === 200) {
            Swal.fire({
              text: `Documento eliminado exitosamente`,
              toast: true,
              position: "top-right",
              timer: 1500,
              timerProgressBar: true,
              showConfirmButton: false,
            }).then(() => {
              window.location.reload();
            });
          } else {
            const error = await response.json();
            throw new Error(error.message);
          }
        } catch (error) {
          Swal.fire({
            text: `Error al eliminar documento: ${error.message}`,
            toast: true,
            position: "top-right",
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: "error",
          });
        }
      });

      if (user.rol === "admin") {
        document.getElementById("usersTable").removeAttribute("hidden");
      }

      documentDataContainer.appendChild(deleteButton);
      docItem.appendChild(documentDataContainer);
    }

    logoutButton.addEventListener("click", logout);
  } catch (error) {
    if (error.message === "Unauthorized") {
      Swal.fire({
        title: "Error!",
        text: "No autorizado!",
        icon: "error",
        confirmButtonText: "Ok",
      }).then(() => {
        window.location.href = "/login";
      });

      return (window.location.href = "/login");
    } else {
      Swal.fire({
        title: "Error!",
        text: "Algo salió mal. Por favor, inténtelo de nuevo",
        icon: "error",
        confirmButtonText: "Ok",
      }).then(() => {
        window.location.href = "/login";
      });
    }
  }
});

const logout = async (event) => {
  try {
    const response = await fetch("/api/sessions/current", {
      method: "DELETE",
    });

    if (response.status === 200) {
      Swal.fire({
        title: "Sesión cerrada",
        text: "Hasta luego!",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/login";
      });
    } else {
      const error = await response.json();
      throw new Error(error);
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Error al cerrar sesión. Por favor, inténtelo de nuevo",
      icon: "error",
      confirmButtonText: "Ok",
    }).then(() => {
      window.location.href = "/login";
    });
  }
};

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    uploadButton.removeAttribute("disabled");
  } else {
    uploadButton.setAttribute("disabled", "disabled");
  }
});

uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const files = document.querySelector('input[type="file"]').files;
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  try {
    const response = await fetch(`/api/users/${user._id}/documents`, {
      method: "POST",
      body: formData,
    });

    if (response.status === 200) {
      Swal.fire({
        text: `Documentos subidos exitosamente!`,
        toast: true,
        position: "top-right",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    Swal.fire({
      text: `Error al subir documentos: ${error.message}`,
      toast: true,
      position: "top-right",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      icon: "error",
    });
  }
});
