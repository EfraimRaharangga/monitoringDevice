$(document).ready(function () {
  $("#data-table,#tampilanDetails, .gauge, h2").hide();
  $("#nextButton button").click(function (e) {
    e.preventDefault();
    $("#tampilanAwal").fadeOut(500);
    $("#data-table, h2").fadeIn(2000);
  });

  $("#buttonKembali").click(function (e) {
    e.preventDefault();
    $("#tampilanDetails").fadeOut(500);
    $("#tabelMonitoring").fadeIn(2000);
  });

  // muat seluruh variabel
  var gaugeChart;
  var gaugeData;
  var gaugeOptions;
  var gaugeFormatter;

  var ramLineChart;
  var ramLineData; // DataTable khusus untuk line chart RAM
  var ramLineOptions;

  var ramLineChart2;
  var ramLineData2; // DataTable khusus untuk line chart RAM
  var ramLineOptions2;

  var currentIpCom = null;
  var maxDataPoints = 30;

  // Array global untuk menyimpan objek Date dari setiap data point
  var timestampsForTicks = [];

  google.charts.load("current", { packages: ["gauge", "corechart"] });
  google.charts.setOnLoadCallback(initializeCharts);

  function initializeCharts() {
    // Gauge Charts
    gaugeData = google.visualization.arrayToDataTable([
      ["Label", "Value"],
      ["Memory", 0],
      ["CPU", 0],
    ]);

    gaugeFormatter = new google.visualization.NumberFormat({
      suffix: "%", // Menambahkan simbol '%' setelah angka
      fractionDigits: 0, // Menentukan jumlah digit desimal (0 berarti tidak ada desimal)
    });
    gaugeFormatter.format(gaugeData, 1);

    gaugeOptions = {
      width: 350,
      redFrom: 90,
      redTo: 100,
      yellowFrom: 75,
      yellowTo: 90,
      minorTicks: 5,
    };

    gaugeChart = new google.visualization.Gauge(
      document.getElementById("chart_div")
    );

    gaugeChart.draw(gaugeData, gaugeOptions);

    // line chart
    ramLineData = new google.visualization.DataTable();
    ramLineData.addColumn("datetime", "Time"); // Kolom pertama untuk waktu
    ramLineData.addColumn("number", "RAM Usage"); // Kolom kedua hanya untuk penggunaan RAM

    ramLineOptions = {
      title: "RAM Usage Trend",
      curveType: "function",
      legend: { position: "bottom" },
      hAxis: {
        title: "Time",
        format: "mm:ss",
        gridlines: {
          count: 0,
        },
        ticks: [],
        textStyle: {
          fontSize: 10, // Sesuaikan ukuran font label sumbu X agar tidak tumpang tindih
        },
      },
      vAxis: {
        title: "RAM Usage", // Judul sumbu Y
        minValue: 0,
        maxValue: 100,
      },
      animation: {
        duration: 500,
        easing: "linear",
      },
      chartArea: { left: 50, top: 30, right: 20, bottom: 60 },
      pointSize: 5,
      colors: ["#FFA500"],
    };

    ramLineChart = new google.visualization.LineChart(
      document.getElementById("ram_line_chart_div") // ID baru untuk chart
    );

    ramLineChart.draw(ramLineData, ramLineOptions); // Gambar chart kosong di awal

    // line chart 2
    ramLineData2 = new google.visualization.DataTable();
    ramLineData2.addColumn("datetime", "Time"); // Kolom pertama untuk waktu
    ramLineData2.addColumn("number", "CPU Usage"); // Kolom kedua hanya untuk penggunaan RAM

    ramLineOptions2 = {
      title: "CPU Usage",
      curveType: "function",
      legend: { position: "bottom" },
      hAxis: {
        title: "Time",
        format: "mm:ss",
        gridlines: {
          count: 0,
        },
        ticks: [],
        textStyle: {
          fontSize: 10, // Sesuaikan ukuran font label sumbu X agar tidak tumpang tindih
        },
      },
      vAxis: {
        title: "CPU Usage", // Judul sumbu Y
        minValue: 0,
        maxValue: 100,
      },
      animation: {
        duration: 500,
        easing: "linear",
      },
      chartArea: { left: 50, top: 30, right: 20, bottom: 60 },
      pointSize: 5,
    };

    ramLineChart2 = new google.visualization.LineChart(
      document.getElementById("ram_line_chart_div2") // ID baru untuk chart
    );

    ramLineChart2.draw(ramLineData2, ramLineOptions2); // Gambar chart kosong di awal
  }

  window.detail = function (ipCom) {
    // Sembunyikan tabel dan tampilkan detail
    $("#tabelMonitoring").fadeOut(500);
    $("#tampilanDetails").fadeIn(2000);

    // Simpan IP komputer yang sedang aktif
    currentIpCom = ipCom;

    // Bersihkan data line chart sebelumnya saat IP baru dipilih
    timestampsForTicks = [];
    ramLineData.removeRows(0, ramLineData.getNumberOfRows());
    ramLineChart.draw(ramLineData, ramLineOptions); // Gambar ulang chart garis kosong

    ramLineData2.removeRows(0, ramLineData2.getNumberOfRows());
    ramLineChart2.draw(ramLineData2, ramLineOptions2); // Gambar ulang chart garis kosong

    $("#tampilanDetails h2").text(`Detail pada IP ${currentIpCom}`);
    $("dd.ipAddress").text(currentIpCom);

    // Panggil fungsi untuk mengambil dan memperbarui data chart
    fetchAndDisplayChartData(currentIpCom);

    // Atur interval jika belum diatur atau jika ipCom berubah
    if (window.detailChartInterval) {
      clearInterval(window.detailChartInterval);
    }
    // Set interval untuk memperbarui data chart setiap 3 detik
    window.detailChartInterval = setInterval(function () {
      if (currentIpCom) {
        // Pastikan ada ipCom yang dipilih
        fetchAndDisplayChartData(currentIpCom);
      }
    }, 3000); // Update setiap 3 detik
  };

  function fetchAndDisplayChartData(ipCom) {
    $.ajax({
      type: "GET",
      url: "/api/clients", // Pastikan URL API Anda benar
      dataType: "json",
      success: function (response) {
        // Periksa apakah 'chart', 'data', dan 'formatter' sudah terinisialisasi
        if (
          !gaugeChart ||
          !gaugeData ||
          !gaugeFormatter ||
          !ramLineChart ||
          !ramLineData ||
          !ramLineOptions
        ) {
          console.warn(
            "Chart, data, or formatter not initialized yet. Skipping update."
          );
          return;
        }

        // Periksa apakah data untuk ipCom yang diminta tersedia
        if (!response[ipCom]) {
          console.error(`Data for ${ipCom} not found in API response.`);
          return;
        }

        let cpu = response[ipCom]["cpu_percent"];
        let ram = response[ipCom]["ram_percent"];
        let timeStampResponse = response[ipCom]["timestamp"];
        let timeStamp = new Date(timeStampResponse.replace(" ", "T"));

        // perbarui data list
        $("dd.cpuUsage").text(`${cpu}%`);
        $("dd.ramUsage").text(`${ram}%`);
        $("dd.timeStamp").text(timeStamp);

        // Perbarui data di Gauge
        gaugeData.setValue(0, 1, cpu); // Update Memory (baris 0, kolom 1)
        gaugeData.setValue(1, 1, ram); // Update CPU (baris 1, kolom 1)
        gaugeFormatter.format(gaugeData, 1);
        gaugeChart.draw(gaugeData, gaugeOptions);
        // console.log(`Chart updated for ${ipCom}: CPU ${cpu}%, RAM ${ram}%`);

        // perbaharui data line chart
        ramLineData.addRow([timeStamp, ram]);
        ramLineData2.addRow([timeStamp, cpu]);

        // Tambahkan timestamp ke array untuk ticks
        timestampsForTicks.push(timeStamp);

        // if (ramLineData.getNumberOfRows() > maxDataPoints) {
        //   ramLineData.removeRow(0);
        // }

        // if (ramLineData2.getNumberOfRows() > maxDataPoints) {
        //   ramLineData2.removeRow(0);
        // }

        // Perbarui opsi ticks pada ramLineOptions
        ramLineOptions.hAxis.ticks = timestampsForTicks;
        ramLineOptions2.hAxis.ticks = timestampsForTicks;

        ramLineChart.draw(ramLineData, ramLineOptions);
        ramLineChart2.draw(ramLineData2, ramLineOptions2);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(
          "Error fetching data for chart update:",
          textStatus,
          errorThrown
        );
        // Anda bisa menampilkan pesan error di UI di sini jika diperlukan
      },
    });
  }
});
