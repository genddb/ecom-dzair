/* Premium Store Core Engine v1.0 
   Author: MESABGUE / GENDDB 
*/

// 1. نظام التبديل الليلي
window.initDarkMode = function() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;
    themeBtn.onclick = () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? "<i class='fa fa-sun'></i>" : "<i class='fa fa-moon'></i>";
        localStorage.setItem('theme', newTheme);
    };
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeBtn.innerHTML = "<i class='fa fa-sun'></i>";
    }
};

// 2. نظام حساب السعر وإرسال البيانات
window.initStoreLogic = function(scriptURL) {
    const dataBox = document.getElementById('pData');
    const basePrice = dataBox ? parseInt(dataBox.getAttribute('data-price')) : 2500;
    const discPerPiece = dataBox ? parseInt(dataBox.getAttribute('data-disc')) : 100;

    window.updateQty = function(val) {
        const input = document.getElementById('qtyInput');
        if (input) {
            let newVal = parseInt(input.value) + val;
            if (newVal >= 1 && newVal <= 10) {
                input.value = newVal;
                calculate();
            }
        }
    };

    function calculate() {
        const qtyInput = document.getElementById('qtyInput');
        if (!qtyInput) return;
        const q = parseInt(qtyInput.value);
        let discount = q > 1 ? (q - 1) * discPerPiece : 0;
        let total = (basePrice * q) - discount;
        if(document.getElementById('u_price')) document.getElementById('u_price').innerText = basePrice.toLocaleString();
        if(document.getElementById('d_amount')) document.getElementById('d_amount').innerText = discount.toLocaleString();
        if(document.getElementById('t_price')) document.getElementById('t_price').innerText = total.toLocaleString();
        if(document.getElementById('hiddenTotal')) document.getElementById('hiddenTotal').value = total + " د.ج";
        if(document.getElementById('p_name')) document.getElementById('p_name').value = document.title.split('|')[0];
    }
    calculate();

    const form = document.getElementById('orderForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            btn.innerHTML = "جاري الإرسال...";
            btn.disabled = true;
            fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                .then(res => {
                    alert('تم استلام طلبك بنجاح!');
                    form.reset();
                    btn.innerHTML = "إرسال الطلب الآن";
                    btn.disabled = false;
                    calculate();
                }).catch(err => {
                    alert('حدث خطأ، يرجى المحاولة لاحقاً.');
                    btn.disabled = false;
                    btn.innerHTML = "إرسال الطلب الآن";
                });
        });
    }
};

// 3. نظام الواتساب التلقائي
window.startWhatsApp = function(waNumber) {
    const waBtn = document.querySelector('.whatsapp-btn');
    const waLink = document.getElementById('whatsappLink');
    if (waBtn && waNumber) {
        waBtn.style.display = 'flex';
        const productName = document.title.split('|')[0].trim();
        const productURL = window.location.href;
        const message = `أهلاً، أريد طلب منتج: ${productName}%0Aالرابط: ${productURL}`;
        if(waLink) waLink.href = `https://api.whatsapp.com/send?phone=${waNumber}&text=${message}`;
    }
};

// 4. نظام العداد التنازلي
window.startTimer = function(dateStr) {
    const endTime = new Date(dateStr).getTime();
    const timerEl = document.getElementById('countdownDisplay');
    if (timerEl && !isNaN(endTime)) {
        timerEl.style.display = 'block';
        const x = setInterval(function() {
            const now = new Date().getTime();
            const distance = endTime - now;
            if (distance < 0) { clearInterval(x); timerEl.style.display = 'none'; return; }
            document.getElementById("days").innerHTML = Math.floor(distance / 864e5);
            document.getElementById("hours").innerHTML = Math.floor((distance % 864e5) / 36e5);
            document.getElementById("minutes").innerHTML = Math.floor((distance % 36e5) / 6e4);
            document.getElementById("seconds").innerHTML = Math.floor((distance % 6e4) / 1e3);
        }, 1000);
    }
};

// 5. نظام إشعارات المبيعات
window.startSalesNotify = function(dataStr) {
    const notifications = dataStr.split(';');
    const notifyBox = document.getElementById('salesNotify');
    const userSpan = document.getElementById('notifyUser');
    let currentIndex = 0;
    if (notifyBox && notifications.length > 0) {
        notifyBox.style.display = 'block';
        function showNext() {
            notifyBox.classList.remove('active');
            setTimeout(() => {
                userSpan.innerText = notifications[currentIndex];
                notifyBox.classList.add('active');
                currentIndex = (currentIndex + 1) % notifications.length;
            }, 500);
        }
        showNext();
        setInterval(showNext, 7000);
    }
};
