const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
const whatsappOverlay = document.getElementById("whatsappOverlay");
const wapp = document.getElementById("wapp");



class Empresa {
    constructor(nombre,background,logo,numero){
        this.nombre = nombre;
        this.background = background;
        this.logo = logo;
        this.numero = numero;
    }
    toHtml() {
        return `
            <img src="${this.logo}"alt="">
            <h2>${this.nombre}</h2>
            <p>Escribinos al Whatsapp ${this.numero}</p>`
    }
}

const empresa = new Empresa("RestoFan", "", "", "+542804220856");

class Overlay {
    constructor() {
        this.overlay = document.createElement("div");
        this.overlay.style.position = "fixed";
        this.overlay.style.top = "0";
        this.overlay.style.left = "0";
        this.overlay.style.width = "100vw";
        this.overlay.style.height = "100vh";
        this.overlay.style.background = "rgba(0,0,0,0.5)";
        this.overlay.style.display = "flex";
        this.overlay.style.alignItems = "center";
        this.overlay.style.justifyContent = "center";
        this.overlay.style.zIndex = "1000";
        this.overlay.style.backdropFilter = "blur(5px)";
        this.overlay.style.opacity = "0"; // inicio transparente
        this.overlay.style.transition = "opacity 0.3s ease"; // transición
    }
}

class Popup {
    constructor(producto) {
        this.pic = document.createElement("img");
        this.pic.style.width = "30vh";
        this.pic.src = producto.img;
        this.pic.style.filter = "drop-shadow(2px 19px 15px #000000)";
        const closeBtn = document.createElement("button");
        const addToCartBtn = document.createElement("button");
        addToCartBtn.textContent = "Agregar al Carrito";
        addToCartBtn.style.marginTop = "20px";
        addToCartBtn.style.padding = "12px 24px";
        addToCartBtn.style.backgroundColor = "#27ae60";
        addToCartBtn.style.color = "white";
        addToCartBtn.style.border = "none";
        addToCartBtn.style.borderRadius = "5px";
        addToCartBtn.style.cursor = "pointer";
        addToCartBtn.style.fontSize = "16px";
        addToCartBtn.style.fontWeight = "bold";
        addToCartBtn.addEventListener("click", () => {
            carrito.agregarProd(producto);
        });
        closeBtn.textContent = "✖";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "5px";
        closeBtn.style.right = "15px";
        closeBtn.style.borderStyle = "none";
        closeBtn.style.background = "transparent";
        closeBtn.style.fontSize = "30px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.filter = "drop-shadow(0px 0px 2px #e5a50a)";
        closeBtn.addEventListener("click", () => this.destroy());



        const textoTitulo = document.createElement("p");
        textoTitulo.style.textAlign = "center";
        textoTitulo.style.fontSize = "30px";
        textoTitulo.style.paddingTop = "10px";
        textoTitulo.style.paddingBottom = "10px";
        textoTitulo.style.fontFamily = "'The Sherloks', serif";
        textoTitulo.textContent = producto.nombre;

        const textoDetalle = document.createElement("p");
        textoDetalle.style.textAlign = "center";
        textoDetalle.style.fontSize = "18px";
        textoDetalle.style.paddingTop = "10px";

        textoDetalle.style.fontFamily = "'The Sherloks', serif";
        textoDetalle.textContent = producto.detalle;

        this.element = new DivOverlay().element;
        this.overlay = new Overlay().overlay;

        this.element.appendChild(textoTitulo);
        this.element.appendChild(this.pic);
        this.element.appendChild(closeBtn);
        this.element.appendChild(textoDetalle);
        this.overlay.appendChild(this.element);
        this.element.appendChild(addToCartBtn);
        document.body.appendChild(this.overlay);
        this.bloquear();
        void this.overlay.offsetWidth;

        requestAnimationFrame(() => {
            this.overlay.style.opacity = "1"; // fade in overlay
            this.element.style.transform = "scale(1)";
            this.element.style.opacity = "1";
        });
    }
    bloquear() {
        document.body.style.overflow = "hidden";
    }
    destroy() {
        this.overlay.style.opacity = "0";
        this.element.style.transform = "scale(0.8)";
        this.element.style.opacity = "0";

        // Esperar la transición antes de eliminar
        setTimeout(() => {
            this.overlay.remove();
            document.body.style.overflow = "auto";
        }, 300); // mismo tiempo que transition
    }
}

class Prod {

