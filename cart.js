```javascript
// ==========================================
// THREADVERSE - SHOPPING CART JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("THREADVERSE cart page started!");

    loadCart();

});


// ==========================================
// LOAD CART
// ==========================================

function loadCart() {

    const cartItemsContainer = document.getElementById("cart-items");
    const cartSummaryContainer = document.getElementById("cart-summary");

    // Get cart from browser storage
    let cart = JSON.parse(
        localStorage.getItem("threadverseCart")
    ) || [];


    // Empty cart
    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Explore our collection and find your perfect style.</p>

                <a href="index.html#products" class="continue-shopping-button">
                    CONTINUE SHOPPING
                </a>
            </div>
        `;

        cartSummaryContainer.innerHTML = "";

        return;
    }


    // Clear loading text
    cartItemsContainer.innerHTML = "";

    let totalAmount = 0;


    // Display each cart item
    cart.forEach(function (item, index) {

        const itemTotal = Number(item.price) * Number(item.quantity);

        totalAmount += itemTotal;


        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name || "THREADVERSE Product"}"
                >

            </div>


            <div class="cart-item-info">

                <p class="cart-item-size">
                    SIZE: ${item.size}
                </p>

                <h2>${item.name}</h2>

                <p class="cart-item-price">
                    ₹${Number(item.price).toFixed(0)}
                </p>

            </div>


            <div class="cart-item-quantity">

                <button
                    class="quantity-button decrease-quantity"
                    data-index="${index}"
                >
                    −
                </button>

                <span>${item.quantity}</span>

                <button
                    class="quantity-button increase-quantity"
                    data-index="${index}"
                >
                    +
                </button>

            </div>


            <div class="cart-item-total">
                ₹${itemTotal.toFixed(0)}
            </div>


            <button
                class="remove-item-button"
                data-index="${index}"
            >
                REMOVE
            </button>

        `;


        cartItemsContainer.appendChild(cartItem);

    });


    // ==========================================
    // CART SUMMARY
    // ==========================================

    cartSummaryContainer.innerHTML = `

        <div class="cart-summary-box">

            <h2>ORDER SUMMARY</h2>

            <div class="summary-row">
                <span>Total</span>
                <strong>₹${totalAmount.toFixed(0)}</strong>
            </div>

            <button
                class="checkout-button"
                id="checkout-button"
            >
                PROCEED TO CHECKOUT
            </button>

            <a
                href="index.html#products"
                class="continue-shopping-link"
            >
                ← Continue Shopping
            </a>

        </div>

    `;


    // ==========================================
    // INCREASE QUANTITY
    // ==========================================

    document.querySelectorAll(".increase-quantity").forEach(function (button) {

        button.addEventListener("click", function () {

            const index = Number(this.getAttribute("data-index"));

            cart[index].quantity += 1;

            saveAndReloadCart(cart);

        });

    });


    // ==========================================
    // DECREASE QUANTITY
    // ==========================================

    document.querySelectorAll(".decrease-quantity").forEach(function (button) {

        button.addEventListener("click", function () {

            const index = Number(this.getAttribute("data-index"));

            if (cart[index].quantity > 1) {

                cart[index].quantity -= 1;

                saveAndReloadCart(cart);

            }

        });

    });


    // ==========================================
    // REMOVE ITEM
    // ==========================================

    document.querySelectorAll(".remove-item-button").forEach(function (button) {

        button.addEventListener("click", function () {

            const index = Number(this.getAttribute("data-index"));

            cart.splice(index, 1);

            saveAndReloadCart(cart);

        });

    });


    // ==========================================
    // CHECKOUT BUTTON
    // ==========================================

    const checkoutButton = document.getElementById("checkout-button");

    if (checkoutButton) {

        checkoutButton.addEventListener("click", function () {

            alert("Checkout will be connected in the next step!");

        });

    }

}


// ==========================================
// SAVE CART AND RELOAD
// ==========================================

function saveAndReloadCart(cart) {

    localStorage.setItem(
        "threadverseCart",
        JSON.stringify(cart)
    );

    loadCart();

}
```
