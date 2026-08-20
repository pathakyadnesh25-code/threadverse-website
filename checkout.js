
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

        const cart =
            JSON.parse(
                localStorage.getItem(
                    "threadverseCart"
                )
            );

        return Array.isArray(cart)
            ? cart
            : [];

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
// 5. FORMAT PRICE
// ==========================================

function formatPrice(amount) {

    return "₹" +
        Number(amount || 0).toLocaleString(
            "en-IN"
        );

}


// ==========================================
// 6. LOAD CART INTO CHECKOUT
// ==========================================

function loadCheckout() {

    const checkoutItems =
        document.getElementById(
            "checkout-items"
        );

    const checkoutTotalPrice =
        document.getElementById(
            "checkout-total-price"
        );

    const checkoutSubtotal =
        document.getElementById(
            "checkout-subtotal"
        );


    if (
        !checkoutItems ||
        !checkoutTotalPrice
    ) {

        console.error(
            "Checkout elements not found."
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

                <p>
                    Your cart is empty.
                </p>

                <a href="index.html#shop">
                    CONTINUE SHOPPING
                </a>

            </div>

        `;


        checkoutTotalPrice.textContent =
            "₹0";


        if (checkoutSubtotal) {

            checkoutSubtotal.textContent =
                "₹0";

        }


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
                    ${formatPrice(itemTotal)}
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
        formatPrice(totalAmount);


    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            formatPrice(totalAmount);

    }


}


// ==========================================
// 7. GET SELECTED PAYMENT METHOD
// ==========================================

function getSelectedPaymentMethod() {

    const selectedPayment =
        document.querySelector(
            'input[name="payment-method"]:checked'
        );


    if (!selectedPayment) {

        return null;

    }


    return selectedPayment.value;

}


// ==========================================
// 8. SETUP CHECKOUT FORM
// ==========================================

function setupCheckoutForm() {

    const checkoutForm =
        document.getElementById(
            "checkout-form"
        );


    const continuePaymentButton =
        document.getElementById(
            "continue-payment-button"
        );


    if (!checkoutForm) {

        console.error(
            "Checkout form not found."
        );

        return;

    }


    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            console.log(
                "THREADVERSE checkout submitted"
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
                    "index.html#shop";


                return;

            }


            // ==================================
            // GET PAYMENT METHOD
            // ==================================

            const paymentMethod =
                getSelectedPaymentMethod();


            if (!paymentMethod) {

                alert(
                    "Please select a payment method."
                );

                return;

            }


            console.log(
                "Selected payment method:",
                paymentMethod
            );


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
            // CHECK FORM ELEMENTS
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
                    "Checkout form fields are missing."
                );


                alert(
                    "Checkout form is incomplete."
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
            // VALIDATE PIN CODE
            // ==================================

            if (!/^[0-9]{6}$/.test(pincode)) {

                alert(
                    "Please enter a valid 6-digit PIN code."
                );

                return;

            }


            // ==================================
            // CALCULATE TOTAL
            // ==================================

            const totalAmount =
                calculateCartTotal(cart);


            // ==================================
            // CREATE FULL SHIPPING ADDRESS
            // ==================================

            const shippingAddress =
                `${address}, ${city}, ${state} - ${pincode}`;


            // ==================================
            // PREVENT DOUBLE CLICK
            // ==================================

            if (continuePaymentButton) {

                continuePaymentButton.disabled =
                    true;


                continuePaymentButton.innerHTML =
                    '<span>PROCESSING...</span>' +
                    '<span class="button-arrow">→</span>';

            }


            try {


                // ==================================
                // CASH ON DELIVERY
                // ==================================

                if (paymentMethod === "cod") {

                    await saveOrderAndFinish(
                        {
                            customerName: customerName,
                            customerEmail: customerEmail,
                            customerPhone: customerPhone,
                            address: address,
                            city: city,
                            state: state,
                            pincode: pincode,
                            shippingAddress: shippingAddress,
                            cart: cart,
                            totalAmount: totalAmount,
                            paymentMethod: "cod",
                            paymentStatus: "pending"
                        }
                    );


                    return;

                }


                // ==================================
                // ONLINE PAYMENT
                // ==================================
                // UPI and Card payment gateway
                // will be connected in the next step.

                if (
                    paymentMethod === "upi" ||
                    paymentMethod === "card"
                ) {

                    const pendingPaymentOrder = {

                        customerName: customerName,
                        customerEmail: customerEmail,
                        customerPhone: customerPhone,
                        address: address,
                        city: city,
                        state: state,
                        pincode: pincode,
                        shippingAddress: shippingAddress,
                        cart: cart,
                        totalAmount: totalAmount,
                        paymentMethod: paymentMethod

                    };


                    // Save checkout details temporarily.
                    // Payment gateway will use these details
                    // in the next step.

                    localStorage.setItem(
                        "threadversePendingPayment",
                        JSON.stringify(
                            pendingPaymentOrder
                        )
                    );


                    if (paymentMethod === "upi") {

                        alert(
                            "UPI payment gateway will open in the next step."
                        );

                    } else {

                        alert(
                            "Card payment gateway will open in the next step."
                        );

                    }


                    // For now, restore the button
                    // and do not create the final order yet.

                    if (continuePaymentButton) {

                        continuePaymentButton.disabled =
                            false;


                        continuePaymentButton.innerHTML =
                            '<span>CONTINUE TO PAYMENT</span>' +
                            '<span class="button-arrow">→</span>';

                    }


                    return;

                }


            } catch (error) {

                console.error(
                    "Unexpected checkout error:",
                    error
                );


                alert(
                    error.message ||
                    "Something went wrong. Please try again."
                );


                if (continuePaymentButton) {

                    continuePaymentButton.disabled =
                        false;


                    continuePaymentButton.innerHTML =
                        '<span>CONTINUE TO PAYMENT</span>' +
                        '<span class="button-arrow">→</span>';

                }

            }

        }
    );

}


// ==========================================
// 9. SAVE ORDER AND FINISH
// ==========================================

async function saveOrderAndFinish(orderDetails) {


    console.log(
        "Saving THREADVERSE order..."
    );


    const orderData = {

        customer_name:
            orderDetails.customerName,

        customer_email:
            orderDetails.customerEmail,

        customer_phone:
            orderDetails.customerPhone,

        address:
            orderDetails.address,

        city:
            orderDetails.city,

        state:
            orderDetails.state,

        pincode:
            orderDetails.pincode,

        shipping_address:
            orderDetails.shippingAddress,

        items:
            orderDetails.cart,

        total_amount:
            orderDetails.totalAmount,

        status:
            "pending",

        payment_method:
            orderDetails.paymentMethod,

        payment_status:
            orderDetails.paymentStatus

    };


    console.log(
        "Order data:",
        orderData
    );


    // ======================================
    // SAVE ORDER TO SUPABASE
    // ======================================

    const { data, error } =
        await supabaseClient
            .from("orders")
            .insert([
                orderData
            ])
            .select()
            .single();


    if (error) {

        console.error(
            "Order saving error:",
            error
        );


        throw new Error(
            error.message ||
            "Unable to place your order."
        );

    }


    if (!data || !data.id) {

        console.error(
            "Order saved but ID is missing:",
            data
        );


        throw new Error(
            "Order ID was not returned."
        );

    }


    const orderId =
        data.id;


    console.log(
        "THREADVERSE ORDER SAVED SUCCESSFULLY!"
    );


    console.log(
        "Order ID:",
        orderId
    );


    // ======================================
    // SAVE LAST ORDER FOR SUCCESS PAGE
    // ======================================

    const lastOrder = {

        id:
            orderId,

        customerName:
            orderDetails.customerName,

        customerEmail:
            orderDetails.customerEmail,

        customerPhone:
            orderDetails.customerPhone,

        address:
            orderDetails.address,

        city:
            orderDetails.city,

        state:
            orderDetails.state,

        pincode:
            orderDetails.pincode,

        shippingAddress:
            orderDetails.shippingAddress,

        items:
            orderDetails.cart,

        totalAmount:
            orderDetails.totalAmount,

        status:
            "pending",

        paymentMethod:
            orderDetails.paymentMethod,

        paymentStatus:
            orderDetails.paymentStatus,

        createdAt:
            data.created_at || null

    };


    localStorage.setItem(
        "threadverseLastOrder",
        JSON.stringify(lastOrder)
    );


    // Remove pending payment data if it exists
    localStorage.removeItem(
        "threadversePendingPayment"
    );


    // ======================================
    // CLEAR CART
    // ======================================

    localStorage.removeItem(
        "threadverseCart"
    );


    // ======================================
    // REDIRECT TO SUCCESS PAGE
    // ======================================

    window.location.href =
        "order-success.html?id=" +
        encodeURIComponent(orderId);

}

