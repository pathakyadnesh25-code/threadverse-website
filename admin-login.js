```javascript
// ==========================================
// THREADVERSE - ADMIN LOGIN JAVASCRIPT
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
// 2. PAGE START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "THREADVERSE admin login page started!"
        );


        // Check whether user is already logged in

        const {
            data: {
                session
            }
        } = await supabaseClient.auth.getSession();


        if (session) {

            console.log(
                "Admin session already exists."
            );

            window.location.href =
                "admin.html";

            return;

        }


        setupAdminLogin();


        setupPasswordToggle();

    }
);


// ==========================================
// 3. ADMIN LOGIN
// ==========================================

function setupAdminLogin() {


    const loginForm =
        document.getElementById(
            "admin-login-form"
        );


    const emailInput =
        document.getElementById(
            "admin-email"
        );


    const passwordInput =
        document.getElementById(
            "admin-password"
        );


    const loginButton =
        document.getElementById(
            "admin-login-button"
        );


    const messageBox =
        document.getElementById(
            "admin-login-message"
        );


    if (
        !loginForm ||
        !emailInput ||
        !passwordInput ||
        !loginButton ||
        !messageBox
    ) {

        console.error(
            "Admin login elements were not found."
        );

        return;

    }


    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                emailInput.value.trim();


            const password =
                passwordInput.value;


            // Clear previous message

            messageBox.textContent = "";

            messageBox.className =
                "admin-login-message";


            // Basic validation

            if (!email || !password) {

                showLoginMessage(
                    "Please enter your email and password.",
                    "error"
                );

                return;

            }


            // Loading state

            loginButton.disabled = true;

            loginButton.textContent =
                "SIGNING IN...";


            try {


                // ==================================
                // SUPABASE EMAIL/PASSWORD LOGIN
                // ==================================

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: password
                    });


                // ==================================
                // HANDLE LOGIN ERROR
                // ==================================

                if (error) {

                    console.error(
                        "Admin login error:",
                        error
                    );


                    showLoginMessage(
                        "Invalid email or password. Please try again.",
                        "error"
                    );


                    loginButton.disabled =
                        false;

                    loginButton.textContent =
                        "SIGN IN TO DASHBOARD";

                    return;

                }


                // ==================================
                // CHECK SESSION
                // ==================================

                if (
                    !data ||
                    !data.session
                ) {

                    showLoginMessage(
                        "Login could not be completed. Please try again.",
                        "error"
                    );


                    loginButton.disabled =
                        false;

                    loginButton.textContent =
                        "SIGN IN TO DASHBOARD";

                    return;

                }


                console.log(
                    "Admin signed in successfully:",
                    data.user.email
                );


                showLoginMessage(
                    "Login successful. Opening dashboard...",
                    "success"
                );


                // ==================================
                // REDIRECT TO ADMIN DASHBOARD
                // ==================================

                setTimeout(
                    function () {

                        window.location.href =
                            "admin.html";

                    },
                    700
                );


            } catch (error) {


                console.error(
                    "Unexpected admin login error:",
                    error
                );


                showLoginMessage(
                    "Something went wrong. Please try again.",
                    "error"
                );


                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "SIGN IN TO DASHBOARD";

            }

        }
    );

}


// ==========================================
// 4. SHOW LOGIN MESSAGE
// ==========================================

function showLoginMessage(
    message,
    type
) {


    const messageBox =
        document.getElementById(
            "admin-login-message"
        );


    if (!messageBox) {

        return;

    }


    messageBox.textContent =
        message;


    messageBox.className =
        "admin-login-message " +
        type;

}


// ==========================================
// 5. SHOW / HIDE PASSWORD
// ==========================================

function setupPasswordToggle() {


    const passwordInput =
        document.getElementById(
            "admin-password"
        );


    const toggleButton =
        document.getElementById(
            "toggle-admin-password"
        );


    if (
        !passwordInput ||
        !toggleButton
    ) {

        return;

    }


    toggleButton.addEventListener(
        "click",
        function () {


            const passwordIsHidden =
                passwordInput.type ===
                "password";


            passwordInput.type =
                passwordIsHidden
                    ? "text"
                    : "password";


            toggleButton.textContent =
                passwordIsHidden
                    ? "HIDE"
                    : "SHOW";


        }
    );

}
```
