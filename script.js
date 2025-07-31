document.addEventListener("DOMContentLoaded", function () {
  // Current year
  let currentYear = 2025;

  // Chile holidays
  const holidays = {
    "01-01": "New Year",
    "04-19": "Good Friday",
    "05-01": "Labor Day",
    "05-21": "Navy Day",
    "06-29": "Saint Peter and Saint Paul",
    "07-16": "Our Lady of Mount Carmel",
    "08-15": "Assumption of Mary",
    "09-18": "Independence Day",
    "09-19": "Army Day",
    "10-12": "Columbus Day",
    "10-31": "Reformation Day",
    "11-01": "All Saints Day",
    "12-08": "Immaculate Conception",
    "12-25": "Christmas Day",
  };

  // Month names in English
  const monthNames = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  // Day names (short) in English
  const dayNames = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

  // Week number header
  const weekHeader = "WK";

  // Initialize the calendar
  function initCalendar() {
    updateYearElements(currentYear);
    renderMonths(currentYear);
  }

  // Update all year-related elements
  function updateYearElements(year) {
    document.querySelector(".header h1 span").textContent = year;
    document.querySelector(
      ".subtitle"
    ).textContent = `Chile's ${year} calendar with holidays`;
    document.querySelector(
      ".header div:last-child"
    ).textContent = `View the ${year} calendar with holidays and special dates in Chile.`;
    document.getElementById("current-year").textContent = year;
    document.getElementById("prev-year-label").textContent = year - 1;
    document.getElementById("next-year-label").textContent = year + 1;
  }

  // Render all months for the year
  function renderMonths(year) {
    const monthsContainer = document.getElementById("months-container");
    monthsContainer.innerHTML = "";

    for (let month = 0; month < 12; month++) {
      const monthElement = createMonthElement(year, month);
      monthsContainer.appendChild(monthElement);
    }
  }

  // Create a month element
  function createMonthElement(year, month) {
    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() === month;

    const monthElement = document.createElement("div");
    monthElement.className = "month";

    const monthHeader = document.createElement("div");
    monthHeader.className = "month-header";
    monthHeader.textContent = monthNames[month];
    monthElement.appendChild(monthHeader);

    const table = document.createElement("table");

    // Create header row with day names
    const headerRow = document.createElement("tr");

    // Add week number column
    const weekNumberHeader = document.createElement("th");
    weekNumberHeader.textContent = weekHeader;
    weekNumberHeader.className = "week-number";
    headerRow.appendChild(weekNumberHeader);

    // Add day headers
    dayNames.forEach((day) => {
      const th = document.createElement("th");
      th.textContent = day;
      if (day === "SU") {
        th.classList.add("sunday");
      }
      headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Calculate starting day (0=Monday, 6=Sunday)
    let startingDay = (firstDay.getDay() + 6) % 7;
    let dayCounter = 1;
    let currentWeek = getWeekNumber(new Date(year, month, 1));

    while (dayCounter <= totalDays) {
      const row = document.createElement("tr");

      // Add week number cell
      const weekNumberCell = document.createElement("td");
      weekNumberCell.textContent = currentWeek;
      weekNumberCell.className = "week-number";
      row.appendChild(weekNumberCell);

      // Add day cells
      for (let i = 0; i < 7; i++) {
        const cell = document.createElement("td");

        if ((dayCounter === 1 && i < startingDay) || dayCounter > totalDays) {
          // Empty cell
          cell.textContent = "";
        } else {
          // Add day number
          cell.textContent = dayCounter;

          // Highlight Sundays (i === 6 because Monday=0)
          if (i === 6) {
            cell.classList.add("sunday");
          }

          // Check for holidays
          const dateStr = `${String(month + 1).padStart(2, "0")}-${String(
            dayCounter
          ).padStart(2, "0")}`;
          if (holidays[dateStr]) {
            cell.classList.add("holiday");
          }

          // Highlight current day
          if (isCurrentMonth && dayCounter === today.getDate()) {
            cell.classList.add("current-day");
          }

          dayCounter++;
        }

        row.appendChild(cell);
      }

      table.appendChild(row);
      currentWeek = getWeekNumber(new Date(year, month, dayCounter));
    }

    monthElement.appendChild(table);
    return monthElement;
  }

  // Helper function to get ISO week number
  function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
    );
  }

  // Event listeners for year navigation
  document.getElementById("prev-year").addEventListener("click", function () {
    currentYear--;
    updateYearElements(currentYear);
    renderMonths(currentYear);
  });

  document.getElementById("next-year").addEventListener("click", function () {
    currentYear++;
    updateYearElements(currentYear);
    renderMonths(currentYear);
  });

  // Initialize the calendar
  initCalendar();
});
