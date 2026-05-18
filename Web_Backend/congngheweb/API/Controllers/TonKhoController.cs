using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyWebAPI.BLL.Services;
using System.Threading.Tasks;

namespace MyWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TonKhoController : ControllerBase
    {
        private readonly ITonKhoService _service;

        public TonKhoController(ITonKhoService service)
        {
            _service = service;
        }

        // GET: api/TonKho/the-loai
        [HttpGet("the-loai")]
        [Authorize(Roles = "Quản trị, Thủ thư")]
        public async Task<IActionResult> GetTheoTheLoai()
        {
            var response = await _service.GetTonKhoTheoTheLoaiAsync();
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        // GET: api/TonKho/sach
        [HttpGet("sach")]
        [Authorize(Roles = "Quản trị, Thủ thư")]
        public async Task<IActionResult> GetTheoSach()
        {
            var response = await _service.GetTonKhoTheoSachAsync();
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
    }
}
