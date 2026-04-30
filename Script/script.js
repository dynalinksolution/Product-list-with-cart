const addToCartBtn = document.querySelectorAll("#to-cart");
const selectOrder = document.querySelectorAll("#cart-amt");
const increment = document.querySelectorAll(".max");
const decrement = document.querySelectorAll(".min");
const orderInputs = document.querySelectorAll(".quantity");
const dessertImgDiv = document.querySelectorAll(".dessert-img");
const emptyCartBg = document.querySelector(".cart-bg");
const totalSelectItems = document.querySelector(".total-items");
const selectedItems = document.querySelector(".occupied");
const cartDessertLists = document.querySelector(".cart-des-lists");
const totalCartItems = document.querySelector(".total-items");
const cartOccupied = document.querySelector(".occupied");
const totalItemOrder = document.querySelector(".total-order");
const confirmOrderBtn = document.querySelector(".order-btn");
const confirmOrderPage = document.querySelector(".confirm-order");
const confirmOrderList = document.querySelector(".confirm-order-list");
const startNewOrderBtn = document.querySelector(".confirm-order-btn");
const confirmTotalOrder = document.querySelector(".confirm-total-order");

let desserts = [];
updateCart(desserts);

// EventListeners - Event Handler
addToCartBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    btn.style.display = "none";
    e.currentTarget.nextElementSibling.style.display = "flex";
    e.currentTarget.parentElement.classList.add("selected");

    addToCart(e, desserts);
    numOfCartItems(desserts);
    updateCart(desserts);
  });
});

increment.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    addToCart(e, desserts);
    numOfCartItems(desserts);
    updateCart(desserts);
  });
});

decrement.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    desserts = removeDessert(e, desserts);
    numOfCartItems(desserts);
    updateCart(desserts);
  });
});

confirmOrderBtn.addEventListener("click", () => {
  renderCart(desserts);
  confirmOrderPage.style.display = "flex";
  renderConfirmPage(desserts);
  confirmTotalOrder.textContent = `$${calcTotalOrder(desserts)}`;
});

startNewOrderBtn.addEventListener("click", () => {
  document.location.href = "../index.html";
});

// Functions

function addToCart(e, desserts) {
  const dessertCard = e.currentTarget.closest(".dessert");
  id =
    dessertCard.querySelector(".dessert-details").firstElementChild.textContent;
  const existingItem = desserts.find((item) => item.id === id);

  if (existingItem) {
    existingItem.qty += 1;
    e.currentTarget.previousElementSibling.value = existingItem.qty;
  } else {
    let price =
      e.currentTarget.parentElement.nextElementSibling.lastElementChild
        .textContent;
    price = price.replace("$", "");
    const img = e.currentTarget.parentElement.firstElementChild;

    desserts.push({
      name: e.currentTarget.parentElement.nextElementSibling.firstElementChild
        .nextElementSibling.textContent,
      price: price,
      id: e.currentTarget.parentElement.nextElementSibling.firstElementChild
        .textContent,
      qty: 1,
      imgSrc: img.getAttribute("src"),

      get totalPrice() {
        return this.price * this.qty;
      },
    });
    e.currentTarget.nextElementSibling.querySelector(".quantity").value = 1;
  }
}

function removeDessert(e, desserts) {
  const dessertCard = e.currentTarget.closest(".dessert");
  id =
    dessertCard.querySelector(".dessert-details").firstElementChild.textContent;
  let existing = desserts.find((item) => item.id == id);

  if (!existing) return desserts;

  existing.qty -= 1;

  if (existing.qty === 0) {
    // reset UI
    resetUi(e);

    // remove from Array
    return desserts.filter((item) => item.id !== id);
    existing = null;
  }
  e.currentTarget.nextElementSibling.value = existing.qty;

  return desserts;
}

function resetUi(e) {
  e.currentTarget.parentElement.previousElementSibling.style.display = "flex";
  e.currentTarget.parentElement.style.display = "none";
  e.currentTarget.parentElement.parentElement.classList.remove("selected");
}

function numOfCartItems(desserts) {
  if (!desserts) {
    totalCartItems.textContent = 0;
  } else {
    totalCartItems.textContent = desserts.reduce((sum, item) => {
      return sum + item.qty;
    }, 0);
  }
}

