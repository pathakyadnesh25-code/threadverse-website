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
let allProducts = [];
let currentAdminUser = null;
let currentEditingProductId = null;


// ==========================================
// 3. START ADMIN DASHBOARD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "THREADVERSE Admin Dashboard starting..."
        );


        createProductModal();


        const isAuthenticated =
            await checkAdminAuthentication();


        if (!isAuthenticated) {

            return;

        }


        console.log(
            "THREADVERSE Admin Dashboard started successfully!"
        );


        setupAdminEvents();

        setupAdminLogout();

        await loadAdminOrders();

        await loadAdminProducts();

    }
);


// ==========================================
// 4. CHECK ADMIN AUTHENTICATION
// ==========================================

async function checkAdminAuthentication() {

    try {

        const result =
            await supabaseClient
                .auth
                .getSession();


        const session =
            result.data.session;


        const error =
            result.error;


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

                const result =
                    await supabaseClient
                        .auth
                        .signOut();


                if (result.error) {

                    console.error(
                        "Admin logout error:",
                        result.error
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

    console.log(
        "Setting up admin events..."
    );


    // ======================================
    // TOP REFRESH BUTTON
    // ======================================

    const refreshButton =
        document.getElementById(
            "refresh-orders-button"
        );


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            async function () {

                await loadAdminOrders();

            }
        );

    }


    // ======================================
    // BOTTOM REFRESH BUTTON
    // ======================================

    const bottomRefreshButton =
        document.getElementById(
            "admin-refresh-bottom"
        );


    if (bottomRefreshButton) {

        bottomRefreshButton.addEventListener(
            "click",
            async function () {

                await loadAdminOrders();

            }
        );

    }


    // ======================================
    // ORDER STATUS FILTER
    // ======================================

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


    // ======================================
    // ORDER SEARCH
    // ======================================

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


    // ======================================
    // ORDER VIEW BUTTON
    // ======================================

    const orderTableBody =
        document.getElementById(
            "admin-orders-table-body"
        );


    if (orderTableBody) {

        orderTableBody.addEventListener(
            "click",
            function (event) {

                const viewButton =
                    event.target.closest(
                        ".admin-view-order-button"
                    );


                if (!viewButton) {

                    return;

                }


                const orderId =
                    viewButton.dataset.orderId;


                openOrderDetails(
                    orderId
                );

            }
        );

    }


    // ======================================
    // ADD PRODUCT BUTTON
    // ======================================

    const addProductButton =
        document.getElementById(
            "add-product-button"
        );


    if (addProductButton) {

        addProductButton.addEventListener(
            "click",
            function () {

                openAddProductModal();

            }
        );

    }


    // ======================================
    // PRODUCT EDIT / DELETE BUTTONS
    // ======================================

    const productTableBody =
        document.getElementById(
            "admin-products-table-body"
        );


    if (productTableBody) {

        productTableBody.addEventListener(
            "click",
            async function (event) {

                const editButton =
                    event.target.closest(
                        ".admin-edit-product-button"
                    );


                if (editButton) {

                    const productId =
                        editButton.dataset.productId;


                    openEditProductModal(
                        productId
                    );

                    return;

                }


                const deleteButton =
                    event.target.closest(
                        ".admin-delete-product-button"
                    );


                if (deleteButton) {

                    const productId =
                        deleteButton.dataset.productId;


                    await deleteProduct(
                        productId
                    );

                }

            }
        );

    }


    // ======================================
    // CLOSE ORDER MODAL
    // ======================================

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


    // ======================================
    // CLOSE ORDER MODAL OVERLAY
    // ======================================

    const orderModal =
        document.getElementById(
            "order-details-modal"
        );


    if (orderModal) {

        orderModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === orderModal ||
                    event.target.classList.contains(
                        "order-modal-overlay"
                    )
                ) {

                    closeOrderModal();

                }

            }
        );

    }


    // ======================================
    // CLOSE PRODUCT MODAL
    // ======================================

    const closeProductModalButton =
        document.getElementById(
            "close-product-modal"
        );


    if (closeProductModalButton) {

        closeProductModalButton.addEventListener(
            "click",
            function () {

                closeProductModal();

            }
        );

    }


    // ======================================
    // PRODUCT FORM SUBMIT
    // ======================================

    const productForm =
        document.getElementById(
            "admin-product-form"
        );


    if (productForm) {

        productForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await saveProduct();

            }
        );

    }


    // ======================================
    // ESCAPE KEY
    // ======================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeOrderModal();

                closeProductModal();

            }

        }
    );


    console.log(
        "Admin events setup completed."
    );

}


