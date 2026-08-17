// ==========================================
// THREADVERSE - ADMIN DASHBOARD JAVASCRIPT
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
// 2. GLOBAL VARIABLES
// ==========================================

let allOrders = [];

let currentAdminUser = null;


// ==========================================
// 3. START ADMIN DASHBOARD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "THREADVERSE Admin Dashboard starting..."
        );


        const isAuthenticated =
            await checkAdminAuthentication();


        if (!isAuthenticated) {

            return;

        }


        console.log(
            "THREADVERSE Admin Dashboard started!"
        );


        setupAdminEvents();

        setupAdminLogout();

        loadAdminOrders();

    }
);


// ==========================================
// 4. CHECK ADMIN AUTHENTICATION
// ==========================================

// ==========================================
// ADMIN AUTHENTICATION AND ACCESS CONTROL
// ==========================================

async function checkAdminAuthentication() {

    try {

        // Get current Supabase session

        const {
            data: {
                session
            },
            error
        } = await supabaseClient
            .auth
            .getSession();


        // ======================================
        // NO LOGIN SESSION
        // ======================================

        if (error || !session || !session.user) {

            console.log(
                "No valid admin session found."
            );

            window.location.href =
                "admin-login.html";

            return false;

        }


        // ======================================
        // AUTHORIZED ADMIN EMAIL
        // ======================================

        const ADMIN_EMAIL =
            "pathakyadnesh25@gmail.com";


        const loggedInEmail =
            String(
                session.user.email || ""
            )
            .trim()
            .toLowerCase();


        // ======================================
        // CHECK ADMIN ACCESS
        // ======================================

        if (
            loggedInEmail !==
            ADMIN_EMAIL.toLowerCase()
        ) {

            console.warn(
                "Unauthorized user attempted admin access:",
                loggedInEmail
            );


            // Sign out unauthorized user

            await supabaseClient
                .auth
                .signOut();


            alert(
                "Access denied. You are not authorized to access the THREADVERSE Admin Dashboard."
            );


            window.location.href =
                "admin-login.html";

            return false;

        }


        // ======================================
        // ADMIN VERIFIED
        // ======================================

        console.log(
            "Authorized THREADVERSE admin verified:",
            loggedInEmail
        );

        return true;


    } catch (error) {

        console.error(
            "Admin authentication error:",
            error
        );


        window.location.href =
            "admin-login.html";

        return false;

    }

}

    try {

        const {
            data: {
                session
            },
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error) {

            console.error(
                "Authentication session error:",
                error
            );

            redirectToAdminLogin();

            return false;

        }


        if (
            !session ||
            !session.user
        ) {

            console.warn(
                "No admin login session found."
            );

            redirectToAdminLogin();

            return false;

        }


        currentAdminUser =
            session.user;


        console.log(
            "Admin authenticated:",
            currentAdminUser.email
        );


        return true;

    } catch (error) {

        console.error(
            "Unexpected authentication error:",
            error
        );

        redirectToAdminLogin();

        return false;

    }

}


// ==========================================
// 5. REDIRECT TO ADMIN LOGIN
// ==========================================

function redirectToAdminLogin() {

    window.location.replace(
        "admin-login.html"
    );

}


// ==========================================
// 6. ADMIN LOGOUT
// ==========================================

function setupAdminLogout() {

    const logoutButton =
        document.getElementById(
            "admin-logout-button"
        );


    if (!logoutButton) {

        console.log(
            "Admin logout button not found."
        );

        return;

    }


    logoutButton.addEventListener(
        "click",
        async function () {

            const originalText =
                logoutButton.textContent;


            logoutButton.disabled =
                true;

            logoutButton.textContent =
                "SIGNING OUT...";


            try {

                const { error } =
                    await supabaseClient
                        .auth
                        .signOut();


                if (error) {

                    console.error(
                        "Admin logout error:",
                        error
                    );

                    alert(
                        "Unable to sign out. Please try again."
                    );

                    logoutButton.disabled =
                        false;

                    logoutButton.textContent =
                        originalText;

                    return;

                }


                currentAdminUser =
                    null;


                window.location.replace(
                    "admin-login.html"
                );


            } catch (error) {

                console.error(
                    "Unexpected logout error:",
                    error
                );

                alert(
                    "Something went wrong while signing out."
                );


                logoutButton.disabled =
                    false;

                logoutButton.textContent =
                    originalText;

            }

        }
    );

}


