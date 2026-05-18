document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('bd-body');
  if (!tbody) return;

  // Đổi URL này cho đúng nơi bạn gọi (gateway hay API trực tiếp)
  const API_URL = 'https://localhost:7151/api/BanDoc';
  // Ví dụ nếu đi qua Ocelot: const API_URL = 'https://localhost:7053/api/bandoc';

  const fmtDate = (val) => {
    if (!val) return '';
    const d = new Date(val);
    return isNaN(d) ? '' : d.toLocaleDateString('vi-VN');
  };

  const fmtMoney = (val) => {
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return '0 ₫';
    return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const fmtTrangThai = (s) => {
    if (!s) return '';
    // tuỳ hệ thống bạn: Active/Inactive hoặc "Đang hoạt động"/"Khoá"...
    const t = String(s).toLowerCase();
    if (t.includes('kho') || t.includes('block') || t.includes('inactive')) return 'Khoá';
    if (t.includes('het han')) return 'Hết hạn';
    return 'Đang hoạt động';
  };

  const normalizeList = (payload) => {
    // API có thể trả thẳng mảng hoặc bọc trong { data: [...] }
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.items)) return payload.items;
    // Trường hợp trả 1 object đơn
    return payload ? [payload] : [];
  };

  const render = (rows) => {
    if (!rows || !rows.length) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center">Không có dữ liệu</td></tr>';
      return;
    }

    const html = rows.map((x, i) => {
      const ma        = x.MaBanDoc ?? x.maBanDoc ?? '';
      const hoTen     = x.HoTen ?? x.hoTen ?? '';
      const soThe     = x.SoThe ?? x.soThe ?? '';
      const email     = x.Email ?? x.email ?? '';
      const dienThoai = x.DienThoai ?? x.dienThoai ?? '';
      const hanThe    = fmtDate(x.HanThe ?? x.hanThe);
      const trangThai = fmtTrangThai(x.TrangThaiThe ?? x.trangThaiThe);
      const duNo      = fmtMoney(x.DuNo ?? x.duNo ?? 0);

      return `
        <tr data-id="${ma}">
          <td>${i + 1}</td>
          <td>${ma}</td>
          <td>${soThe}</td>
          <td>${hoTen}</td>
          <td>${email}</td>
          <td>${dienThoai}</td>
          <td>${hanThe}</td>
          <td>${trangThai}</td>
          <td style="text-align:right">${duNo}</td>
          <td>
            <button class="btn-sm" data-act="edit" data-id="${ma}">Sửa</button>
            <button class="btn-sm" data-act="delete" data-id="${ma}">Xoá</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = html;
  };

  // Tải dữ liệu
  fetch(API_URL/*, { credentials: 'include' nếu dùng cookie }*/)
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(payload => render(normalizeList(payload)))
    .catch(err => {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>';
    });

  // Event delegation cho nút Hành động
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.dataset.act === 'edit') {
      // Ví dụ: chuyển sang trang sửa
      // location.href = `../html/FixBD.html?ma=${encodeURIComponent(id)}`;
      console.log('Edit', id);
    }

    if (btn.dataset.act === 'delete') {
      console.log('Delete', id);
      // Gọi API xoá, sau đó reload danh sách
    }
  });
});
