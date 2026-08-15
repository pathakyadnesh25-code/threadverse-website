// ==========================================
// THREADVERSE - CART JAVASCRIPT
// ==========================================

console.log("THREADVERSE cart.js loaded successfully!");


// ==========================================
// GET CART FROM LOCAL STORAGE
// ==========================================

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("threadverseCart")
        ) || [];

    } catch (error) {

        console.error("Error reading cart:", error);

        return [];

    }

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
// LOAD CART
// ==========================================

function loadCart() {

    const cartContainer =
        document.getElementById("cart-container");

    const cartTotal =
        document.getElementById("cart-total");

    const checkoutButton =
        document.getElementById("checkout-button");


    // CHECK REQUIRED ELEMENTS
    if (!cartContainer || !cartTotal) {

        console.error(
            "Cart elements not found in cart.html"
        );

        return;

    }


    // GET CART
    const cart = getCart();

    console.log("Current cart:", cart);


    // ==========================================
    // EMPTY CART
    // ==========================================

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">

                <h2>Your cart is empty</h2>

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


        cartTotal.textContent = "₹0";


        if (checkoutButton) {

            checkoutButton.style.display = "none";

        }


        return;

    }


    // SHOW CHECKOUT BUTTON
    if (checkoutButton) {

        checkoutButton.style.display = "inline-block";

    }


    // ==========================================
    // DISPLAY PRODUCTS
    // ==========================================

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


        cartItem.className =
            "cart-item";


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


    // ==========================================
    // UPDATE TOTAL
    // ==========================================

    cartTotal.textContent = `₹${total}`;


    // ==========================================
    // INCREASE QUANTITY
    // ==========================================

    document
        .querySelectorAll(".increase-button")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(this.dataset.index);

                    const updatedCart =
                        getCart();


                    updatedCart[index].quantity =
                        (Number(
                            updatedCart[index].quantity
                        ) || 1) + 1;


                    saveCart(updatedCart);

                    loadCart();

                }
            );

        });


    // ==========================================
    // DECREASE QUANTITY
    // ==========================================

    document
        .querySelectorAll(".decrease-button")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

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

                }
            );

        });


    // ==========================================
    // REMOVE PRODUCT
    // ==========================================

    document
        .querySelectorAll(".remove-button")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(this.dataset.index);

                    const updatedCart =
                        getCart();


                    updatedCart.splice(index, 1);


                    saveCart(updatedCart);

                    loadCart();

                }
            );

        });

}


// ==========================================
// CHECKOUT BUTTON
// ==========================================

function setupCheckout() {

    const checkoutButton =
        document.getElementById("checkout-button");


    if (!checkoutButton) {

        return;

    }


    checkoutButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "checkout.html";

        }
    );

}


// ==========================================
// START WEBSITE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "THREADVERSE cart page started successfully!"
        );


        loadCart();

        setupCheckout();

    }
);
