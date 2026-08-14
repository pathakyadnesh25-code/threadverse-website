```javascript
// ==========================================
// THREADVERSE - PRODUCT DETAILS JAVASCRIPT
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

const urlParams = new URLSearchParams(window.location.search);

const productId = urlParams.get("id");


// ==========================================
// 3. LOAD SELECTED PRODUCT
// ==========================================

async function loadProduct() {

    const productDetails =
        document.getElementById("product-details");

    const loadingMessage =
        document.getElementById("loading-message");


    // Check product ID
    if (!productId) {

        loadingMessage.textContent =
            "Product not found.";

        return;

    }


    try {

        // Get selected product from Supabase
        const { data: product, error } =
            await supabaseClient
                .from("products")
                .select("*")
                .eq("id", productId)
                .single();


        // Check database error
        if (error) {

            console.error(
                "Product loading error:",
                error.message
            );

            loadingMessage.textContent =
                "Unable to load this product.";

            return;

        }


        // Check product exists
        if (!product) {

            loadingMessage.textContent =
                "Product not found.";

            return;

        }


        console.log(
            "Product loaded successfully:",
            product
        );


        // Hide loading message
        loadingMessage.style.display = "none";


        // Display product
        productDetails.innerHTML = `

            <div class="product-detail-card">

                <div class="product-detail-image">

                    <img
                        src="${product.image}"
                        alt="${product.name || "THREADVERSE Product"}"
                    >

                </div>


                <div class="product-detail-info">

                    <p class="product-category">
                        ${product.category || "THREADVERSE"}
                    </p>


                    <h1>
                        ${product.name || "THREADVERSE Product"}
                    </h1>


                    <p class="product-detail-description">
                        ${product.description || "Premium custom wear by THREADVERSE."}
                    </p>


                    <h2 class="product-detail-price">
                        ₹${product.price || "0"}
                    </h2>


                    <label for="size">
                        SELECT SIZE
                    </label>

                    <select id="size">

                        <option value="">
                            Choose your size
                        </option>

                        <option value="S">
                            Small (S)
                        </option>

                        <option value="M">
                            Medium (M)
                        </option>

                        <option value="L">
                            Large (L)
                        </option>

                        <option value="XL">
                            Extra Large (XL)
                        </option>

                    </select>


                    <label for="quantity">
                        QUANTITY
                    </label>

                    <input
                        type="number"
                        id="quantity"
                        value="1"
                        min="1"
                    >


                    <button
                        class="add-to-cart-button"
                        id="add-to-cart"
                    >
                        ADD TO CART
                    </button>


                    <a
                        href="index.html#products"
                        class="back-button"
                    >
                        ← BACK TO SHOP
                    </a>

                </div>

            </div>

        `;


        // ==========================================
        // 4. ADD PRODUCT TO CART
        // ==========================================

        const addToCartButton =
            document.getElementById("add-to-cart");


        console.log(
            "Add to Cart button found:",
            addToCartButton
        );


        if (addToCartButton) {

            addToCartButton.addEventListener(
                "click",
                function () {

                    const selectedSize =
                        document.getElementById("size").value;

                    const selectedQuantity =
                        Number(
                            document.getElementById("quantity").value
                        );


                    // Check size
                    if (!selectedSize) {

                        alert("Please select a size.");

                        return;

                    }


                    // Check quantity
                    if (
                        !selectedQuantity ||
                        selectedQuantity < 1
                    ) {

                        alert(
                            "Please enter a valid quantity."
                        );

                        return;

                    }


                    // Get existing cart
                    let cart =
                        JSON.parse(
                            localStorage.getItem(
                                "threadverseCart"
                            )
                        ) || [];


                    // Find same product with same size
                    const existingItem =
                        cart.find(function (item) {

                            return (
                                String(item.id) === String(product.id) &&
                                item.size === selectedSize
                            );

                        });


                    // Increase quantity if already in cart
                    if (existingItem) {

                        existingItem.quantity +=
                            selectedQuantity;

                    } else {

                        // Add new item
                        cart.push({

                            id: product.id,

                            name: product.name ||
                                "THREADVERSE Product",

                            price:
                                Number(product.price) || 0,

                            image:
                                product.image || "",

                            size:
                                selectedSize,

                            quantity:
                                selectedQuantity

                        });

                    }


                    // Save cart
                    localStorage.setItem(
                        "threadverseCart",
                        JSON.stringify(cart)
                    );


                    console.log(
                        "Product added to cart:",
                        cart
                    );


                    alert(
                        (product.name ||
                            "Product") +
                        " added to your cart!"
                    );

                }
            );

        }


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
```
