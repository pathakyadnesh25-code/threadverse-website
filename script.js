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

        productsGrid.innerHTML = "<p>Loading products...</p>";

        const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            console.error("Supabase product error:", error.message);

            productsGrid.innerHTML = `
                <p>Unable to load products right now.</p>
            `;

            return;
        }

        console.log("Products loaded successfully:", data);
        console.log("Total products:", data.length);

        if (!data || data.length === 0) {
            productsGrid.innerHTML = `
                <p>No products available yet.</p>
            `;

            return;
        }


        // Clear old manually created products
        productsGrid.innerHTML = "";


        // Create product cards
        data.forEach(function (product) {

            const productCard = document.createElement("div");

            productCard.className = "product-card";


            // Product image
            const imageHTML = product.image
                ? `
                    <img
                        src="${product.image}"
                        alt="${product.name || "THREADVERSE Product"}"
                        class="real-product-image"
                    >
                  `
                : `
                    <div class="product-image">
                        IMAGE COMING SOON
                    </div>
                  `;


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
                        ₹${product.price || "0"}
                    </p>

                    <button class="product-button">
                        VIEW PRODUCT
                    </button>

                </div>
            `;


            productsGrid.appendChild(productCard);

        });


        // Add click events after products are created
        const productButtons = document.querySelectorAll(".product-button");

        productButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                alert("Product ordering will be connected soon!");

            });

        });


    } catch (error) {

        console.error("Unexpected error:", error);

        productsGrid.innerHTML = `
            <p>Something went wrong while loading products.</p>
        `;

    }

}


// ==========================================
// 3. WEBSITE START
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("THREADVERSE website started successfully!");

    // Load products from Supabase
    loadProducts();


    // ======================================
    // SMOOTH SCROLLING
    // ======================================

    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId && targetId !== "#") {

                const targetElement = document.querySelector(targetId);

                if (targetElement) {

                    event.preventDefault();

                    targetElement.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }

        });

    });


    // ======================================
    // CUSTOM DESIGN BUTTON
    // ======================================

    const customButtons = document.querySelectorAll(".custom-order");

    customButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            alert("Welcome to THREADVERSE Custom Design!");

        });

    });

});
