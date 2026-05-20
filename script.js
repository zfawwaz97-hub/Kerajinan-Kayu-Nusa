// Katalog -> Keranjang sederhana
const tombolTambah = document.querySelectorAll('.btn-tambah');
const cartButton = document.getElementById('cart-button');
const cartCountEl = document.getElementById('cart-count');
const cartPanel = document.getElementById('cart-panel');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeCartBtn = document.getElementById('close-cart');

let cart = [];

function formatRupiah(number) {
    return 'Rp ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function updateCartCount() {
    const count = cart.reduce((s, it) => s + it.qty, 0);
    cartCountEl.textContent = count;
}

function renderCart() {
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<li class="cart-empty">Keranjang kosong</li>';
        cartTotalEl.textContent = formatRupiah(0);
        return;
    }

    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price * item.qty;
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <div class="cart-item-left">
                <strong>${item.name}</strong>
                <div class="cart-item-meta">${formatRupiah(item.price)} x ${item.qty}</div>
            </div>
            <div class="cart-item-right">
                <button class="btn-remove" data-idx="${idx}">Hapus</button>
            </div>
        `;
        cartItemsEl.appendChild(li);
    });

    cartTotalEl.textContent = formatRupiah(total);
}

function addToCart(name, price) {
    const existing = cart.find((i) => i.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartCount();
    renderCart();
}

// event listeners: tombol tambah pada tiap baris
tombolTambah.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const tr = e.target.closest('tr');
        const name = tr.dataset.name || tr.querySelector('td').textContent.trim();
        const price = parseInt(tr.dataset.price || '0', 10);
        addToCart(name, price);
        // umpan balik singkat
        btn.textContent = '✅ ditambahkan';
        setTimeout(() => (btn.textContent = '+ Tambah'), 1200);
    });
});

// show/hide cart
cartButton.addEventListener('click', () => {
    cartPanel.classList.toggle('open');
    cartPanel.setAttribute('aria-hidden', cartPanel.classList.contains('open') ? 'false' : 'true');
});
closeCartBtn.addEventListener('click', () => {
    cartPanel.classList.remove('open');
    cartPanel.setAttribute('aria-hidden', 'true');
});

// remove item (delegation)
cartItemsEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remove')) {
        const idx = parseInt(e.target.dataset.idx, 10);
        if (!isNaN(idx)) {
            cart.splice(idx, 1);
            updateCartCount();
            renderCart();
        }
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang kosong. Tambahkan produk terlebih dahulu.');
        return;
    }
    // simple checkout flow — hanya konfirmasi dan kosongkan keranjang
    const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
    alert(`Terima kasih! Total pesanan ${formatRupiah(total)}. Kami akan menghubungi Anda untuk detail pembayaran.`);
    cart = [];
    updateCartCount();
    renderCart();
    cartPanel.classList.remove('open');
});

// fitur kirim pesan sukses (tetap ada)
const formKontak = document.getElementById('form-kontak');
const pesanSukses = document.getElementById('pesan-sukses');

formKontak.addEventListener('submit', function (event) {
    event.preventDefault();
    pesanSukses.style.display = 'block';
    formKontak.reset();
    setTimeout(function() {
            pesanSukses.style.display = 'none';
    }, 2000);
});

// render awal
updateCartCount();
renderCart();