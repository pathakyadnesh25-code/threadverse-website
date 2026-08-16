// ==========================================
// THREADVERSE - CHECKOUT JAVASCRIPT
// ==========================================


// ==========================================
// 1. SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL =
    "https://gguzdxgxtpibbsfqtxjm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_kli1NoCH59sG0Sa3I2-hTw_W909MSZX";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// 2. START CHECKOUT PAGE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "THREADVERSE checkout page started successfully!"
        );

        loadCheckout();
        setupCheckoutForm();

    }
);


// ==========================================
// 3. GET CART SAFELY
// ==========================================

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("threadverseCart")
        ) || [];

    } catch (error) {

        console.error(
            "Error loading cart:",
            error
        );

        return [];

    }

}


// ==========================================
// 4. CALCULATE CART TOTAL
// ==========================================

function calculateCartTotal(cart) {

    let totalAmount = 0;

    cart.forEach(function (item) {

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;

        totalAmount +=
            price * quantity;

    });

    return totalAmount;

}


// ==========================================
// 5. LOAD CART INTO CHECKOUT
// ==========================================

function loadCheckout() {

    const checkoutItems =
        document.getElementById("checkout-items");

    const checkoutTotalPrice =
        document.getElementById("checkout-total-price");


    if (
        !checkoutItems ||
        !checkoutTotalPrice
    ) {

        console.error(
            "Checkout elements not found in checkout.html"
        );

        return;

    }


    const cart = getCart();

    console.log(
        "Current checkout cart:",
        cart
    );


    // ======================================
    // EMPTY CART
    // ======================================

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <div class="empty-checkout">
                <p>Your cart is empty.</p>

                <a href="index.html#products">
                    CONTINUE SHOPPING
                </a>
            </div>
        `;

        checkoutTotalPrice.textContent =
            "₹0";

        return;

    }


    // ======================================
    // DISPLAY CART ITEMS
    // ======================================

    checkoutItems.innerHTML = "";


    cart.forEach(function (item) {

        const quantity =
            Number(item.quantity) || 1;

        const price =
            Number(item.price) || 0;

        const itemTotal =
            price * quantity;


        const checkoutItem =
            document.createElement("div");

        checkoutItem.className =
            "checkout-item";


        checkoutItem.innerHTML = `

            <div class="checkout-item-image">

                <img
                    src="${item.image || ""}"
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


        checkoutItems.appendChild(
            checkoutItem
        );

    });


    // ======================================
    // DISPLAY TOTAL
    // ======================================

    const totalAmount =
        calculateCartTotal(cart);

    checkoutTotalPrice.textContent =
        "₹" + totalAmount.toFixed(0);

}


// ==========================================
// 6. SETUP CHECKOUT FORM
// ==========================================