function updateCart(desserts) {
  if (!desserts || desserts.length === 0) {
    emptyCartBg.style.display = "flex";
    cartOccupied.style.display = "none";
    cartDessertLists.innerHTML = "";
    totalCartItems.textContent = 0;
    totalItemOrder.textContent = "$0.00";

    desserts = desserts.filter((item) => item.qty > 0);

    return;
  }
  emptyCartBg.style.display = "none";
  cartOccupied.style.display = "block";

  numOfCartItems(desserts);
  renderCart(desserts);
}
function newCart() {
  desserts.forEach((item) => {
    const dessert = document.createElement("div");
    dessert.classList.add("listed-dessert");
    const dessertInfo = document.createElement("div");
    dessertInfo.classList.add("dessert-info");
    const dessertName = document.createElement("h2");
    dessertName.classList.add("dessert-name");
    dessertName.textContent = item.name;
    const dessertPricing = document.createElement("div");
    dessertPricing.classList.add("pricing");
    const itemQuantity = document.createElement("p");
    itemQuantity.classList.add("qnty");
    itemQuantity.innerHTML = `<span>${item.qty}</span>x`;
    const itemPrice = document.createElement("p");
    itemPrice.classList.add("item-price");
    itemPrice.textContent = `@$${item.price}`;
    const itemTotalPrice = document.createElement("p");
    itemTotalPrice.classList.add("t-price");
    let totalPrice = item.totalPrice;
    totalPrice = String(totalPrice);
    if (totalPrice.includes(".")) {
      totalPrice = totalPrice + "0";
    } else {
      totalPrice = totalPrice + ".00";
    }

    totalItemOrder.textContent = `$${calcTotalOrder(desserts)}`;
    itemTotalPrice.textContent = `$${totalPrice}`;
    const removeItemBtn = document.createElement("div");
    removeItemBtn.classList.add("delete-list-btn");
    removeItemBtn.textContent = "x";
    removeItemBtn.id = item.id;
    removeItemBtn.addEventListener("click", (e) => {
      const id = e.currentTarget.id;

      //  remove item from array completely
      desserts = removeItemFromCart(desserts, id);
      updateCart(desserts);

      // reset product ui
      const dessertCard = document.querySelectorAll(".dessert");
      dessertCard.forEach((card) => {
        const cardId =
          card.querySelector(".dessert-details").firstElementChild.textContent;

        if (cardId === id) {
          card.querySelector("#to-cart").style.display = "flex";
          card.querySelector("#cart-amt").style.display = "none";
          card.firstElementChild.classList.remove("selected");
        }
      });
      updateCart(desserts);
    });

    dessertPricing.append(itemQuantity, itemPrice, itemTotalPrice);
    dessertInfo.append(dessertName, dessertPricing);
    dessert.append(dessertInfo, removeItemBtn);

    cartDessertLists.appendChild(dessert);
  });
}

function renderCart(desserts) {
  cartDessertLists.innerHTML = "";
  newCart(desserts);
}

function calcTotalOrder(desserts) {
  let totalOrderPrice = desserts.reduce((sum, item) => {
    return sum + item.totalPrice;
  }, 0);

  totalOrderPrice = String(totalOrderPrice);
  if (totalOrderPrice.includes(".")) {
    totalOrderPrice = totalOrderPrice + "0";
  } else {
    totalOrderPrice = totalOrderPrice + ".00";
  }
  return totalOrderPrice;
}

function removeItemFromCart(desserts, id) {
  desserts = desserts.filter((item) => item.id !== id);
  return desserts;
}

function confirmPageList(desserts) {
  desserts.forEach((item) => {
    const dessert = document.createElement("div");
    dessert.classList.add("listed-dessert", "listed-dessert-confirm");

    const dessertThumbnail = document.createElement("div");
    dessertThumbnail.classList.add("dessert-thumbnail");
    const img = document.createElement("img");
    img.setAttribute("loading", "lazy");
    const itemImgSrc = item.imgSrc;
    let toSlice = itemImgSrc.lastIndexOf("-");
    let thmbSrc = itemImgSrc.slice(0, toSlice);
    thmbSrc = thmbSrc + "-thumbnail.jpg";
    img.setAttribute("src", thmbSrc);

    const dessertInfo = document.createElement("div");
    dessertInfo.classList.add("dessert-info");
    const dessertName = document.createElement("h2");
    dessertName.classList.add("dessert-name");
    dessertName.textContent = item.name;
    const dessertPricing = document.createElement("div");
    dessertPricing.classList.add("pricing");
    const itemQuantity = document.createElement("p");
    itemQuantity.classList.add("qnty");
    itemQuantity.innerHTML = `<span>${item.qty}</span>x`;
    const itemPrice = document.createElement("p");
    itemPrice.classList.add("item-price");
    itemPrice.textContent = `@$${item.price}`;

    const confirmPrice = document.createElement("p");
    confirmPrice.classList.add("t-price", "confirm-p");

    let totalPrice = item.totalPrice;
    totalPrice = String(totalPrice);
    if (totalPrice.includes(".")) {
      totalPrice = totalPrice + "0";
    } else {
      totalPrice = totalPrice + ".00";
    }
    confirmPrice.textContent = `$${totalPrice}`;

    dessertThumbnail.appendChild(img);
    dessertPricing.append(itemQuantity, itemPrice);
    dessertInfo.append(dessertName, dessertPricing);
    dessert.append(dessertThumbnail, dessertInfo, confirmPrice);
    confirmOrderList.appendChild(dessert);
  });
}

function renderConfirmPage(desserts) {
  confirmOrderList.innerHTML = "";
  confirmPageList(desserts);
}
