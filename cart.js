
// ============================================================
// THREADVERSE — PROFESSIONAL CART SYSTEM
// ============================================================

"use strict";

console.log("THREADVERSE cart.js loaded successfully!");


// ============================================================
// CONFIGURATION
// ============================================================

const CART_STORAGE_KEY = "threadverseCart";


// ============================================================
// DOM READY
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log(
        "THREADVERSE cart page started successfully!"
    );

    initializeCart();

});


// ============================================================
// INITIALIZE CART
// ============================================================

function initializeCart() {

    loadCart();

    setupCartEvents();

    updateNavbarCartCount();

}


// ============================================================
// GET CART
// ============================================================

function getCart() {

    try {

        const storedCart =
            localStorage.getItem(CART_STORAGE_KEY);

        if (!storedCart) {
            return [];
        }

        const parsedCart =
            JSON.parse(storedCart);

        if (!Array.isArray(parsedCart)) {

            console.warn(
                "THREADVERSE: Invalid cart data detected."
            );

            return [];

        }

        return parsedCart;

    } catch (error) {

        console.error(
            "THREADVERSE: Unable to read cart.",
            error
        );

        return [];

    }

}


// ============================================================
// SAVE CART
// ============================================================

function saveCart(cart) {

    try {

        if (!Array.isArray(cart)) {

            console.error(
                "THREADVERSE: Cart must be an array."
            );

            return false;

        }

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );

        updateNavbarCartCount();

        return true;

    } catch (error) {

        console.error(
            "THREADVERSE: Unable to save cart.",
            error
        );

        return false;

    }

}


// ============================================================
// FORMAT PRICE
// ============================================================

function formatPrice(amount) {

    const price =
        Number(amount) || 0;

    return "₹" + price.toLocaleString("en-IN");

}


// ============================================================
// NORMALIZE CART ITEM
// ============================================================

function normalizeCartItem(item) {

    return {

        id:
            item?.id ??
            item?.product_id ??
            "",

        name:
            item?.name ||
            "THREADVERSE Product",

        category:
            item?.category ||
            "THREADVERSE",

        image:
            item?.image ||
            "",

        size:
            item?.size ||
            "Not selected",

        price:
            Math.max(
                0,
                Number(item?.price) || 0
            ),

        quantity:
            Math.max(
                1,
                Number(item?.quantity) || 1
            )

    };

}


// ============================================================
// LOAD CART
// ============================================================

function loadCart() {

    const cartContainer =
        document.getElementById("cart-container");

    const cartTotal =
        document.getElementById("cart-total");

    const cartFinalTotal =
        document.getElementById("cart-final-total");

    const checkoutButton =
        document.getElementById("checkout-button");

    const emptyCart =
        document.getElementById("empty-cart");


    if (!cartContainer) {

        console.error(
            "THREADVERSE: #cart-container was not found."
        );

        return;

    }


    let cart =
        getCart().map(normalizeCartItem);


    // ========================================================
    // EMPTY CART
    // ========================================================

    if (cart.length === 0) {

        renderEmptyCart();

        if (cartTotal) {
            cartTotal.textContent = "₹0";
        }

        if (cartFinalTotal) {
            cartFinalTotal.textContent = "₹0";
        }

        if (checkoutButton) {
            checkoutButton.disabled = true;
        }

        if (emptyCart) {
            emptyCart.style.display = "block";
        }

        updateCartCounters(0, 0);

        return;

    }


    // Hide external empty-cart component

    if (emptyCart) {
        emptyCart.style.display = "none";
    }


    // ========================================================
    // CALCULATE TOTAL
    // ========================================================

    let subtotal = 0;

    let totalQuantity = 0;


    cart.forEach(function (item) {

        const itemTotal =
            item.price * item.quantity;

        subtotal += itemTotal;

        totalQuantity += item.quantity;

    });


    // ========================================================
    // RENDER CART
    // ========================================================

    cartContainer.innerHTML = "";


    cart.forEach(function (item, index) {

        const cartItem =
            createCartItem(item, index);

        cartContainer.appendChild(cartItem);

    });


    // ========================================================
    // UPDATE SUMMARY
    // ========================================================

    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(subtotal);

    }


    if (cartFinalTotal) {

        cartFinalTotal.textContent =
            formatPrice(subtotal);

    }


    // ========================================================
    // ENABLE CHECKOUT
    // ========================================================

    if (checkoutButton) {

        checkoutButton.disabled = false;

    }


    // ========================================================
    // UPDATE COUNTERS
    // ========================================================

    updateCartCounters(
        cart.length,
        totalQuantity
    );


    // ========================================================
    // SAVE NORMALIZED CART
    // ========================================================

    saveCart(cart);

}


// ============================================================
// CREATE CART ITEM
// ============================================================

