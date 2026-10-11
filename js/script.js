const carGrid = document.getElementById("car-grid");

function displayCars(list) {
  carGrid.innerHTML = "";

  list.forEach(function (car) {
    const status = car.available ? "Available" : "Booked";
    const statusClass = car.available ? "available" : "booked";

    carGrid.innerHTML += `
      <article class="car-card">
        <img src="${car.image}" alt="${car.name}">
        <div class="car-info">
          <h3>${car.name}</h3>
          <p class="category">${car.category}</p>
          <ul>
            <li>Fuel: ${car.fuel}</li>
            <li>Seats: ${car.seats}</li>
          </ul>
          <p class="price">$${car.price} <span>per day</span></p>
          <span class="status ${statusClass}">${status}</span>
<a href="car.html?id=${car.id}" class="details-link">View details</a>
        </div>
      </article>
    `;
  });
}

displayCars(cars);

const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const priceFilter = document.getElementById("price-filter");
const noResults = document.getElementById("no-results");

function filterCars() {
  const searchText = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const maxPrice = priceFilter.value;

  const result = cars.filter(function (car) {
    const matchesName = car.name.toLowerCase().includes(searchText);
    const matchesCategory = category === "all" || car.category === category;
    const matchesPrice = maxPrice === "all" || car.price <= Number(maxPrice);

    return matchesName && matchesCategory && matchesPrice;
  });

  displayCars(result);
  noResults.hidden = result.length > 0;
}

searchInput.addEventListener("input", filterCars);
categoryFilter.addEventListener("change", filterCars);
priceFilter.addEventListener("change", filterCars);

const carSelect = document.getElementById("car");

cars.forEach(function (car) {
  if (car.available) {
    carSelect.innerHTML += `<option value="${car.id}">${car.name} - $${car.price}/day</option>`;
  }
});
const preselectedCar = new URLSearchParams(window.location.search).get("car");
if (preselectedCar) {
  carSelect.value = preselectedCar;
}

const pickupInput = document.getElementById("pickup");
const returnInput = document.getElementById("return");

const today = new Date().toISOString().split("T")[0];
pickupInput.min = today;
returnInput.min = today;

const bookingForm = document.getElementById("booking-form");
const successMessage = document.getElementById("booking-success");

function showError(id, message) {
  document.getElementById(id + "-error").textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(function (el) {
    el.textContent = "";
  });
}

bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();
  successMessage.hidden = true;

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const carId = carSelect.value;
  const pickup = pickupInput.value;
  const returnDate = returnInput.value;

  let isValid = true;

  if (name.length < 3) {
    showError("name", "Please enter your full name (at least 3 letters).");
    isValid = false;
  }

  if (!/^[0-9+\s-]{10,15}$/.test(phone)) {
    showError("phone", "Enter a valid phone number (10 to 15 digits).");
    isValid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("email", "Enter a valid email address.");
    isValid = false;
  }

  if (carId === "") {
    showError("car", "Please choose a car.");
    isValid = false;
  }

  if (pickup === "") {
    showError("pickup", "Choose a pick-up date.");
    isValid = false;
  } else if (pickup < today) {
    showError("pickup", "Pick-up date cannot be in the past.");
    isValid = false;
  }

  if (returnDate === "") {
    showError("return", "Choose a return date.");
    isValid = false;
  } else if (pickup !== "" && returnDate <= pickup) {
    showError("return", "Return date must be after the pick-up date.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const car = cars.find(function (c) {
    return c.id === Number(carId);
  });
  const days = Math.round((new Date(returnDate) - new Date(pickup)) / (1000 * 60 * 60 * 24));
  const total = days * car.price;

  saveBooking({
  carName: car.name,
  name: name,
  pickup: pickup,
  returnDate: returnDate,
  days: days,
  total: total
});
displayHistory();

  successMessage.textContent =
    "Thank you, " + name + "! Your request for the " + car.name + " (" + days +
    " day" + (days > 1 ? "s" : "") + ") was received. Estimated total: $" + total + ".";
  successMessage.hidden = false;
  bookingForm.reset();
});

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("open");
});

navMenu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navMenu.classList.remove("open");
  });
});

function getBookings() {
  return JSON.parse(localStorage.getItem("bookings")) || [];
}

function saveBooking(booking) {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

const historyList = document.getElementById("history-list");
const clearButton = document.getElementById("clear-history");

function displayHistory() {
  const bookings = getBookings();

  if (bookings.length === 0) {
    historyList.innerHTML = "<p>No bookings yet. Book a car above to see it here.</p>";
    clearButton.hidden = true;
    return;
  }

  historyList.innerHTML = "";
  bookings.forEach(function (b) {
    historyList.innerHTML += `
      <div class="history-item">
        <h3>${b.carName}</h3>
        <p>${b.pickup} to ${b.returnDate} (${b.days} day${b.days > 1 ? "s" : ""})</p>
        <p>Booked by ${b.name}. Total: $${b.total}</p>
      </div>
    `;
  });
  clearButton.hidden = false;
}

clearButton.addEventListener("click", function () {
  localStorage.removeItem("bookings");
  displayHistory();
});

displayHistory();

const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "Light mode";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "Dark mode";
  }
}

applyTheme(localStorage.getItem("theme"));

themeToggle.addEventListener("click", function () {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
});

const authLink = document.getElementById("auth-link");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {
  authLink.textContent = "Logout (" + currentUser.name.split(" ")[0] + ")";
  authLink.href = "#";
  authLink.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("currentUser");
    window.location.reload();
  });
}