// ==========================================
// 8. LOAD ORDERS
// ==========================================

async function loadAdminOrders() {

    console.log(
        "Loading THREADVERSE orders..."
    );


    showLoadingState();


    try {

        const result =
            await supabaseClient
                .from("orders")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (result.error) {

            console.error(
                "Error loading orders:",
                result.error
            );

            showAdminError(
                result.error.message
            );

            return;

        }


        allOrders =
            Array.isArray(result.data)
                ? result.data
                : [];


        console.log(
            "Orders loaded successfully:",
            allOrders.length
        );


        updateDashboardStats(
            allOrders
        );


        filterAndDisplayOrders();

    } catch (error) {

        console.error(
            "Unexpected order error:",
            error
        );

        showAdminError(
            "Something went wrong while loading orders."
        );

    }

}


// ==========================================
// 9. FILTER ORDERS
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
            ? String(
                statusFilter.value
            ).toLowerCase()
            : "all";


    const searchText =
        orderSearch
            ? String(
                orderSearch.value
            )
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


                const searchableText =
                    [
                        order.id,
                        order.customer_name,
                        order.customer_email,
                        order.customer_phone
                    ]
                        .join(" ")
                        .toLowerCase();


                return (
                    statusMatches &&
                    (
                        !searchText ||
                        searchableText.includes(
                            searchText
                        )
                    )
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

        return;

    }


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
                order.id || "";


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
                    <span class="admin-status-badge status-${escapeAttribute(orderStatus)}">
                        ${escapeHTML(
                            capitalizeText(orderStatus)
                        )}
                    </span>
                </td>

                <td>
                    ${escapeHTML(
                        formatOrderDate(order.created_at)
                    )}
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

}


// ==========================================
// 11. UPDATE DASHBOARD STATISTICS
// ==========================================

