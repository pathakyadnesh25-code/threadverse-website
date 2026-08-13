const SUPABASE_URL = "https://gguzdxgtpibsftqxjm.supabase.co";

const SUPABASE_KEY = "sb_publishable_kli1NoCH59sG0Sa3I2-hTw_W909MSZX;

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);// 
    const { data, error } = await supabaseClient
        .from("products")
        .select("*");

    if (error) {
        console.error("Error loading products:", error);
        return;
    }

    console.log("Products loaded:", data);
}EADVERSE Website JavaScript

document.addEventListener("loadProducts();", function () {

    // Show welcome message in browser console
    console.log("Welcome to THREADVERSE - Wear Your Identity!");

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href");

            if (targetId !== "#") {
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

    // Product buttons
    const productButtons = document.querySelectorAll(".product-button");

    productButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            alert("This product will be available soon on THREADVERSE!");
        });
    });

    // Custom order button
    const customButtons = document.querySelectorAll(".custom-order");

    customButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            alert("Welcome to THREADVERSE Custom Design! Your custom clothing journey starts here.");
        });
    });

});
