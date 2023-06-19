class Curso{
    constructor(nombre, id, tipo, precio, descripcion){
        this.nombre = nombre;
        this.id = id;
        this.tipo = tipo;
        this.precio = precio;
        this.cupo = cupo;
        this.descripcion = descripcion;
    }
}

// Base Datos
const cursosBase = [
    {nombre: "Inglés para adultos", id: "001", tipo: "Senior", precio: 15000,  descripcion: "Duración: 5 meses. Lenguaje de uso general, comunicacional. Nivel Básico a intermedio."},
    {nombre: "Inglés Jurídico", id: "002", tipo: "Senior", precio: 20000, descripcion: "Duración: 5 meses. Uso general y técnico. Nivel Intermedio a avanzado."},
    {nombre: "Cursos Teen", id: "003", tipo: "Teen", precio: 18000, descripcion: "Duración: 5 meses. Combo de dos Idiomas (Inglés, Portugues, Francés). Nivel Básico."},
    {nombre: "Nivel Inicial", id: "004", tipo: "Kids", precio: 10000, descripcion: "Duración: 5 meses. Nivel inicial de 3 a 5 años."},
    {nombre: "Inglés para diseño gráfico", id: "005", tipo: "Teen", precio: 12000, descripcion: "Duración: 3 meses."},
    {nombre: "Inglés y Arte", id: "006", tipo: "Teen", precio: 12000, descripcion: "Duración: 3 meses."}
];

// Local storage
const cursos = JSON.parse(localStorage.getItem("cursos")) || [] 
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
const inscripcion = JSON.parse(localStorage.getItem("inscripcion")) || []

const agregarCurso = ({nombre, id, tipo, precio, descripcion})=>{
    if(cursos.some(cur=>cur.id===id)){
        //Avisaría que el curso ya existe
    } else {
        const cursoNuevo = new Curso(nombre, id, tipo, precio, descripcion);
        cursos.push(cursoNuevo);
        localStorage.setItem('cursos', JSON.stringify(cursos))
    }
}

const cursoExtistente = ()=>{
    if (cursos.length===0){
        cursosBase.forEach(cur=>{
            let dato = JSON.parse(JSON.stringify(cur));
            agregarCurso(dato)}
        )
    }
}

const totalCarrito = ()=>{
    let total = carrito.reduce((acumulador, {precio, cantidad})=>{
        return acumulador + (precio*cantidad);
    }, 0)
    return total
}

const totalCarritoRender = ()=>{
    const carritoTotal = document.getElementById("carritoTotal");
    carritoTotal.innerHTML=`Precio total: $ ${totalCarrito()}`;
}

// agrega cursos al carrito
const agregarCarrito = (objetoCarrito)=>{
    carrito.push(objetoCarrito);
    totalCarritoRender()
}

const renderizarCarrito = ()=>{
    const listaCarrito = document.getElementById("listaCarrito");
    listaCarrito.innerHTML="";
    carrito.forEach(({nombre, precio, cantidad, id}) =>{
        let elementoLista = document.createElement("li");
        elementoLista.innerHTML=`Curso: ${nombre} * Precio del curso: $ ${precio} * Cantidad:${cantidad} <button id="eliminarCarrito${id}">Eliminar</button>`;
        listaCarrito.appendChild(elementoLista);
        const botonBorrar = document.getElementById(`eliminarCarrito${id}`);
        botonBorrar.addEventListener("click",()=>{
            carrito = carrito.filter((elemento)=>{
                if(elemento.id !== id){
                    return elemento
                }
            })
            let carritoString = JSON.stringify(carrito);
            localStorage.setItem("carrito", carritoString);
            renderizarCarrito()
        })
        let carritoString = JSON.stringify(carrito);
        localStorage.setItem("carrito", carritoString);
    })
}

const borrarCarrito = ()=>{
    carrito.length = 0 
    let carritoString = JSON.stringify(carrito);
    localStorage.setItem("carrito", carritoString);
    renderizarCarrito()
}

//renderiza el DOM
const renderizarCursos = (arrayUtilizado)=>{
    const contenedorCursos = document.getElementById("contenedorCursos")
    contenedorCursos.innerHTML = "";
    arrayUtilizado.forEach(({nombre, id, tipo, precio, descripcion})=>{
        const curCard = document.createElement("div")
        curCard.classList.add("col-xs")
        curCard.classList.add("card")
        curCard.style = "width: 300px;height:300px; margin:20px"
        curCard.id = id
        curCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${nombre}</h5>
                    <h6>${tipo}</h6>
                    <p class="card-text">${descripcion}</p>
                    <span>Precio: $ ${precio}</span>
                    <form id="form${id}">
                        <label for="contador${id}">Cantidad</label>
                        <input tipo="number" placeholder="0" id="contador${id}">
                        <button class="btn btn-primary" id="botonCur${id}">Agregar</button>
                    </form>
                </div>`
        contenedorCursos.appendChild(curCard)
        const boton = document.getElementById(`botonCur${id}`)
        boton.addEventListener("click",(e)=>{
            e.preventDefault()
            const contadorCantidad = Number(document.getElementById(`contador${id}`).value)
            if(contadorCantidad>0){
                agregarCarrito({nombre, id, tipo, precio, descripcion, cantidad:contadorCantidad})
                renderizarCarrito()
                const form = document.getElementById(`form${id}`)
                form.reset()
            }
        }) 
    })
}

const comprar = (event)=>{
    const data = new FormData(event.target);
    const cliente = Object.fromEntries(data);
    const ticket = {cliente: cliente, total:totalCarrito(), id:inscripcion.length, cursos:carrito};
    inscripcion.push(ticket);
    localStorage.setItem("inscripcion", JSON.stringify(inscripcion));
    borrarCarrito();
    let mensaje = document.getElementById("carritoTotal");
    mensaje.innerHTML = "Muchas gracias por su compra! En breve nos pondremos en contacto con Usted."

};

// DOM
const compraFinal = document.getElementById("formCompraFinal")
compraFinal.addEventListener("submit",(event)=>{
    event.preventDefault()
    if(carrito.length>0){
        comprar(event)
    } else {
        //Advierte carrito vacio
    }
});



const app = ()=>{
    cursoExtistente();
    renderizarCursos(cursos);
    renderizarCarrito();
    totalCarritoRender();
};


app()