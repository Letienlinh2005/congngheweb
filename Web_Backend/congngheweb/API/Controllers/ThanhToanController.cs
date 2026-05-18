using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyWebAPI.BLL.Services;
using MyWebAPI.DTO;
using System.Threading.Tasks;

namespace MyWebAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThanhToanController : ControllerBase
    {
        private readonly IThanhToanService _service;
        public ThanhToanController(IThanhToanService service) => _service = service;

        [Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var res = await _service.GetAllAsync();
            return res.Success ? Ok(res) : StatusCode(500, res);
        }

        [Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpGet("{maThanhToan}")]
        public async Task<IActionResult> GetById(string maThanhToan)
        {
            var res = await _service.GetByIdAsync(maThanhToan);
            if (!res.Success && res.Data == null) return NotFound(res);
            return Ok(res);
        }

        // POST: /api/ThanhToan/Phat
        [Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpPost("phat")]
        public async Task<IActionResult> ThanhToanPhat([FromBody] ThanhToanPhatDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ" });

            var res = await _service.ThanhToanPhatAsync(model);
            if (!res.Success) return BadRequest(res);

            return Ok(res);
        }


    }
}
