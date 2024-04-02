const form = document.querySelector("form");
const productList = document.getElementById("productList");

const getCurrentUser = async () => {
  try {
    const response = await fetch("/api/users/current");
    const data = await response.json();
    return data.data;
  } catch (error) {
    alert("Ocurrió un error al obtener el usuario actual");
    window.location.href = "/login";
  }
};

const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("productImage", imageFile); // Cambiado a "productImage"

    const response = await fetch("/images", {
      method: "POST",
      body: formData,
    });

    const { url } = await response.json();
    if (url) {
      return url;
    } else {
      throw new Error("No se ha recibido la URL de la imagen");
    }
  } catch (error) {
    console.error("Error al cargar la imagen:", error);
    alert("Ocurrió un error al cargar la imagen");
  }
};

const updateHeader = (username) => {
  const productHeader = document.getElementById("productHeader");
  if (productHeader) {
    productHeader.textContent = `Listado de Productos - ${username}`;
  }
};

const sendProductData = async (username) => {
  const socket = io({
    auth: {
      username: username || "admin",
    },
  });

  // send message/product
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Obtén los valores de los campos del formulario dentro del evento submit
    const title = document.getElementById("productTitle").value;
    const description = document.getElementById("productDescription").value;
    const price = document.getElementById("productPrice").value;
    const code = document.getElementById("productCode").value;
    const status = document.getElementById("productStatus").checked; // Para checkbox
    const stock = document.getElementById("productStock").value;
    const category = document.getElementById("productCategory").value;
    const imageFile = document.getElementById("productImage").files[0];
    const thumbnail = [];

    // Validations
    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !category ||
      !imageFile
    ) {
      Swal.fire({
        title: "Error!",
        text: "Todos los campos son obligatorios",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    const url = await uploadImage(imageFile);
    thumbnail.push(url);

    const addProductOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        price,
        thumbnail,
        code,
        status,
        stock,
        category,
      }),
      credentials: "include",
    };

    await fetch(`http://localhost:8080/api/products`, addProductOptions)
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          throw new Error("No estas autorizado para agregar productos");
        }
        if (!res.ok) {
          throw new Error("Error al agregar el producto: " + res.statusText);
        }
        return res.json();
      })
      .then((res) => {
        Swal.fire({
          title: "Producto agregado correctamente",
          icon: "success",
          confirmButtonText: "Ok",
        });
        return socket.emit("addProduct");
      })
      .catch((err) => {
        Swal.fire({
          title: "Ocurrió un error al agregar el producto!",
          text: err.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      });

    form.reset();
  });

  // Get products
  socket.on("getProducts", (data) => {
    productList.innerHTML = "";
    for (const product of data.products) {
      const productItem = document.createElement("div");
      productItem.classList.add("product-item");

      const imgContainer = document.createElement("div"); // Contenedor para la imagen
      const img = document.createElement("img");
      img.src = product.thumbnail;
      img.alt = product.title;
      img.width = 100;
      img.height = 100;
      imgContainer.appendChild(img);

      imgContainer.addEventListener("click", () => {
        window.open(`${product.thumbnail}`, "_blank");
      });

      imgContainer.addEventListener("mouseover", () => {
        imgContainer.style.cursor = "pointer";
      });

      const title = document.createElement("p");
      title.textContent = product.title;

      const price = document.createElement("p");
      price.textContent = `$${product.price}`;

      const owner = document.createElement("p");
      owner.textContent = `${product.owner}`;

      // Delete Product
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";

      deleteButton.addEventListener("click", () => {
        Swal.fire({
          title: "Confirmación",
          text: "¿Estás seguro que quieres eliminar este producto? Esta acción no puede revertirse",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Eliminar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            fetch(`http://localhost:8080/api/products/${product._id}`, {
              method: "DELETE",
              credentials: "include",
            })
              .then((res) => {
                if (res.status === 401 || res.status === 403) {
                  throw new Error("No estas autorizado eliminar este producto");
                }
                if (!res.ok) {
                  throw new Error(
                    "Error al agregar el producto: " + res.statusText
                  );
                }
                return res.json();
              })
              .then((res) => {
                Swal.fire({
                  title: "Producto eliminado correctamente",
                  icon: "success",
                  confirmButtonText: "Ok",
                });
                return socket.emit("deleteProduct");
              })
              .catch((err) => {
                return Swal.fire({
                  title: "Ocurrió un error al eliminar el producto!",
                  text: err.message,
                  icon: "error",
                  confirmButtonText: "Ok",
                });
              });
          }
        });
      });

      productItem.appendChild(imgContainer);
      productItem.appendChild(title);
      productItem.appendChild(price);
      productItem.appendChild(owner);
      productItem.appendChild(deleteButton);

      productList.appendChild(productItem);
    }
  });
};

// User Conected
// socket.on("new-user", (username) => {
//   Swal.fire({
//     text: `Bienvenido ${username}`,
//     toast: true,
//     position: "top-right",
//     timer: 2500,
//     timerProgressBar: true,
//     showConfirmButton: false,
//   });
// });

// User Disconected
// socket.on("user-disconnected", (username) => {
//   Swal.fire({
//     text: `Te vamos a extrañar ${username}! Esperamos que vuelvas pronto`,
//     toast: true,
//     position: "top-right",
//     timer: 2500,
//     timerProgressBar: true,
//     showConfirmButton: false,
//   });
// });

getCurrentUser().then((user) => {
  updateHeader(`${user.email} (${user.rol})`);
  sendProductData(user.email);
});
