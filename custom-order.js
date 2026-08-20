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


    // Check required elements
    if (!customOrderForm) {

        console.error("Custom order form not found.");

        return;

    }


    if (!submitButton) {

        console.error("Submit button not found.");

        return;

    }


    if (!messageBox) {

        console.error("Custom order message box not found.");

        return;

    }


    // ==========================================
    // 3. FORM SUBMISSION
    // ==========================================

    customOrderForm.addEventListener(
        "submit",
        async function (event) {

            // Stop page refresh
            event.preventDefault();


            // Prevent duplicate submission
            if (submitButton.disabled) {

                return;

            }


            // ======================================
            // 4. GET FORM VALUES
            // ======================================

            const customerNameElement =
                document.getElementById("customer-name");

            const emailElement =
                document.getElementById("email");

            const phoneElement =
                document.getElementById("phone");

            const productTypeElement =
                document.getElementById("product-type");

            const styleElement =
                document.getElementById("style");

            const sizeElement =
                document.getElementById("size");

            const quantityElement =
                document.getElementById("quantity");

            const designDescriptionElement =
                document.getElementById("design-description");

            const imageInput =
                document.getElementById("design-image");


            // Check form fields exist
            if (
                !customerNameElement ||
                !emailElement ||
                !phoneElement ||
                !productTypeElement ||
                !styleElement ||
                !sizeElement ||
                !quantityElement ||
                !designDescriptionElement
            ) {

                console.error("One or more form fields are missing.");

                messageBox.textContent =
                    "Something is missing from the form. Please refresh and try again.";

                return;

            }


            const customerName =
                customerNameElement.value.trim();

            const email =
                emailElement.value.trim();

            const phone =
                phoneElement.value.trim();

            const productType =
                productTypeElement.value;

            const style =
                styleElement.value.trim();

            const size =
                sizeElement.value;

            const quantity =
                Number(quantityElement.value);

            const designDescription =
                designDescriptionElement.value.trim();


            // ======================================
            // 5. BASIC VALIDATION
            // ======================================

            if (!customerName) {

                messageBox.textContent =
                    "Please enter your name.";

                return;

            }


            if (!email) {

                messageBox.textContent =
                    "Please enter your email address.";

                return;

            }


            if (!phone) {

                messageBox.textContent =
                    "Please enter your phone number.";

                return;

            }


            if (!productType) {

                messageBox.textContent =
                    "Please select a product type.";

                return;

            }


            if (!size) {

                messageBox.textContent =
                    "Please select a size.";

                return;

            }


            if (!quantity || quantity < 1) {

                messageBox.textContent =
                    "Please enter a valid quantity.";

                return;

            }


            if (!designDescription) {

                messageBox.textContent =
                    "Please describe your design.";

                return;

            }


            // ======================================
            // 6. START SUBMISSION
            // ======================================

            submitButton.disabled = true;

            submitButton.innerHTML =
                "SUBMITTING YOUR DESIGN...";

            messageBox.textContent =
                "Please wait while we submit your custom order...";


            try {


                // ==================================
                // 7. UPLOAD DESIGN IMAGE
                // ==================================

                let designImageURL = null;


                if (
                    imageInput &&
                    imageInput.files &&
                    imageInput.files.length > 0
                ) {


                    const file =
                        imageInput.files[0];


                    // Get file extension
                    const fileExtension =
                        file.name.split(".").pop();


                    // Create unique filename
                    const uniqueFileName =
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .substring(2, 10) +
                        "." +
                        fileExtension;


                    // Storage path
                    const filePath =
                        "custom-orders/" +
                        uniqueFileName;


                    console.log(
                        "Uploading design:",
                        filePath
                    );


                    // Upload image
                    const {
                        data: uploadData,
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
                            "Unable to upload your design image: " +
                            uploadError.message
                        );

                    }


                    console.log(
                        "Design uploaded successfully:",
                        uploadData
                    );


                    // Get public URL
                    const {
                        data: publicURLData
                    } =
                    supabaseClient
                        .storage
                        .from("designs")
                        .getPublicUrl(filePath);


                    if (
                        publicURLData &&
                        publicURLData.publicUrl
                    ) {

                        designImageURL =
                            publicURLData.publicUrl;

                    }


                    console.log(
                        "Design image URL:",
                        designImageURL
                    );

                }


                // ==================================
                // 8. SAVE CUSTOM ORDER TO SUPABASE
                // ==================================

                console.log(
                    "Saving custom order..."
                );


                // IMPORTANT:
                // No .select() or .single() here.
                // This prevents requiring SELECT permission.

                const {
                    error: insertError
                } =
                await supabaseClient
                    .from("custom_designs")
                    .insert([
                        {
                            customer_name: customerName,
                            email: email,
                            phone: phone,

                            product_type: productType,

                            style:
                                style || null,

                            size: size,

                            quantity: quantity,

                            design_description:
                                designDescription,

                            design_image:
                                designImageURL,

                            status:
                                "Pending"
                        }
                    ]);


                // Check database error
                if (insertError) {

                    console.error(
                        "Custom order save error:",
                        insertError
                    );

                    throw new Error(
                        insertError.message ||
                        "Unable to save your custom order."
                    );

                }


                console.log(
                    "Custom order saved successfully!"
                );


                // ==================================
                // 9. SUCCESS
                // ==================================

                messageBox.innerHTML =
                    "✓ Your custom design has been submitted successfully! " +
                    "Thank you for choosing THREADVERSE. " +
                    "We will review your design and contact you soon.";


                // Reset form
                customOrderForm.reset();


                // Scroll to success message
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
                // 10. RESET BUTTON
                // ==================================

                submitButton.disabled = false;

                submitButton.innerHTML =
                    'SUBMIT CUSTOM ORDER <span>→</span>';

            }

        }
    );


    console.log(
        "THREADVERSE Custom Order form is ready!"
    );

});
