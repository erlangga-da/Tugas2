var upbjjList = ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"];
var pengirimanList = [
  { kode: "JNE-REG", nama: "JNE Regular" },
  { kode: "JNE-EXP", nama: "JNE Express" }
];
var paketList = [
  { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 120000 },
  { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201", "FISIP4001"], harga: 140000 }
];

var app = new Vue({
  el: '#app',
  data: {
    filterReorder: false,
    selectedSort: "",
    selectedUpbjj: "",
    selectedkategori: "",
    upbjjList: upbjjList,
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    isBookPopupVisible: false,
    editingBookCode: null,
    bookForm: {
      kode: "",
      judul: "",
      kategori: "",
      upbjj: "",
      lokasiRak: "",
      harga: 0,
      qty: 0,
      safety: 0,
      catatan: ""
    },
    pengirimanList: pengirimanList,
    paket: paketList,
    stok: [
      {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        catatanHTML: "Edisi 2024, cetak ulang"
      },
      {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        catatanHTML: "Cover baru"
      },
      {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        catatanHTML: "Butuh pendingin untuk kit basah"
      },
      {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        catatanHTML: "Stok menipis, prioritaskan reorder"
      }
    ],
    // Simulasi status DO (opsional fitur Tracking DO)
    tracking: {
      "DO2025-0001": {
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "JNE",
        tanggalKirim: "2025-08-25",
        paket: "PAKET-UT-001",
        total: 120000,
        perjalanan: [
          { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
          { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
          { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
        ]
      }
    }
  },
  computed: {
    stokTampil: function () {
      var result = this.stok;

      if (this.filterReorder) {
        result = result.filter(item => item.qty === 0 || item.qty < item.safety);
      }

      if (this.selectedUpbjj) {
        result = result.filter(item => item.upbjj === this.selectedUpbjj);
      }

      if (this.selectedkategori) {
        result = result.filter(item => item.kategori === this.selectedkategori);
      }

      if (this.selectedSort === 'judul') {
        result = result.slice().sort((a, b) => a.judul.localeCompare(b.judul));
      } else if (this.selectedSort === 'qty') {
        result = result.slice().sort((a, b) => a.qty - b.qty);
      } else if (this.selectedSort === 'harga') {
        result = result.slice().sort((a, b) => a.harga - b.harga);
      }


      return result;
    }
  },
  methods: {
    showPopup: function () {
      this.editingBookCode = null;
      this.bookForm = this.emptyBookForm();
      this.isBookPopupVisible = true;
    },
    editBook: function (item) {
      this.editingBookCode = item.kode;
      this.bookForm = {
        kode: item.kode,
        judul: item.judul,
        kategori: item.kategori,
        upbjj: item.upbjj,
        lokasiRak: item.lokasiRak,
        harga: item.harga,
        qty: item.qty,
        safety: item.safety,
        catatan: item.catatanHTML
      };
      this.isBookPopupVisible = true;
    },
    closeBookPopup: function () {
      this.isBookPopupVisible = false;
      this.editingBookCode = null;
    },
    saveBook: function () {
      var book = {
        kode: this.bookForm.kode.trim(),
        judul: this.bookForm.judul.trim(),
        kategori: this.bookForm.kategori,
        upbjj: this.bookForm.upbjj,
        lokasiRak: this.bookForm.lokasiRak.trim(),
        harga: Number(this.bookForm.harga),
        qty: Number(this.bookForm.qty),
        safety: Number(this.bookForm.safety),
        catatanHTML: this.bookForm.catatan.trim()
      };
      var duplicate = this.stok.some(item =>
        item.kode === book.kode && item.kode !== this.editingBookCode
      );

      if (duplicate) {
        alert("Kode buku sudah digunakan.");
        return;
      }

      if (this.editingBookCode) {
        var index = this.stok.findIndex(item => item.kode === this.editingBookCode);
        if (index === -1) {
          alert("Data buku yang akan diedit tidak ditemukan.");
          return;
        }
        this.$set(this.stok, index, book);
      } else {
        this.stok.push(book);
      }

      this.closeBookPopup();
    },
    emptyBookForm: function () {
      return {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: 0,
        qty: 0,
        safety: 0,
        catatan: ""
      };
    },
    resetFilter: function () {
      this.filterReorder = false;
      this.selectedSort = "";
      this.selectedUpbjj = "";
      this.selectedkategori = "";
    },
    getStatusLabel: function (item) {
      if (item.qty === 0) return 'Kosong';
      if (item.qty < item.safety) return 'Menipis';
      return 'Aman';
    }
  }
});