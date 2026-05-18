// ../js/FixSach.js

// ====== CONFIG API ======
if (!window.API_SACH) {
  window.API_SACH = 'https://localhost:7151/api/Sach';
}
if (!window.API_THELOAI) {
  window.API_THELOAI = 'https://localhost:7151/api/TheLoai';
}

// cache thể loại để không load lại nhiều lần
let _cacheTheLoai = null;

// helper lấy element theo 2 kiểu id (Pascal/camel)
function getEl(id1, id2) {
  return document.getElementById(id1) || (id2 ? document.getElementById(id2) : null);
}

// ====== LOAD DANH SÁCH THỂ LOẠI ======
async function loadTheLoaiList() {
  if (_cacheTheLoai) return _cacheTheLoai;

  try {
    const res = await fetch(window.API_THELOAI, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    let data = await res.json();

    // API có thể dạng { data: [...] }
    if (data && Array.isArray(data.data)) data = data.data;

    if (!Array.isArray(data)) data = [];
    _cacheTheLoai = data;
    return data;
  } catch (err) {
    console.error('Lỗi load thể loại:', err);
    _cacheTheLoai = [];
    return [];
  }
}

// bind option cho <select id="MaTheLoai">
function bindTheLoaiOptions(list, selectedMa) {
  const sel = getEl('MaTheLoai', 'theLoai');
  if (!sel) return;

  if (!Array.isArray(list) || list.length === 0) {
    sel.innerHTML = `<option value="">(Chưa có thể loại)</option>`;
    sel.value = '';
    return;
  }

  const optionsHtml = [
    `<option value="">-- Chọn thể loại --</option>`,
    ...list.map(tl => {
      const ma  = tl.MaTheLoai  ?? tl.maTheLoai  ?? '';
      const ten = tl.TenTheLoai ?? tl.tenTheLoai ?? ma;
      return `<option value="${ma}">${ten}</option>`;
    })
  ].join('');

  sel.innerHTML = optionsHtml;

  if (selectedMa) {
    sel.value = selectedMa;
    if (sel.value !== selectedMa) {
      console.warn('⚠️ Không tìm thấy thể loại có mã', selectedMa);
    }
  }
}

// ====== ĐỔ DỮ LIỆU SÁCH VÀO FORM ======
function fillFixSachForm(sach) {
  if (!sach) return;

  const maSachEl     = getEl('MaSach', 'maSach');
  const tieuDeEl     = getEl('TieuDe', 'tieuDe');
  const tacGiaEl     = getEl('TacGia', 'tacGia');
  const namXBEl      = getEl('NamXuatBan', 'namXuatBan');
  const ngonNguEl    = getEl('NgonNgu', 'ngonNgu');
  const tomTatEl     = getEl('TomTat', 'tomTat');
  const lienKetAnhEl = getEl('LienKetAnh', 'lienKetAnh');
  const previewImg   = document.getElementById('previewImg');

  if (maSachEl)     maSachEl.value     = sach.MaSach     ?? sach.maSach     ?? '';
  if (tieuDeEl)     tieuDeEl.value     = sach.TieuDe     ?? sach.tieuDe     ?? '';
  if (tacGiaEl)     tacGiaEl.value     = sach.TacGia     ?? sach.tacGia     ?? '';
  if (namXBEl)      namXBEl.value      = sach.NamXuatBan ?? sach.namXuatBan ?? '';
  if (ngonNguEl)    ngonNguEl.value    = sach.NgonNgu    ?? sach.ngonNgu    ?? '';
  if (tomTatEl)     tomTatEl.value     = sach.TomTat     ?? sach.tomTat     ?? '';
  if (lienKetAnhEl) lienKetAnhEl.value = sach.LienKetAnh ?? sach.lienKetAnh ?? '';

  // ảnh bìa hiện tại (nếu có)
  const anh = sach.LienKetAnh ?? sach.lienKetAnh ?? sach.AnhBiaUrl ?? sach.anhBiaUrl;
  if (previewImg) {
    if (anh) previewImg.src = anh;
    else previewImg.src = '';
  }

  // ====== CHỌN ẢNH MỚI: PREVIEW + UPLOAD LÊN API/SACH/UPLOAD ======
  const fileInput = document.getElementById('fileAnh');
  if (fileInput && previewImg) {
    fileInput.onchange = async function () {
      const file = this.files[0];
      if (!file) return;

      // preview tạm bằng blob:
      const blobUrl = URL.createObjectURL(file);
      previewImg.src = blobUrl;

      const maSachInput = getEl('MaSach', 'maSach');
      const maSachVal = maSachInput?.value.trim();
      if (!maSachVal) {
        alert('Thiếu mã sách, không thể upload ảnh');
        return;
      }

      const formData = new FormData();
      formData.append('MaSach', maSachVal);
      formData.append('File', file);

      try {
        const res = await authFetch(`${window.API_SACH}/upload`, {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

        if (!res.ok || data.success === false) {
          console.error('Upload ảnh lỗi:', data);
          alert(data.message || 'Upload ảnh thất bại');
          return;
        }

        // server trả url thật, ví dụ: /images/sach/xxx.jpg
        const fileUrl = data.url || data.Url || '';
        if (fileUrl) {
          previewImg.src = fileUrl;                    // dùng URL thật
          const lkEl = getEl('LienKetAnh', 'lienKetAnh');
          if (lkEl) lkEl.value = fileUrl;              // lưu vào input để lần sau load lại vẫn có
        }

      } catch (err) {
        console.error(err);
        alert('Có lỗi khi upload ảnh');
      }
    };
  }
}

// ====== BACK BUTTON ======
function attachSachBackHandler() {
  const btnBack = document.getElementById('goBackbtn');
  if (!btnBack) return;

  btnBack.onclick = function () {
    if (typeof window.loadPage === 'function') {
      window.loadPage('../html/Sach.html', 'initSachPage');
    } else {
      window.history.back();
    }
  };
}

// ====== SAVE BUTTON ======
function attachSachSaveHandler() {
  const btn = document.getElementById('saveBtn');
  if (!btn) {
    console.warn('⚠️ không tìm thấy nút saveBtn cho Sách');
    return;
  }
  btn.onclick = saveFixSach;
}

async function saveFixSach() {
  const msgEl       = document.getElementById('fix-msg');
  const maSachEl    = getEl('MaSach', 'maSach');
  const tieuDeEl    = getEl('TieuDe', 'tieuDe');
  const tacGiaEl    = getEl('TacGia', 'tacGia');
  const maTheLoaiEl = getEl('MaTheLoai', 'theLoai');
  const namXBEl     = getEl('NamXuatBan', 'namXuatBan');
  const ngonNguEl   = getEl('NgonNgu', 'ngonNgu');
  const tomTatEl    = getEl('TomTat', 'tomTat');
  const lienAnhEl   = getEl('LienKetAnh', 'lienKetAnh');

  const maSach    = maSachEl?.value.trim()    || '';
  const tieuDe    = tieuDeEl?.value.trim()    || '';
  const tacGia    = tacGiaEl?.value.trim()    || '';
  const maTheLoai = maTheLoaiEl?.value.trim() || '';
  const namXBVal  = namXBEl?.value.trim()     || '';
  const ngonNgu   = ngonNguEl?.value.trim()   || '';
  const tomTat    = tomTatEl?.value.trim()    || '';
  const lienAnh   = lienAnhEl?.value.trim()   || '';

  // validate cơ bản
  if (!maSach) {
    alert('Thiếu mã sách');
    return;
  }
  if (!tieuDe) {
    alert('Thiếu tiêu đề sách');
    return;
  }
  if (!tacGia) {
    alert('Thiếu tác giả');
    return;
  }

  // KHÔNG gửi LienKetAnh = null nữa
  const payload = {
    MaSach:     maSach,
    TieuDe:     tieuDe,
    TacGia:     tacGia,
    MaTheLoai:  maTheLoai || null,
    NamXuatBan: namXBVal ? Number(namXBVal) : null,
    NgonNgu:    ngonNgu || null,
    TomTat:     tomTat || null
    // LienKetAnh sẽ thêm bên dưới nếu có
  };

  if (lienAnh) {
    payload.LienKetAnh = lienAnh;  // chỉ gửi khi có link, tránh xóa ảnh cũ
  }

  console.log('📤 gửi lên (Sách):', payload);

  const showMsg = (text, color = 'red') => {
    if (msgEl) {
      msgEl.style.color = color;
      msgEl.textContent = text;
    } else {
      if (color === 'red') alert(text);
      else console.log(text);
    }
  };

  try {
    const res = await authFetch(`${window.API_SACH}/${encodeURIComponent(maSach)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    let obj;
    try { obj = JSON.parse(text); } catch { obj = null; }

    if (!res.ok || (obj && obj.success === false)) {
      showMsg(obj?.message || text || 'Cập nhật sách thất bại', 'red');
      return;
    }

    showMsg('Cập nhật sách thành công', 'green');

    setTimeout(() => {
      if (typeof window.loadPage === 'function') {
        window.loadPage('../html/Sach.html', 'initSachPage');
      }
    }, 500);
  } catch (err) {
    console.error(err);
    showMsg('Lỗi kết nối API', 'red');
  }
}

// ====== INIT CHÍNH, GỌI SAU KHI FixSach.html ĐƯỢC LOAD ======
window.initFixSach = async function () {
  const id = sessionStorage.getItem('editSach');
  console.log('🔵 đang sửa sách:', id);

  if (!id) {
    alert('Không có mã sách để sửa');
    return;
  }

  try {
    // 1) load sách
    const res = await authFetch(`${window.API_SACH}/${encodeURIComponent(id)}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      console.error('API sách lỗi', res.status);
      alert('Không tải được dữ liệu sách');
      return;
    }

    let sach = await res.json();
    console.log('🟣 API Sách trả về:', sach);

    if (sach && typeof sach === 'object' && sach.data) {
      sach = sach.data;
    }

    // 2) fill form cơ bản
    fillFixSachForm(sach);

    // 3) load thể loại + bind combobox
    const dsTheLoai = await loadTheLoaiList();

    // cố gắng suy ra mã TL hiện tại
    const maTL =
      sach.MaTheLoai  ?? sach.maTheLoai ??
      sach.TheLoai    ?? sach.theLoai   ?? '';

    bindTheLoaiOptions(dsTheLoai, maTL);

    // 4) gắn nút
    attachSachSaveHandler();
    attachSachBackHandler();
  } catch (err) {
    console.error(err);
    alert('Lỗi tải dữ liệu sách');
  }
};
