//Header Date
setInterval(function () {
  let date = new Date();
  let days = date.getDay();
  let month = date.getMonth();
  let dateNum = date.getDate();

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let daysStr = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  document.getElementById("day").textContent = daysStr[days];
  document.getElementById("month").textContent = months[month];
  document.getElementById("dateNum").textContent = dateNum;
});

const productCards = document.querySelector(".product-cards");
const listHtmlCarts = document.querySelector(".list-html-cart");
let listProducts = [];
let listCartItems = JSON.parse(localStorage.getItem("cart")) || [];

const addDataToElement = () => {
  productCards.innerHTML = "";
  if (listProducts.length != 0) {
    listProducts.forEach((product) => {
      let newCard = document.createElement("div");
      newCard.classList.add("card");

      newCard.innerHTML = `
              <div class="product">
  
              <div class="porduct_header">
                <h3 class="title">${product.title}</h3>
                <h4>$${product.price}</h4>
              </div>
  
              <div class="product_img">
                 <img src="${product.img}" width="200" alt="">
              </div>
  
              <div class="product_footer" data-id="${product.id}">
              <button class="add-cart" data-id="${product.id}">Add To Cart  
              <img src="images/add-cart.png" class="shopping-img" alt="img">
              
              </button>
              <span id="heart"><i class="fa-regular fa-heart heart" data-id="${product.id}"></i></span>
              </div>
  
              </div>
       `;
      productCards.appendChild(newCard);
    });
  }
};

productCards.addEventListener("click", function (event) {
  let targetEvent = event.target;

  if (
    targetEvent.classList.contains("add-cart") ||
    targetEvent.classList.contains("shopping-img")
  ) {
    let productId = targetEvent.parentElement.dataset.id;
    addToCart(productId);
    addCartToHtml();
  } else if (targetEvent.classList.contains("heart")) {
    let like = document.querySelectorAll(".heart");
    let likeId = targetEvent.dataset.id;
    like[likeId].classList.toggle("fa-solid");
  }
});

//Add to cart
const addToCart = (productId) => {
  let positionThisCartItem = listCartItems.findIndex(
    (value) => value.productId == productId
  );

  if (listCartItems.length <= 0) {
    listCartItems = [
      {
        productId: productId,
        quantity: 1,
      },
    ];
  } else if (positionThisCartItem < 0) {
    listCartItems.push({
      productId: productId,
      quantity: 1,
    });
  } else listCartItems[positionThisCartItem].quantity += 1;

  addCartToHtml();
  saveToLocalStorage();
};

//Save to local storage
function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(listCartItems));
}

//Add cart to Html
const addCartToHtml = () => {
  listHtmlCarts.innerHTML = "";

  if (listCartItems.length > 0) {
    listCartItems.forEach((cartItem) => {
      let newCart = document.createElement("div");
      newCart.classList.add("cart-body");

      let positionProduct = listProducts.findIndex(
        (value) => value.id == cartItem.productId
      );
      let detail = listProducts[positionProduct];

      newCart.innerHTML = `
         <div class="cart-items" data-id="">
             <div class="cart-items-thumb">
                     <img src="${detail.img}" alt="">
                     <h5>$<span class="price-el" data-price="${detail.price}">${detail.price}</span></h5>
             </div>
             <div class="cart-items-qty">
             <p>${detail.title}</p>
                 <div>
                 <span data-id="${cartItem.productId}"><i class="fa-solid fa-minus minus"></i></span>
                 <small class="cartqauntity">${cartItem.quantity}</small>
                 <span data-id="${cartItem.productId}"><i class="fa-solid fa-plus plus"></i></span>
                 </div>
             </div>
             <div class="cart-items-action">
                 <span data-id="${cartItem.productId}"><i class="fa-solid fa-xmark delete"  data-id="${cartItem.id}"></i></span>
             </div>
         </div>
      `;
      listHtmlCarts.appendChild(newCart);
    });
    priceCalculating();
  }
};