function createCartItem(item, index) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "cart-item";

    wrapper.dataset.index =
        index;


    const product =
        document.createElement("div");

    product.className =
        "cart-product";


    // ========================================================
    // PRODUCT IMAGE
    // ========================================================

    const image =
        document.createElement("img");

    image.className =
        "cart-product-image";

    image.src =
        item.image ||
        "https://via.placeholder.com/300x300?text=THREADVERSE";

    image.alt =
        item.name;

    image.loading =
        "lazy";


    // ========================================================
    // PRODUCT INFORMATION
    // ========================================================

    const information =
        document.createElement("div");

    information.className =
        "cart-product-info";


    const category =
        document.createElement("p");

    category.className =
        "cart-category";

    category.textContent =
        item.category;


    const name =
        document.createElement("h3");

    name.textContent =
        item.name;


    const size =
        document.createElement("p");

    size.className =
        "cart-product-size";

    size.textContent =
        "Size: " + item.size;


    const price =
        document.createElement("p");

    price.className =
        "cart-price";

    price.textContent =
        formatPrice(item.price);


    information.appendChild(category);

    information.appendChild(name);

    information.appendChild(size);

    information.appendChild(price);


    product.appendChild(image);

    product.appendChild(information);


    // ========================================================
    // QUANTITY CONTROLS
    // ========================================================

    const quantityContainer =
        document.createElement("div");

    quantityContainer.className =
        "cart-quantity";


    const decreaseButton =
        document.createElement("button");

    decreaseButton.type =
        "button";

    decreaseButton.className =
        "quantity-button decrease-button";

    decreaseButton.dataset.action =
        "decrease";

    decreaseButton.dataset.index =
        index;

    decreaseButton.setAttribute(
        "aria-label",
        "Decrease quantity"
    );

    decreaseButton.textContent =
        "−";


    const quantityNumber =
        document.createElement("span");

    quantityNumber.className =
        "quantity-number";

    quantityNumber.textContent =
        item.quantity;


    const increaseButton =
        document.createElement("button");

    increaseButton.type =
        "button";

    increaseButton.className =
        "quantity-button increase-button";

    increaseButton.dataset.action =
        "increase";

    increaseButton.dataset.index =
        index;

    increaseButton.setAttribute(
        "aria-label",
        "Increase quantity"
    );

    increaseButton.textContent =
        "+";


    quantityContainer.appendChild(
        decreaseButton
    );

    quantityContainer.appendChild(
        quantityNumber
    );

    quantityContainer.appendChild(
        increaseButton
    );


    // ========================================================
    // ITEM TOTAL
    // ========================================================

    const itemTotal =
        document.createElement("div");

    itemTotal.className =
        "cart-item-total";

    itemTotal.textContent =
        formatPrice(
            item.price * item.quantity
        );


    // ========================================================
    // REMOVE BUTTON
    // ========================================================

    const removeButton =
        document.createElement("button");

    removeButton.type =
        "button";

    removeButton.className =
        "remove-button";

    removeButton.dataset.action =
        "remove";

    removeButton.dataset.index =
        index;

    removeButton.setAttribute(
        "aria-label",
        "Remove " + item.name
    );

    removeButton.textContent =
        "Remove";


    // ========================================================
    // BUILD ITEM
    // ========================================================

    wrapper.appendChild(product);

    wrapper.appendChild(quantityContainer);

    wrapper.appendChild(itemTotal);

    wrapper.appendChild(removeButton);


    return wrapper;

}


// ============================================================
// EMPTY CART
// ============================================================

function renderEmptyCart() {

    const cartContainer =
        document.getElementById("cart-container");


    if (!cartContainer) {
        return;
    }


    cartContainer.innerHTML = `

        <div class="cart-empty-state">

            <div class="empty-cart-icon">
                🛍
            </div>

            <h2>
                Your cart is empty
            </h2>

            <p>
                You haven't added anything to your
                THREADVERSE collection yet.
            </p>

            <a
                href="index.html#products"
                class="continue-shopping"
            >
                Explore Collection
                <span>→</span>
            </a>

        </div>

    `;

}


// ============================================================
// CART EVENT DELEGATION
// ============================================================

function setupCartEvents() {

    const cartContainer =
        document.getElementById("cart-container");


    if (!cartContainer) {
        return;
    }


    cartContainer.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest("button");


            if (!button) {
                return;
            }


            const action =
                button.dataset.action;

            const index =
                Number(button.dataset.index);


            if (
                !action ||
                Number.isNaN(index)
            ) {
                return;
            }


            if (action === "increase") {

                changeQuantity(
                    index,
                    1
                );

            }


            if (action === "decrease") {

                changeQuantity(
                    index,
                    -1
                );

            }


            if (action === "remove") {

                removeItem(index);

            }

        }
    );

}


