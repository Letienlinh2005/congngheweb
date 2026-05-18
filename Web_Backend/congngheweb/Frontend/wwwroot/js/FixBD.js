// ../js/FixBD.js

// dùng lại API_BANDOC nếu BanDoc.js đã khai báo, nếu chưa thì tạo
if (!window.API_BANDOC) {
  window.API_BANDOC = 'https://localhost:7151/api/BanDoc';
}

// gọi sau khi FixBD.html được load vào admin
window.initFixBD = async function () {
  const id = sessionStorage.getItem('editBD');
  console.log('🔵 đang sửa mã:', id);
  if (!id) {
    alert('Không có mã bạn đọc để sửa');
    return;
  }

  try {
    const res = await authFetch(`${window.API_BANDOC}/${encodeURIComponent(id)}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      console.error('API lỗi', res.status);
      alert('Không tải được bạn đọc');
      return;
    }

    let bd = await res.json();
    console.log('🟣 API trả về:', bd);

    // nếu backend bọc trong .data
    if (bd && typeof bd === 'object' && bd.data) {
      bd = bd.data;
    }

    // 1) đổ dữ liệu
    fillFixBDForm(bd);
    // 2) gắn nút Lưu NGAY SAU KHI DOM đã có
    attachSaveHandler();
    attachBackHandler();
  } catch (err) {
    console.error(err);
    alert('Lỗi tải dữ liệu');
  }
};
function attachBackHandler() {
  const btnBack = document.getElementById('goBackbtn');
  if (!btnBack) return;

  btnBack.onclick = function () {
    // nếu đang trong admin và có hàm loadPage thì gọi lại
    if (typeof window.loadPage === 'function') {
      window.loadPage('../html/Readermanagement.html', 'initReaderPage');
    } else {
      // fallback: quay lại trình duyệt
      window.history.back();
    }
  };
}

// đổ dữ liệu vào form
function fillFixBDForm(bd) {
  if (!bd) return;

  const maBD      = document.getElementById('MaBD');
  const soThe     = document.getElementById('Sothe');
  const hoTen     = document.getElementById('Hoten');
  const email     = document.getElementById('Email');
  const sodt      = document.getElementById('sodt');
  const hanThe    = document.getElementById('hanthe');
  const trangThai = document.getElementById('TrangThai');
  const duNo      = document.getElementById('DuNo');

  if (maBD)   maBD.value   = bd.MaBanDoc   ?? bd.maBanDoc   ?? '';
  if (soThe)  soThe.value  = bd.SoThe      ?? bd.soThe      ?? '';
  if (hoTen)  hoTen.value  = bd.HoTen      ?? bd.hoTen      ?? '';
  if (email)  email.value  = bd.Email      ?? bd.email      ?? '';
  if (sodt)   sodt.value   = bd.DienThoai  ?? bd.dienThoai  ?? bd.SDT ?? bd.sdt ?? '';

  const rawDate = bd.HanThe ?? bd.hanThe ?? bd.NgayHetHan ?? bd.ngayHetHan;
  if (hanThe) {
    hanThe.value = toInputDate(rawDate);
  }

  // map trạng thái
  if (trangThai) {
    let st = bd.TrangThaiThe ?? bd.trangThaiThe ?? bd.TrangThai ?? bd.trangThai;

    if (st === true || st === 1 || st === "1") {
      st = "1";
    } else if (st === false || st === 0 || st === "0") {
      st = "0";
    } else if (typeof st === "string") {
      const s = st.toLowerCase().trim();
      if (s.includes("hoạt")) {
        st = "1";
      } else if (s.includes("không") || s.includes("ko")) {
        st = "0";
      }
    }

    trangThai.value = st;
  }

  if (duNo) duNo.value = bd.DuNo ?? bd.duNo ?? bd.SoTienNo ?? 0;
}

// helper cho input date
function toInputDate(v) {
  if (!v) return '';
  const s = String(v);
  if (s.includes('T')) return s.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (s.includes('/')) {
    const [d, m, y] = s.split('/');
    if (d && m && y) return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
  return '';
}

// gắn sự kiện lưu (gọi sau khi form đã được load)
function attachSaveHandler() {
  const btn = document.getElementById('saveBtn');
  if (!btn) {
    console.warn('⚠️ không tìm thấy nút saveBtn');
    return;
  }
  btn.onclick = saveFixBD;
}

async function saveFixBD() {
  const maBD      = document.getElementById('MaBD').value.trim();
  const soThe     = document.getElementById('Sothe').value.trim();
  const hoTen     = document.getElementById('Hoten').value.trim();
  const email     = document.getElementById('Email').value.trim();
  const sodt      = document.getElementById('sodt').value.trim();
  const hanThe    = document.getElementById('hanthe').value;
  const trangThaiVal = document.getElementById('TrangThai').value; // "1" hoặc "0"
  const duNo      = document.getElementById('DuNo').value;

  // === validate cơ bản ===
  if (!maBD) {
    alert('Thiếu mã bạn đọc');
    return;
  }

  // kiểm tra email nếu có nhập
  if (email) {
    // regex nhẹ, đủ dùng
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Email không hợp lệ');
      return;
    }
  }

  // kiểm tra số điện thoại VN kiểu 10 số, cho phép 0 đầu
  if (sodt) {
    // ví dụ: 0xxxxxxxxx hoặc 84xxxxxxxxx bạn có thể chỉnh
    const phoneRegex = /^0\d{9}$/; 
    if (!phoneRegex.test(sodt)) {
      alert('Số điện thoại phải gồm 10 số và bắt đầu bằng 0');
      return;
    }
  }

  // map 1/0 -> chuỗi đúng theo DB
  let trangThaiStr = '';
  if (trangThaiVal === '1') trangThaiStr = 'Hoạt động';
  else if (trangThaiVal === '0') trangThaiStr = 'Không hoạt động';
  else trangThaiStr = trangThaiVal; // phòng hờ

  const payload = {
    MaBanDoc: maBD,
    SoThe: soThe,
    HoTen: hoTen,
    Email: email,
    DienThoai: sodt,
    HanThe: hanThe,
    TrangThaiThe: trangThaiStr,
    DuNo: Number(duNo) || 0
  };

  console.log('📤 gửi lên:', payload);

  try {
    const res = await fetch(`${window.API_BANDOC}/${encodeURIComponent(maBD)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();

    if (!res.ok) {
      alert('Lưu thất bại: ' + text);
      return;
    }

    alert('Lưu thành công!');
    if (typeof window.loadPage === 'function') {
      window.loadPage('../html/Readermanagement.html', 'initReaderPage');
    }
  } catch (err) {
    console.error(err);
    alert('Có lỗi khi gọi API');
  }
}