listHtmlCarts.addEventListener("click", function (event) {
  let eventPlace = event.target;
  if (
    eventPlace.classList.contains("minus") ||
    eventPlace.classList.contains("plus") ||
    eventPlace.classList.contains("delete")
  ) {
    let cartId = eventPlace.parentElement.dataset.id;
    let type = "minus";

    if (eventPlace.classList.contains("plus")) type = "plus";
    else if (eventPlace.classList.contains("delete")) type = "delete";

    changeQuantity(cartId, type);
  }
});

//Change quantity
function changeQuantity(cartId, type) {
  let placeItemInCart = listCartItems.findIndex(
    (value) => value.productId == cartId
  );
  if (placeItemInCart >= 0) {
    switch (type) {
      case "plus":
        listCartItems[placeItemInCart].quantity =
          listCartItems[placeItemInCart].quantity + 1;
        break;

      case "delete":
        listCartItems.splice(placeItemInCart, 1);
        break;

      default:
        let quantityChange = listCartItems[placeItemInCart].quantity - 1;
        if (quantityChange > 0) {
          listCartItems[placeItemInCart].quantity = quantityChange;
        } else {
          listCartItems.splice(placeItemInCart, 1);
        }
        break;
    }
  }
  saveToLocalStorage();
  addCartToHtml();
  priceCalculating();
}

//fetch data from json
const getDataFromJson = () => {
  fetch("../product-data.json")
    .then((response) => response.json())
    .then((data) => {
      listProducts = data;
      addDataToElement();

      //get data from local storage
      if (localStorage.getItem("cart")) {
        listCartItems = JSON.parse(localStorage.getItem("cart"));
        addCartToHtml();
      }
    });
};
getDataFromJson();

//Price calculating
function priceCalculating() {
  let priceEl = document.querySelectorAll(".price-el");
  let toTalPriceShEl = document.getElementById("totalPrice");
  let totalPrice = 0;
  let totalItem = 0;

  listCartItems.forEach((cartItem, index) => {
    if (!listCartItems.length <= 0) {
      const priceData = priceEl[index].dataset.price;
      totalPrice += parseInt(cartItem.quantity) * parseInt(priceData);
      totalItem += cartItem.quantity;
    }
  });
  // Display total price and total items count
  toTalPriceShEl.textContent = "$" + totalPrice.toFixed(2);
  document.getElementById("card_length").innerHTML = totalItem;
  document.getElementById("number-of-items").innerHTML = totalItem;
}
priceCalculating();

//Search related elements
const card = document.querySelectorAll(".card");
const searchIcon = document.getElementById("search_icon");
const searchInput = document.getElementById("search_input");

function displayNone(display) {
  card.forEach((card) => {
    card.style.display = display;
  });
}

// For Searching Productes
function find_my_product() {
  displayNone("none");

  let searchValue = searchInput.value;
  searchValue = searchValue.toUpperCase();
  let searchStrings = searchValue.split(/\W/);
  let title = document.querySelectorAll(".title");

  for (let i = 0; i < title.length; i++) {
    //set a counter to zero
    let num = 0;

    for (let j = 0; j < searchStrings.length; j++) {
      let currentSearch = searchStrings[j].toUpperCase();

      if (searchValue !== "") {
        // if the term is found, add 1 to the counter
        if (title[i].textContent.toUpperCase().indexOf(currentSearch) !== -1) {
          num++;
        }

        // display only if all the terms were found
        let titleParent = title[i].parentNode,
          bodyParent = titleParent.parentNode,
          desParent = bodyParent.parentNode;
        const searchArea = document.querySelector(".search-group");

        document.addEventListener("click", function (event) {
          if (!searchArea.contains(event.target)) {
            desParent.style.display = "inline";
          }
        });
        if (num == searchStrings.length) desParent.style.display = "inline";
        else desParent.style.display = "none";
      } else {
        displayNone("inline");
      }
    }
  }
}
searchIcon.addEventListener("click", find_my_product);
