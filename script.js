// ==========================================
// THREADVERSE - MAIN JAVASCRIPT
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
// 2. LOAD AND DISPLAY PRODUCTS
// ==========================================

async function loadProducts() {

    const productsGrid = document.querySelector(".products-grid");


    if (!productsGrid) {

        console.error("Products grid not found in index.html");

        return;

    }


    try {

        // Loading message
        productsGrid.innerHTML = `
            <p class="products-loading">
                Loading THREADVERSE products...
            </p>
        `;


        // Get products from Supabase
        const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("id", {
                ascending: true
            });


        // Check for Supabase error
        if (error) {

            console.error(
                "Supabase product error:",
                error.message
            );


            productsGrid.innerHTML = `
                <p class="products-error">
                    Unable to load products right now.
                </p>
            `;

            return;

        }


        console.log(
            "Products loaded successfully:",
            data
        );

        console.log(
            "Total products:",
            data.length
        );


        // No products found
        if (!data || data.length === 0) {

            productsGrid.innerHTML = `
                <p class="products-empty">
                    No products available yet.
                </p>
            `;

            return;

        }


        // Clear loading message
        productsGrid.innerHTML = "";


        // ======================================
        // CREATE PRODUCT CARDS
        // ======================================

        data.forEach(function (product) {


            const productCard =
                document.createElement("div");


            productCard.className =
                "product-card";


            // Product image
            const imageHTML = product.image
                ? `
                    <img
                        src="${product.image}"
                        alt="${product.name || "THREADVERSE Product"}"
                        class="real-product-image"
                        loading="lazy"
                    >
                `
                : `
                    <div class="product-image">
                        IMAGE COMING SOON
                    </div>
                `;


            // Product card content
            productCard.innerHTML = `

                ${imageHTML}

                <div class="product-details">

                    <p class="product-category">
                        ${product.category || "THREADVERSE"}
                    </p>

                    <h3>
                        ${product.name || "THREADVERSE Product"}
                    </h3>

                    <p class="product-description">
                        ${product.description || "Premium custom wear by THREADVERSE."}
                    </p>

                    <p class="product-price">
                        ₹${Number(product.price || 0).toLocaleString("en-IN")}
                    </p>

                    <button
                        class="product-button"
                        data-product-id="${product.id}"
                        type="button"
                    >
                        VIEW PRODUCT
                    </button>

                </div>
            `;


            // Open product details page
            const productButton =
                productCard.querySelector(".product-button");


            productButton.addEventListener(
                "click",
                function () {

                    window.location.href =
                        `product.html?id=${product.id}`;

                }
            );


            // Add card to website
            productsGrid.appendChild(
                productCard
            );


        });


        console.log(
            "THREADVERSE products displayed successfully."
        );


    } catch (error) {

        console.error(
            "Unexpected product loading error:",
            error
        );


        productsGrid.innerHTML = `
            <p class="products-error">
                Something went wrong while loading products.
            </p>
        `;

    }

}


// ==========================================
// 3. WEBSITE START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        console.log(
            "THREADVERSE website started successfully!"
        );


        // ======================================
        // LOAD PRODUCTS
        // ======================================

        loadProducts();


        // ======================================
        // SMOOTH SCROLLING
        // ======================================

        const navLinks =
            document.querySelectorAll('a[href^="#"]');


        navLinks.forEach(function (link) {


            link.addEventListener(
                "click",
                function (event) {


                    const targetId =
                        this.getAttribute("href");


                    if (
                        targetId &&
                        targetId !== "#"
                    ) {


                        const targetElement =
                            document.querySelector(targetId);


                        if (targetElement) {


                            event.preventDefault();


                            targetElement.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });


                        }

                    }


                }
            );


        });


        // ======================================
        // CUSTOM ORDER BUTTONS
        // ======================================

        const customButtons =
            document.querySelectorAll(".custom-order");


        customButtons.forEach(function (button) {


            button.addEventListener(
                "click",
                function () {


                    window.location.href =
                        "custom-order.html";


                }
            );


        });


        console.log(
            "THREADVERSE website fully initialized!"
        );


    }
);