// ==========================================
// 7. SETUP ADMIN EVENTS
// ==========================================

function setupAdminEvents() {


    // TOP REFRESH BUTTON

    const refreshButton =
        document.getElementById(
            "refresh-orders-button"
        );


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function () {

                loadAdminOrders();

            }
        );

    }


    // BOTTOM REFRESH BUTTON

    const bottomRefreshButton =
        document.getElementById(
            "admin-refresh-bottom"
        );


    if (bottomRefreshButton) {

        bottomRefreshButton.addEventListener(
            "click",
            function () {

                loadAdminOrders();

            }
        );

    }


    // STATUS FILTER

    const statusFilter =
        document.getElementById(
            "order-status-filter"
        );


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            function () {

                filterAndDisplayOrders();

            }
        );

    }


    // ORDER SEARCH

    const orderSearch =
        document.getElementById(
            "order-search"
        );


    if (orderSearch) {

        orderSearch.addEventListener(
            "input",
            function () {

                filterAndDisplayOrders();

            }
        );

    }


    // CLOSE MODAL BUTTON

    const closeModalButton =
        document.getElementById(
            "close-order-modal"
        );


    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            function () {

                closeOrderModal();

            }
        );

    }


    // CLOSE MODAL WHEN CLICKING OUTSIDE

    const modalOverlay =
        document.querySelector(
            ".order-modal-overlay"
        );


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modalOverlay
                ) {

                    closeOrderModal();

                }

            }
        );

    }

}


// ==========================================
// 8. LOAD ORDERS FROM SUPABASE
// ==========================================

async function loadAdminOrders() {

    console.log(
        "Loading THREADVERSE orders..."
    );


    showLoadingState();


    try {

        const { data, error } =
            await supabaseClient
                .from("orders")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Error loading orders:",
                error
            );

            showAdminError(
                error.message ||
                "Unable to load orders."
            );

            return;

        }


        allOrders =
            Array.isArray(data)
                ? data
                : [];


        console.log(
            "Orders loaded successfully:",
            allOrders
        );


        updateDashboardStats(
            allOrders
        );


        filterAndDisplayOrders();


    } catch (error) {

        console.error(
            "Unexpected admin error:",
            error
        );

        showAdminError(
            "Something went wrong while loading orders."
        );

    }

}


// ==========================================
// 9. FILTER AND DISPLAY ORDERS
// ==========================================

function filterAndDisplayOrders() {

    const statusFilter =
        document.getElementById(
            "order-status-filter"
        );


    const orderSearch =
        document.getElementById(
            "order-search"
        );


    const selectedStatus =
        statusFilter
            ? String(statusFilter.value).toLowerCase()
            : "all";


    const searchText =
        orderSearch
            ? orderSearch.value
                .trim()
                .toLowerCase()
            : "";


    const filteredOrders =
        allOrders.filter(
            function (order) {

                const orderStatus =
                    String(
                        order.status ||
                        "pending"
                    ).toLowerCase();


                const statusMatches =
                    selectedStatus === "all" ||
                    orderStatus === selectedStatus;


                const orderId =
                    String(
                        order.id || ""
                    ).toLowerCase();


                const shortOrderId =
                    orderId.slice(
                        0,
                        8
                    );


                const customerName =
                    String(
                        order.customer_name || ""
                    ).toLowerCase();


                const customerEmail =
                    String(
                        order.customer_email || ""
                    ).toLowerCase();


                const customerPhone =
                    String(
                        order.customer_phone || ""
                    ).toLowerCase();


                const searchMatches =
                    !searchText ||

                    orderId.includes(
                        searchText
                    ) ||

                    shortOrderId.includes(
                        searchText
                    ) ||

                    customerName.includes(
                        searchText
                    ) ||

                    customerEmail.includes(
                        searchText
                    ) ||

                    customerPhone.includes(
                        searchText
                    );


                return (
                    statusMatches &&
                    searchMatches
                );

            }
        );


    displayOrders(
        filteredOrders
    );

}


