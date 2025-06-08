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

        // Periksa apakah data kosong atau tidak ada
        if (Object.keys(data).length === 0) {
          // Jika data kosong, tampilkan pesan "Data belum ada"
          const $noDataRow = $("<tr>");
          $noDataRow.html(`
            <td colspan="4" class="px-3 py-2 text-center text-gray-500">Data belum ada</td>
          `);
          $tbody.append($noDataRow);
        } else {
          // Jika ada data, iterasi dan tampilkan tabel
          $.each(data, function (ip, info) {
            // Tampil Tabel
            const $row = $("<tr>");

            $row.addClass("text-gray-900 first:font-medium"); // Kelas dipisahkan spasi

            // Isi baris dengan HTML. Gunakan .html() atau .append()
            $row.html(`
              <td class="px-3 py-2 whitespace-nowrap">${ip}</td>
              <td class="px-3 py-2 whitespace-nowrap">${info.cpu_percent}</td>
              <td class="px-3 py-2 whitespace-nowrap">${info.ram_percent}</td>
              <td class="px-3 py-2 whitespace-nowrap">${info.timestamp}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sky-600 cursor-pointer italic" onclick="detail('${ip}')">Details</td>
            `);

            // Tambahkan baris ke tbody
            $tbody.append($row);
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching data:", textStatus, errorThrown);
        // Anda juga bisa menambahkan pesan error ke dalam tabel jika diperlukan
        const $tbody = $("#data-table tbody");
        $tbody.empty();
        const $errorRow = $("<tr>");
        $errorRow.html(`
          <td colspan="4" class="px-3 py-2 text-center text-red-500">Gagal memuat data. Silakan coba lagi.</td>
        `);
        $tbody.append($errorRow);
      },
    });
  }

  // Panggil fetchData pertama kali saat halaman dimuat
  fetchData();

  // Set interval untuk memanggil fetchData setiap 3 detik
  setInterval(fetchData, 3000);
});

function changeIP(ipAddress, newSeparator) {
  // 1. Validasi input: pastikan ipAddress adalah string dan newSeparator adalah string tunggal
  if (
    typeof ipAddress !== "string" ||
    typeof newSeparator !== "string" ||
    newSeparator.length !== 1
  ) {
    console.error(
      "Input tidak valid. Parameter pertama harus string IP, parameter kedua harus karakter separator tunggal."
    );
    return null; // Atau throw new Error('Invalid input');
  }

  // 2. Tentukan separator yang sedang digunakan di IP address
  // Kita asumsikan separator saat ini adalah '.' atau '-'
  let currentSeparator = "";
  if (ipAddress.includes(".")) {
    currentSeparator = ".";
  } else if (ipAddress.includes("-")) {
    currentSeparator = "-";
  } else {
    // Jika tidak ada separator yang dikenali, kembalikan IP asli atau tangani sesuai kebutuhan
    console.warn(
      "Separator saat ini tidak dikenali (bukan '.' atau '-'). Mengembalikan IP asli."
    );
    return ipAddress;
  }

  // 3. Pisahkan string IP address berdasarkan separator saat ini
  const parts = ipAddress.split(currentSeparator);

  // 4. Gabungkan kembali bagian-bagian IP dengan separator baru
  return parts.join(newSeparator);
}
