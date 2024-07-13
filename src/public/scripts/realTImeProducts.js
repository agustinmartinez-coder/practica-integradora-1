const socket = io();
const form = document.getElementById("newProductForm");
const productsBody = document.getElementById("productsBody");



form.addEventListener("submit", (e) => {
  e.preventDefault();
  const datForm = new FormData(e.target);
  console.log(datForm);
  const prod = Object.fromEntries(datForm);
  socket.emit("newProduct", prod);
  e.target.reset();
});

const createTableRow = (prod) => {
  let row = document.createElement("tr");
  row.innerHTML = `
    <td>${prod.title}</td>
    <td>${prod.description}</td>
    <td class="m-auto">
    </td>
    <td>${prod.price}</td>
    <td>${prod.code}</td>
    <td>${prod.stock}</td>
    <td>
      <button class="btn btn-danger btn-sm" onclick="removeProduct('${prod._id}')">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
    </td>
  `;
  row.id = `productRow${prod._id}`;
  return row;
};

const renderProducts = (data) => {
  productsBody.innerHTML = "";
  if (data && Array.isArray(data)) {
    data.forEach((prod) => {
      const row = createTableRow(prod);
      productsBody.appendChild(row);
    });
  } else {
    console.error("Error al cargar los productos: datos no válidos");
  }
};

const removeProduct = (prodId) => {
  console.log(prodId)
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    socket.emit("removeProduct", prodId);
  }
};

socket.on("prodsData", renderProducts);

socket.on("productRemoved", (removedProductId) => {
  const tableRowToRemove = document.getElementById(
    `productRow${removedProductId}`
  );
  if (tableRowToRemove) {
    tableRowToRemove.remove();
  } else {
    console.error("No se encontró la fila del producto a eliminar");
  }
});

socket.emit("getProducts");