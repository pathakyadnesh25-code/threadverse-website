// ==========================================
// THREADVERSE - PRODUCT DETAILS
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
// 2. GET PRODUCT ID FROM URL
// ==========================================

const urlParams = new URLSearchParams(
    window.location.search
);

const productId = urlParams.get("id");


// ==========================================
// 3. CART FUNCTIONS
// ==========================================

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("threadverseCart")
        ) || [];

    } catch (error) {

        console.error(
            "Unable to read cart:",
            error
        );

        return [];

    }

}


function saveCart(cart) {

    localStorage.setItem(
        "threadverseCart",
        JSON.stringify(cart)
    );

}


function findCartItem(
    cart,
    product,
    size
) {

    return cart.find(
        function (item) {

            return (
                String(item.id) ===
                String(product.id) &&

                item.size === size
            );

        }
    );

}


// ==========================================
// 4. LOAD SELECTED PRODUCT
// ==========================================

async function loadProduct() {

    const productDetails =
        document.getElementById(
            "product-details"
        );


    const loadingMessage =
        document.getElementById(
            "loading-message"
        );


    // Check product ID
    if (!productId) {

        loadingMessage.textContent =
            "Product not found.";

        return;

    }


    try {

        // Get product from Supabase
        const {
            data: product,
            error
        } = await supabaseClient
            .from("products")
            .select("*")
            .eq("id", productId)
            .single();


        // Supabase error
        if (error) {

            console.error(
                "Product loading error:",
                error
            );


            loadingMessage.textContent =
                "Unable to load product.";

            return;

        }


        // Product not found
        if (!product) {

            loadingMessage.textContent =
                "Product not found.";

            return;

        }


        console.log(
            "Product loaded:",
            product
        );


        // Hide loading message
        loadingMessage.style.display =
            "none";


        // ======================================
        // CREATE PRODUCT PAGE
        // ======================================

        productDetails.innerHTML =

            '<div class="product-detail-card">' +


                // PRODUCT IMAGE
                '<div class="product-detail-image">' +

                    '<img ' +
                        'src="' + product.image + '" ' +
                        'alt="' +
                        (product.name || "THREADVERSE Product") +
                        '">' +

                '</div>' +


                // PRODUCT INFORMATION
                '<div class="product-detail-info">' +


                    // CATEGORY
                    '<p class="product-category">' +

                        (product.category || "THREADVERSE") +

                    '</p>' +


                    // PRODUCT NAME
                    '<h1>' +

                        (product.name ||
                        "THREADVERSE Product") +

                    '</h1>' +


                    // DESCRIPTION
                    '<p class="product-detail-description">' +

                        (
                            product.description ||
                            "Premium custom wear by THREADVERSE."
                        ) +

                    '</p>' +


                    // PRICE
                    '<h2 class="product-detail-price">₹' +

                        (
                            Number(product.price) || 0
                        ) +

                    '</h2>' +


                    // SIZE
                    '<label for="size">' +
                        'SELECT SIZE' +
                    '</label>' +


                    '<select id="size">' +

                        '<option value="">' +
                            'Choose your size' +
                        '</option>' +

                        '<option value="S">' +
                            'Small (S)' +
                        '</option>' +

                        '<option value="M">' +
                            'Medium (M)' +
                        '</option>' +

                        '<option value="L">' +
                            'Large (L)' +
                        '</option>' +

                        '<option value="XL">' +
                            'Extra Large (XL)' +
                        '</option>' +

                    '</select>' +


                    // SIZE ERROR MESSAGE
                    '<p id="size-error" ' +
                        'style="display:none; margin-top:8px;">' +
                    '</p>' +


                    // QUANTITY BEFORE ADDING TO CART
                    '<div id="initial-quantity-section">' +

                        '<label for="quantity">' +
                            'QUANTITY' +
                        '</label>' +


                        '<input ' +
                            'type="number" ' +
                            'id="quantity" ' +
                            'value="1" ' +
                            'min="1">' +

                    '</div>' +


                    // AMAZON STYLE CART QUANTITY
                    '<div ' +
                        'id="cart-quantity-section" ' +
                        'style="display:none;">' +

                        '<label>QUANTITY IN CART</label>' +


                        '<div class="cart-quantity-control">' +

                            '<button ' +
                                'type="button" ' +
                                'id="decrease-cart-quantity">' +

                                '−' +

                            '</button>' +


                            '<span id="cart-quantity-number">' +
                                '1' +
                            '</span>' +


                            '<button ' +
                                'type="button" ' +
                                'id="increase-cart-quantity">' +

                                '+' +

                            '</button>' +

                        '</div>' +

                    '</div>' +


                    // ADD TO CART BUTTON
                    '<button ' +
                        'class="add-to-cart-button" ' +
                        'id="add-to-cart">' +

                        'ADD TO CART' +

                    '</button>' +


                    // BUY NOW BUTTON
                    '<button ' +
                        'class="buy-now-button" ' +
                        'id="buy-now">' +

                        'BUY NOW' +

                    '</button>' +


                    // BACK BUTTON
                    '<a ' +
                        'href="index.html#shop" ' +
                        'class="back-button">' +

                        '← BACK TO SHOP' +

                    '</a>' +


                '</div>' +


            '</div>';


        // ======================================
        // GET PAGE ELEMENTS
        // ======================================

        const sizeSelect =
            document.getElementById("size");


        const quantityInput =
            document.getElementById("quantity");


        const addToCartButton =
            document.getElementById("add-to-cart");


        const buyNowButton =
            document.getElementById("buy-now");


        const sizeError =
            document.getElementById("size-error");


        const initialQuantitySection =
            document.getElementById(
                "initial-quantity-section"
            );


        const cartQuantitySection =
            document.getElementById(
                "cart-quantity-section"
            );


        const cartQuantityNumber =
            document.getElementById(
                "cart-quantity-number"
            );


        const increaseButton =
            document.getElementById(
                "increase-cart-quantity"
            );


        const decreaseButton =
            document.getElementById(
                "decrease-cart-quantity"
            );


        // ======================================
        // SHOW SIZE ERROR
        // ======================================

        function showSizeError(message) {

            sizeError.textContent =
                message;


            sizeError.style.display =
                "block";

        }


        function hideSizeError() {

            sizeError.textContent =
                "";


            sizeError.style.display =
                "none";

        }


        // ======================================
        // GET SELECTED QUANTITY
        // ======================================

        function getSelectedQuantity() {

            const quantity =
                Number(quantityInput.value);


            if (
                !quantity ||
                quantity < 1
            ) {

                return 1;

            }


            return Math.floor(
                quantity
            );

        }


        // ======================================
        // UPDATE PRODUCT PAGE STATE
        // ======================================

        function updateCartUI() {

            const selectedSize =
                sizeSelect.value;


            // No size selected
            if (!selectedSize) {

                initialQuantitySection.style.display =
                    "block";


                cartQuantitySection.style.display =
                    "none";


                addToCartButton.style.display =
                    "block";


                return;

            }


            const cart =
                getCart();


            const existingItem =
                findCartItem(
                    cart,
                    product,
                    selectedSize
                );


            // Product is already in cart
            if (existingItem) {

                const quantity =
                    Number(
                        existingItem.quantity
                    ) || 1;


                cartQuantityNumber.textContent =
                    quantity;


                initialQuantitySection.style.display =
                    "none";


                addToCartButton.style.display =
                    "none";


                cartQuantitySection.style.display =
                    "block";

            } else {

                // Product not in cart
                initialQuantitySection.style.display =
                    "block";


                addToCartButton.style.display =
                    "block";


                cartQuantitySection.style.display =
                    "none";

            }

        }


        // ======================================
        // ADD TO CART
        // ======================================

        addToCartButton.addEventListener(
            "click",
            function () {

                const selectedSize =
                    sizeSelect.value;


                // Check size
                if (!selectedSize) {

                    showSizeError(
                        "Please select a size before adding to cart."
                    );

                    return;

                }


                hideSizeError();


                const selectedQuantity =
                    getSelectedQuantity();


                let cart =
                    getCart();


                const existingItem =
                    findCartItem(
                        cart,
                        product,
                        selectedSize
                    );


                // If already exists
                if (existingItem) {

                    existingItem.quantity +=
                        selectedQuantity;

                } else {

                    // Add new product
                    cart.push({

                        id:
                            product.id,

                        name:
                            product.name,

                        price:
                            Number(product.price) || 0,

                        image:
                            product.image,

                        size:
                            selectedSize,

                        quantity:
                            selectedQuantity

                    });

                }


                // Save cart
                saveCart(cart);


                console.log(
                    "Product added to cart:",
                    cart
                );


                // IMPORTANT:
                // NO ALERT MESSAGE HERE


                // Show + / quantity / -
                updateCartUI();

            }
        );


        // ======================================
        // INCREASE QUANTITY
        // ======================================

        increaseButton.addEventListener(
            "click",
            function () {

                const selectedSize =
                    sizeSelect.value;


                if (!selectedSize) {

                    return;

                }


                const cart =
                    getCart();


                const existingItem =
                    findCartItem(
                        cart,
                        product,
                        selectedSize
                    );


                if (existingItem) {

                    existingItem.quantity =
                        (
                            Number(
                                existingItem.quantity
                            ) || 0
                        ) + 1;


                    saveCart(cart);


                    updateCartUI();


                    console.log(
                        "Cart quantity increased:",
                        cart
                    );

                }

            }
        );


        // ======================================
        // DECREASE QUANTITY
        // ======================================

        decreaseButton.addEventListener(
            "click",
            function () {

                const selectedSize =
                    sizeSelect.value;


                if (!selectedSize) {

                    return;

                }


                let cart =
                    getCart();


                const itemIndex =
                    cart.findIndex(
                        function (item) {

                            return (
                                String(item.id) ===
                                String(product.id) &&

                                item.size ===
                                selectedSize
                            );

                        }
                    );


                if (itemIndex === -1) {

                    return;

                }


                const existingItem =
                    cart[itemIndex];


                existingItem.quantity =
                    (
                        Number(
                            existingItem.quantity
                        ) || 1
                    ) - 1;


                // Remove from cart at zero
                if (
                    existingItem.quantity <= 0
                ) {

                    cart.splice(
                        itemIndex,
                        1
                    );

                }


                saveCart(cart);


                updateCartUI();


                console.log(
                    "Cart quantity decreased:",
                    cart
                );

            }
        );


        // ======================================
        // SIZE CHANGE
        // ======================================

        sizeSelect.addEventListener(
            "change",
            function () {

                hideSizeError();


                updateCartUI();

            }
        );


        // ======================================
        // BUY NOW
        // ======================================

        buyNowButton.addEventListener(
            "click",
            function () {

                const selectedSize =
                    sizeSelect.value;


                // Check size
                if (!selectedSize) {

                    showSizeError(
                        "Please select a size before buying."
                    );

                    return;

                }


                hideSizeError();


                const selectedQuantity =
                    getSelectedQuantity();


                let cart =
                    getCart();


                const existingItem =
                    findCartItem(
                        cart,
                        product,
                        selectedSize
                    );


                // Add product if not already present
                if (existingItem) {

                    // Keep current cart quantity
                    // Buy Now goes directly to cart

                } else {

                    cart.push({

                        id:
                            product.id,

                        name:
                            product.name,

                        price:
                            Number(product.price) || 0,

                        image:
                            product.image,

                        size:
                            selectedSize,

                        quantity:
                            selectedQuantity

                    });

                }


                // Save cart
                saveCart(cart);


                console.log(
                    "Buy Now cart:",
                    cart
                );


                // Go directly to cart
                window.location.href =
                    "cart.html";

            }
        );


        // ======================================
        // CHECK CART ON PAGE LOAD
        // ======================================

        updateCartUI();


    } catch (error) {

        console.error(
            "Unexpected error:",
            error
        );


        loadingMessage.textContent =
            "Something went wrong while loading the product.";

    }

}


// ==========================================
// 5. START PRODUCT PAGE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "THREADVERSE product page started!"
        );


        loadProduct();

    }
);
