const dataBarang = [
	{ id: 1, nama: 'Laptop Lenovo', harga: 15000000, stok: 5 },
	{ id: 2, nama: 'Mouse Logitech', harga: 300000, stok: 10 },
	{ id: 3, nama: 'Keyboard Mechanical', harga: 750000, stok: 3 },
	{ id: 4, nama: 'Monitor Dell', harga: 2500000, stok: 2 },
	{ id: 5, nama: 'Headset HyperX', harga: 1200000, stok: 0 },
	{ id: 6, nama: 'Flashdisk 64GB', harga: 150000, stok: 15 },
];

const tempatProduk = document.getElementById('wadah-produk');

dataBarang.forEach((barang) => {
	const divKartu = document.createElement('div');
	divKartu.className = 'kartu-barang';
	divKartu.dataset.nama = barang.nama.toLowerCase();

	const judulHtml = document.createElement('h3');
	judulHtml.appendChild(document.createTextNode(barang.nama));

	const hargaHtml = document.createElement('p');
	hargaHtml.appendChild(document.createTextNode('Rp ' + barang.harga));

	const stokHtml = document.createElement('p');
	stokHtml.id = 'sisa-stok-' + barang.id;
	stokHtml.appendChild(document.createTextNode('Stok: ' + barang.stok));

	const tombolTambah = document.createElement('button');
	tombolTambah.className = 'tombol-masuk-keranjang';
	tombolTambah.dataset.id = barang.id;
	tombolTambah.appendChild(document.createTextNode('Tambah ke Keranjang'));

	divKartu.appendChild(judulHtml);
	divKartu.appendChild(hargaHtml);
	divKartu.appendChild(stokHtml);
	divKartu.appendChild(tombolTambah);

	tempatProduk.appendChild(divKartu);
});

$(document).ready(function () {
	let keranjangSaya = [];
	let uangTotal = 0;

	function updateTulisanKeranjang() {
		$('#jumlah-di-keranjang').text(keranjangSaya.length);
		$('#tulisan-total').text('Rp ' + uangTotal);
	}

	$('#cari-barang').on('input', function () {
		let kataKunci = $(this).val().toLowerCase();
		$('.kartu-barang').each(function () {
			let namaBarangDicari = $(this).data('nama');
			$(this).toggle(namaBarangDicari.indexOf(kataKunci) > -1);
		});
	});

	$('#tombol-keranjang').click(function () {
		$('#kotak-keranjang').fadeToggle();
	});

	$(document).on('click', '.tombol-masuk-keranjang', function () {
		let idBarangMilikKita = $(this).data('id');
		let barangDipilih = dataBarang.find((b) => b.id == idBarangMilikKita);

		if (barangDipilih.stok <= 0) {
			alert('Maaf, stok ' + barangDipilih.nama + ' habis!');
			return;
		}

		barangDipilih.stok--;
		$('#sisa-stok-' + idBarangMilikKita).text('Stok: ' + barangDipilih.stok);

		keranjangSaya.push({ ...barangDipilih, idUnik: Date.now() });
		uangTotal += barangDipilih.harga;

		let barisBelanja = $('<li></li>')
			.text(barangDipilih.nama + ' - Rp ' + barangDipilih.harga)
			.hide();

		let tombolHapusItem = $('<button class="tombol-hapus">Hapus</button>')
			.data('id', barangDipilih.id)
			.data('idunik', keranjangSaya[keranjangSaya.length - 1].idUnik);

		barisBelanja.append(tombolHapusItem);

		$('#daftar-belanjaan').append(barisBelanja);
		barisBelanja.fadeIn();
		updateTulisanKeranjang();
	});

	$(document).on('click', '.tombol-hapus', function () {
		if (confirm('Hapus item ini dari keranjang?')) {
			let idProdukAsli = $(this).data('id');
			let idKeranjangUnik = $(this).data('idunik');
			let dataProduk = dataBarang.find((b) => b.id == idProdukAsli);
			let barisanList = $(this).parent();

			dataProduk.stok++;
			$('#sisa-stok-' + idProdukAsli).text('Stok: ' + dataProduk.stok);

			let posisiDiArray = keranjangSaya.findIndex((k) => k.idUnik == idKeranjangUnik);
			if (posisiDiArray > -1) {
				keranjangSaya.splice(posisiDiArray, 1);
				uangTotal -= dataProduk.harga;
			}

			barisanList.fadeOut(function () {
				$(this).remove();
				updateTulisanKeranjang();
			});
		}
	});

	$('#tombol-kosongkan').click(function () {
		if (keranjangSaya.length === 0) return;

		if (confirm('Kosongkan semua isi keranjang?')) {
			keranjangSaya.forEach((itemBelanjaan) => {
				let p = dataBarang.find((prod) => prod.id == itemBelanjaan.id);
				p.stok++;
				$('#sisa-stok-' + p.id).text('Stok: ' + p.stok);
			});

			keranjangSaya = [];
			uangTotal = 0;

			$('#daftar-belanjaan').empty();
			updateTulisanKeranjang();
		}
	});

	$('#tombol-bayar').click(function () {
		if (keranjangSaya.length === 0) {
			alert('Keranjang kosong!');
			return;
		}

		let namaOrang = prompt('Masukkan nama pembeli:');

		if (namaOrang) {
			$('#bagian-atas, #wadah-produk').hide();
			$('#kotak-keranjang').fadeOut();

			let teksHtmlRingkasan = '<h2>Ringkasan Pesanan</h2>';
			teksHtmlRingkasan += '<p>Nama: ' + namaOrang + '</p>';
			teksHtmlRingkasan += '<p>Item:</p><ul>';

			keranjangSaya.forEach((itemBelanjaan) => {
				teksHtmlRingkasan += '<li>' + itemBelanjaan.nama + ' - Rp ' + itemBelanjaan.harga + '</li>';
			});

			teksHtmlRingkasan += '</ul>';
			teksHtmlRingkasan += '<h3>Total: Rp ' + uangTotal + '</h3>';
			teksHtmlRingkasan += "<button onclick='location.reload()'>Kembali</button>";

			$('#kotak-ringkasan').html(teksHtmlRingkasan).fadeIn();
		}
	});
});
