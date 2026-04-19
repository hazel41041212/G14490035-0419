/**
 * 購物車：本機 cart、購物金／綠點折抵、結帳
 */
(function () {
    let t = null;

    function render() {
        const cart = GreenMartLocal.getCart();
        const emptyEl = document.getElementById('cart-empty');
        const panel = document.getElementById('cart-panel');
        const tbody = document.getElementById('cart-tbody');

        if (!cart.length) {
            emptyEl.textContent = t.cart.empty;
            emptyEl.classList.remove('d-none');
            panel.classList.add('d-none');
            return;
        }
        emptyEl.classList.add('d-none');
        panel.classList.remove('d-none');

        tbody.innerHTML = '';
        let subtotal = 0;
        cart.forEach(function (it) {
            const line = (it.price || 0) * (it.qty || 1);
            subtotal += line;
            const tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' +
                (it.name || '') +
                '</td><td>NT$ ' +
                it.price +
                '</td><td><input type="number" class="form-control form-control-sm cart-qty" min="1" data-id="' +
                it.id +
                '" value="' +
                (it.qty || 1) +
                '" style="max-width:5rem"></td><td>NT$ ' +
                line +
                '</td><td><button type="button" class="btn btn-sm btn-outline-danger cart-remove" data-id="' +
                it.id +
                '">' +
                t.cart.remove +
                '</button></td>';
            tbody.appendChild(tr);
        });
        subtotal = Math.round(subtotal * 100) / 100;
        document.getElementById('cart-subtotal').textContent = 'NT$ ' + subtotal;

        document.getElementById('val-avail-credit').textContent =
            'NT$ ' + GreenMartLocal.getShoppingCredit();
        document.getElementById('val-avail-points').textContent = String(GreenMartLocal.getPoints());

        document.querySelectorAll('.cart-qty').forEach(function (inp) {
            inp.addEventListener('change', function () {
                const id = this.getAttribute('data-id');
                const q = Math.max(1, parseInt(this.value, 10) || 1);
                const items = GreenMartLocal.getCart();
                const ix = items.findIndex(function (x) {
                    return x.id === id;
                });
                if (ix >= 0) {
                    items[ix].qty = q;
                    GreenMartLocal.saveCart(items);
                    render();
                }
            });
        });
        document.querySelectorAll('.cart-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                GreenMartLocal.saveCart(
                    GreenMartLocal.getCart().filter(function (x) {
                        return x.id !== id;
                    })
                );
                render();
            });
        });
    }

    (async function () {
        const lang = GreenMart.getLang();
        t = await GreenMart.loadTranslations(lang);
        GreenMart.applyNavLabels(t);
        GreenMart.wireNavLang();
        GreenMart.setActiveNav();
        GreenMart.attachAuthNav(t);
        document.title = t.cart.title;
        document.getElementById('page-title').textContent = t.cart.heading;
        document.getElementById('page-lead').textContent = t.cart.lead;

        document.getElementById('th-product').textContent = t.cart.colProduct;
        document.getElementById('th-price').textContent = t.cart.colPrice;
        document.getElementById('th-qty').textContent = t.cart.colQty;
        document.getElementById('th-sub').textContent = t.cart.colSub;
        document.getElementById('lbl-avail-credit').textContent = t.cart.availCredit;
        document.getElementById('lbl-use-credit').textContent = t.cart.useCredit;
        document.getElementById('lbl-avail-points').textContent = t.cart.availPoints;
        document.getElementById('lbl-use-points').textContent = t.cart.usePoints;
        document.getElementById('hint-points').textContent = t.cart.pointsHelp;
        document.getElementById('lbl-subtotal').textContent = t.cart.subtotal;
        document.getElementById('btn-checkout').textContent = t.cart.checkout;

        document.getElementById('btn-checkout').addEventListener('click', function () {
            const useCredit = parseFloat(document.getElementById('input-use-credit').value) || 0;
            const usePoints = parseInt(document.getElementById('input-use-points').value, 10) || 0;
            const r = GreenMartLocal.checkoutCart({ useCredit: useCredit, usePoints: usePoints });
            if (!r.ok) {
                GreenMart.showToast(r.msg || 'Error', 'danger');
                return;
            }
            GreenMart.showToast(t.cart.toastOk, 'success');
            document.getElementById('input-use-credit').value = '0';
            document.getElementById('input-use-points').value = '0';
            render();
        });

        render();
    })();
})();