// ============================================================
// CHANGE QUANTITY
// ============================================================

function changeQuantity(index, change) {

    const cart =
        getCart().map(normalizeCartItem);


    if (!cart[index]) {

        console.warn(
            "THREADVERSE: Cart item not found."
        );

        return;

    }


    const currentQuantity =
        cart[index].quantity;


    const newQuantity =
        currentQuantity + change;


    // Never allow quantity below 1

    if (newQuantity < 1) {
        return;
    }


    cart[index].quantity =
        newQuantity;


    saveCart(cart);

    loadCart();

}


// ============================================================
// REMOVE ITEM
// ============================================================

function removeItem(index) {

    const cart =
        getCart().map(normalizeCartItem);


    if (!cart[index]) {
        return;
    }


    const removedItem =
        cart[index];


    cart.splice(index, 1);


    saveCart(cart);

    loadCart();


    showCartMessage(
        `"${removedItem.name}" removed from your cart.`
    );

}


// ============================================================
// UPDATE CART COUNTERS
// ============================================================

function updateCartCounters(
    uniqueItems,
    totalQuantity
) {

    const itemCount =
        document.getElementById(
            "cart-item-count"
        );

    const summaryCount =
        document.getElementById(
            "summary-item-count"
        );


    if (itemCount) {

        itemCount.textContent =
            totalQuantity +
            (totalQuantity === 1
                ? " item"
                : " items");

    }


    if (summaryCount) {

        summaryCount.textContent =
            totalQuantity;

    }


    updateNavbarCartCount(
        totalQuantity
    );

}


// ============================================================
// NAVBAR CART COUNT
// ============================================================

function updateNavbarCartCount(
    providedCount = null
) {

    const navCartCount =
        document.getElementById(
            "nav-cart-count"
        );


    if (!navCartCount) {
        return;
    }


    const count =
        providedCount !== null
            ? providedCount
            : getCart().reduce(
                function (total, item) {

                    return total +
                        (
                            Number(
                                item.quantity
                            ) || 0
                        );

                },
                0
            );


    navCartCount.textContent =
        count;


    navCartCount.style.display =
        count > 0
            ? "inline-flex"
            : "none";

}


// ============================================================
// CART MESSAGE
// ============================================================

function showCartMessage(message) {

    const messageElement =
        document.getElementById(
            "cart-message"
        );


    if (!messageElement) {
        return;
    }


    messageElement.textContent =
        message;


    messageElement.classList.add(
        "cart-message-visible"
    );


    setTimeout(
        function () {

            messageElement.classList.remove(
                "cart-message-visible"
            );

        },
        2500
    );

}


// ============================================================
// CLEAR ENTIRE CART
// ============================================================

function clearCart() {

    const confirmed =
        window.confirm(
            "Remove all items from your cart?"
        );


    if (!confirmed) {
        return;
    }


    saveCart([]);

    loadCart();

    showCartMessage(
        "Your cart has been cleared."
    );

}


// ============================================================
// GET CART SUBTOTAL
// ============================================================

function getCartSubtotal() {

    const cart =
        getCart().map(normalizeCartItem);


    return cart.reduce(
        function (total, item) {

            return total +
                (
                    item.price *
                    item.quantity
                );

        },
        0
    );

}


// ============================================================
// GET TOTAL QUANTITY
// ============================================================

function getCartQuantity() {

    const cart =
        getCart();


    return cart.reduce(
        function (total, item) {

            return total +
                (
                    Number(
                        item.quantity
                    ) || 0
                );

        },
        0
    );

}


// ============================================================
// CHECKOUT
// ============================================================

function setupCheckout() {

    const checkoutButton =
        document.getElementById(
            "checkout-button"
        );


    if (!checkoutButton) {
        return;
    }


    checkoutButton.addEventListener(
        "click",
        function () {

            const cart =
                getCart();


            if (cart.length === 0) {

                showCartMessage(
                    "Your cart is empty."
                );

                return;

            }


            /*
             * Checkout page.
             *
             * We will build checkout.html
             * separately.
             */

            window.location.href =
                "checkout.html";

        }
    );

}


// ============================================================
// START CHECKOUT
// ============================================================

setupCheckout();


// ============================================================
// OPTIONAL GLOBAL FUNCTIONS
//
// These allow other THREADVERSE pages to use the cart system.
// ============================================================

window.THREADVERSE_CART = {

    getCart: getCart,

    saveCart: saveCart,

    loadCart: loadCart,

    clearCart: clearCart,

    getCartSubtotal: getCartSubtotal,

    getCartQuantity: getCartQuantity,

    changeQuantity: changeQuantity,

    removeItem: removeItem,

    updateNavbarCartCount:
        updateNavbarCartCount

};


console.log(
    "THREADVERSE cart system initialized."
);

