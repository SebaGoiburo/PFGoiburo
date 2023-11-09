

if(localStorage.getItem("username")===null){
    window.addEventListener('load', function() {
        // Ventana emergente
        document.getElementById('popup').style.display = 'block';
    
    
        let popup = document.getElementById('popup');
        let popupForm = document.getElementById('popupForm');
        let usernameInput = document.getElementById('username');
        let emailInput = document.getElementById('email');
        let submitBtn = document.getElementById('submitBtn');
    
        if(usernameInput !== "" || emailInput !== ""){
            submitBtn.addEventListener('click', function() {
                var username = usernameInput.value;
                var email = emailInput.value;
            
                // Guardo valores en el LocalStorage para utilizarlos en la bienvenida y en el ticket
                localStorage.setItem('username', username);
                localStorage.setItem('email', email);
            
                // Oculto el div popup
                popup.style.display = 'none';
            });
        }
    });
    
    if(localStorage.getItem("username")){
        let username = localStorage.getItem("username");
        mostrarMensajeBienvenida(username);
    }
};

//Muestro mensaje de bienvenida con los datos solicitados al usuario y alojados en el LocalStorage
mostrarMensajeBienvenida(localStorage.getItem("username"));

function mostrarMensajeBienvenida(username) {
    let mensajeBienvenida = document.getElementById('mensajeBienvenida');
    mensajeBienvenida.innerHTML = '¡Bienvenid@, ' + username + '!';
    mensajeBienvenida.style.display = 'block';
}

//Cargo los productos en el contenedor
const cardProductos = productos.reduce(( acc, element) => {
    return acc + `
        <div class="col cardProducto">
        <img src= ${element.ubicacionImagen}
        <div class="descripcionProducto">
        <div class="nombreYPrecio">
            <h3 class="nombre">${element.nombre}</h3>
            <h4 class="precio">${element.precio}</h4>
        </div>
        </div>
        </div>
    `
}, "");

document.getElementById("filaProductos").innerHTML = cardProductos;

//Renderizo la lista de productos que tengo en el Ticket(Carrito)
let listadoProductosArray = [];
let listadoProductosJson = localStorage.getItem("productosEnTicket");
listadoProductosArray = JSON.parse(listadoProductosJson);

const listaTicket = document.getElementById("listaProductos");

function mostrarProductosEnTicket(listadoProductosArray){
    
}

//Prueba de productos visualizados
const productosVisualizados = document.getElementsByClassName("cardProducto");
console.log(productosVisualizados);

//Seteo un precio total en $0
const precioTotal = document.getElementById("precioTotal");
let total = 0.00;
precioTotal.innerHTML= `$${total}`;




//Preparo y seteo la escucha de clicks sobre los productos para que se impriman en el ticket de compra
for (let i =0; i < productosVisualizados.length; i++){
    productosVisualizados[i].addEventListener("click", ()=>{
        //Agrego el nuevo producto al Array Ticket(Carrito) y lo seteo en el LocalStorage
        let nuevoProducto = { nombre: productosVisualizados[i].children[1].children[0].innerHTML, precio: productosVisualizados[i].children[1].children[1].innerHTML };
        listadoProductosArray.push(nuevoProducto);
        localStorage.setItem("productosEnTicket", JSON.stringify(listadoProductosArray));

        //Creo una linea para renderizar en el div ticket el producto y el precio
        const nuevaLinea = document.createElement('div');
        nuevaLinea.innerHTML = `<span class="productoTicket"> ${productosVisualizados[i].children[1].children[0].innerHTML} </span> <span class="precioTicket">${productosVisualizados[i].children[1].children[1].innerHTML}</span><br><img src="/img/iconosTicket/2.png" alt="Borrar producto" onclick="borrarProducto()">`;
        listaTicket.appendChild(nuevaLinea);

        //Creo una variable para recibir el precio en String y parsearlo a double
        let precioString = productosVisualizados[i].children[1].children[1].innerHTML;
        let precioDouble = parseFloat(precioString);

        //Creo una variable acumuladora
        total += precioDouble;
        localStorage.setItem("precioTotal", total.toString());
        precioTotal.innerHTML= total.toString();

    })
}

console.log(total);

