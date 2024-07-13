const socket = io();

const btnChat = document.querySelector("#botonChat");
const parrafosMensajes = document.querySelector("#parrafosMensajes");
const valueInput = document.querySelector("#chatBox");

let userEmail;

Swal.fire({
    title: "Ingrese un usuario",
    text: "Por favor ingrese su usuario",
    input: "text",
    inputValidator: (valor) => {
        return !valor && "ingrese un usuario correctamente";
    },
    allowOutsideClick: false,
}).then((resultado) => {
    userEmail = resultado.value;
    socket.emit("loadChats");
});

btnChat.addEventListener("click", () => {
    if (valueInput.value.trim().length > 0) {
        socket.emit("newMessage", { email: userEmail, message: valueInput.value });
        valueInput.value = "";
        socket.on();
    }
});

socket.on("newMessage", (newMessage) => {
    // Aquí puedes actualizar la interfaz de usuario con el nuevo mensaje
    parrafosMensajes.innerHTML += `
        <li class="liParrafosMensajes">
            <div class="spanContainer">
                <p>${newMessage.postTime}</p>
                <p>${newMessage.email}:</p>
            </div>
            <p class="userMessage">${newMessage.message}</p>
        </li>
    `;
});