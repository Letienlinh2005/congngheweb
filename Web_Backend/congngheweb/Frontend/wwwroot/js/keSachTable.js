document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('ks-body');
  if (!tbody) return;

  // Đổi URL này cho đúng (gateway hay API trực tiếp)
  const API_URL = 'https://localhost:7151/api/KeSach';
  // Ví dụ nếu đi qua Ocelot: const API_URL = 'https://localhost:7053/api/KeSach';

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
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Không có dữ liệu</td></tr>';
      return;
    }

    const html = rows.map((x, i) => {
      const maKe  = x.MaKe  ?? x.maKe  ?? '';
      const viTri = x.ViTri ?? x.viTri ?? '';

      return `
        <tr data-id="${maKe}">
          <td>${i + 1}</td>
          <td>${maKe}</td>
          <td>${viTri}</td>
          <td>
            <button class="btn-sm" data-act="edit" data-id="${maKe}">Sửa</button>
            <button class="btn-sm" data-act="delete" data-id="${maKe}">Xoá</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = html;
  };

  // Tải dữ liệu
  fetch(API_URL /*, { credentials: 'include' nếu dùng cookie }*/)
    .then(r => { 
      if (!r.ok) throw new Error(`HTTP ${r.status}`); 
      return r.json(); 
    })
    .then(payload => render(normalizeList(payload)))
    .catch(err => {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>';
    });

  // Event delegation cho nút Hành động
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.dataset.act === 'edit') {
      console.log('Edit kệ', id);
      // ví dụ: lưu vào session + load trang sửa
      // sessionStorage.setItem('editKS', id);
      // loadPage('FixKS.html');
    }

    if (btn.dataset.act === 'delete') {
      console.log('Delete kệ', id);
      // TODO: Gọi API xoá, sau đó reload danh sách
      // fetch(`${API_URL}/${encodeURIComponent(id)}`, { method: 'DELETE' })
      //   .then(r => { ... })
    }
  });
});
