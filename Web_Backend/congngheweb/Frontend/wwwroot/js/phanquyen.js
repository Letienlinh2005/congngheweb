// ../js/phanquyen.js

// Cấu hình các quyền giống hình bạn gửi
// module: nhóm tính năng lớn (Danh mục sản phẩm, Danh sách sản phẩm, ...)
// actions: các hành động cho từng module
const permissionConfig = [
  {
    moduleGroup: "Tính năng",     // dòng lớn phía trên (chỉ hiển thị 1 lần)
    moduleName: "Danh mục sản phẩm",
    actions: [
      { name: "Xem",       key: "dmsp_view" },
      { name: "Thêm mới",  key: "dmsp_create" },
      { name: "Chỉnh sửa", key: "dmsp_edit" },
      { name: "Xoá",       key: "dmsp_delete" }
    ]
  },
  {
    moduleGroup: "Danh sách sản phẩm",
    moduleName: "Danh sách sản phẩm",
    actions: [
      { name: "Xem",       key: "dssp_view" },
      { name: "Thêm mới",  key: "dssp_create" },
      { name: "Chỉnh sửa", key: "dssp_edit" },
      { name: "Xoá",       key: "dssp_delete" }
    ]
  },
  {
    moduleGroup: "Nhóm quyền",
    moduleName: "Nhóm quyền",
    actions: [
      { name: "Xem",       key: "group_view" },
      { name: "Thêm mới",  key: "group_create" },
      { name: "Chỉnh sửa", key: "group_edit" },
      { name: "Xoá",       key: "group_delete" }
    ]
  },
  {
    moduleGroup: "Phân quyền",
    moduleName: "Phân quyền",
    actions: [
      { name: "Xem",       key: "perm_view" },
      { name: "Thêm mới",  key: "perm_create" },
      { name: "Chỉnh sửa", key: "perm_edit" },
      { name: "Xoá",       key: "perm_delete" }
    ]
  },
  {
    moduleGroup: "Tài khoản",
    moduleName: "Tài khoản",
    actions: [
      { name: "Xem",       key: "account_view" },
      { name: "Thêm mới",  key: "account_create" },
      { name: "Chỉnh sửa", key: "account_edit" },
      { name: "Xoá",       key: "account_delete" }
    ]
  }
];

// giả sử có 2 role đúng như cột: Quản trị viên & Quản lý nội dung
const roles = [
  { id: "admin", label: "Quản trị viên" },
  { id: "content", label: "Quản lý nội dung" }
];

document.addEventListener("DOMContentLoaded", () => {
  renderPermissionTable();

  document.getElementById("btnSavePermission")
    .addEventListener("click", savePermissions);
});

function renderPermissionTable() {
  const tbody = document.getElementById("pq-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  let lastGroup = "";

  permissionConfig.forEach(cfg => {
    // nếu moduleGroup khác lần trước thì render row nhóm
    if (cfg.moduleGroup && cfg.moduleGroup !== lastGroup) {
      const trGroup = document.createElement("tr");
      trGroup.className = "pq-section-row";
      trGroup.innerHTML = `
        <td colspan="4">${cfg.moduleGroup}</td>
      `;
      tbody.appendChild(trGroup);
      lastGroup = cfg.moduleGroup;
    }

    // mỗi action là 1 dòng
    cfg.actions.forEach((act, index) => {
      const tr = document.createElement("tr");
      tr.className = "pq-item-row";

      tr.innerHTML = `
        <td>${index === 0 ? cfg.moduleName : ""}</td>
        <td class="pq-action-name">${act.name}</td>
        ${roles.map(r => `
          <td style="text-align:center">
            <input type="checkbox"
                   data-role="${r.id}"
                   data-perm="${act.key}">
          </td>
        `).join("")}
      `;

      tbody.appendChild(tr);
    });
  });
}

// TODO: chỗ này bạn tự gọi API lưu quyền tuỳ DB của bạn
function savePermissions() {
  const checkboxes = document.querySelectorAll("input[type=checkbox][data-role][data-perm]");
  const data = [];

  checkboxes.forEach(cb => {
    data.push({
      roleId: cb.dataset.role,
      permissionKey: cb.dataset.perm,
      allowed: cb.checked
    });
  });

  console.log("Quyền sắp gửi lên API:", data);

  // ví dụ:
  // fetch('https://localhost:7151/api/phanquyen/update', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // }).then(...)

  alert("Tạm thời mới log ra console. Bạn nối thêm API lưu quyền ở hàm savePermissions().");
}
