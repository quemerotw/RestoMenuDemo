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

const empresa = new Empresa("RestoFan", "./images/splash.png", "./images/logo.png", "+542804220856");

class BackButtonManager {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('popstate', (event) => {
            this.handleBackButton(event);
        });
    }

    pushState(type) {
        const state = { modal: type };
        history.pushState(state, '');
    }

    handleBackButton(event) {
        const popup = document.getElementById('popup');
        if (popup && popup.parentElement) {
            const overlay = popup.parentElement;
            if (overlay && overlay.style.opacity === '1') {
                overlay.style.opacity = '0';
                popup.style.transform = 'scale(0.8)';
                popup.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    document.body.style.overflow = 'auto';
                }, 300);
                return;
            }
        }

        const cartPanel = document.getElementById('cart-panel');
        if (cartPanel && cartPanel.classList.contains('active')) {
            carrito.toggleCart();
            return;
        }

        const navbar = document.getElementById('navbar');
        if (navbar && navbar.style.left === '0px') {
            navbar.style.left = '-100%';
            return;
        }
    }
}

const backButtonManager = new BackButtonManager();


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
        // Crear overlay
        this.overlay = new Overlay().overlay;
        this.element = document.createElement("div");
        this.element.className = "popup-container";

        // Botón cerrar
        const closeBtn = document.createElement("button");
        closeBtn.className = "popup-close";
        closeBtn.innerHTML = "✖";
        closeBtn.addEventListener("click", () => this.destroy());

        // Imagen del producto
        const pic = document.createElement("img");
        pic.className = "popup-img";
        pic.src = producto.img;
        pic.alt = producto.nombre;

        // Título
        const titulo = document.createElement("h3");
        titulo.className = "popup-title";
        titulo.textContent = producto.nombre;

        // Detalle
        const detalle = document.createElement("p");
        detalle.className = "popup-detail";
        detalle.textContent = producto.detalle;

        // Precio
        const precio = document.createElement("p");
        precio.className = "popup-price";
        precio.textContent = `$${producto.precio.toLocaleString('es-AR')}`;

        // Botón agregar al carrito
        const addToCartBtn = document.createElement("button");
        addToCartBtn.className = "popup-btn-cart";
        addToCartBtn.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Agregar al Carrito`;
        addToCartBtn.addEventListener("click", () => {
            carrito.agregarProd(producto);
            this.destroy();
        });

        // Ensamblar popup
        this.element.appendChild(closeBtn);
        this.element.appendChild(pic);
        this.element.appendChild(titulo);
        this.element.appendChild(detalle);
        this.element.appendChild(precio);
        this.element.appendChild(addToCartBtn);

        this.overlay.appendChild(this.element);
        document.body.appendChild(this.overlay);

        this.bloquear();
        void this.overlay.offsetWidth;

        requestAnimationFrame(() => {
            this.overlay.style.opacity = "1";
            this.element.style.transform = "scale(1)";
            this.element.style.opacity = "1";
        });

        backButtonManager.pushState('popup');
    }

    bloquear() {
        document.body.style.overflow = "hidden";
    }

    destroy() {
        this.overlay.style.opacity = "0";
        this.element.style.transform = "scale(0.8)";
        this.element.style.opacity = "0";

        setTimeout(() => {
            this.overlay.remove();
            document.body.style.overflow = "auto";
        }, 300);
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
            <img src="${this.img}" alt="${this.nombre}" class="item-img">
            <div class="itemInfo">
                <h3 class="name"> ${this.nombre}</h3>
                    <p class="det">${this.detalle}</p>
                    <p class="price">$${this.precio}</p>
            </div>
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
                backButtonManager.pushState('cart');
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
        if (this.itemsCart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        new CheckoutPopup(this);
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
class CheckoutPopup {
    constructor(carrito) {
        this.carrito = carrito;
        this.overlay = this.createOverlay();
        this.element = this.createPopup();
        this.direccion = '';
        this.isTakeAway = false;

        this.overlay.appendChild(this.element);
        document.body.appendChild(this.overlay);

        this.bloquear();
        void this.overlay.offsetWidth;

        requestAnimationFrame(() => {
            this.overlay.style.opacity = "1";
            this.element.style.transform = "scale(1)";
            this.element.style.opacity = "1";
        });

        if (typeof backButtonManager !== 'undefined') {
            backButtonManager.pushState('checkout');
        }
    }

    createOverlay() {
        const overlay = document.createElement("div");
        overlay.className = "checkout-overlay";
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                this.destroy();
            }
        });
        return overlay;
    }

    createPopup() {
        const popup = document.createElement("div");
        popup.className = "checkout-popup";

        // Header
        const header = document.createElement("div");
        header.className = "checkout-header";

        const title = document.createElement("h2");
        title.textContent = "Finalizar Pedido";

        const closeBtn = document.createElement("button");
        closeBtn.className = "checkout-close";
        closeBtn.innerHTML = "✖";
        closeBtn.addEventListener("click", () => this.destroy());

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Body
        const body = document.createElement("div");
        body.className = "checkout-body";

        // Resumen del pedido
        const resumen = this.createResumen();

        // Checkbox Take Away
        const takeAwayContainer = document.createElement("div");
        takeAwayContainer.className = "checkout-takeaway";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "takeaway-check";
        checkbox.addEventListener("change", (e) => {
            this.isTakeAway = e.target.checked;
            direccionInput.disabled = e.target.checked;
            if (e.target.checked) {
                direccionInput.value = '';
                direccionInput.placeholder = "Retiro en local";
            } else {
                direccionInput.placeholder = "Ej: Calle 123, Barrio, Ciudad";
            }
        });

        const label = document.createElement("label");
        label.htmlFor = "takeaway-check";
        label.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> Retiro en local (Take Away)';

        takeAwayContainer.appendChild(checkbox);
        takeAwayContainer.appendChild(label);

        // Campo de dirección
        const direccionContainer = document.createElement("div");
        direccionContainer.className = "checkout-direccion";

        const direccionLabel = document.createElement("label");
        direccionLabel.textContent = "Dirección de envío:";

        const direccionInput = document.createElement("input");
        direccionInput.type = "text";
        direccionInput.placeholder = "Ej: Calle 123, Barrio, Ciudad";
        direccionInput.className = "direccion-input";
        direccionInput.addEventListener("input", (e) => {
            this.direccion = e.target.value;
        });

        direccionContainer.appendChild(direccionLabel);
        direccionContainer.appendChild(direccionInput);

        // Botones
        const actions = document.createElement("div");
        actions.className = "checkout-actions";

        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn-cancel";
        cancelBtn.textContent = "Cancelar";
        cancelBtn.addEventListener("click", () => this.destroy());

        const confirmBtn = document.createElement("button");
        confirmBtn.className = "btn-confirm";
        confirmBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Enviar Pedido';
        confirmBtn.addEventListener("click", () => this.confirmar());

        actions.appendChild(cancelBtn);
        actions.appendChild(confirmBtn);

        // Ensamblar
        body.appendChild(resumen);
        body.appendChild(takeAwayContainer);
        body.appendChild(direccionContainer);
        body.appendChild(actions);

        popup.appendChild(header);
        popup.appendChild(body);

        return popup;
    }

    createResumen() {
        const resumen = document.createElement("div");
        resumen.className = "checkout-resumen";

        const title = document.createElement("h3");
        title.textContent = "Resumen del pedido:";

        const items = document.createElement("div");
        items.className = "checkout-items";

        this.carrito.itemsCart.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "checkout-item";
            itemDiv.innerHTML = `
                <span>${item.nombre} x${item.cantidad}</span>
                <span>$${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
            `;
            items.appendChild(itemDiv);
        });

        const total = document.createElement("div");
        total.className = "checkout-total";
        total.innerHTML = `
            <strong>Total:</strong>
            <strong>$${this.carrito.calcularTotal().toLocaleString('es-AR')}</strong>
        `;

        resumen.appendChild(title);
        resumen.appendChild(items);
        resumen.appendChild(total);

        return resumen;
    }

    confirmar() {
        if (!this.isTakeAway && !this.direccion.trim()) {
            alert('Por favor, ingresa una dirección de envío o selecciona retiro en local');
            return;
        }

        const mensaje = this.generarMensajeWhatsApp();
        const numeroWhatsApp = empresa.numero; // CAMBIAR POR TU NÚMERO
        const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

        window.open(url, '_blank');

        // Cerrar popup y carrito
        this.destroy();
        if (this.carrito && this.carrito.toggleCart) {
            this.carrito.toggleCart();
        }

        // Opcional: vaciar carrito
        // this.carrito.vaciarCarrito();
    }

    generarMensajeWhatsApp() {
        let mensaje = ' *NUEVO PEDIDO* \n\n';
        if (this.isTakeAway) {
            mensaje += ' *Modalidad:* Retiro en local (Take Away)';
        } else {
            mensaje += ` *Dirección de envío:*\n${this.direccion}`;
        }
        mensaje += '*Productos:*\n';
        this.carrito.itemsCart.forEach(item => {
            mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString('es-AR')}\n`;
        });

        mensaje += `\n*Total: $${this.carrito.calcularTotal().toLocaleString('es-AR')}*\n\n`;

        

        return encodeURIComponent(mensaje);
    }

    bloquear() {
        document.body.style.overflow = "hidden";
    }

    destroy() {
        this.overlay.style.opacity = "0";
        this.element.style.transform = "scale(0.8)";
        this.element.style.opacity = "0";

        setTimeout(() => {
            this.overlay.remove();
            document.body.style.overflow = "auto";
        }, 300);
    }
}

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
    new Prod(1, "Pizza Muzzarella", 8500, "Salsa de tomate, muzzarella y aceitunas", "./images/Muzza.png",1),
    new Prod(2, "Pizza Napolitana", 9500, "Tomate, muzzarella, jamón y tomates frescos", "./images/Napo.png",1),
    new Prod(3, "Empanadas x12", 6000, "Carne, jamón y queso, pollo", "./images/empanadas.png",2),
    new Prod(4, "Milanesa Napolitana", 9500, "Con papas fritas y ensalada", "./images/milanesa.png",3),
    new Prod(5, "Hamburguesa Completa", 7500, "Doble carne, queso, lechuga, tomate", "./images/hamburgesa.png",3),
    new Prod(6, "Lomito Completo", 8000, "Lomo, queso, lechuga, tomate, huevo", "./images/lomito.png",3),
    new Prod(7, "Coca Cola", 5000, "1.5lts","./images/cocacola.webp",4)
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
      backButtonManager.pushState('menu');

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
