
 const cart = document.querySelector(".cart");
 const cartToggle = document.getElementById("cart-toggle");
 const cartClose = document.getElementById("cart-close");

 //Toggle Cart
    cartToggle.addEventListener("click", () => {
        cart.classList.toggle("cart_show_hide");
    }); 

 //Hide Cart
 if(cartClose) {
    cartClose.addEventListener("click", () => {
        cart.classList.remove("cart_show_hide");
    });
 }
