// ../js/PhieuMuonTable.js
document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('pm-body');
  if (!tbody) return;

  const API_URL = 'https://localhost:7151/api/phieumuon';
  // nếu đi gateway: const API_URL = 'https://localhost:7053/api/phieumuon';

  const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.items)) return payload.items;
    return payload ? [payload] : [];
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

    const html = rows.map((x, i) => {
      const maPhieuMuon = x.maPhieuMuon ?? x.MaPhieuMuon ?? '';
      const maBanSao    = x.maBanSao ?? x.MaBanSao ?? '';
      const maBanDoc    = x.maBanDoc ?? x.MaBanDoc ?? '';
      const ngayMuon    = fmtDate(x.ngayMuon ?? x.NgayMuon);
      const hanTra      = fmtDate(x.hanTra ?? x.HanTra);
      const ngayTraTT   = fmtDate(x.ngayTraThucTe ?? x.NgayTraThucTe);
      const soLanGiaHan = x.soLanGiaHan ?? x.SoLanGiaHan ?? 0;
      const trangThai   = x.trangThai ?? x.TrangThai ?? '';

      return `
        <tr data-id="${maPhieuMuon}">
          <td>${i + 1}</td>
          <td>${maPhieuMuon}</td>
          <td>${maBanSao}</td>
          <td>${maBanDoc}</td>
          <td>${ngayMuon}</td>
          <td>${hanTra}</td>
          <td>${ngayTraTT}</td>
          <td>${soLanGiaHan}</td>
          <td>${trangThai}</td>
          <td>
            <button class="btn-sm" data-act="edit" data-id="${maPhieuMuon}">Sửa</button>
            <button class="btn-sm" data-act="delete" data-id="${maPhieuMuon}">Xoá</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = html;
  };

  // tải dữ liệu
  fetch(API_URL)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(payload => render(normalizeList(payload)))
    .catch(err => {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>';
    });

  // Sửa / Xoá
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.dataset.act === 'edit') {
      sessionStorage.setItem('editPM', id);
      if (typeof loadPage === 'function') {
        loadPage('../html/FixPM.html', 'initFixPM');
      } else {
        window.location.href = `../html/FixPM.html?id=${encodeURIComponent(id)}`;
      }
    }

    if (btn.dataset.act === 'delete') {
      if (!confirm('Xoá phiếu mượn ' + id + '?')) return;
      fetch(`${API_URL}/${encodeURIComponent(id)}`, { method: 'DELETE' })
        .then(r => {
          if (!r.ok) throw new Error('Xoá thất bại');
          return r.text();
        })
        .then(() => {
          // reload
          return fetch(API_URL).then(r => r.json()).then(p => render(normalizeList(p)));
        })
        .catch(err => {
          console.error(err);
          alert('Xoá thất bại');
        });
    }
  });
});
