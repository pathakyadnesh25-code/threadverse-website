// ==========================================
// THREADVERSE - CART JAVASCRIPT
// ==========================================

console.log("THREADVERSE cart.js loaded successfully!");


// ==========================================
// GET CART FROM LOCAL STORAGE
// ==========================================

function getCart() {

    return JSON.parse(localStorage.getItem("threadverseCart")) || [];

}


// ==========================================
// SAVE CART
// ==========================================

function saveCart(cart) {

    localStorage.setItem(
        "threadverseCart",
        JSON.stringify(cart)
    );

}


// ==========================================
// LOAD AND DISPLAY CART
// ==========================================

function loadCart() {

    const cartContainer =
        document.getElementById("cart-container");

    const cartTotal =
        document.getElementById("cart-total");

    if (!cartContainer) {

        console.error(
            "Cart container not found in cart.html"
        );

        return;

    }


    const cart = getCart();

    console.log("Current cart:", cart);


    // ======================================
    // EMPTY CART
    // ======================================

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">

                <h2>Your cart is empty.</h2>

                <p>
                    Add some amazing THREADVERSE products
                    to your cart!
                </p>

                <a href="index.html#products"
                   class="continue-shopping">

                    CONTINUE SHOPPING

                </a>

            </div>
        `;

        if (cartTotal) {

            cartTotal.textContent = "₹0";

        }

        return;

    }


    // ======================================
    // DISPLAY CART PRODUCTS
    // ======================================

    cartContainer.innerHTML = "";


    let total = 0;


    cart.forEach(function (item, index) {

        const quantity =
            Number(item.quantity) || 1;

        const price =
            Number(item.price) || 0;


        const itemTotal =
            price * quantity;


        total += itemTotal;


        const cartItem =
            document.createElement("div");


        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-product">

                <img
                    src="${item.image || ""}"
                    alt="${item.name || "THREADVERSE Product"}"
                    class="cart-product-image"
                >

                <div class="cart-product-info">

                    <p class="cart-category">
                        ${item.category || "THREADVERSE"}
                    </p>

                    <h3>
                        ${item.name || "THREADVERSE Product"}
                    </h3>

                    <p>
                        Size: ${item.size || "Not selected"}
                    </p>

                    <p class="cart-price">
                        ₹${price}
                    </p>

                </div>

            </div>


            <div class="cart-quantity">

                <button
                    class="quantity-button decrease-button"
                    data-index="${index}"
                >
                    −
                </button>


                <span>
                    ${quantity}
                </span>


                <button
                    class="quantity-button increase-button"
                    data-index="${index}"
                >
                    +
                </button>

            </div>


            <div class="cart-item-total">

                ₹${itemTotal}

            </div>


            <button
                class="remove-button"
                data-index="${index}"
            >
                REMOVE
            </button>

        `;


        cartContainer.appendChild(cartItem);

    });


    // ======================================
    // UPDATE TOTAL
    // ======================================

    if (cartTotal) {

        cartTotal.textContent = `₹${total}`;

    }


    // ======================================
    // INCREASE QUANTITY
    // ======================================

    const increaseButtons =
        document.querySelectorAll(".increase-button");


    increaseButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const index =
                Number(this.dataset.index);


            const cart = getCart();


            cart[index].quantity =
                (Number(cart[index].quantity) || 1) + 1;


            saveCart(cart);


            loadCart();

        });

    });


    // ======================================
    // DECREASE QUANTITY
    // ======================================

    const decreaseButtons =
        document.querySelectorAll(".decrease-button");


    decreaseButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const index =
                Number(this.dataset.index);


            const cart = getCart();


            const currentQuantity =
                Number(cart[index].quantity) || 1;


            if (currentQuantity > 1) {

                cart[index].quantity =
                    currentQuantity - 1;

            }


            saveCart(cart);


            loadCart();

        });

    });


    // ======================================
    // REMOVE PRODUCT
    // ======================================

    const removeButtons =
        document.querySelectorAll(".remove-button");


    removeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const index =
                Number(this.dataset.index);


            const cart = getCart();


            cart.splice(index, 1);


            saveCart(cart);


            loadCart();

        });

    });

}


// ==========================================
// START CART PAGE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "THREADVERSE cart page started successfully!"
        );

        loadCart();

    }
);
