window.addEventListener("load", async () => {
  try {
    const response = await fetch("/api/users");

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

    const users = await response.json();
    const tableBody = document.getElementById("usersTableBody");

    for (const user of users) {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = user.name;
      row.appendChild(nameCell);

      const emailCell = document.createElement("td");
      emailCell.textContent = user.email;
      row.appendChild(emailCell);

      const rolCell = document.createElement("td");

      if (user.rol === "admin") {
        rolCell.textContent = "Admin";
      } else {
        const editSelect = document.createElement("select");

        const userOption = document.createElement("option");
        userOption.value = "user";
        userOption.textContent = "User";
        const premiumOption = document.createElement("option");
        premiumOption.value = "premium";
        premiumOption.textContent = "Premium";

        if (user.rol === "user") {
          editSelect.appendChild(userOption);
          editSelect.appendChild(premiumOption);
        } else {
          editSelect.appendChild(premiumOption);
          editSelect.appendChild(userOption);
        }

        if (user.rol === "user") {
          userOption.selected = true;
        } else {
          premiumOption.selected = true;
        }

        editSelect.addEventListener("change", async (event) => {
          try {
            const response = await fetch(`/api/users/premium/${user.email}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ rol: event.target.value }),
            });

            if (response.status === 200) {
              Swal.fire({
                text: `Usuario actualizado exitosamente`,
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
              text: `Error al actualizar usuario: ${error.message}`,
              toast: true,
              position: "top-right",
              timer: 2500,
              timerProgressBar: true,
              showConfirmButton: false,
              icon: "error",
            });
          }
        });

        rolCell.appendChild(editSelect);
      }

      row.appendChild(rolCell);
      const actionsCell = document.createElement("td");

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";

      if (user.rol === "admin") {
        deleteButton.style.display = "none";
      }

      deleteButton.addEventListener("click", async () => {
        try {
          const response = await fetch(`/api/users/${user.email}`, {
            method: "DELETE",
          });

          if (response.status === 200) {
            Swal.fire({
              text: `Usuario eliminado exitosamente`,
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
            text: `Error al eliminar usuario: ${error.message}`,
            toast: true,
            position: "top-right",
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: "error",
          });
        }
      });

      actionsCell.appendChild(deleteButton);
      row.appendChild(actionsCell);
      tableBody.appendChild(row);
    }
  } catch (error) {
    console.log("Error", error);
    Swal.fire({
      title: "Error!",
      text: "Algo salió mal. Por favor, inténtelo de nuevo",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
});
