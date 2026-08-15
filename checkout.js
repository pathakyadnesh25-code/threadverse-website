```javascript
// ==========================================
// THREADVERSE - CHECKOUT JAVASCRIPT
// ==========================================


// ==========================================
// 1. SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL = "https://gguzdxgxtpibbsfqtxjm.supabase.co";

const SUPABASE_KEY = "sb_publishable_kli1NoCH59sG0Sa3I2-hTw_W909MSZX";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// 2. START CHECKOUT PAGE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("THREADVERSE checkout page started!");

    loadCheckout();

    setupCheckoutForm();

});


// ==========================================
// 3. LOAD CART INTO CHECKOUT
// ==========================================

function loadCheckout() {

    const checkoutItems =
        document.getElementById("checkout-items");

    const checkoutTotalPrice =
        document.getElementById("checkout-total-price");

    const cart = JSON.parse(
        localStorage.getItem("threadverseCart")
    ) || [];


    if (cart.length === 0) {

        checkoutItems.innerHTML =
            '<p>Your cart is empty.</p>' +
            '<a href="index.html#products">Continue Shopping</a>';

        checkoutTotalPrice.textContent = "₹0";

        return;

    }


    checkoutItems.innerHTML = "";

    let totalAmount = 0;


    cart.forEach(function (item) {

        const quantity = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        const itemTotal = price * quantity;

        totalAmount += itemTotal;


        const checkoutItem =
            document.createElement("div");

        checkoutItem.className = "checkout-item";


        checkoutItem.innerHTML =
            '<div class="checkout-item-image">' +
                '<img src="' + item.image + '" alt="' +
                (item.name || "THREADVERSE Product") + '">' +
            '</div>' +

            '<div class="checkout-item-info">' +
                '<h3>' +
                    (item.name || "THREADVERSE Product") +
                '</h3>' +

                '<p>Size: ' +
                    (item.size || "Not selected") +
                '</p>' +

                '<p>Quantity: ' + quantity + '</p>' +

                '<strong>₹' +
                    itemTotal.toFixed(0) +
                '</strong>' +
            '</div>';


        checkoutItems.appendChild(checkoutItem);

    });


    checkoutTotalPrice.textContent =
        "₹" + totalAmount.toFixed(0);

}


// ==========================================
// 4. CHECKOUT FORM AND SAVE ORDER
// ==========================================

function setupCheckoutForm() {

    const checkoutForm =
        document.getElementById("checkout-form");


    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Get cart
            const cart = JSON.parse(
                localStorage.getItem("threadverseCart")
            ) || [];


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


            // Calculate total amount
            let totalAmount = 0;

            cart.forEach(function (item) {

                const price =
                    Number(item.price) || 0;

                const quantity =
                    Number(item.quantity) || 1;

                totalAmount +=
                    price * quantity;

            });


            // Disable button while saving
            const placeOrderButton =
                document.querySelector(".place-order-button");

            placeOrderButton.disabled = true;

            placeOrderButton.textContent =
                "PLACING ORDER...";


            // Save order to Supabase
            const { data, error } =
                await supabaseClient
                    .from("orders")
                    .insert([
                        {
                            customer_name: customerName,
                            customer_email: customerEmail,
                            customer_phone: customerPhone,
                            address: address,
                            city: city,
                            state: state,
                            pincode: pincode,
                            items: cart,
                            total_amount: totalAmount
                        }
                    ])
                    .select();


            // Handle error
            if (error) {

                console.error(
                    "Order saving error:",
                    error
                );

                alert(
                    "Unable to place your order. Please try again."
                );

                placeOrderButton.disabled = false;

                placeOrderButton.textContent =
                    "PLACE ORDER";

                return;

            }


            console.log(
                "Order placed successfully:",
                data
            );


            // Get order ID
            const orderId = data[0].id;


            // Clear cart
            localStorage.removeItem(
                "threadverseCart"
            );


            // Save order ID temporarily
            localStorage.setItem(
                "threadverseLastOrderId",
                orderId
            );


            // Redirect to confirmation page
            window.location.href =
                "order-success.html?id=" + orderId;

        }
    );

}

