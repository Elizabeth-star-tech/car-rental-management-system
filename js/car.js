const params = new URLSearchParams(window.location.search);
const carId = Number(params.get("id"));
const car = cars.find(function (c) {
  return c.id === carId;
});
const detailsBox = document.getElementById("car-details");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

if (!car) {
  detailsBox.innerHTML = `
    <h2>Car not found</h2>
    <p>We could not find that car. It may have been removed.</p>
    <a href="index.html#cars" class="btn">Back to all cars</a>
  `;
} else {
  document.title = car.name + " | DriveEasy";

  const bookButton = car.available
    ? `<a href="index.html?car=${car.id}#booking" class="btn">Book this car</a>`
    : `<span class="btn btn-disabled">Currently booked</span>`;

  const featureItems = car.features
    .map(function (f) {
      return "<li>" + f + "</li>";
    })
    .join("");

  detailsBox.innerHTML = `
    <div class="details-layout">
      <img src="${car.image}" alt="${car.name}" class="details-image">

      <div class="details-text">
        <h1>${car.name}</h1>
        <p class="category">${car.category} - ${car.year}</p>
        <p class="price">$${car.price} <span>per day</span></p>
        <p>${car.description}</p>

        <table class="specs">
          <tr><th>Fuel</th><td>${car.fuel}</td></tr>
          <tr><th>Seats</th><td>${car.seats}</td></tr>
          <tr><th>Transmission</th><td>${car.transmission}</td></tr>
          <tr><th>Status</th><td>${car.available ? "Available" : "Booked"}</td></tr>
        </table>

        <h3>Features</h3>
        <ul class="feature-list">${featureItems}</ul>

        ${bookButton}
      </div>
    </div>
  `;
}