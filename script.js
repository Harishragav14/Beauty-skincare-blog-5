
const SUPABASE_URL = "https://dowdrzcftavwdvlwqjjx.supabase.co";

const SUPABASE_KEY = "sb_publishable_8fGnZM2bGCdp76AsR-rtDg_X4WvMECS";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
// DOM element selection
var heading = document.getElementById("about");
var paragraphs = document.getElementsByTagName("p");
var tips = document.getElementsByClassName("tip");
var sections = document.querySelectorAll("section");

// Show or hide beauty tips
document.getElementById("toggleTips").addEventListener("click", function () {
    for (var i = 0; i < tips.length; i++) {
        tips[i].classList.toggle("hidden");
    }

    this.textContent = tips[0].classList.contains("hidden")
        ? "Show Tips"
        : "Hide Tips";
});

// Filter skincare products
document.getElementById("skinType").addEventListener("change", function () {
    var type = this.value;
    var products = document.querySelectorAll(".product");
    var count = 0;

    products.forEach(function (product) {
        var show = type === "all" || product.dataset.skin === type;
        product.style.display = show ? "" : "none";
        if (show) count++;
    });

    document.getElementById("productMessage").textContent =
        count + (count === 1 ? " product found." : " products found.");
});

// Live message character counter
var message = document.getElementById("message");

message.addEventListener("input", function () {
    document.getElementById("charCount").textContent = this.value.length;
});

// Contact form connected to Supabase
document.getElementById("contactForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var message = document.getElementById("message").value.trim();
    var result = document.getElementById("result");
    var button = this.querySelector('button[type="submit"]');

    if (name.length < 1 || name.length > 20) {
        result.textContent = "Name must be 1–20 characters.";
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        result.textContent = "Enter a valid email containing @.";
        return;
    }

    if (message.length < 1 || message.length > 200) {
        result.textContent = "Message must be 1–200 characters.";
        return;
    }

    button.disabled = true;
    result.textContent = "Saving message...";

    try {
        const { error } = await db
            .from("contact_messages")
            .insert([{ name: name, email: email, message: message }]);

        if (error) throw error;

        result.textContent = "Message saved successfully!";
        this.reset();
        document.getElementById("charCount").textContent = "0";

    } catch (error) {
        console.error(error);
        result.textContent = "Failed to save. Please try again.";
    } finally {
        button.disabled = false;
    }
});

// Dark mode toggle
document.getElementById("themeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark");

    var dark = document.body.classList.contains("dark");
    this.textContent = dark ? "Light Mode" : "Dark Mode";
});

// Click event for headings
document.addEventListener("click", function (event) {
    if (event.target.tagName === "H2") {
        event.target.style.color = "#91a582";
    }
});
