// calendar.js

let holidaysByYear = {};

function closeModal() {
  document.getElementById("holidayModal").style.display = "none";
}

function showPopup(dateStr, holiday) {
  const modal = document.getElementById("holidayModal");
  const content = document.getElementById("holidayContent");
  content.innerHTML = `<strong>${holiday.name}</strong><br>${dateStr}`;
  modal.style.display = "flex";
}

function generateCalendar(year, holidays) {
  const calendar = document.querySelector(".calendar");
  calendar.innerHTML = "";
  const monthNames = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
  const daysShort = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  for (let month = 0; month < 12; month++) {
    const firstDay = new Date(year, month, 1);
    const totalDays = new Date(year, month + 1, 0).getDate();
    const startWeekDay = (firstDay.getDay() + 6) % 7;
    const container = document.createElement("div");
    container.className = "month";
    container.innerHTML = `<h2>${monthNames[month]}</h2>`;

    const daysHeader = document.createElement("div");
    daysHeader.className = "days day-names";
    daysShort.forEach(d => daysHeader.innerHTML += `<span>${d}</span>`);
    container.appendChild(daysHeader);

    const dates = document.createElement("div");
    dates.className = "dates";
    for (let i = 0; i < startWeekDay; i++) dates.innerHTML += `<span></span>`;

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const holiday = holidays[dateStr];
      const span = document.createElement("span");
      span.textContent = d;
      if (holiday) span.className = `holiday ${holiday.type}`;
      if (dateStr === todayStr && year === today.getFullYear()) span.classList.add("today");
      span.onclick = () => { if (holiday) showPopup(dateStr, holiday); };
      dates.appendChild(span);
    }

    container.appendChild(dates);
    calendar.appendChild(container);
  }

  document.getElementById("year-title").textContent = `Calendario ${year}`;
  document.getElementById("calendar-link").textContent = `Ver calendario ${year} con festivos y fechas especiales en Chile.`;
}

window.onload = () => {
  const year = typeof currentYear !== "undefined" ? currentYear : new Date().getFullYear();
  fetch("https://yourusername.github.io/calendar/assets/data/holidays.json")
    .then(res => res.json())
    .then(data => {
      holidaysByYear = data;
      const holidays = holidaysByYear[year] || {};
      generateCalendar(year, holidays);
    });
};
