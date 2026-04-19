(async function () {
    const lang = GreenMart.getLang();
    const t = await GreenMart.loadTranslations(lang);
    GreenMart.applyNavLabels(t);
    GreenMart.wireNavLang();
    GreenMart.setActiveNav();
    GreenMart.attachAuthNav(t);
    document.title = t.sell.title;
    document.getElementById('page-title').textContent = t.sell.heading;
    document.getElementById('page-lead').textContent = t.sell.lead;
    document.getElementById('lbl-sell-name').textContent = t.sell.nameLabel;
    document.getElementById('lbl-sell-price').textContent = t.sell.priceLabel;
    document.getElementById('lbl-sell-esg').textContent = t.sell.esgLabel;
    document.getElementById('sell-submit-btn').textContent = t.sell.submitBtn;

    document.getElementById('sell-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('sell-name').value.trim();
        const price = Number(document.getElementById('sell-price').value);
        const esg = document.getElementById('sell-esg').value.trim();
        if (!name || !Number.isFinite(price) || price < 1) return;

        GreenMartLocal.addListing({ name: name, price: price, esgNote: esg });
        const pts = GreenMartLocal.earnSellPoints(price);
        GreenMartLocal.appendLedger({
            type: 'sell',
            title: '上架商品',
            detail: name + ' · NT$ ' + price + (esg ? ' · ' + esg : ''),
            pointsDelta: pts,
            creditDelta: 0,
        });
        GreenMart.showToast(t.sell.toastOk + ' (+' + pts + ')', 'success');
        this.reset();
    });
})();