// ==========================================
// 10. DISPLAY ORDERS
// ==========================================

function displayOrders(orders) {

    const loadingElement =
        document.getElementById(
            "admin-orders-loading"
        );


    const emptyElement =
        document.getElementById(
            "admin-empty-orders"
        );


    const wrapperElement =
        document.getElementById(
            "admin-orders-wrapper"
        );


    const tableBody =
        document.getElementById(
            "admin-orders-table-body"
        );


    if (loadingElement) {

        loadingElement.style.display =
            "none";

    }


    if (!tableBody) {

        console.error(
            "Admin orders table body not found."
        );

        return;

    }


    // NO ORDERS

    if (
        !orders ||
        orders.length === 0
    ) {

        tableBody.innerHTML = "";


        if (wrapperElement) {

            wrapperElement.style.display =
                "none";

        }


        if (emptyElement) {

            emptyElement.style.display =
                "block";

        }

        return;

    }


    // SHOW ORDERS TABLE

    if (emptyElement) {

        emptyElement.style.display =
            "none";

    }


    if (wrapperElement) {

        wrapperElement.style.display =
            "block";

    }


    tableBody.innerHTML = "";


    orders.forEach(
        function (order) {

            const row =
                document.createElement(
                    "tr"
                );


            const orderId =
                order.id || "N/A";


            // ONLY FIRST 8 CHARACTERS
            // Example: #12345678

            const shortOrderId =
                String(orderId)
                    .slice(0, 8);


            const customerName =
                order.customer_name ||
                "Customer";


            const customerPhone =
                order.customer_phone ||
                "Not available";


            const totalAmount =
                Number(
                    order.total_amount
                ) || 0;


            const orderStatus =
                String(
                    order.status ||
                    "pending"
                ).toLowerCase();


            const formattedStatus =
                capitalizeText(
                    orderStatus
                );


            const formattedDate =
                formatOrderDate(
                    order.created_at
                );


            row.innerHTML = `

                <td>
                    <strong>
                        #${escapeHTML(shortOrderId)}
                    </strong>
                </td>


                <td>

                    <div class="admin-customer-name">
                        ${escapeHTML(customerName)}
                    </div>

                    <div class="admin-customer-email">
                        ${escapeHTML(
                            order.customer_email || ""
                        )}
                    </div>

                </td>


                <td>
                    ${escapeHTML(customerPhone)}
                </td>


                <td>
                    <strong>
                        ₹${totalAmount.toFixed(0)}
                    </strong>
                </td>


                <td>

                    <span
                        class="admin-status-badge status-${escapeAttribute(orderStatus)}"
                    >
                        ${escapeHTML(formattedStatus)}
                    </span>

                </td>


                <td>
                    ${escapeHTML(formattedDate)}
                </td>


                <td>

                    <button
                        class="admin-view-order-button"
                        type="button"
                        data-order-id="${escapeAttribute(
                            String(orderId)
                        )}"
                    >
                        VIEW
                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );


    // VIEW ORDER BUTTON EVENTS

    const viewButtons =
        document.querySelectorAll(
            ".admin-view-order-button"
        );


    viewButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    openOrderDetails(
                        this.dataset.orderId
                    );

                }
            );

        }
    );

}


// ==========================================
// 11. UPDATE DASHBOARD STATISTICS
// ==========================================

function updateDashboardStats(orders) {

    const totalOrdersElement =
        document.getElementById(
            "total-orders"
        );


    const pendingOrdersElement =
        document.getElementById(
            "pending-orders"
        );


    const totalSalesElement =
        document.getElementById(
            "total-sales"
        );


    const todayOrdersElement =
        document.getElementById(
            "today-orders"
        );


    const totalOrders =
        orders.length;


    const pendingOrders =
        orders.filter(
            function (order) {

                return (
                    String(
                        order.status ||
                        "pending"
                    ).toLowerCase()
                    === "pending"
                );

            }
        ).length;


    const totalSales =
        orders.reduce(
            function (total, order) {

                return (
                    total +
                    (
                        Number(
                            order.total_amount
                        ) || 0
                    )
                );

            },
            0
        );


    const today =
        new Date();


    const todayStart =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


    const tomorrowStart =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
        );


    const todayOrders =
        orders.filter(
            function (order) {

                if (!order.created_at) {

                    return false;

                }


                const orderDate =
                    new Date(
                        order.created_at
                    );


                return (
                    orderDate >= todayStart &&
                    orderDate < tomorrowStart
                );

            }
        ).length;


    if (totalOrdersElement) {

        totalOrdersElement.textContent =
            totalOrders;

    }


    if (pendingOrdersElement) {

        pendingOrdersElement.textContent =
            pendingOrders;

    }


    if (totalSalesElement) {

        totalSalesElement.textContent =
            "₹" +
            totalSales.toFixed(0);

    }


    if (todayOrdersElement) {

        todayOrdersElement.textContent =
            todayOrders;

    }

}


// ==========================================
// 12. OPEN ORDER DETAILS
// ==========================================

function openOrderDetails(orderId) {

    const selectedOrder =
        allOrders.find(
            function (order) {

                return (
                    String(order.id) ===
                    String(orderId)
                );

            }
        );


    if (!selectedOrder) {

        alert(
            "Order details could not be found."
        );

        return;

    }


    const modal =
        document.getElementById(
            "order-details-modal"
        );


    const modalBody =
        document.getElementById(
            "order-modal-body"
        );


    if (!modal || !modalBody) {

        console.error(
            "Order details modal not found."
        );

        return;

    }


    const items =
        Array.isArray(
            selectedOrder.items
        )
            ? selectedOrder.items
            : [];


    let itemsHTML = "";


    if (items.length === 0) {

        itemsHTML = `

            <p class="admin-no-order-items">
                Product details are unavailable.
            </p>

        `;

    } else {

        items.forEach(
            function (item) {

                const quantity =
                    Number(
                        item.quantity
                    ) || 1;


                const price =
                    Number(
                        item.price
                    ) || 0;


                const itemTotal =
                    price * quantity;


                itemsHTML += `

                    <div class="admin-modal-product">

                        <div class="admin-modal-product-left">

                            <div class="admin-modal-product-image">

                                ${
                                    item.image
                                        ? `
                                            <img
                                                src="${escapeAttribute(item.image)}"
                                                alt="${escapeAttribute(
                                                    item.name ||
                                                    "THREADVERSE Product"
                                                )}"
                                            >
                                        `
                                        : `
                                            <div class="admin-product-placeholder">
                                                THREADVERSE
                                            </div>
                                        `
                                }

                            </div>


                            <div>

                                <h4>
                                    ${escapeHTML(
                                        item.name ||
                                        "THREADVERSE Product"
                                    )}
                                </h4>

                                <p>
                                    Size:
                                    ${escapeHTML(
                                        item.size ||
                                        "Not selected"
                                    )}
                                </p>

                                <p>
                                    Quantity:
                                    ${quantity}
                                </p>

                            </div>

                        </div>


                        <strong>
                            ₹${itemTotal.toFixed(0)}
                        </strong>

                    </div>

                `;

            }
        );

    }


    modalBody.innerHTML = `

        <div class="admin-modal-section">

            <h3>
                Order Information
            </h3>

            <div class="admin-modal-info-grid">

                <div>

                    <span>
                        Order ID
                    </span>

                    <strong>
                        #${escapeHTML(
                            String(
                                selectedOrder.id ||
                                "N/A"
                            ).slice(0, 8)
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Order Date
                    </span>

                    <strong>
                        ${escapeHTML(
                            formatOrderDate(
                                selectedOrder.created_at
                            )
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Order Status
                    </span>

                    <strong>
                        ${escapeHTML(
                            capitalizeText(
                                selectedOrder.status ||
                                "pending"
                            )
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Payment Status
                    </span>

                    <strong>
                        ${escapeHTML(
                            capitalizeText(
                                selectedOrder.payment_status ||
                                "pending"
                            )
                        )}
                    </strong>

                </div>

            </div>

        </div>


        <div class="admin-modal-section">

            <h3>
                Customer Details
            </h3>

            <div class="admin-modal-info-grid">

                <div>

                    <span>
                        Full Name
                    </span>

                    <strong>
                        ${escapeHTML(
                            selectedOrder.customer_name ||
                            "Not available"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Email
                    </span>

                    <strong>
                        ${escapeHTML(
                            selectedOrder.customer_email ||
                            "Not available"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Phone
                    </span>

                    <strong>
                        ${escapeHTML(
                            selectedOrder.customer_phone ||
                            "Not available"
                        )}
                    </strong>

                </div>

            </div>

        </div>


        <div class="admin-modal-section">

            <h3>
                Delivery Address
            </h3>

            <div class="admin-modal-address">

                <p>
                    ${escapeHTML(
                        selectedOrder.address || ""
                    )}
                </p>

                <p>
                    ${escapeHTML(
                        selectedOrder.city || ""
                    )},
                    ${escapeHTML(
                        selectedOrder.state || ""
                    )}
                </p>

                <p>
                    PIN Code:
                    ${escapeHTML(
                        selectedOrder.pincode || ""
                    )}
                </p>

            </div>

        </div>


        <div class="admin-modal-section">

            <h3>
                Ordered Products
            </h3>

            <div class="admin-modal-products">

                ${itemsHTML}

            </div>

        </div>


        <div class="admin-modal-total">

            <span>
                Total Order Amount
            </span>

            <strong>
                ₹${(
                    Number(
                        selectedOrder.total_amount
                    ) || 0
                ).toFixed(0)}
            </strong>

        </div>


        <div class="admin-status-update-section">

            <label for="admin-order-status-select">
                UPDATE ORDER STATUS
            </label>


            <div class="admin-status-update-row">

                <select id="admin-order-status-select">

                    <option value="pending">
                        PENDING
                    </option>

                    <option value="confirmed">
                        CONFIRMED
                    </option>

                    <option value="processing">
                        PROCESSING
                    </option>

                    <option value="shipped">
                        SHIPPED
                    </option>

                    <option value="delivered">
                        DELIVERED
                    </option>

                    <option value="cancelled">
                        CANCELLED
                    </option>

                </select>


                <button
                    id="update-order-status-button"
                    type="button"
                    data-order-id="${escapeAttribute(
                        String(selectedOrder.id)
                    )}"
                >
                    UPDATE STATUS
                </button>

            </div>

        </div>

    `;


    const statusSelect =
        document.getElementById(
            "admin-order-status-select"
        );


    if (statusSelect) {

        statusSelect.value =
            String(
                selectedOrder.status ||
                "pending"
            ).toLowerCase();

    }


    const updateStatusButton =
        document.getElementById(
            "update-order-status-button"
        );


    if (updateStatusButton) {

        updateStatusButton.addEventListener(
            "click",
            function () {

                updateOrderStatus(
                    this.dataset.orderId
                );

            }
        );

    }


    modal.style.display =
        "flex";


    document.body.style.overflow =
        "hidden";

}


// ==========================================
// 13. UPDATE ORDER STATUS
// ==========================================

async function updateOrderStatus(orderId) {

    const statusSelect =
        document.getElementById(
            "admin-order-status-select"
        );


    const updateButton =
        document.getElementById(
            "update-order-status-button"
        );


    if (!statusSelect) {

        return;

    }


    const newStatus =
        statusSelect.value;


    if (updateButton) {

        updateButton.disabled =
            true;

        updateButton.textContent =
            "UPDATING...";

    }


    try {

        const { data, error } =
            await supabaseClient
                .from("orders")
                .update(
                    {
                        status:
                            newStatus,

                        updated_at:
                            new Date().toISOString()
                    }
                )
                .eq(
                    "id",
                    orderId
                )
                .select()
                .single();


        if (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                "Unable to update order status. Please check Supabase permissions."
            );

            return;

        }


        console.log(
            "Order status updated:",
            data
        );


        const orderIndex =
            allOrders.findIndex(
                function (order) {

                    return (
                        String(order.id) ===
                        String(orderId)
                    );

                }
            );


        if (orderIndex !== -1) {

            allOrders[orderIndex] =
                data;

        }


        updateDashboardStats(
            allOrders
        );


        filterAndDisplayOrders();


        alert(
            "Order status updated successfully!"
        );


        closeOrderModal();


    } catch (error) {

        console.error(
            "Unexpected status update error:",
            error
        );

        alert(
            "Something went wrong while updating the order."
        );

    } finally {

        if (updateButton) {

            updateButton.disabled =
                false;

            updateButton.textContent =
                "UPDATE STATUS";

        }

    }

}


// ==========================================
// 14. CLOSE ORDER MODAL
// ==========================================

function closeOrderModal() {

    const modal =
        document.getElementById(
            "order-details-modal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    document.body.style.overflow =
        "";

}


// ==========================================
// 15. SHOW LOADING STATE
// ==========================================

function showLoadingState() {

    const loadingElement =
        document.getElementById(
            "admin-orders-loading"
        );


    const emptyElement =
        document.getElementById(
            "admin-empty-orders"
        );


    const wrapperElement =
        document.getElementById(
            "admin-orders-wrapper"
        );


    if (loadingElement) {

        loadingElement.style.display =
            "block";

    }


    if (emptyElement) {

        emptyElement.style.display =
            "none";

    }


    if (wrapperElement) {

        wrapperElement.style.display =
            "none";

    }

}


// ==========================================
// 16. SHOW ADMIN ERROR
// ==========================================

function showAdminError(message) {

    const loadingElement =
        document.getElementById(
            "admin-orders-loading"
        );


    const emptyElement =
        document.getElementById(
            "admin-empty-orders"
        );


    const wrapperElement =
        document.getElementById(
            "admin-orders-wrapper"
        );


    if (loadingElement) {

        loadingElement.style.display =
            "none";

    }


    if (wrapperElement) {

        wrapperElement.style.display =
            "none";

    }


    if (emptyElement) {

        emptyElement.style.display =
            "block";


        emptyElement.innerHTML = `

            <h3>
                Unable to Load Orders
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                type="button"
                onclick="loadAdminOrders()"
            >
                TRY AGAIN
            </button>

        `;

    }

}


// ==========================================
// 17. FORMAT ORDER DATE
// ==========================================

function formatOrderDate(dateValue) {

    if (!dateValue) {

        return "Not available";

    }


    try {

        const date =
            new Date(
                dateValue
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Not available";

        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    } catch (error) {

        return "Not available";

    }

}


// ==========================================
// 18. CAPITALIZE TEXT
// ==========================================

function capitalizeText(value) {

    const text =
        String(
            value || ""
        );


    if (!text) {

        return "Pending";

    }


    return (
        text.charAt(0)
            .toUpperCase() +
        text.slice(1)
            .toLowerCase()
    );

}


// ==========================================
// 19. ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    const text =
        String(
            value ?? ""
        );


    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        text;


    return element.innerHTML;

}


// ==========================================
// 20. ESCAPE HTML ATTRIBUTE
// ==========================================

function escapeAttribute(value) {

    return escapeHTML(value)
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
