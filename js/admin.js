if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

const statsBox = document.getElementById("stats");
const carsBody = document.getElementById("cars-table-body");
const bookingsBody = document.getElementById("bookings-table-body");
const bookingsWrap = document.getElementById("bookings-wrap");
const noBookings = document.getElementById("no-bookings");

function getBookings() {
  return JSON.parse(localStorage.getItem("bookings")) || [];
}

function displayStats() {
  const bookings = getBookings();

  const availableCars = cars.filter(function (car) {
    return car.available;
  }).length;

  const revenue = bookings.reduce(function (sum, b) {
    return sum + b.total;
  }, 0);

  statsBox.innerHTML = `
    <div class="stat-card">
      <p class="stat-number">${cars.length}</p>
      <p>Total cars</p>
    </div>
    <div class="stat-card">
      <p class="stat-number">${availableCars}</p>
      <p>Available now</p>
    </div>
    <div class="stat-card">
      <p class="stat-number">${bookings.length}</p>
      <p>Bookings made</p>
    </div>
    <div class="stat-card">
      <p class="stat-number">$${revenue}</p>
      <p>Total revenue</p>
    </div>
  `;
}

function displayCars() {
  carsBody.innerHTML = "";

  cars.forEach(function (car) {
    const status = car.available ? "Available" : "Booked";
    const statusClass = car.available ? "available" : "booked";

    carsBody.innerHTML += `
      <tr>
        <td class="car-cell">
          <img src="${car.image}" alt="${car.name}" class="thumb">
          <span>${car.name}</span>
        </td>
        <td>${car.category}</td>
        <td>$${car.price}</td>
        <td>${car.seats}</td>
        <td><span class="status ${statusClass}">${status}</span></td>
      </tr>
    `;
  });
}

function displayBookings() {
  const bookings = getBookings();
  bookingsBody.innerHTML = "";

  if (bookings.length === 0) {
    noBookings.hidden = false;
    bookingsWrap.hidden = true;
    return;
  }

  noBookings.hidden = true;
  bookingsWrap.hidden = false;

  bookings.forEach(function (b, index) {
    bookingsBody.innerHTML += `
      <tr>
        <td>${b.name}</td>
        <td>${b.carName}</td>
        <td>${b.pickup}</td>
        <td>${b.returnDate}</td>
        <td>${b.days}</td>
        <td>$${b.total}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      </tr>
    `;
  });
}

bookingsBody.addEventListener("click", function (event) {
  if (!event.target.classList.contains("delete-btn")) {
    return;
  }

  const index = Number(event.target.dataset.index);
  const bookings = getBookings();
  bookings.splice(index, 1);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  displayStats();
  displayBookings();
});

displayStats();
displayCars();
displayBookings();