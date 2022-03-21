
document.addEventListener('DOMContentLoaded', () => {

            const baseDeDatos = [
                {
                    id: 1,
                    nombre: 'Hannover',
                    precio: 700,
                    imagen: 'img/hannover.png'
                },
                {
                    id: 2,
                    nombre: 'Milano',
                    precio: 750,
                    imagen: 'img/milano.png'
                },
                {
                    id: 3,
                    nombre: 'Paris',
                    precio: 720,
                    imagen: 'img/paris.png'
                },
                {
                    id: 4,
                    nombre: 'Moscu',
                    precio: 800,
                    imagen: 'img/moscu.png'
                },
                {
                    id: 5,
                    nombre: 'Muzzarelitas',
                    precio: 600,
                    imagen: 'img/muzzarelitas.png'
                },
                {
                    id: 6,
                    nombre: 'Chickenfingers',
                    precio: 650,
                    imagen: 'img/chickenfinger.png'
                }

            ];

            let carrito = [];
            const divisa = '$';
            const DOMitems = document.querySelector('#items');
            const DOMcarrito = document.querySelector('#carrito');
            const DOMtotal = document.querySelector('#total');
            const DOMbotonVaciar = document.querySelector('#boton-vaciar');
            const DOMbotonComprar = document.querySelector('#boton-comprar');
            const miLocalStorage = window.localStorage;

            // Funciones

            function renderizarProductos() {
                baseDeDatos.forEach((info) => {
                    
                    const miNodo = document.createElement('div');
                    miNodo.classList.add('card', 'col-sm-4');
                    // Body
                    const miNodoCardBody = document.createElement('div');
                    miNodoCardBody.classList.add('card-body');
                    // Titulo
                    const miNodoTitle = document.createElement('h5');
                    miNodoTitle.classList.add('card-title');
                    miNodoTitle.textContent = info.nombre;
                    // Imagen
                    const miNodoImagen = document.createElement('img');
                    miNodoImagen.classList.add('img-fluid');
                    miNodoImagen.setAttribute('src', info.imagen);
                    // Precio
                    const miNodoPrecio = document.createElement('p');
                    miNodoPrecio.classList.add('card-text');
                    miNodoPrecio.textContent = `${divisa}${info.precio}`;
                    // Boton 
                    const miNodoBoton = document.createElement('button');
                    miNodoBoton.classList.add('btn', 'btn-primary');
                    miNodoBoton.textContent = '+';
                    miNodoBoton.setAttribute('marcador', info.id);
                    miNodoBoton.addEventListener('click', anadirProducto);
                    
                    miNodoCardBody.appendChild(miNodoImagen);
                    miNodoCardBody.appendChild(miNodoTitle);
                    miNodoCardBody.appendChild(miNodoPrecio);
                    miNodoCardBody.appendChild(miNodoBoton);
                    miNodo.appendChild(miNodoCardBody);
                    DOMitems.appendChild(miNodo);
                });
            }

            /**
            * Evento para añadir un producto al carrito de la compra
            */
            function anadirProducto(evento) {
                
                carrito.push(evento.target.getAttribute('marcador'))
                
                renderizarCarrito();
                
                guardarCarritoEnLocalStorage();
                swal({
                    title: "Gracias",
                    text: "Agregaste la burga al carrito",
                    icon: "success",
                });
            }

            /**
            * Productos guardados en el carrito
            */
            function renderizarCarrito() {
                
                DOMcarrito.textContent = '';
                
                const carritoSinDuplicados = [...new Set(carrito)];
                
                carritoSinDuplicados.forEach((item) => {
                    
                    const miItem = baseDeDatos.filter((itemBaseDatos) => {
                        
                        return itemBaseDatos.id === parseInt(item);
                    });
                    
                    const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                        
                        return itemId === item ? total += 1 : total;
                    }, 0);
                    
                    const miNodo = document.createElement('li');
                    miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
                    miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio}`;
                    // Boton de borrar
                    const miBoton = document.createElement('button');
                    miBoton.classList.add('btn', 'btn-danger', 'mx-5');
                    miBoton.textContent = 'X';
                    miBoton.style.marginLeft = '1rem';
                    miBoton.dataset.item = item;
                    miBoton.addEventListener('click', borrarItemCarrito);
                    
                    miNodo.appendChild(miBoton);
                    DOMcarrito.appendChild(miNodo);
                });
                // Renderizo el precio total en el HTML
                DOMtotal.textContent = calcularTotal();
            }

            /**
            * Evento para borrar un elemento del carrito
            */
            function borrarItemCarrito(evento) {
                
                const id = evento.target.dataset.item;
                
                carrito = carrito.filter((carritoId) => {
                    return carritoId !== id;
                });
                
                renderizarCarrito();
                
                guardarCarritoEnLocalStorage();

            }

            
            // Calcula el precio total teniendo en cuenta los productos repetidos
            
            function calcularTotal() {
                
                return carrito.reduce((total, item) => {
                    
                    const miItem = baseDeDatos.filter((itemBaseDatos) => {
                        return itemBaseDatos.id === parseInt(item);
                    });
                    
                    return total + miItem[0].precio;
                }, 0).toFixed(2);
            }

            function vaciarCarrito() {
                
                carrito = [];
                
                renderizarCarrito();
                
                localStorage.clear();

            }

            function guardarCarritoEnLocalStorage () {
                miLocalStorage.setItem('carrito', JSON.stringify(carrito));
            }

            function cargarCarritoDeLocalStorage () {
                
                if (miLocalStorage.getItem('carrito') !== null) {
                    
                    carrito = JSON.parse(miLocalStorage.getItem('carrito'));
                }
            }
            
            function comprar() {
                swal({
                    icon: "success",
                });
                carrito = [];
                
                renderizarCarrito();
                
                localStorage.clear();
            }
            
            // Api propia

            const comentarios = document.querySelector('#listaComentarios')

            fetch('comentarios.json')
            .then(response => response.json())
            .then(data => {
                data.forEach((comments) => {
                    const li = document.createElement('li');
                    li.classList.add('containerLi')
                    li.innerHTML = `
                    <h4>${comments.name}</h4>
                    <h5>${comments.email}</h5>
                    <p>${comments.body}</p>
                    `
                    comentarios.append(li);
                }

                )
            })



            DOMbotonVaciar.addEventListener('click', vaciarCarrito);
            DOMbotonComprar.addEventListener('click', comprar);

            
            cargarCarritoDeLocalStorage();
            renderizarProductos();
            renderizarCarrito();
        });