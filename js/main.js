if(localStorage.getItem("darkMode")==null){
    localStorage.setItem("darkMode", false);
}else if(localStorage.getItem("darkMode")=="true"){
    document.body.classList.add("dark-mode");
}

//MODO OSCURO
const botonModoOscuro = document.getElementById("botonModoOscuro");
botonModoOscuro.addEventListener('click', function() {
    document.body.classList.toggle("dark-mode");
    if(localStorage.getItem("darkMode")=="false"){
        localStorage.setItem("darkMode", "true");
    }else {
        localStorage.setItem("darkMode", "false");
    }
    
});

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


//CARGO LOS PRODUCTOS ATRAVÉS DE UN FECTH DESDE UN ARCHIVO .JSON
//Tuve que agregar todas las funcionalidades del sitio dentro del fetch,
//porque prácticamente todas las funciones que tiene dependen de la carga de
//los productos. Por supuesto que en un entorno de producción debería ser
//mucho más prolijo y modularizado supongo.


fetch('https://raw.githubusercontent.com/SebaGoiburo/PFGoiburo/main/js/productos.json')
.then( respuesta => respuesta.json())
.then( data  =>{
    console.log(data);
    const cardProductos = data.reduce(( acc, elemento) => {
        return acc + `
            <div class="col cardProducto">
            <img src= ${elemento.ubicacionImagen}
            <div class="descripcionProducto">
            <div class="nombreYPrecio">
                <h3 class="nombre">${elemento.nombre}</h3>
                <h4 class="precio">${elemento.precio}</h4>
            </div>
            </div>
            </div>
        `
    }, "");
    document.getElementById("filaProductos").innerHTML = cardProductos;

    document.getElementById("filaProductos").innerHTML = cardProductos;

//Capturo productos visualizados dinamicamente
const productosVisualizados = document.getElementsByClassName("cardProducto");
console.log(productosVisualizados);


//Renderizo la lista de productos que tengo en el Ticket(Carrito)
const listaTicket = document.getElementById("listaProductos");
let listadoProductosArray = [];

function mostrarProductosEnTicket(listadoProductosArray){
    for(let i=0; i<listadoProductosArray.length; i++){
        const nuevaLinea = document.createElement('div');
        nuevaLinea.classList.add("productoYprecio")
        nuevaLinea.innerHTML = `<span class="productoTicket"> ${listadoProductosArray[i].nombre} </span> <span class="precioTicket">${listadoProductosArray[i].precio}</span><img src="/img/iconosTicket/2.png" class="iconoBorrarProducto" id="${listadoProductosArray[i].nombre}" alt="Borrar producto">`;
        listaTicket.appendChild(nuevaLinea);
    }
    agregarEscuchaABotonesBorrarProducto();
}

let total = 0.0;
const precioTotal = document.getElementById("precioTotal");
precioTotal.innerHTML = total.toString();

//Si el localStorage no está vacío, muestro los productos
if(localStorage.getItem("productosEnTicket")!== null){
    let listadoProductosJson = localStorage.getItem("productosEnTicket");
    listadoProductosArray = JSON.parse(listadoProductosJson);
    
    mostrarProductosEnTicket(listadoProductosArray);

    listadoProductosArray.forEach(function(producto) {
        let precio = parseFloat(producto.precio);
        total += precio;
    });
    precioTotal.innerHTML = `$${total.toString()}`;
}

function agregarProductoALocalStorage(nuevoProducto){
    let listadoProductosJson = localStorage.getItem("productosEnTicket");
    listadoProductosArray = JSON.parse(listadoProductosJson);
    listadoProductosArray.push(nuevoProducto);
    localStorage.setItem("productosEnTicket", JSON.stringify(listadoProductosArray));
}


//Preparo y seteo la escucha de clicks sobre los productos para que se impriman en el ticket de compra
for (let i =0; i < productosVisualizados.length; i++){
    productosVisualizados[i].addEventListener("click", function(event) {
        //Agrego el nuevo producto al Array Ticket(Carrito) y lo seteo en el LocalStorage
        let nuevoProducto = { nombre: productosVisualizados[i].children[1].children[0].innerHTML, precio: productosVisualizados[i].children[1].children[1].innerHTML };
        agregarProductoALocalStorage(nuevoProducto);

        //Creo una linea para renderizar en el div ticket el producto y el precio
        const nuevaLinea = document.createElement('div');
        nuevaLinea.classList.add("productoYprecio")
        nuevaLinea.innerHTML = `<span class="productoTicket"> ${productosVisualizados[i].children[1].children[0].innerHTML} </span> <span class="precioTicket">${productosVisualizados[i].children[1].children[1].innerHTML}</span><img src="/img/iconosTicket/2.png" class="iconoBorrarProducto" id="${productosVisualizados[i].children[1].children[0].innerHTML}" alt="Borrar producto"><br>`;
        listaTicket.appendChild(nuevaLinea);

        //Notificación de agregado al carrito mediante Toastify
        Toastify({
            text:`Agregaste ${productosVisualizados[i].children[1].children[0].innerHTML} a tu ticket!`,
            duration: 1500,
            style:{
                background: "linear-gradient(to right, rgba(0, 170, 149, 0.7), rgba(0, 170, 149, 0.3))",
                fontSize: "14px",
            },
            gravity: "bottom",
            offset: {
                x: "20vw",  
                y: "50vh",
            },
        }).showToast();

        //Agrego escucha del boton borrar producto
        let iconoBorrar = document.getElementById(`${productosVisualizados[i].children[1].children[0].innerHTML}`);
        iconoBorrar.addEventListener('click', function () {
            let lineaProducto = iconoBorrar.parentNode;
            lineaProducto.parentNode.removeChild(lineaProducto);
            borrarProducto(`${productosVisualizados[i].children[1].children[0].innerHTML}`);
        });

        //Sumo precio al total del ticket
        let precioProducto = parseFloat(`${productosVisualizados[i].children[1].children[1].innerHTML}`);
        total += precioProducto;
        precioTotal.innerHTML = `$${total.toString()}`;
       
    })
}

//TICKET- Creo función para borrar todo el ticket
function agregarEscuchaABotonBorrarTicket(){
    const iconoBorrarTicket = document.getElementById("iconoBorrarTicket");
    iconoBorrarTicket.addEventListener('click', function() {
        
        let jsonParaBorrarProducto = localStorage.getItem("productosEnTicket");
        let arrayParaBorrarProducto = JSON.parse(jsonParaBorrarProducto);
        arrayParaBorrarProducto = [];
        localStorage.setItem("productosEnTicket", JSON.stringify(arrayParaBorrarProducto));
        listaTicket.innerHTML= "";
        total = 0.00;
        precioTotal.innerHTML = `$${total.toString()}`;

        Toastify({
            text:`Ticket borrado!`,
            duration: 1500,
            style:{
                background: "linear-gradient(to right, rgba(255, 0, 0, 0.7), rgba(255, 0, 0, 0.3))",
                fontSize: "14px", 
            },
            gravity: "bottom",
            offset: {
                x: "20vw",  
                y: "50vh",
            },
            escapeMarkup: "false",
        }).showToast();
    });
}
agregarEscuchaABotonBorrarTicket();

//TICKET- Creo función para borrar productos del ticket
function borrarProducto(nombreProducto){

    let jsonParaBorrarProducto = localStorage.getItem("productosEnTicket");
    let arrayParaBorrarProducto = JSON.parse(jsonParaBorrarProducto);
    arrayParaBorrarProducto = arrayParaBorrarProducto.filter(elemento=> elemento.nombre !== nombreProducto);
    
    total = 0.00;

    arrayParaBorrarProducto.forEach(function(producto) {
        let precio = parseFloat(producto.precio);
        total += precio;
    });
    precioTotal.innerHTML = `$${total.toString()}`;

    localStorage.setItem("productosEnTicket", JSON.stringify(arrayParaBorrarProducto));
}

//Creo una función para agregar la escucha del evento click en cada ícono de borrado
function agregarEscuchaABotonesBorrarProducto(){
    let iconos = document.querySelectorAll('.iconoBorrarProducto');

    iconos.forEach(function (icono) {
        icono.addEventListener('click', function () {
        
        let linea = icono.parentNode;
        linea.parentNode.removeChild(linea);
        borrarProducto(icono.id);
        });
    });
}
}
)

//Cargo los productos en el contenedor
// const cardProductos = productos.reduce(( acc, element) => {
//     return acc + `
//         <div class="col cardProducto">
//         <img src= ${element.ubicacionImagen}
//         <div class="descripcionProducto">
//         <div class="nombreYPrecio">
//             <h3 class="nombre">${element.nombre}</h3>
//             <h4 class="precio">${element.precio}</h4>
//         </div>
//         </div>
//         </div>
//     `
// }, "");




