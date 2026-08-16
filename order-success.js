```javascript
// ==========================================
// THREADVERSE - ORDER SUCCESS JAVASCRIPT
// ==========================================


document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "THREADVERSE order success page started!"
        );

        loadOrderSuccess();

    }
);


// ==========================================
// LOAD ORDER SUCCESS DETAILS
// ==========================================

function loadOrderSuccess() {


    // ======================================
    // GET ORDER ID FROM URL
    // ======================================

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const urlOrderId =
        urlParams.get("id");



    // ======================================
    // GET LAST ORDER FROM LOCAL STORAGE
    // ======================================

    let lastOrder = null;


    try {

        lastOrder =
            JSON.parse(
                localStorage.getItem(
                    "threadverseLastOrder"
                )
            );

    } catch (error) {

        console.error(
            "Error reading last order:",
            error
        );

    }



    // ======================================
    // CHECK IF ORDER EXISTS
    // ======================================

    if (!lastOrder) {

        showOrderUnavailable(
            urlOrderId
        );

        return;

    }



    // ======================================
    // VERIFY ORDER ID
    // ======================================

    if (
        urlOrderId &&
        lastOrder.id &&
        String(urlOrderId) !== String(lastOrder.id)
    ) {

        showOrderUnavailable(
            urlOrderId
        );

        return;

    }



    // ======================================
    // DISPLAY ORDER ID
    // ======================================

    const orderIdElement =
        document.getElementById(
            "success-order-id"
        );


    if (orderIdElement) {

        orderIdElement.textContent =
            lastOrder.id ||
            urlOrderId ||
            "Not available";

    }



    // ======================================
    // DISPLAY CUSTOMER DETAILS
    // ======================================

    const customerDetailsElement =
        document.getElementById(
            "success-customer-details"
        );


    if (customerDetailsElement) {

        customerDetailsElement.innerHTML = `

            <div class="success-info-row">

                <span>
                    Name
                </span>

                <strong>
                    ${escapeHTML(
                        lastOrder.customerName || "Not available"
                    )}
                </strong>

            </div>


            <div class="success-info-row">

                <span>
                    Email
                </span>

                <strong>
                    ${escapeHTML(
                        lastOrder.customerEmail || "Not available"
                    )}
                </strong>

            </div>


            <div class="success-info-row">

                <span>
                    Phone
                </span>

                <strong>
                    ${escapeHTML(
                        lastOrder.customerPhone || "Not available"
                    )}
                </strong>

            </div>

        `;

    }



    // ======================================
    // DISPLAY DELIVERY ADDRESS
    // ======================================

    const deliveryDetailsElement =
        document.getElementById(
            "success-delivery-details"
        );


    if (deliveryDetailsElement) {

        deliveryDetailsElement.innerHTML = `

            <div class="success-address">

                <strong>
                    ${escapeHTML(
                        lastOrder.customerName || ""
                    )}
                </strong>

                <p>
                    ${escapeHTML(
                        lastOrder.address || ""
                    )}
                </p>

                <p>
                    ${escapeHTML(
                        lastOrder.city || ""
                    )},
                    ${escapeHTML(
                        lastOrder.state || ""
                    )}
                </p>

                <p>
                    PIN Code:
                    ${escapeHTML(
                        lastOrder.pincode || ""
                    )}
                </p>

                <p>
                    Phone:
                    ${escapeHTML(
                        lastOrder.customerPhone || ""
                    )}
                </p>

            </div>

        `;

    }



    // ======================================
    // DISPLAY ORDER ITEMS
    // ======================================

    const orderItemsElement =
        document.getElementById(
            "success-order-items"
        );


    const items =
        Array.isArray(lastOrder.items)
            ? lastOrder.items
            : [];


    if (orderItemsElement) {


        // EMPTY ORDER ITEMS

        if (items.length === 0) {

            orderItemsElement.innerHTML = `

                <div class="success-no-items">

                    Order item details are not available.

                </div>

            `;

        } else {


            orderItemsElement.innerHTML = "";


            items.forEach(
                function (item) {


                    const quantity =
                        Number(item.quantity) || 1;


                    const price =
                        Number(item.price) || 0;


                    const itemTotal =
                        price * quantity;


                    const orderItem =
                        document.createElement("div");


                    orderItem.className =
                        "success-order-item";


                    const image =
                        escapeAttribute(
                            item.image || ""
                        );


                    const productName =
                        escapeHTML(
                            item.name ||
                            "THREADVERSE Product"
                        );


                    const productSize =
                        escapeHTML(
                            item.size ||
                            "Not selected"
                        );


                    orderItem.innerHTML = `

                        <div class="success-order-item-left">

                            <div class="success-order-image">

                                ${
                                    image
                                        ? `
                                            <img
                                                src="${image}"
                                                alt="${productName}"
                                            >
                                        `
                                        : `
                                            <div class="success-image-placeholder">
                                                THREADVERSE
                                            </div>
                                        `
                                }

                            </div>


                            <div class="success-order-product-info">

                                <h3>
                                    ${productName}
                                </h3>

                                <p>
                                    Size:
                                    ${productSize}
                                </p>

                                <p>
                                    Quantity:
                                    ${quantity}
                                </p>

                            </div>

                        </div>


                        <strong class="success-item-price">

                            ₹${itemTotal.toFixed(0)}

                        </strong>

                    `;


                    orderItemsElement.appendChild(
                        orderItem
                    );


                }
            );

        }

    }



    // ======================================
    // DISPLAY TOTAL
    // ======================================

    const totalElement =
        document.getElementById(
            "success-order-total"
        );


    if (totalElement) {

        totalElement.textContent =
            "₹" +
            (
                Number(lastOrder.totalAmount) || 0
            ).toFixed(0);

    }



    // ======================================
    // CONSOLE SUCCESS MESSAGE
    // ======================================

    console.log(
        "Order details loaded successfully:",
        lastOrder
    );


}



// ==========================================
// ORDER NOT AVAILABLE
// ==========================================

function showOrderUnavailable(orderId) {


    const orderIdElement =
        document.getElementById(
            "success-order-id"
        );


    const customerDetailsElement =
        document.getElementById(
            "success-customer-details"
        );


    const deliveryDetailsElement =
        document.getElementById(
            "success-delivery-details"
        );


    const orderItemsElement =
        document.getElementById(
            "success-order-items"
        );


    const totalElement =
        document.getElementById(
            "success-order-total"
        );



    if (orderIdElement) {

        orderIdElement.textContent =
            orderId ||
            "Order details unavailable";

    }



    if (customerDetailsElement) {

        customerDetailsElement.innerHTML = `

            <p class="success-unavailable-message">

                Customer details are unavailable.
                Please return to the website to continue shopping.

            </p>

        `;

    }



    if (deliveryDetailsElement) {

        deliveryDetailsElement.innerHTML = `

            <p class="success-unavailable-message">

                Delivery details are unavailable.

            </p>

        `;

    }



    if (orderItemsElement) {

        orderItemsElement.innerHTML = `

            <div class="success-no-items">

                Order item details are unavailable.

            </div>

        `;

    }



    if (totalElement) {

        totalElement.textContent =
            "₹0";

    }



    console.warn(
        "Order details were not found in local storage."
    );


}



// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {


    const text =
        String(value ?? "");


    const element =
        document.createElement("div");


    element.textContent =
        text;


    return element.innerHTML;


}



// ==========================================
// ESCAPE HTML ATTRIBUTE
// ==========================================

function escapeAttribute(value) {


    return escapeHTML(value)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");


}
```
