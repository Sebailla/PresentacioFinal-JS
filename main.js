// Agredado de productos

class Producto {
    constructor(id, img, name, origen, price, stock) {
        this.id = id;
        this.img = img;
        this.name = name;
        this.origen = origen;
        this.price = price;
        this.stock = stock
    }
}
const newCards = document.getElementById("newCards");
const productos = [];

tienda();

function tienda() {fetch("./data.json")
    .then(response => response.json())
    .then(data => {
        data.forEach(producto => {
            productos.push(new Producto(producto.id, producto.img, producto.name,
                producto.origen, producto.price, producto.stock))
        });
        //console.log(productos);
        productos.forEach(producto => {
            newCards.innerHTML += `
        <div class="cardShop" id="${producto.id}">
            <img src="${producto.img}" alt="Imagen ${producto.name}"/>
            <h3>${producto.name}</h3>
            <h6><b>Origen:</b> <br> <br> <span>${producto.origen}</span></h6>
            <h4>$ <span>${producto.price}</span></h4>
            <h5>Disponible: <span>${producto.stock}</span></h5>
            <button class="btnAddCart" type="input" id="${producto.id}">Comprar</button>
        </div>
        `
        })
    })}

//Buscar producto
const btnSearch = document.getElementById("btnSearch");
btnSearch.addEventListener("click", buscarPez);

function buscarPez() {

    const search = document.getElementById("search");
    let buscarPez = search.value.trim().toUpperCase();
    let resultado = productos.filter((producto) => producto.name.toUpperCase().includes(buscarPez));

    if (resultado.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ingrese valores válidos."
        });
        return;
    }

    if (resultado.length > 0) {

        Swal.fire({
            title: 'Se encontraron los siguiente items:',
            html:
                '<div class="cardShop" id="${producto.id}">' +
                resultado.map(producto => `<img src="${producto.img}" alt="Imagen ${producto.name}"/>`).join() +
                resultado.map(producto => `<h3>${producto.name}</h3>`).join() +
                resultado.map(producto => `<h4>$ <span>${producto.price}</span></h4>`).join() +
                '<div/>',
            confirmButtonText: 'OK'

        })

    } else {
        Swal.fire({
            title: 'No se encontraron coincidencias',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }

    search.value = "";
}

//=========   Carrito    ==================

const btnCart = document.querySelector(".containerCartIcon");
const containerCartProducts = document.querySelector(
    ".containerCartProducts"
);

btnCart.addEventListener("click", () => {
    containerCartProducts.classList.toggle("hiddenCart");
});


const cartInfo = document.querySelector(".cartProduct");
const rowProduct = document.querySelector(".rowProduct");

// Lista de todos los contenedores de productos del cart
const productsList = document.querySelector(".productosShop");

// Variable de array de Productos
let allProducts = [];

const valorTotal = document.querySelector(".totalPagar");

const countProducts = document.querySelector("#contadorProductos");

const cartEmpty = document.querySelector(".cartEmpty");
const cartTotal = document.querySelector(".cartTotal");


productsList.addEventListener("click", addProductc);

//Agregar al carrito

function addProductc(e) {
    if (e.target.classList.contains("btnAddCart")) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            name: product.querySelector("h3").textContent,
            price: product.querySelector("h4").textContent,
        };

        //Agregamos el producto al Cart y confirmamos si ya existe
        const existe = allProducts.some(
            product => product.name === infoProduct.name
        );

        if (existe) {
            const products = allProducts.map(product => {
                if (product.name === infoProduct.name) {
                    product.quantity++;
                    return product;
                } else {
                    return product;
                }
            });
            allProducts = [...products];
        } else {
            allProducts = [...allProducts, infoProduct];
        }

        showHTML();

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Producto agregado al Carrito',
            showConfirmButton: false,
            timer: 1000
        })
    }
};

// Eliminar item de cart

rowProduct.addEventListener("click", deletProduct);

function deletProduct(e) {
    if (e.target.classList.contains("iconClose")) {
        const product = e.target.parentElement;
        const name = product.querySelector("p").textContent;

        allProducts = allProducts.filter(
            product => product.name !== name
        )

        showHTML();
    };
}


// Vaciar Cart

const vaciar = document.getElementById("btnVaciar");
vaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    if (allProducts !== []) {

        allProducts = [];
        showHTML();

        const containerProduct = document.createElement("div");
        containerProduct.classList.add("cartProduct");

        containerProduct.innerHTML = `
            <div class="infoCartProduct">
            <p class="cartEmpty">Carrito Vacío</p>
            </div>
        `;

        rowProduct.append(containerProduct);
    }
}

// Funcion para mostrar HTML cart
function showHTML() {

    // Limpiar HTML
    rowProduct.innerHTML = "";

    let total = 0;
    let totalOfProducts = 0;


    allProducts.forEach(product => {
        const containerProduct = document.createElement("div");
        containerProduct.classList.add("cartProduct");

        containerProduct.innerHTML = `
            <div class="infoCartProduct">
                <span class="quantityProductoCarrito">${product.quantity}</span>
                <p class="nameProductoCarrito">${product.name}</p>
                <span class="priceProductoCarrito">${product.price}</span>
            </div>
            <img src="./img/ico/eliminar-papelera.png" alt="delete" class="iconClose">
            
        `;

        rowProduct.append(containerProduct);
        // Total a pagar
        total = total + parseInt(product.quantity * product.price.slice(1));
        // Total de productos
        totalOfProducts = totalOfProducts + product.quantity;

    });

    valorTotal.innerText = `$ ${total}`;
    countProducts.innerText = totalOfProducts;

};
