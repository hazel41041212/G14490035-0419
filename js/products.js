/**
 * 商品介紹：多語、加入購物車（本機）
 */
(async function () {
    const lang = GreenMart.getLang();
    const t = await GreenMart.loadTranslations(lang);
    GreenMart.applyNavLabels(t);
    GreenMart.wireNavLang();
    GreenMart.setActiveNav();
    GreenMart.attachAuthNav(t);
    document.title = t.products.title;

    const h = document.getElementById('products-heading');
    const lead = document.getElementById('products-lead');
    if (h) h.textContent = t.products.heading;
    if (lead) lead.textContent = t.products.lead;

    document.querySelectorAll('.btn-add-cart').forEach(function (btn) {
        btn.textContent = t.products.addCart;
        btn.addEventListener('click', function () {
            GreenMartLocal.addToCart({
                id: this.getAttribute('data-product-id'),
                name: this.getAttribute('data-product-name'),
                price: Number(this.getAttribute('data-product-price')),
                qty: 1,
            });
            GreenMart.showToast(t.products.toastAdded, 'success');
        });
    });
})();