function updateDashboardStats(orders) {

    const totalOrders =
        orders.length;


    const pendingOrders =
        orders.filter(
            function (order) {

                return String(
                    order.status || "pending"
                ).toLowerCase() === "pending";

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


    const todayString =
        new Date()
            .toLocaleDateString(
                "en-CA",
                {
                    timeZone: "Asia/Kolkata"
                }
            );


    const todayOrders =
        orders.filter(
            function (order) {

                if (!order.created_at) {

                    return false;

                }


                return (
                    new Date(
                        order.created_at
                    )
                        .toLocaleDateString(
                            "en-CA",
                            {
                                timeZone:
                                    "Asia/Kolkata"
                            }
                        ) === todayString
                );

            }
        ).length;


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
            "₹" + totalSales.toFixed(0);

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

                return String(order.id) ===
                    String(orderId);

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


    if (
        !modal ||
        !modalBody
    ) {

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
                    Number(item.quantity) || 1;


                const price =
                    Number(item.price) || 0;


                const productName =
                    item.name ||
                    item.product_name ||
                    "THREADVERSE Product";


                itemsHTML += `
                    <div class="admin-modal-product">

                        <div class="admin-modal-product-left">

                            <div class="admin-modal-product-image">

                                ${
                                    item.image
                                        ? `
                                            <img
                                                src="${escapeAttribute(item.image)}"
                                                alt="${escapeAttribute(productName)}"
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
                                    ${escapeHTML(productName)}
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
                            ₹${(price * quantity).toFixed(0)}
                        </strong>

                    </div>
                `;

            }
        );

    }


    modalBody.innerHTML = `

        <div class="admin-modal-section">

            <h3>Order Information</h3>

            <div class="admin-modal-info-grid">

                <div>
                    <span>Order ID</span>
                    <strong>
                        #${escapeHTML(
                            String(
                                selectedOrder.id || "N/A"
                            ).slice(0, 8)
                        )}
                    </strong>
                </div>

                <div>
                    <span>Order Date</span>
                    <strong>
                        ${escapeHTML(
                            formatOrderDate(
                                selectedOrder.created_at
                            )
                        )}
                    </strong>
                </div>

                <div>
                    <span>Order Status</span>
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
                    <span>Payment Status</span>
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

            <h3>Customer Details</h3>

            <div class="admin-modal-info-grid">

                <div>
                    <span>Full Name</span>
                    <strong>
                        ${escapeHTML(
                            selectedOrder.customer_name ||
                            "Not available"
                        )}
                    </strong>
                </div>

                <div>
                    <span>Email</span>
                    <strong>
                        ${escapeHTML(
                            selectedOrder.customer_email ||
                            "Not available"
                        )}
                    </strong>
                </div>

                <div>
                    <span>Phone</span>
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

            <h3>Delivery Address</h3>

            <div class="admin-modal-address">

                <p>
                    ${escapeHTML(
                        selectedOrder.address ||
                        "Not available"
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
                        selectedOrder.pincode ||
                        "Not available"
                    )}
                </p>

            </div>

        </div>


        <div class="admin-modal-section">

            <h3>Ordered Products</h3>

            <div class="admin-modal-products">
                ${itemsHTML}
            </div>

        </div>


        <div class="admin-modal-total">

            <span>Total Order Amount</span>

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

                    <option value="pending">PENDING</option>
                    <option value="confirmed">CONFIRMED</option>
                    <option value="processing">PROCESSING</option>
                    <option value="shipped">SHIPPED</option>
                    <option value="delivered">DELIVERED</option>
                    <option value="cancelled">CANCELLED</option>

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
            async function () {

                await updateOrderStatus(
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


    if (
        !statusSelect ||
        !orderId
    ) {

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

        const result =
            await supabaseClient
                .from("orders")
                .update(
                    {
                        status: newStatus
                    }
                )
                .eq(
                    "id",
                    orderId
                )
                .select()
                .single();


        if (result.error) {

            alert(
                "Unable to update order status: " +
                result.error.message
            );

            return;

        }


        const orderIndex =
            allOrders.findIndex(
                function (order) {

                    return String(order.id) ===
                        String(orderId);

                }
            );


        if (orderIndex !== -1) {

            allOrders[orderIndex] =
                result.data;

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

        console.error(error);

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
// 15. PRODUCT MODAL
// ==========================================

function createProductModal() {

    if (
        document.getElementById(
            "admin-product-modal"
        )
    ) {

        return;

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "admin-product-modal";


    modal.style.display =
        "none";


    modal.innerHTML = `

        <div class="threadverse-product-modal-overlay"></div>

        <div class="threadverse-product-modal-content">

            <div class="threadverse-product-modal-header">

                <div>

                    <p>
                        THREADVERSE PRODUCT MANAGEMENT
                    </p>

                    <h2 id="product-modal-title">
                        Add Product
                    </h2>

                </div>

                <button
                    id="close-product-modal"
                    type="button"
                >
                    ×
                </button>

            </div>


            <form id="admin-product-form">

                <div class="threadverse-product-form-group">

                    <label for="product-name">
                        PRODUCT NAME
                    </label>

                    <input
                        id="product-name"
                        type="text"
                        required
                        placeholder="Example: Custom Brand Merch T-Shirt"
                    >

                </div>


                <div class="threadverse-product-form-row">

                    <div class="threadverse-product-form-group">

                        <label for="product-price">
                            PRICE (₹)
                        </label>

                        <input
                            id="product-price"
                            type="number"
                            min="0"
                            required
                            placeholder="699"
                        >

                    </div>


                    <div class="threadverse-product-form-group">

                        <label for="product-category">
                            CATEGORY
                        </label>

                        <input
                            id="product-category"
                            type="text"
                            required
                            placeholder="Brand Merch"
                        >

                    </div>

                </div>


                <div class="threadverse-product-form-group">

                    <label for="product-image">
                        PRODUCT IMAGE URL
                    </label>

                    <input
                        id="product-image"
                        type="url"
                        required
                        placeholder="Paste Supabase image URL"
                    >

                </div>


                <div class="threadverse-product-form-group">

                    <label for="product-description">
                        DESCRIPTION
                    </label>

                    <textarea
                        id="product-description"
                        required
                        placeholder="Write a short product description..."
                    ></textarea>

                </div>


                <div class="threadverse-product-modal-actions">

                    <button
                        id="cancel-product-button"
                        type="button"
                    >
                        CANCEL
                    </button>

                    <button
                        id="save-product-button"
                        type="submit"
                    >
                        SAVE PRODUCT
                    </button>

                </div>

            </form>

        </div>
    `;


    document.body.appendChild(
        modal
    );


    const overlay =
        modal.querySelector(
            ".threadverse-product-modal-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            function () {

                closeProductModal();

            }
        );

    }


    const cancelButton =
        document.getElementById(
            "cancel-product-button"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                closeProductModal();

            }
        );

    }

}


// ==========================================
// 16. OPEN ADD PRODUCT MODAL
// ==========================================

function openAddProductModal() {

    currentEditingProductId =
        null;


    const modal =
        document.getElementById(
            "admin-product-modal"
        );


    const form =
        document.getElementById(
            "admin-product-form"
        );


    const title =
        document.getElementById(
            "product-modal-title"
        );


    const saveButton =
        document.getElementById(
            "save-product-button"
        );


    if (form) {

        form.reset();

    }


    if (title) {

        title.textContent =
            "Add Product";

    }


    if (saveButton) {

        saveButton.textContent =
            "SAVE PRODUCT";

    }


    if (modal) {

        modal.style.display =
            "flex";

        document.body.style.overflow =
            "hidden";

    }

}


// ==========================================
// 17. OPEN EDIT PRODUCT MODAL
// ==========================================

function openEditProductModal(productId) {

    const product =
        allProducts.find(
            function (item) {

                return String(item.id) ===
                    String(productId);

            }
        );


    if (!product) {

        alert(
            "Product could not be found."
        );

        return;

    }


    currentEditingProductId =
        product.id;


    const modal =
        document.getElementById(
            "admin-product-modal"
        );


    const title =
        document.getElementById(
            "product-modal-title"
        );


    const saveButton =
        document.getElementById(
            "save-product-button"
        );


    document.getElementById(
        "product-name"
    ).value =
        product.name || "";


    document.getElementById(
        "product-price"
    ).value =
        Number(product.price) || 0;


    document.getElementById(
        "product-category"
    ).value =
        product.category || "";


    document.getElementById(
        "product-image"
    ).value =
        product.image || "";


    document.getElementById(
        "product-description"
    ).value =
        product.description || "";


    if (title) {

        title.textContent =
            "Edit Product";

    }


    if (saveButton) {

        saveButton.textContent =
            "UPDATE PRODUCT";

    }


    if (modal) {

        modal.style.display =
            "flex";

        document.body.style.overflow =
            "hidden";

    }

}


// ==========================================
// 18. CLOSE PRODUCT MODAL
// ==========================================

function closeProductModal() {

    const modal =
        document.getElementById(
            "admin-product-modal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    currentEditingProductId =
        null;


    document.body.style.overflow =
        "";

}


// ==========================================
// 19. SAVE PRODUCT
// ==========================================

async function saveProduct() {

    const name =
        document.getElementById(
            "product-name"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "product-price"
            ).value
        );


    const category =
        document.getElementById(
            "product-category"
        ).value.trim();


    const image =
        document.getElementById(
            "product-image"
        ).value.trim();


    const description =
        document.getElementById(
            "product-description"
        ).value.trim();


    const saveButton =
        document.getElementById(
            "save-product-button"
        );


    if (
        !name ||
        !category ||
        !image ||
        !description ||
        Number.isNaN(price) ||
        price < 0
    ) {

        alert(
            "Please fill all product details correctly."
        );

        return;

    }


    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.textContent =
            currentEditingProductId
                ? "UPDATING..."
                : "SAVING...";

    }


    const productData = {

        name: name,
        price: price,
        category: category,
        image: image,
        description: description

    };


    try {

        let result;


        // ======================================
        // UPDATE EXISTING PRODUCT
        // ======================================

        if (currentEditingProductId) {

            result =
                await supabaseClient
                    .from("products")
                    .update(productData)
                    .eq(
                        "id",
                        currentEditingProductId
                    )
                    .select()
                    .single();

        }

        // ======================================
        // ADD NEW PRODUCT
        // ======================================

        else {

            result =
                await supabaseClient
                    .from("products")
                    .insert(
                        productData
                    )
                    .select()
                    .single();

        }


        if (result.error) {

            console.error(
                "Product save error:",
                result.error
            );

            alert(
                "Unable to save product: " +
                result.error.message
            );

            return;

        }


        console.log(
            "Product saved successfully:",
            result.data
        );


        alert(
            currentEditingProductId
                ? "Product updated successfully!"
                : "Product added successfully!"
        );


        closeProductModal();


        await loadAdminProducts();

    } catch (error) {

        console.error(
            "Unexpected product save error:",
            error
        );

        alert(
            "Something went wrong while saving the product."
        );

    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                currentEditingProductId
                    ? "UPDATE PRODUCT"
                    : "SAVE PRODUCT";

        }

    }

}


// ==========================================
// 20. DELETE PRODUCT
// ==========================================

async function deleteProduct(productId) {

    const product =
        allProducts.find(
            function (item) {

                return String(item.id) ===
                    String(productId);

            }
        );


    const productName =
        product
            ? product.name
            : "this product";


    const confirmed =
        confirm(
            `Are you sure you want to delete "${productName}"?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const result =
            await supabaseClient
                .from("products")
                .delete()
                .eq(
                    "id",
                    productId
                );


        if (result.error) {

            console.error(
                "Delete product error:",
                result.error
            );

            alert(
                "Unable to delete product: " +
                result.error.message
            );

            return;

        }


        alert(
            "Product deleted successfully!"
        );


        await loadAdminProducts();

    } catch (error) {

        console.error(
            "Unexpected delete error:",
            error
        );

        alert(
            "Something went wrong while deleting the product."
        );

    }

}


// ==========================================
// 21. LOAD PRODUCTS
// ==========================================

async function loadAdminProducts() {

    console.log(
        "Loading THREADVERSE products..."
    );


    const loadingElement =
        document.getElementById(
            "admin-products-loading"
        );


    const emptyElement =
        document.getElementById(
            "admin-empty-products"
        );


    const wrapperElement =
        document.getElementById(
            "admin-products-wrapper"
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


    try {

        const result =
            await supabaseClient
                .from("products")
                .select("*")
                .order(
                    "id",
                    {
                        ascending: true
                    }
                );


        if (result.error) {

            console.error(
                "Error loading products:",
                result.error
            );

            showProductsError(
                result.error.message
            );

            return;

        }


        allProducts =
            Array.isArray(result.data)
                ? result.data
                : [];


        console.log(
            "Products loaded successfully:",
            allProducts
        );


        displayAdminProducts(
            allProducts
        );

    } catch (error) {

        console.error(
            "Unexpected product loading error:",
            error
        );

        showProductsError(
            "Something went wrong while loading products."
        );

    }

}


// ==========================================
// 22. DISPLAY PRODUCTS
// ==========================================

function displayAdminProducts(products) {

    const loadingElement =
        document.getElementById(
            "admin-products-loading"
        );


    const emptyElement =
        document.getElementById(
            "admin-empty-products"
        );


    const wrapperElement =
        document.getElementById(
            "admin-products-wrapper"
        );


    const tableBody =
        document.getElementById(
            "admin-products-table-body"
        );


    if (loadingElement) {

        loadingElement.style.display =
            "none";

    }


    if (!tableBody) {

        return;

    }


    if (
        !products ||
        products.length === 0
    ) {

        tableBody.innerHTML =
            "";


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


    if (emptyElement) {

        emptyElement.style.display =
            "none";

    }


    if (wrapperElement) {

        wrapperElement.style.display =
            "block";

    }


    tableBody.innerHTML =
        "";


    products.forEach(
        function (product) {

            const row =
                document.createElement(
                    "tr"
                );


            const productId =
                product.id;


            const productName =
                product.name ||
                "THREADVERSE Product";


            const productPrice =
                Number(product.price) || 0;


            const productCategory =
                product.category ||
                "Not available";


            const productDescription =
                product.description ||
                "No description";


            const productImage =
                product.image ||
                "";


            const imageHTML =
                productImage
                    ? `
                        <img
                            src="${escapeAttribute(productImage)}"
                            alt="${escapeAttribute(productName)}"
                            class="admin-product-table-image"
                        >
                    `
                    : `
                        <div class="admin-product-table-placeholder">
                            NO IMAGE
                        </div>
                    `;


            row.innerHTML = `

                <td>
                    ${imageHTML}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(productName)}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(productCategory)}
                </td>

                <td>
                    <strong>
                        ₹${productPrice.toFixed(0)}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(productDescription)}
                </td>

                <td>

                    <button
                        class="admin-edit-product-button"
                        type="button"
                        data-product-id="${escapeAttribute(
                            String(productId)
                        )}"
                    >
                        EDIT
                    </button>

                    <button
                        class="admin-delete-product-button"
                        type="button"
                        data-product-id="${escapeAttribute(
                            String(productId)
                        )}"
                    >
                        DELETE
                    </button>

                </td>
            `;


            tableBody.appendChild(
                row
            );

        }
    );


    console.log(
        "Product table displayed successfully."
    );

}


// ==========================================
// 23. PRODUCT ERROR
// ==========================================

function showProductsError(message) {

    const loadingElement =
        document.getElementById(
            "admin-products-loading"
        );


    const emptyElement =
        document.getElementById(
            "admin-empty-products"
        );


    const wrapperElement =
        document.getElementById(
            "admin-products-wrapper"
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
                Unable to Load Products
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                id="admin-products-try-again"
                type="button"
            >
                TRY AGAIN
            </button>
        `;


        const tryAgainButton =
            document.getElementById(
                "admin-products-try-again"
            );


        if (tryAgainButton) {

            tryAgainButton.addEventListener(
                "click",
                async function () {

                    await loadAdminProducts();

                }
            );

        }

    }

}


// ==========================================
// 24. LOADING STATE
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
// 25. ADMIN ERROR
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
                id="admin-try-again-button"
                type="button"
            >
                TRY AGAIN
            </button>
        `;


        const tryAgainButton =
            document.getElementById(
                "admin-try-again-button"
            );


        if (tryAgainButton) {

            tryAgainButton.addEventListener(
                "click",
                async function () {

                    await loadAdminOrders();

                }
            );

        }

    }

}


// ==========================================
// 26. FORMAT DATE
// ==========================================

function formatOrderDate(dateValue) {

    if (!dateValue) {

        return "Not available";

    }


    try {

        const date =
            new Date(dateValue);


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
                timeZone: "Asia/Kolkata",
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
// 27. CAPITALIZE TEXT
// ==========================================

function capitalizeText(value) {

    const text =
        String(value || "")
            .trim();


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
// 28. ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        String(value ?? "");


    return element.innerHTML;

}


// ==========================================
// 29. ESCAPE ATTRIBUTE
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
