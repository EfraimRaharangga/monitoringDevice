// auto_update.js
// Pastikan jQuery sudah dimuat di halaman HTML sebelum file ini
$(document).ready(function () {
  // Jalankan kode setelah DOM siap

  function fetchData() {
    // Menggunakan $.ajax atau $.get untuk request AJAX
    $.ajax({
      url: "/api/clients",
      method: "GET", // Atau "GET" jika hanya mengambil data
      dataType: "json", // Memberi tahu jQuery untuk mengurai respons sebagai JSON
      success: function (data) {
        // Seleksi tbody menggunakan jQuery
        const $tbody = $("#data-table tbody");

        // Kosongkan isi tbody
        $tbody.empty(); // Mirip dengan innerHTML = ""

        // Iterasi data
        $.each(data, function (ip, info) {
          // Tampil Tabel
          const $row = $("<tr>");
          console.log(ip);

          // Tambahkan kelas Tailwind CSS.
          // Perhatikan: string kelas dipisahkan spasi untuk jQuery.
          // Jika Anda memiliki masalah dengan sintaks Tailwind `*:`, Anda mungkin perlu mengkaji ulang bagaimana kelas ini dimaksudkan untuk digunakan dalam konteks HTML atau CSS Anda.
          // Namun, sesuai yang Anda inginkan, ini adalah cara jQuery menambahkannya:
          $row.addClass("text-gray-900 first:font-medium"); // Kelas dipisahkan spasi

          // Isi baris dengan HTML. Gunakan .html() atau .append()
          $row.html(`
                        <td class="px-3 py-2 whitespace-nowrap">${ip}</td>
                        <td class="px-3 py-2 whitespace-nowrap">${info.cpu_percent}</td>
                        <td class="px-3 py-2 whitespace-nowrap">${info.ram_percent}</td>
                        <td class="px-3 py-2 whitespace-nowrap">${info.timestamp}</td>
                    `);

          // Tambahkan baris ke tbody
          $tbody.append($row);
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching data:", textStatus, errorThrown);
      },
    });
  }

  function fetchGauges() {
    $.ajax({
      type: "get",
      url: "/api/clients",
      data: "data",
      dataType: "json",
      success: function (response) {},
    });
  }

  // Panggil fetchData pertama kali saat halaman dimuat
  fetchData();

  // Set interval untuk memanggil fetchData setiap 3 detik
  setInterval(fetchData, 3000);
});
