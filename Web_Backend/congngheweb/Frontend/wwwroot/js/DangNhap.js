const API_LOGIN = 'https://localhost:7151/api/dangnhap/login';

document.getElementById('btnLogin').addEventListener('click', doLogin);
document.getElementById('login-password').addEventListener('keyup', e => {
    if (e.key === 'Enter') doLogin();
});

async function doLogin() {
    const msgEl   = document.getElementById('auth-msg');
    const email   = document.getElementById('login-username').value.trim();
    const matKhau = document.getElementById('login-password').value.trim();

    msgEl.style.color = 'red';
    msgEl.textContent = '';

    if (!email || !matKhau) {
        msgEl.textContent = 'Vui lòng nhập đầy đủ email và mật khẩu.';
        return;
    }

    msgEl.style.color = '#333';
    msgEl.textContent = 'Đang đăng nhập...';

    try {
        const res = await fetch(API_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tenDangNhap: email,
                matKhau: matKhau
            })
        });

        const payload = await res.json().catch(() => ({}));

        if (!res.ok || payload.success === false) {
            msgEl.style.color = 'red';
            msgEl.textContent = payload.message || 'Đăng nhập thất bại.';
            return;
        }

        const { token, user } = payload.data || {};

        if (!token || !user) {
            msgEl.style.color = 'red';
            msgEl.textContent = 'Dữ liệu trả về không hợp lệ.';
            return;
        }

        // Gom đầy đủ thông tin để UserPage dùng
        const currentUser = {
            token: token,
            maTaiKhoan: user.maTaiKhoan || user.MaTaiKhoan || null,
            maBanDoc:   user.maBanDoc   || user.MaBanDoc   || null,
            tenDangNhap: user.tenDangNhap || user.TenDangNhap || email,
            vaiTro:      user.vaiTro      || user.VaiTro      || 'User'
        };

        // Lưu token + current user
        localStorage.setItem('ACCESS_TOKEN', token);               // nếu chỗ khác còn dùng
        localStorage.setItem('CURRENT_USER', JSON.stringify(currentUser));

        msgEl.style.color = 'green';
        msgEl.textContent = 'Đăng nhập thành công!';

        // Điều hướng theo vai trò
        setTimeout(() => {
            const role = (currentUser.vaiTro || '').toLowerCase();
            // role đang toLowerCase() nên chỉ cần check 'bạn đọc'
            if (role.includes('bạn đọc')) {
                window.location.href = '../html/trangChu.html';
            } else {
                window.location.href = '../html/admin.html';
            }
        }, 700);

    } catch (err) {
        console.error(err);
        msgEl.style.color = 'red';
        msgEl.textContent = 'Lỗi kết nối server.';
    }
}
