// ../js/AuthGuard.js

(function () {
  // lấy thông tin user khi login
  const raw = localStorage.getItem('CURRENT_USER');
  if (!raw) {
    // chưa đăng nhập → đá về Login
    window.location.href = '../html/DangNhap.html';
    return;
  }

  let user;
  try {
    user = JSON.parse(raw);
  } catch (e) {
    console.error('CURRENT_USER hỏng:', e);
    localStorage.removeItem('CURRENT_USER');
    localStorage.removeItem('ACCESS_TOKEN');
    window.location.href = '../html/DangNhap.html';
    return;
  }

  const role = (user.vaiTro || '').toLowerCase();

  // chỉ cho Quản trị & Thủ thư
  const isAdmin  = role.includes('quản trị');
  const isThuThu = role.includes('thủ thư');

  if (!isAdmin && !isThuThu ) {
    alert('Bạn không có quyền truy cập trang quản trị.');
    // tuỳ bạn muốn nhảy về đâu
    window.location.href = '../html/trangChu.html';
  }
})();