    constructor(id, nombre, precio, detalle, img, cat) {
        this.nombre = nombre;
        this.precio = precio;
        this.detalle = detalle;
        this.img = img;
        this.id = id;
        this.cat = cat;
    }
    toHtml() {
        return `<label class="item" data-producto-id="${this.id}">
            <div class="itemInfo">
                <h3 class="name"> ${this.nombre}</h3>
                    <p class="det">${this.detalle}</p>
                    <p class="price">${this.precio}</p>
            </div>
            <img src="${this.img}" alt="${this.nombre}" class="item-img">
        </label >
        `
    }
}

class Categoria {
    constructor(id,nombre,img) {
        this.id = id;
        this.nombre = nombre;
        this.img = img;
    }
    toHtmlList() {
        return `<li><a href="#${this.nombre}" onclick="closeTab();">${this.nombre}</a></li>`
    }
    toHtmlCat() {
        return `<section id="${this.nombre}" class="categoria">
      <h2>${this.nombre}</h2>
      <div class="menu-list" id="${this.id}">
      </div>
    </section>`
    }
}

class DivOverlay {
    constructor() {

        this.element = document.createElement("div");
        this.element.id = "popup";

        this.element.style.alignItems = "center";
        this.element.style.display = "flex";
        this.element.style.flexDirection = "column";
        this.element.style.position = "relative";
        this.element.style.background = "#333";
        this.element.style.padding = "8px";
        this.element.style.color = "#fff";
        this.element.style.borderRadius = "6px";
        this.element.style.fontSize = "14px";
        this.element.style.pointerEvents = "auto";
        this.element.style.boxShadow = "0px 0px 27px 11px #000000";
        this.element.style.transform = "scale(0.8)"; // empieza reducido
        this.element.style.opacity = "0"; // empieza invisible
        this.element.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    }
}


class Cart {
    constructor() {
        this.itemsCart = [];
        this.init();
    }

    init() {
        // Cargar carrito desde localStorage si existe
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.itemsCart = JSON.parse(savedCart);
        }
        this.updateCartUI();
    }

    agregarProd(prod) {
        // Verificar si el producto ya existe en el carrito
        const existingItem = this.itemsCart.find(item => item.id === prod.id);

        if (existingItem) {
            existingItem.cantidad++;
        } else {
            this.itemsCart.push({
                id: prod.id,
                nombre: prod.nombre,
                precio: prod.precio,
                detalle: prod.detalle,
                img: prod.img,
                cantidad: 1
            });
        }

        this.guardarCarrito();
        this.updateCartUI();
        this.mostrarNotificacion(`${prod.nombre} agregado al carrito`);
    }

    eliminarProd(id) {
        this.itemsCart = this.itemsCart.filter(item => item.id !== id);
        this.guardarCarrito();
        this.updateCartUI();
    }

    modificarCantidad(id, nuevaCantidad) {
        const item = this.itemsCart.find(item => item.id === id);
        if (item) {
            if (nuevaCantidad <= 0) {
                this.eliminarProd(id);
            } else {
                item.cantidad = nuevaCantidad;
                this.guardarCarrito();
                this.updateCartUI();
            }
        }
    }

    vaciarCarrito() {
        this.itemsCart = [];
        this.guardarCarrito();
        this.updateCartUI();
    }

    calcularTotal() {
        return this.itemsCart.reduce((total, item) => {
            return total + (item.precio * item.cantidad);
        }, 0);
    }

    getCantidadTotal() {
        return this.itemsCart.reduce((total, item) => total + item.cantidad, 0);
    }

    guardarCarrito() {
        localStorage.setItem('cart', JSON.stringify(this.itemsCart));
    }

    updateCartUI() {
        // Actualizar badge del contador
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
            const cantidad = this.getCantidadTotal();
            cartBadge.textContent = cantidad;
            cartBadge.style.display = cantidad > 0 ? 'flex' : 'none';
        }

        // Actualizar contenido del carrito si está abierto
        this.renderCartItems();
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartFooter = document.getElementById('cart-footer');

        if (!cartItemsContainer) return;

        if (this.itemsCart.length === 0) {
            cartItemsContainer.innerHTML = '';
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (cartFooter) cartFooter.style.display = 'none';
            return;
        }

        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'flex';