function setupCheckoutForm() {

    const checkoutForm =
        document.getElementById("checkout-form");


    if (!checkoutForm) {

        console.error(
            "Checkout form not found in checkout.html"
        );

        return;

    }


    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            console.log(
                "THREADVERSE place order form submitted"
            );


            // ==================================
            // GET CART
            // ==================================

            const cart = getCart();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty. Please add products first."
                );

                window.location.href =
                    "index.html#products";

                return;

            }


            // ==================================
            // GET FORM ELEMENTS
            // ==================================

            const customerNameElement =
                document.getElementById(
                    "customer-name"
                );

            const customerEmailElement =
                document.getElementById(
                    "customer-email"
                );

            const customerPhoneElement =
                document.getElementById(
                    "customer-phone"
                );

            const addressElement =
                document.getElementById(
                    "address"
                );

            const cityElement =
                document.getElementById(
                    "city"
                );

            const stateElement =
                document.getElementById(
                    "state"
                );

            const pincodeElement =
                document.getElementById(
                    "pincode"
                );


            // ==================================
            // CHECK FORM FIELDS
            // ==================================

            if (
                !customerNameElement ||
                !customerEmailElement ||
                !customerPhoneElement ||
                !addressElement ||
                !cityElement ||
                !stateElement ||
                !pincodeElement
            ) {

                console.error(
                    "One or more checkout form fields are missing."
                );

                alert(
                    "Checkout form is incomplete. Please check the page."
                );

                return;

            }


            // ==================================
            // GET CUSTOMER DETAILS
            // ==================================

            const customerName =
                customerNameElement.value.trim();

            const customerEmail =
                customerEmailElement.value.trim();

            const customerPhone =
                customerPhoneElement.value.trim();

            const address =
                addressElement.value.trim();

            const city =
                cityElement.value.trim();

            const state =
                stateElement.value.trim();

            const pincode =
                pincodeElement.value.trim();


            // ==================================
            // VALIDATE DETAILS
            // ==================================

            if (
                !customerName ||
                !customerEmail ||
                !customerPhone ||
                !address ||
                !city ||
                !state ||
                !pincode
            ) {

                alert(
                    "Please fill in all customer and delivery details."
                );

                return;

            }


            // ==================================
            // CALCULATE TOTAL
            // ==================================

            const totalAmount =
                calculateCartTotal(cart);


            // ==================================
            // PLACE ORDER BUTTON
            // ==================================

            const placeOrderButton =
                document.querySelector(
                    ".place-order-button"
                );


            if (placeOrderButton) {

                placeOrderButton.disabled =
                    true;

                placeOrderButton.textContent =
                    "PLACING ORDER...";

            }


            try {

                // ==================================
                // SAVE ORDER TO SUPABASE
                // ==================================

                const { data, error } =
                    await supabaseClient
                        .from("orders")
                        .insert([
                            {
                                customer_name:
                                    customerName,

                                customer_email:
                                    customerEmail,

                                customer_phone:
                                    customerPhone,

                                address:
                                    address,

                                city:
                                    city,

                                state:
                                    state,

                                pincode:
                                    pincode,

                                items:
                                    cart,

                                total_amount:
                                    totalAmount
                            }
                        ])
                        .select()
                        .single();


                // ==================================
                // HANDLE DATABASE ERROR
                // ==================================

                if (error) {

                    console.error(
                        "Order saving error:",
                        error
                    );

                    alert(
                        "Unable to place your order. Please try again."
                    );


                    if (placeOrderButton) {

                        placeOrderButton.disabled =
                            false;

                        placeOrderButton.textContent =
                            "PLACE ORDER";

                    }

                    return;

                }


                // ==================================
                // CHECK SAVED ORDER
                // ==================================

                if (!data) {

                    console.error(
                        "Order saved but no order data was returned."
                    );

                    alert(
                        "Order was saved, but confirmation details could not be loaded."
                    );


                    if (placeOrderButton) {

                        placeOrderButton.disabled =
                            false;

                        placeOrderButton.textContent =
                            "PLACE ORDER";

                    }

                    return;

                }


                // ==================================
                // GET ORDER ID
                // ==================================

                const orderId =
                    data.id;


                if (!orderId) {

                    console.error(
                        "Order ID was not returned:",
                        data
                    );

                    alert(
                        "Order was saved, but the Order ID could not be loaded."
                    );

                    return;

                }


                console.log(
                    "Order placed successfully!"
                );

                console.log(
                    "Saved order:",
                    data
                );

                console.log(
                    "Order ID:",
                    orderId
                );


                // ==================================
                // SAVE COMPLETE ORDER DETAILS
                // ==================================

                const lastOrder = {

                    id:
                        orderId,

                    customerName:
                        customerName,

                    customerEmail:
                        customerEmail,

                    customerPhone:
                        customerPhone,

                    address:
                        address,

                    city:
                        city,

                    state:
                        state,

                    pincode:
                        pincode,

                    items:
                        cart,

                    totalAmount:
                        totalAmount

                };


                localStorage.setItem(
                    "threadverseLastOrder",
                    JSON.stringify(lastOrder)
                );


                // ==================================
                // CLEAR SHOPPING CART
                // ==================================

                localStorage.removeItem(
                    "threadverseCart"
                );


                // ==================================
                // REDIRECT TO SUCCESS PAGE
                // ==================================

                window.location.href =
                    "order-success.html?id=" +
                    encodeURIComponent(orderId);


            } catch (error) {

                console.error(
                    "Unexpected checkout error:",
                    error
                );


                alert(
                    "Something went wrong. Please try again."
                );


                if (placeOrderButton) {

                    placeOrderButton.disabled =
                        false;

                    placeOrderButton.textContent =
                        "PLACE ORDER";

                }

            }

        }
    );

}
