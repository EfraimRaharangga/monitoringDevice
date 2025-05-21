// auto_update.js
function fetchData() {
  fetch("/api/clients")
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.querySelector("#data-table tbody");
      tbody.innerHTML = "";

      for (const [ip, info] of Object.entries(data)) {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${ip}</td>
                    <td>${info.cpu_percent}</td>
                    <td>${info.ram_percent}</td>
                    <td>${info.timestamp}</td>
                `;
        tbody.appendChild(row);
      }
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
    });
}

setInterval(fetchData, 3000); // update tiap 3 detik
window.onload = fetchData;