        cartItemsContainer.innerHTML = this.itemsCart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <p class="cart-item-price">$${item.precio.toLocaleString('es-AR')}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="btn-cantidad" onclick="carrito.modificarCantidad(${item.id}, ${item.cantidad - 1})">-</button>
                    <span class="cantidad">${item.cantidad}</span>
                    <button class="btn-cantidad" onclick="carrito.modificarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                    <button class="btn-eliminar" onclick="carrito.eliminarProd(${item.id})">🗑️</button>
                </div>
                <div class="cart-item-subtotal">
                    $${(item.precio * item.cantidad).toLocaleString('es-AR')}
                </div>
            </div>
        `).join('');

        if (cartTotal) {
            cartTotal.textContent = `$${this.calcularTotal().toLocaleString('es-AR')}`;
        }
    }

    toggleCart() {
        const cartPanel = document.getElementById('cart-panel');
        if (cartPanel) {
            cartPanel.classList.toggle('active');
            if (cartPanel.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }
    }

    generarMensajeWhatsApp() {
        if (this.itemsCart.length === 0) {
            alert('El carrito está vacío');
            return '';
        }

        let mensaje = '¡Hola! Quiero hacer el siguiente pedido:\n\n';

        this.itemsCart.forEach(item => {
            mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString('es-AR')}\n`;
        });

        mensaje += `\n*Total: $${this.calcularTotal().toLocaleString('es-AR')}*`;

        return encodeURIComponent(mensaje);
    }

    finalizarCompra() {
        const mensaje = this.generarMensajeWhatsApp();
        if (mensaje) {
            // Reemplaza este número con el número de WhatsApp del negocio

            const url = `https://wa.me/${empresa.numero}?text=${mensaje}`;
            window.open(url, '_blank');

            // Opcional: vaciar el carrito después de enviar
            // this.vaciarCarrito();
        }
    }

    mostrarNotificacion(mensaje) {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = mensaje;
        document.body.appendChild(notification);

        // Mostrar con animación
        setTimeout(() => notification.classList.add('show'), 10);

        // Ocultar y eliminar después de 2 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}


const carrito = new Cart();


document.addEventListener('DOMContentLoaded', () => {
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => carrito.toggleCart());
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => carrito.toggleCart());
    }
});

const productos = [
    new Prod(1, "Pizza Muzzarella", 8500, "Salsa de tomate, muzzarella y aceitunas", "./images/pizza-muzza.jpg",1),
    new Prod(2, "Pizza Napolitana", 9500, "Tomate, muzzarella, jamón y tomates frescos", "./images/pizza-napo.jpg",1),
    new Prod(3, "Empanadas x12", 6000, "Carne, jamón y queso, pollo", "./images/empanadas.jpg",2),
    new Prod(4, "Milanesa Napolitana", 9500, "Con papas fritas y ensalada", "./images/milanesa.jpg",3),
    new Prod(5, "Hamburguesa Completa", 7500, "Doble carne, queso, lechuga, tomate", "./images/hamburguesa.jpg",3),
    new Prod(6, "Lomito Completo", 8000, "Lomo, queso, lechuga, tomate, huevo", "./images/lomito.jpg",3),
    new Prod(7, "Coca Cola", 5000, "1.5lts",".images/coca15.jpg",4)
];

const categorias = [
    new Categoria(1, "Pizzas"),
    new Categoria(2, "Empanadas"),
    new Categoria(3, "Entre Panes"),
    new Categoria(4,"Bebidas")
]

menuToggle.addEventListener("click", () => {
  if (navbar.style.left === "0px") {
    navbar.style.left = "-100%";
  } else {
    navbar.style.left = "0px";
  }
});

function agregarListen() {
    const itemList = document.querySelectorAll(".item");
    itemList.forEach(element => {
        let popup;
        if (element.className == "item") {
            element.addEventListener("click", (e) => {
                e.preventDefault();
                const productoId = parseInt(element.getAttribute('data-producto-id'));
                const producto = productos.find(p => p.id === productoId);
                if (producto) {
                    new Popup(producto);
                }
            });
        }
  });
} 

function mostrarProds(prod) {
    document.getElementById(prod.cat).innerHTML += prod.toHtml();
}

function insertarCategorias(){
    const dis = document.getElementById("page");
    dis.innerHTML = categorias.map(cat => cat.toHtmlCat()).join('');
    const tat = document.getElementById("navList");
    tat.innerHTML = categorias.map(cat => cat.toHtmlList()).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    insertarCategorias();
    productos.forEach((prod) => {
        mostrarProds(prod);
    });
    agregarListen();
    document.getElementById("nosotros").innerHTML = empresa.toHtml();
});

function closeTab() {
    if (navbar.style.left==="0px") {
        navbar.style.left = "-100%";
    }
}