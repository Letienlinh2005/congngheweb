// ../js/Phat.js
const API_PHAT = 'https://localhost:7151/api/phat';

window.initPhatPage = function () {
  const tbody     = document.getElementById('ph-body');
  const btnSearch = document.getElementById('en');
  const inpSearch = document.getElementById('search-bd');

  const btnAll      = document.getElementById('All');
  const btnActive   = document.getElementById('Active');    // "Đã trả"
  const btnNoActive = document.getElementById('No-active'); // "Trễ hẹn"

  if (!tbody) return;

  let allPH = [];

  const normalize = (p) => {
    if (Array.isArray(p)) return p;
    if (p && Array.isArray(p.data)) return p.data;
    return p ? [p] : [];
  };

  const fmtDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    return isNaN(dt) ? '' : dt.toLocaleDateString('vi-VN');
  };

  const render = (rows) => {
    if (!rows || !rows.length) {
      tbody.innerHTML =
        '<tr><td colspan="9" style="text-align:center">Không có dữ liệu</td></tr>';
      return;
    }

    tbody.innerHTML = rows
      .map((x, i) => {
        const id       = x.maPhat       ?? x.MaPhat       ?? '';
        const pm       = x.maPhieuMuon  ?? x.MaPhieuMuon  ?? '';
        const soTien   = x.soTien       ?? x.SoTien       ?? 0;
        const lyDo     = x.lyDo         ?? x.LyDo         ?? '';
        const ngay     = fmtDate(x.ngayTinh ?? x.NgayTinh);
        const tt       = x.trangThai    ?? x.TrangThai    ?? '';
        const maTT     = x.maThanhToan  ?? x.MaThanhToan  ?? '';

        return `
          <tr data-id="${id}">
            <td>${i + 1}</td>
            <td>${id}</td>
            <td>${pm}</td>
            <td>${soTien.toLocaleString('vi-VN')} đ</td>
            <td>${lyDo}</td>
            <td>${ngay}</td>
            <td>${tt}</td>
            <td>${maTT || '-'}</td>
            <td>
              <!-- nút thanh toán -->
              <button class="btn-fil" data-act="pay" data-id="${id}">
                Thanh toán
              </button>
            </td>
          </tr>
        `;
      })
      .join('');
  };

  const doSearch = () => {
    const key = (inpSearch?.value || '').trim().toLowerCase();
    if (!key) {
      render(allPH);
      return;
    }
    const filtered = allPH.filter((x) => {
      const id    = (x.maPhat       ?? x.MaPhat       ?? '').toLowerCase();
      const pm    = (x.maPhieuMuon  ?? x.MaPhieuMuon  ?? '').toLowerCase();
      const lyDo  = (x.lyDo         ?? x.LyDo         ?? '').toLowerCase();
      const tt    = (x.trangThai    ?? x.TrangThai    ?? '').toLowerCase();
      const maTT  = (x.maThanhToan  ?? x.MaThanhToan  ?? '').toLowerCase();
      return (
        id.includes(key) ||
        pm.includes(key) ||
        lyDo.includes(key) ||
        tt.includes(key) ||
        maTT.includes(key)
      );
    });
    render(filtered);
  };

  // Lọc "Đã trả" / "Trễ hẹn"
  const filterTrangThai = (mode) => {
    const filtered = allPH.filter((x) => {
      const ttRaw  = (x.trangThai ?? x.TrangThai ?? '').toString().toLowerCase();
      const lyDo   = (x.lyDo ?? x.LyDo ?? '').toString().toLowerCase();

      if (mode === 'da-tra') {
        return ttRaw.includes('đã trả');
      }
      if (mode === 'tre-hen') {
        return lyDo.includes('trễ') || ttRaw.includes('trễ');
      }
      return true;
    });
    render(filtered);
  };

  // load lần đầu
  fetch(API_PHAT)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((p) => {
      allPH = normalize(p);
      render(allPH);
    })
    .catch((err) => {
      console.error(err);
      tbody.innerHTML =
        '<tr><td colspan="9" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>';
    });

  // tìm kiếm
  if (btnSearch) btnSearch.onclick = doSearch;
  if (inpSearch)
    inpSearch.onkeyup = (e) => {
      if (e.key === 'Enter') doSearch();
    };

  // nút lọc
  if (btnAll)      btnAll.onclick      = () => render(allPH);
  if (btnActive)   btnActive.onclick   = () => filterTrangThai('da-tra');
  if (btnNoActive) btnNoActive.onclick = () => filterTrangThai('tre-hen');

  // Hành động
    // Hành động trong bảng
  tbody.onclick = (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;

    const act = btn.dataset.act;
    const id  = btn.dataset.id;

    // chỉ còn 1 hành động: Thanh toán
    if (act === 'pay') {
      // tìm đúng bản ghi phạt trong mảng allPH
      const row = allPH.find((x) => (x.maPhat ?? x.MaPhat ?? '') === id);
      if (!row) {
        alert('Không tìm thấy bản ghi phạt.');
        return;
      }

      // 👉 LƯU VÀO SESSION để trang ThanhToanPhat đọc lại
      try {
        sessionStorage.setItem('PAY_PHAT', JSON.stringify(row));
        console.log('Đã lưu PAY_PHAT vào sessionStorage:', row);
      } catch (err) {
        console.warn('Không lưu được PAY_PHAT vào sessionStorage', err);
      }

      // 👉 NHẢY SANG FORM THANH TOÁN PHẠT
      if (typeof loadPage === 'function') {
        // gọi đúng như các menu khác: ../html/...
        loadPage('../html/ThanhToanPhat.html', 'initThanhToanPhatPage');
      } else {
        // trường hợp bạn mở file lẻ, fallback chuyển trang
        window.location.href = '../html/ThanhToanPhat.html';
      }
    }
  };
};

