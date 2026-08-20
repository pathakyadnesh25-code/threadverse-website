
// ==========================================
// THREADVERSE - CUSTOM ORDER JAVASCRIPT
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
// 2. PAGE START
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("THREADVERSE Custom Order page started!");

    const customOrderForm =
        document.getElementById("custom-order-form");

    const submitButton =
        document.getElementById("submit-custom-order");

    const messageBox =
        document.getElementById("custom-order-message");


    if (!customOrderForm) {

        console.error(
            "Custom order form not found."
        );

        return;

    }


    // ==========================================
    // 3. FORM SUBMISSION
    // ==========================================

    customOrderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Prevent duplicate submissions
            if (submitButton.disabled) {
                return;
            }


            // --------------------------------------
            // GET FORM VALUES
            // --------------------------------------

            const customerName =
                document.getElementById("customer-name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const productType =
                document.getElementById("product-type").value;

            const style =
                document.getElementById("style").value.trim();

            const size =
                document.getElementById("size").value;

            const quantity =
                Number(
                    document.getElementById("quantity").value
                );

            const designDescription =
                document
                    .getElementById("design-description")
                    .value
                    .trim();

            const imageInput =
                document.getElementById("design-image");


            // --------------------------------------
            // BASIC VALIDATION
            // --------------------------------------

            if (
                !customerName ||
                !email ||
                !phone ||
                !productType ||
                !size ||
                !quantity ||
                quantity < 1 ||
                !designDescription
            ) {

                messageBox.textContent =
                    "Please complete all required fields.";

                return;

            }


            // --------------------------------------
            // START LOADING
            // --------------------------------------

            submitButton.disabled = true;

            submitButton.innerHTML =
                "SUBMITTING YOUR ORDER...";

            messageBox.textContent =
                "Please wait while we submit your custom order...";


            try {


                // ==================================
                // 4. UPLOAD DESIGN IMAGE
                // ==================================

                let designImageURL = null;


                if (
                    imageInput &&
                    imageInput.files &&
                    imageInput.files.length > 0
                ) {


                    const file =
                        imageInput.files[0];


                    // Create unique filename
                    const fileExtension =
                        file.name.split(".").pop();


                    const safeFileName =
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .substring(2, 10) +
                        "." +
                        fileExtension;


                    const filePath =
                        "custom-orders/" +
                        safeFileName;


                    console.log(
                        "Uploading design:",
                        filePath
                    );


                    // Upload to Supabase Storage
                    const {
                        error: uploadError
                    } =
                    await supabaseClient
                        .storage
                        .from("designs")
                        .upload(
                            filePath,
                            file,
                            {
                                cacheControl: "3600",
                                upsert: false
                            }
                        );


                    if (uploadError) {

                        console.error(
                            "Design upload error:",
                            uploadError
                        );

                        throw new Error(
                            "Unable to upload your design. Please try again."
                        );

                    }


                    // Get public image URL
                    const {
                        data: publicURLData
                    } =
                    supabaseClient
                        .storage
                        .from("designs")
                        .getPublicUrl(
                            filePath
                        );


                    designImageURL =
                        publicURLData.publicUrl;


                    console.log(
                        "Design uploaded successfully:",
                        designImageURL
                    );

                }


                // ==================================
                // 5. SAVE CUSTOM ORDER IN SUPABASE
                // ==================================

                console.log(
                    "Saving custom order..."
                );


                const {
                    data,
                    error
                } =
                const { error } = await supabaseClient
    .from("custom_designs")
    .insert([
        {
            customer_name: customerName,
            email: email,
            phone: phone,
            product_type: productType,
            style: style || null,
            size: size,
            quantity: quantity,
            design_description: designDescription,
            design_image: designImageURL,
            status: "Pending"
        }
    ]);


                if (error) {

                    console.error(
                        "Custom order save error:",
                        error
                    );

                    throw new Error(
                        error.message ||
                        "Unable to submit your custom order."
                    );

                }


                console.log(
                    "Custom order saved successfully:",
                    data
                );


                // ==================================
                // 6. SUCCESS MESSAGE
                // ==================================

                messageBox.textContent =
                    "✓ Your custom order has been submitted successfully! THREADVERSE will contact you soon.";


                // Reset form
                customOrderForm.reset();


                // Scroll to message
                messageBox.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


            } catch (error) {


                console.error(
                    "Custom order error:",
                    error
                );


                messageBox.textContent =
                    error.message ||
                    "Something went wrong. Please try again.";


            } finally {


                // ==================================
                // 7. RESET BUTTON
                // ==================================

                submitButton.disabled = false;

                submitButton.innerHTML =
                    'SUBMIT CUSTOM ORDER <span>→</span>';

            }

        }
    );

});

