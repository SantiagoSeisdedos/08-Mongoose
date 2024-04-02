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
      alert("No autorizado!");
      return (window.location.href = "/login");
    }

    const result = await response.json();
    user = result.data; // Cambiado de result.payload a result.data

    document.getElementById("name").textContent = user.name;
    document.getElementById("lastName").textContent = user.lastName;
    document.getElementById("email").textContent = user.email;
    document.getElementById("rol").textContent = user.rol;
    document.getElementById("profilePicture").src = user.profilePicture;

    documentsList.innerHTML = "";

    for (const userDocument of user.documents) {

      console.log(userDocument)

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
      // documentDataContainer.appendChild(docImage);

      documentsList.appendChild(docItem);
      // docItem.appendChild(docName);
      docItem.appendChild(docImage);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.classList.add("deleteButton");
      deleteButton.addEventListener("click", async () => {
        try {
          const response = await fetch(`/api/users/${user._id}/documents/${userDocument._id}`, {
            method: "DELETE",
          });

          if (response.status === 200) {
            alert("Documento eliminado exitosamente!");
            window.location.reload();
          } else {
            const error = await response.json();
            throw new Error(error.message);
          }
        } catch (error) {
          console.error("Error deleting document:", error);
          alert("Error al eliminar documento: " + error.message);
        }
      });

      documentDataContainer.appendChild(deleteButton);
      docItem.appendChild(documentDataContainer);
      
    }

    logoutButton.addEventListener("click", logout);
  } catch (error) {
    if (error.message === "Unauthorized") {
      alert("No autorizado!");
      return (window.location.href = "/login");
    } else {
      console.log(error);
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
      alert("Documentos subidos exitosamente!");
      window.location.reload();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error uploading documents:", error);
    alert("Error al subir documentos: " + error.message);
  }
});
