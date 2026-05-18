using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyWebAPI.BLL;
using MyWebAPI.DTO;

namespace MyWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatChoController : ControllerBase
    {
        private readonly IDatChoService _svc;
        public DatChoController(IDatChoService svc) => _svc = svc;

        // POST api/DatCho
        [HttpPost]
        public async Task<ActionResult<string>> Tao(DatChoCreateRequest req)
        {
            var id = await _svc.TaoDatChoAsync(req);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        // GET api/DatCho/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DatChoDTO>> GetById(string id)
        {
            var dto = await _svc.GetByIdAsync(id);
            if (dto == null) return NotFound();
            return dto;
        }

        // GET api/DatCho?maBanDoc=BD05&maSach=S001&trangThai=Chờ hàng
        [HttpGet]
        public async Task<ActionResult<List<DatChoDTO>>> List(
            [FromQuery] string? maBanDoc,
            [FromQuery] string? maSach,
            [FromQuery] string? trangThai)
        {
            var list = await _svc.ListAsync(maBanDoc, maSach, trangThai);
            return list;
        }

        // POST api/DatCho/ready
        [AllowAnonymous]
        [HttpPost("ready")]
        public async Task<ActionResult<string?>> SetReady(DatChoReadyRequest req)
        {
            var id = await _svc.ChuyenSangGiuAsync(req.MaSach, req.GiuTrongGio);
            return Ok(id); // có thể null nếu chưa ai chờ
        }

        // POST api/DatCho/{id}/cancel
        [AllowAnonymous]
        [HttpPost("{id}/cancel")]
        public async Task<ActionResult> Cancel(string id)
        {
            var rows = await _svc.HuyAsync(id);
            if (rows == 0) return NotFound();
            return NoContent();
        }

        // POST api/DatCho/expire
        [Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpPost("expire")]
        public async Task<ActionResult<int>> Expire()
        {
            var count = await _svc.HetHanAsync();
            return Ok(count);
        }
    }
}
