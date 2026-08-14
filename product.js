// ==========================================
// THREADVERSE - PRODUCT DETAILS JAVASCRIPT
// ==========================================

// SUPABASE CONFIGURATION
const SUPABASE_URL = "https://gguzdxgxtpibbsfqtxjm.supabase.co";

const SUPABASE_KEY = "sb_publishable_kli1NoCH59sG0Sa3I2-hTw_W909MSZX";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// GET PRODUCT ID FROM URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");


// LOAD SELECTED PRODUCT
async function loadProduct() {

    const productDetails = document.getElementById("product-details");
    const loadingMessage = document.getElementById("loading-message");

    if (!productId) {
        loadingMessage.textContent = "Product not found.";
        return;
    }

    try {

        const { data: product, error } = await supabaseClient
            .from("products")
            .select("*")
            .eq("id", productId)
            .single();

        if (error) {
            console.error("Product loading error:", error.message);
            loadingMessage.textContent = "Unable to load this product.";
            return;
        }

        console.log("Product loaded successfully:", product);

        loadingMessage.style.display = "none";

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

                    <h1>${product.name || "THREADVERSE Product"}</h1>

                    <p class="product-detail-description">
                        ${product.description || "Premium custom wear by THREADVERSE."}
                    </p>

                    <h2 class="product-detail-price">
                        ₹${product.price || "0"}
                    </h2>

                    <label for="size">SELECT SIZE</label>

                    <select id="size">
                        <option value="">Choose your size</option>
                        <option value="S">Small (S)</option>
                        <option value="M">Medium (M)</option>
                        <option value="L">Large (L)</option>
                        <option value="XL">Extra Large (XL)</option>
                    </select>

                    <label for="quantity">QUANTITY</label>

                    <input
                        type="number"
                        id="quantity"
                        value="1"
                        min="1"
                    >

                    <button class="add-to-cart-button" id="add-to-cart">
    ADD TO CART
</button>

                    <a href="index.html#products" class="back-button">
                        ← BACK TO SHOP
                    </a>

                </div>

            </div>
        `; 
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

                    <h1>${product.name || "THREADVERSE Product"}</h1>

                    <p class="product-detail-description">
                        ${product.description || "Premium custom wear by THREADVERSE."}
                    </p>

                    <h2 class="product-detail-price">
                        ₹${product.price || "0"}
                    </h2>

                    <label for="size">SELECT SIZE</label>

                    <select id="size">
                        <option value="">Choose your size</option>
                        <option value="S">Small (S)</option>
                        <option value="M">Medium (M)</option>
                        <option value="L">Large (L)</option>
                        <option value="XL">Extra Large (XL)</option>
                    </select>

                    <label for="quantity">QUANTITY</label>

                    <input
                        type="number"
                        id="quantity"
                        value="1"
                        min="1"
                    >

                    <button class="add-to-cart-button" id="add-to-cart">
                        ADD TO CART
                    </button>

                    <a href="index.html#products" class="back-button">
                        ← BACK TO SHOP
                    </a>

                </div>

            </div>
        `;


        // ==========================================
        // ADD PRODUCT TO CART
        // ==========================================

        const addToCartButton = document.getElementById("add-to-cart");

        addToCartButton.addEventListener("click", function () {

            const selectedSize = document.getElementById("size").value;

            const selectedQuantity = Number(
                document.getElementById("quantity").value
            );

            // Check whether size is selected
            if (!selectedSize) {
                alert("Please select a size.");
                return;
            }

            // Check quantity
            if (!selectedQuantity || selectedQuantity < 1) {
                alert("Please enter a valid quantity.");
                return;
            }


            // Get existing cart
            let cart = JSON.parse(
                localStorage.getItem("threadverseCart")
            ) || [];


            // Check whether same product and size already exist
            const existingItem = cart.find(function (item) {

                return item.id === product.id &&
                       item.size === selectedSize;

            });


            // If product already exists, increase quantity
            if (existingItem) {

                existingItem.quantity += selectedQuantity;

            } else {

                // Add new product
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.image,
                    size: selectedSize,
                    quantity: selectedQuantity
                });

            }


            // Save cart in browser
            localStorage.setItem(
                "threadverseCart",
                JSON.stringify(cart)
            );


            alert(product.name + " added to your cart!");

        });


    } catch (error) {

    } catch (error) {

        console.error("Unexpected error:", error);
        loadingMessage.textContent = "Something went wrong.";

    }

}


// START
document.addEventListener("DOMContentLoaded", function () {

    console.log("THREADVERSE product page started!");

    loadProduct();

});
