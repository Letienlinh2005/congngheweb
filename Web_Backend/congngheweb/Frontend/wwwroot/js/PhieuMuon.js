// ../js/PhieuMuon.js

if (!window.API_KESACH) {
  window.API_PHIEU_MUON = 'https://localhost:7151/api/phieumuon';
}

window.initPhieuMuonPage = function () {
  const tbody = document.getElementById('pm-body');
  const btnSearch = document.getElementById('en');
  const inpSearch = document.getElementById('search-bd');
  if (!tbody) return;

  let allPM = [];

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
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center">Không có dữ liệu</td></tr>';
      return;
    }

    tbody.innerHTML = rows.map((x, i) => {
      const id = x.maPhieuMuon ?? x.MaPhieuMuon ?? '';
      const bs = x.maBanSao ?? x.MaBanSao ?? '';
      const bd = x.maBanDoc ?? x.MaBanDoc ?? '';
      const nm = fmtDate(x.ngayMuon ?? x.NgayMuon);
      const ht = fmtDate(x.hanTra ?? x.HanTra);
      const ntt = fmtDate(x.ngayTraThucTe ?? x.NgayTraThucTe);
      const slg = x.soLanGiaHan ?? x.SoLanGiaHan ?? 0;
      const tt = x.trangThai ?? x.TrangThai ?? '';

      return `
      <tr data-id="${id}">
        <td>${i + 1}</td>
        <td>${id}</td>
        <td>${bs}</td>
        <td>${bd}</td>
        <td>${nm}</td>
        <td>${ht}</td>
        <td>${ntt}</td>
        <td>${slg}</td>
        <td>${tt}</td>
        <td>
          <a class="btn-sm" data-act="edit"   data-id="${id}">Sửa</a>
          <a class="btn-sm" data-act="delete" data-id="${id}">Xoá</a>
          <a class="btn-sm" data-act="return" data-id="${id}">Trả sách</a>
        </td>
      </tr>
    `;
    }).join('');
  };


  const doSearch = () => {
    const key = (inpSearch?.value || '').trim().toLowerCase();
    if (!key) {
      render(allPM);
      return;
    }
    const filtered = allPM.filter(x => {
      const id = (x.maPhieuMuon ?? x.MaPhieuMuon ?? '').toLowerCase();
      const bs = (x.maBanSao ?? x.MaBanSao ?? '').toLowerCase();
      const bd = (x.maBanDoc ?? x.MaBanDoc ?? '').toLowerCase();
      const tt = (x.trangThai ?? x.TrangThai ?? '').toLowerCase();
      return id.includes(key) || bs.includes(key) || bd.includes(key) || tt.includes(key);
    });
    render(filtered);
  };

  // load lần đầu
  authFetch(API_PHIEU_MUON)
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(p => {
      allPM = normalize(p);
      render(allPM);
    })
    .catch(err => {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>';
    });

  // tìm kiếm
  if (btnSearch) btnSearch.onclick = doSearch;
  if (inpSearch) inpSearch.onkeyup = (e) => { if (e.key === 'Enter') doSearch(); };

  // hành động
  tbody.onclick = (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.dataset.act === 'edit') {
      sessionStorage.setItem('editPM', id);
      if (typeof loadPage === 'function') {
        loadPage('../html/FixPM.html', 'initFixPM');
      }
    }

    if (btn.dataset.act === 'delete') {
      if (typeof window.deletePM === 'function') {
        window.deletePM(id, () => {
          fetch(API_PHIEU_MUON)
            .then(r => r.json())
            .then(p => {
              allPM = normalize(p);
              doSearch();
            });
        });
      }
    }

    // ====== THÊM HÀNH ĐỘNG TRẢ SÁCH ======
    if (btn.dataset.act === 'return') {
      const pm = allPM.find(x =>
        (x.maPhieuMuon ?? x.MaPhieuMuon ?? '') === id
      );
      if (!pm) {
        alert('Không tìm thấy dữ liệu phiếu mượn.');
        return;
      }

      // Lưu full info phiếu mượn sang sessionStorage để trang kia đọc lại
      sessionStorage.setItem('TRA_SACH_PM', JSON.stringify(pm));

      // Nhảy sang trang Trả sách & tính phạt
      if (typeof loadPage === 'function') {
        loadPage('../html/ThanhToanPhat.html', 'initThanhToanPhatPage');
      } else {
        window.location.href = '../html/ThanhToanPhat.html';
      }
    }
  };
};
