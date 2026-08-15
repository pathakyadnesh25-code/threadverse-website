// ==========================================
// THREADVERSE - CART JAVASCRIPT
// ==========================================

console.log("THREADVERSE cart.js loaded successfully!");


// ==========================================
// GET CART FROM LOCAL STORAGE
// ==========================================

function getCart() {

    return JSON.parse(
        localStorage.getItem("threadverseCart")
    ) || [];

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
        document.getElementById("cart-items");

    const cartSummary =
        document.getElementById("cart-summary");


    // Check if cart elements exist
    if (!cartContainer || !cartSummary) {

        console.error(
            "Cart elements not found in cart.html"
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

                <a
                    href="index.html#products"
                    class="continue-shopping"
                >
                    CONTINUE SHOPPING
                </a>

            </div>

        `;


        cartSummary.innerHTML = "";

        return;

    }


    // ======================================
    // CLEAR OLD CART CONTENT
    // ======================================

    cartContainer.innerHTML = "";


    let total = 0;


    // ======================================
    // DISPLAY CART PRODUCTS
    // ======================================

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


                <span class="quantity-number">
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
    // ORDER SUMMARY + CHECKOUT BUTTON
    // ======================================

    cartSummary.innerHTML = `

        <div class="cart-total-box">

            <h2>ORDER SUMMARY</h2>


            <div class="summary-row">

                <span>Subtotal</span>

                <span>₹${total}</span>

            </div>


            <div class="summary-row">

                <span>Delivery</span>

                <span>Calculated at checkout</span>

            </div>


            <div class="summary-row total-row">

                <span>TOTAL</span>

                <span>₹${total}</span>

            </div>


            <a
                href="checkout.html"
                class="checkout-button"
            >
                PROCEED TO CHECKOUT
            </a>


            <a
                href="index.html#products"
                class="continue-shopping-cart"
            >
                ← CONTINUE SHOPPING
            </a>

        </div>

    `;


    // ======================================
    // INCREASE QUANTITY
    // ======================================

    const increaseButtons =
        document.querySelectorAll(".increase-button");


    increaseButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const index =
                Number(this.dataset.index);

            const updatedCart =
                getCart();


            updatedCart[index].quantity =
                (Number(updatedCart[index].quantity) || 1) + 1;


            saveCart(updatedCart);


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

            const updatedCart =
                getCart();


            const currentQuantity =
                Number(
                    updatedCart[index].quantity
                ) || 1;


            if (currentQuantity > 1) {

                updatedCart[index].quantity =
                    currentQuantity - 1;

            }


            saveCart(updatedCart);


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

            const updatedCart =
                getCart();


            updatedCart.splice(index, 1);


            saveCart(updatedCart);


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
