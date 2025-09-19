// Load users from localStorage OR set default ones
/* {
    "rajesh@gmail.com": "Rajesh@1",
    "durga@gmail.com": "durga@1",
    "+91 9827798277": "rahul$1",
    "ram@outlook.com": "ram$1",
    "+91 7676767676": "shreya@1"
};*/

let users = JSON.parse(localStorage.getItem("users")) || {};
// Save users back to localStorage
function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

// To add a new registered user
function addUser(event) {
    event.preventDefault(); // stop form from refreshing

    let username = document.getElementById("newUsername").value.trim();
    let pswd = document.getElementById("newPassword").value.trim();
    let confirmPswd = document.getElementById("checkPassword").value.trim();

    console.log("Register attempt:", username, pswd, confirmPswd); // debug

    if (!username || !pswd) {
        alert("Please enter both username and password");
        return;
    }

    if (pswd !== confirmPswd) {
        alert("Passwords do not match!");
        return;
    }

    if (users[username]) {
        alert("User already registered!");
        return;
    }

    // Add new user
    users[username] = pswd;
    saveUsers();

    alert("User registered successfully!");
    window.location.href = "index.html"; // redirect
}

// To verify an authorized user 
function verifyUser(event) {
    event.preventDefault(); // stop form from refreshing

    let username = document.getElementById("username").value.trim();
    let pswd = document.getElementById("inputPassword").value.trim();

    console.log("Login attempt:", username, pswd); // debug

    if (users[username] && users[username] === pswd) {
        alert("Login Successful!");
        window.location.href = "index.html"; // redirect
    } else {
        alert("Enter valid credentials!");
    }
}







let cart=JSON.parse(localStorage.getItem("cart")) || [];
const GST=0.12;
const DISCOUNT=0.1;

// Function to get total quantity
function getTotalQuantity() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Function to update navbar cart count
function updateCartCount() {
    const cartCount = document.querySelector(".cart-badge");
    if (cartCount) {
        cartCount.innerText = getTotalQuantity();
    }
}

// Function to add item
function addItem(button) {
    const card=button.closest(".card-body");
    const name=card.querySelector(".card-title").innerText;
    const priceText=card.querySelector("h6").innerText;
    const price=parseInt(priceText.match(/\d+/)[0]); // extract number

    // check if item exists
    const existingItem=cart.find(item => item.name === name);
    if (existingItem)
        existingItem.quantity++;
    else 
        cart.push({ name, price, quantity: 1 });

    // save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    alert(`${name} added to cart!`);

    if(window.location.pathname.includes("cart.html"))
        location.reload();
    
}

// Function to render cart page
function renderCart() {
    const emptyCart=document.querySelector(".empty-cart");
    const cartContainer=document.querySelector(".cart-container");
    const cartItemsContainer=document.querySelector(".cart-items");
    const amount=document.querySelector(".total-amount");

    if (!cartItemsContainer) return; // only run on cart.html

    cartItemsContainer.innerHTML="";
    let totalBill=0;

    if (cart.length===0) {
        if(emptyCart) 
            emptyCart.style.display="flex"; // show empty message
        if(cartContainer) 
            cartContainer.style.display = "none"; // hide cart
        if(amount) 
            amount.innerHTML = "₹0";               // reset bill
        return;
    }
    if(emptyCart) 
        emptyCart.style.display = "none";   // hide empty message
    if(cartContainer) 
        cartContainer.style.display = "block"; // show cart

    // Heading for the cart item list
    const headingRow = document.createElement("div");
    headingRow.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "fw-bold",
        "mx-5",
        "cart-heading-row"
    );
    headingRow.innerHTML = `
        <div class="cart-title" style="color: rgba(153, 78, 46); font-size: 24px;">Item</div>
        <div class="cart-qt-amt" class="d-flex" style="color: rgb(22, 164, 74, 1); font-size: 20px;">
            <span class="me-3">Quantity</span>
            <span>Total</span>
        </div>
    `;
    cartItemsContainer.appendChild(headingRow);

    cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center",
            "shadow-sm",
            "mx-5"
        );

        itemDiv.innerHTML = `
            <div>
                <h5 class="mb-1">${item.name}</h5>
                <small class="text-muted">₹${item.price} each</small>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-danger me-2" onclick="changeQuantity(${index}, -1)">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-success me-3" onclick="changeQuantity(${index}, 1)">+</button>
                <strong>₹${item.price * item.quantity}</strong>
            </div>
        `;

        cartItemsContainer.appendChild(itemDiv);
        totalBill+=item.price*item.quantity;
    });

    // To display bill
    let actualAmount=document.querySelector(".actual-amount");
    actualAmount.innerHTML=`₹${totalBill}`;
    let actual=totalBill;

    let gst=document.querySelector(".gst-amount");
    let gstAmount=GST*totalBill;
    gst.innerHTML=`+₹${gstAmount}`;

    let discount=document.querySelector(".discount-amount");
    let discountAmount;
    if(actual>599) {
        discountAmount=DISCOUNT*totalBill;
        discount.innerHTML=`-₹${discountAmount}`;
    }
    else
    {
        discountAmount=0;
        discount.innerHTML=`₹0`;
    }
    
    totalBill+=gstAmount-discountAmount;
    amount.innerHTML=`₹${totalBill}`;
}

// Change quantity
function changeQuantity(index, change) {
    cart[index].quantity+=change;

    if (cart[index].quantity<=0)
        cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Load cart on cart.html
document.addEventListener("DOMContentLoaded", renderCart);

// Update total items
document.addEventListener("DOMContentLoaded", updateCartCount);




// To save bill in local storage
const payBtn = document.querySelector(".payBill button");
if (payBtn) {
    payBtn.addEventListener("click", function () {
        const billHTML = document.getElementById("billSection").outerHTML;
        localStorage.setItem("invoiceData", billHTML);
        localStorage.setItem("clearCart", "true"); // mark cart to be cleared
        window.open("order.html", "_blank");
    });
}

// downloading invoice bill as pdf (only on order.html)
document.addEventListener("DOMContentLoaded", () => {
    // Render saved bill
    const billHTML = localStorage.getItem("invoiceData");
    if (billHTML) {
        document.getElementById("billContainer").innerHTML = billHTML;
    }

    // Download Invoice
    const downloadBtn = document.getElementById("downloadInvoice");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            const billElement = document.getElementById("billSection");
            if (billElement) {
                const opt = {
                    margin: 0.5,
                    filename: 'AV_Order_Invoice.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                html2pdf().set(opt).from(billElement).save().then(() => {
                    // delay alert by 1 second
                    setTimeout(() => {
                        alert("Download successful! ☕ Happy Caffiening...");
                    }, 1000);
                });
            }
        });
    }

    // Clear cart after successful order
    if (localStorage.getItem("clearCart") === "true") {
        localStorage.removeItem("cart");
        localStorage.removeItem("clearCart");
    }
    
});


// Empty all items in cart and innvoice created
document.getElementById("empty-cart-btn").addEventListener("click", (event)=>{
        // clear cart array
        cart = [];  

        // remove from localStorage
        localStorage.removeItem("cart");

        // Suppose you stored invoice data
        localStorage.setItem("invoiceData", "<div>Bill</div>");

        // Later, to remove only that
        localStorage.removeItem("invoiceData");

        // re-render cart instantly
        renderCart();

        // update cart count in navbar
        updateCartCount();

        alert("Your cart is now empty! 🛒");
    }
);