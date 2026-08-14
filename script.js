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
// 2. LOAD PRODUCTS FROM SUPABASE
// ==========================================

async function loadProducts() {
    try {
        const { data, error } = await supabaseClient
            .from("products")
            .select("*");

        if (error) {
            console.error("Supabase product error:", error.message);
            return;
        }

        console.log("Products loaded successfully:", data);
        console.log("Total products:", data.length);

    } catch (error) {
        console.error("Unexpected error:", error);
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
    // PRODUCT BUTTONS
    // ======================================

    const productButtons = document.querySelectorAll(".product-button");

    productButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            alert("This product feature is being connected to THREADVERSE!");

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
