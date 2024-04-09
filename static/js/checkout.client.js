window.addEventListener("load", async () => {
  try {
    const urlParams = window.location.href;
    const cartId = urlParams.split("/").pop();

    const response = await fetch(`http://localhost:8080/api/orders/${cartId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch cart data");
    }

    const data = await response.json();
    const cartItems = document.getElementById("cartItems");
    const totalAmount = document.getElementById("totalAmount");
    let totalPrice = 0;
    data.products.forEach((product) => {
      const total = parseInt(product.quantity) * product.price;
      totalPrice += total;
      const row = `<tr>
                                <td>${product.title}</td>
                                <td>${product.code}</td>
                                <td>$${product.price}</td>
                                <td>${product.quantity}</td>
                                <td>$${total}</td>
                            </tr>`;
      cartItems.insertAdjacentHTML("beforeend", row);
    });
    totalAmount.textContent = `Total: $${totalPrice}`;
  } catch (error) {
    console.error("Error:", error);
  }
});

document.getElementById("confirmButton").addEventListener("click", async () => {
  const urlParams = window.location.href;
  const cartId = urlParams.split("/").pop();

  try {
    const response = await fetch(`http://localhost:8080/api/orders/${cartId}`, {
      method: "POST",
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("Ocurrio un error al procesar la compra");
    }

    const data = await response.json();
    console.log(data);

    Swal.fire({
      title: "Compra realizada con éxito",
      text: "Gracias, vuelvas prontos!",
      icon: "success",
      imageUrl: "https://i.ytimg.com/vi/0T9HXhgNhWU/maxresdefault.jpg",
      imageHeight: 300,
      imageAlt: "Apu agradeciendo la compra",
      confirmButtonText: "Ok",
    }).then(() => {
      window.location.href = "/realTimeProducts";
    });
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "Ocurrió un error al procesar la compra",
      text: error.message,
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
});
