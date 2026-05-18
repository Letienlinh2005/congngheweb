const API_REGISTER = 'https://localhost:7151/api/dangnhap/register-reader';

document.getElementById('btnRegister').addEventListener('click', doRegister);

async function doRegister() {
    const msgEl = document.getElementById('reg-msg');
    const hoTen = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const pass1 = document.getElementById('reg-password').value.trim();
    const pass2 = document.getElementById('reg-password2').value.trim();

    msgEl.style.color = 'red';
    msgEl.textContent = '';

    if (!hoTen || !email || !phone || !pass1 || !pass2) {
        msgEl.textContent = 'Vui lòng nhập đầy đủ thông tin.';
        return;
    }

    // check email sơ sơ
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msgEl.textContent = 'Email không hợp lệ.';
        return;
    }

    // check phone VN 10 số
    if (!/^0\d{9}$/.test(phone)) {
        msgEl.textContent = 'Số điện thoại phải gồm 10 số và bắt đầu bằng 0.';
        return;
    }

    if (pass1.length < 6) {
        msgEl.textContent = 'Mật khẩu phải có ít nhất 6 ký tự.';
        return;
    }

    if (pass1 !== pass2) {
        msgEl.textContent = 'Hai mật khẩu không trùng nhau.';
        return;
    }

    msgEl.style.color = '#333';
    msgEl.textContent = 'Đang đăng ký...';

    try {
        const res = await fetch(API_REGISTER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hoTen: hoTen,
                email: email,
                dienThoai: phone,
                matKhau: pass1
            })
        });

        const payload = await res.json().catch(() => ({}));

        if (!res.ok || payload.success === false) {
            msgEl.style.color = 'red';
            msgEl.textContent = payload.message || 'Đăng ký thất bại.';
            return;
        }

        msgEl.style.color = 'green';
        msgEl.textContent = payload.message || 'Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.';

        // Sau khi đăng ký xong → chuyển sang login
        setTimeout(() => {
            window.location.href = 'Login.html';
        }, 1200);

    } catch (err) {
        console.error(err);
        msgEl.style.color = 'red';
        msgEl.textContent = 'Lỗi kết nối server.';
    }
}