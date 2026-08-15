```javascript
// ==========================================
// THREADVERSE - CHECKOUT JAVASCRIPT
// ==========================================


// ==========================================
// START CHECKOUT PAGE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("THREADVERSE checkout page started!");

    loadCheckout();

    setupCheckoutForm();

});


// ==========================================
// LOAD CART INTO CHECKOUT
// ==========================================

function loadCheckout() {

    const checkoutItems =
        document.getElementById("checkout-items");

    const checkoutTotalPrice =
        document.getElementById("checkout-total-price");


    // Get cart from browser storage
    const cart = JSON.parse(
        localStorage.getItem("threadverseCart")
    ) || [];


    // Check empty cart
    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>Your cart is empty.</p>

            <a href="index.html#products">
                Continue Shopping
            </a>
        `;

        checkoutTotalPrice.textContent = "₹0";

        return;

    }


    // Clear loading message
    checkoutItems.innerHTML = "";


    let totalAmount = 0;


    // Display all products
    cart.forEach(function (item) {

        const quantity =
            Number(item.quantity) || 1;

        const price =
            Number(item.price) || 0;

        const itemTotal =
            price * quantity;


        totalAmount += itemTotal;


        const checkoutItem =
            document.createElement("div");

        checkoutItem.className =
            "checkout-item";


        checkoutItem.innerHTML = `

            <div class="checkout-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name || "THREADVERSE Product"}"
                >

            </div>


            <div class="checkout-item-info">

                <h3>
                    ${item.name || "THREADVERSE Product"}
                </h3>

                <p>
                    Size: ${item.size || "Not selected"}
                </p>

                <p>
                    Quantity: ${quantity}
                </p>

                <strong>
                    ₹${itemTotal.toFixed(0)}
                </strong>

            </div>

        `;


        checkoutItems.appendChild(checkoutItem);

    });


    // Show total
    checkoutTotalPrice.textContent =
        "₹" + totalAmount.toFixed(0);

}


// ==========================================
// CHECKOUT FORM
// ==========================================

function setupCheckoutForm() {

    const checkoutForm =
        document.getElementById("checkout-form");


    checkoutForm.addEventListener(
        "submit",
        function (event) {

            // Stop page from refreshing
            event.preventDefault();


            // Get cart
            const cart = JSON.parse(
                localStorage.getItem("threadverseCart")
            ) || [];


            // Prevent empty order
            if (cart.length === 0) {

                alert(
                    "Your cart is empty. Please add products first."
                );

                return;

            }


            // Get customer details
            const customerName =
                document.getElementById("customer-name").value.trim();

            const customerEmail =
                document.getElementById("customer-email").value.trim();

            const customerPhone =
                document.getElementById("customer-phone").value.trim();

            const address =
                document.getElementById("address").value.trim();

            const city =
                document.getElementById("city").value.trim();

            const state =
                document.getElementById("state").value.trim();

            const pincode =
                document.getElementById("pincode").value.trim();


            // Create order object
            const order = {

                customerName: customerName,

                customerEmail: customerEmail,

                customerPhone: customerPhone,

                address: address,

                city: city,

                state: state,

                pincode: pincode,

                items: cart,

                orderDate:
                    new Date().toISOString()

            };


            // Temporary: save latest order locally
            localStorage.setItem(
                "threadverseLatestOrder",
                JSON.stringify(order)
            );


            console.log(
                "Order created successfully:",
                order
            );


            alert(
                "Your order details are ready! Order database connection is the next step."
            );

        }
    );

}
```
