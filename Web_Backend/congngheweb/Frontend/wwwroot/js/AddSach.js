// ../js/AddSach.js

// dùng lại API_SACH nếu đã có
if (!window.API_SACH) {
  window.API_SACH = 'https://localhost:7151/api/Sach';
}
// API thể loại
if (!window.API_THELOAI) {
  window.API_THELOAI = 'https://localhost:7151/api/TheLoai';
}

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return payload ? [payload] : [];
}

async function loadTheLoaiOptionsAdd() {
  const sel = document.getElementById('MaTheLoai');
  if (!sel) return;

  sel.innerHTML = `<option value="">-- Đang tải thể loại... --</option>`;

  try {
    const res = await fetch(window.API_THELOAI, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let data = await res.json();
    data = normalizeList(data);

    sel.innerHTML =
      `<option value="">-- Chọn thể loại --</option>` +
      data.map(tl => {
        const ma  = tl.maTheLoai ?? tl.MaTheLoai ?? '';
        const ten = tl.tenTheLoai ?? tl.TenTheLoai ?? ma;
        return `<option value="${ma}">${ten}</option>`;
      }).join('');
  } catch (err) {
    console.error(err);
    sel.innerHTML = `<option value="">-- Lỗi tải thể loại --</option>`;
  }
}

function initPreviewInput() {
  const inp = document.getElementById('LienKetAnh');
  const img = document.getElementById('previewImgAdd');
  if (!inp || !img) return;

  const update = () => {
    const url = inp.value.trim();
    img.src = url || '';
  };

  inp.addEventListener('input', update);
}

// được gọi từ Sach.html: loadPage('../html/AddSach.html','initAddSach')
window.initAddSach = async function () {
  const msg = document.getElementById('add-sach-msg');
  const saveBtn = document.getElementById('saveBtn');
  const backBtn = document.getElementById('goBackbtn');

  await loadTheLoaiOptionsAdd();
  initPreviewInput();

  if (backBtn) {
    backBtn.onclick = function () {
      if (typeof window.loadPage === 'function') {
        window.loadPage('../html/Sach.html', 'initSachPage');
      } else {
        window.history.back();
      }
    };
  }

  if (saveBtn) {
    saveBtn.onclick = async function () {
      const maSach    = document.getElementById('MaSach').value.trim();
      const tieuDe    = document.getElementById('TieuDe').value.trim();
      const tacGia    = document.getElementById('TacGia').value.trim();
      const maTheLoai = document.getElementById('MaTheLoai').value.trim();
      const namXBVal  = document.getElementById('NamXuatBan').value.trim();
      const ngonNgu   = document.getElementById('NgonNgu').value.trim();
      const tomTat    = document.getElementById('TomTat').value.trim();
      const lienAnh   = document.getElementById('LienKetAnh').value.trim();

      if (!maSach || !tieuDe || !tacGia) {
        msg.style.color = 'red';
        msg.textContent = 'Mã sách, Tiêu đề, Tác giả là bắt buộc';
        return;
      }

      const body = {
        MaSach:     maSach,
        TieuDe:     tieuDe,
        TacGia:     tacGia,
        MaTheLoai:  maTheLoai || null,
        NamXuatBan: namXBVal ? Number(namXBVal) : null,
        NgonNgu:    ngonNgu || null,
        TomTat:     tomTat || null,
        LienKetAnh: lienAnh || null
      };

      msg.style.color = 'black';
      msg.textContent = 'Đang lưu...';

      try {
        const res = await fetch(window.API_SACH, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        const text = await res.text();
        let obj;
        try { obj = JSON.parse(text); } catch { obj = null; }

        if (!res.ok || (obj && obj.success === false)) {
          msg.style.color = 'red';
          msg.textContent = (obj && obj.message) || text || 'Thêm sách thất bại';
          return;
        }

        msg.style.color = 'green';
        msg.textContent = 'Thêm sách thành công';

        setTimeout(() => {
          if (typeof window.loadPage === 'function') {
            window.loadPage('../html/Sach.html', 'initSachPage');
          }
        }, 600);
      } catch (err) {
        console.error(err);
        msg.style.color = 'red';
        msg.textContent = 'Lỗi kết nối API';
      }
    };
  }
};
