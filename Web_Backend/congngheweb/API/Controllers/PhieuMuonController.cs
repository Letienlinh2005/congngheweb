using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyWebAPI.BLL.Services;
using MyWebAPI.DTO;

namespace API_PhieuMuon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhieuMuonController : ControllerBase
    {
        private readonly IPhieuMuonService _phieuMuonService;
        public PhieuMuonController(IPhieuMuonService phieuMuonService)
        {
            _phieuMuonService = phieuMuonService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _phieuMuonService.GetAllAsync();

            if (response.Success)
                return Ok(response);
            return StatusCode(500, response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var response = await _phieuMuonService.GetByIdAsync(id);
            if (response.Success)
                return Ok(response);
            return NotFound(response);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePhieuMuonRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var response = await _phieuMuonService.CreateAsync(request);
            if (response.Success)
                return Ok(response);
            return BadRequest(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdatePhieuMuonRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var response = await _phieuMuonService.UpdateAsync(id, request);
            if (response.Success)
                return Ok(response);
            return BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var response = await _phieuMuonService.DeleteAsync(id);
            if (response.Success)
                return Ok(response);
            return BadRequest(response);
        }

        // POST: api/PhieuMuon/tra-sach-va-tinh-phat
        //[Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpPost("tra-sach-va-tinh-phat")]
        public async Task<IActionResult> TraSachVaTinhPhat([FromBody] TraSachVaTinhPhatRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ" });
            }

            var res = await _phieuMuonService.TraSachVaTinhPhatAsync(model);
            if (!res.Success) return BadRequest(res);

            return Ok(res);
        }
        //GET: api/PhieuMuon/
        [HttpGet("chi-tiet")]
        public async Task<IActionResult> GetAllChiTiet()
        {
            var result = await _phieuMuonService.GetAllChiTietPhieuMuonAsync();
            return Ok(result);
        }

        [HttpPost("gia-han/{id}")]
        public async Task<IActionResult> GiaHan(string id)
        {
            var res = await _phieuMuonService.GiaHanAsync(id);
            if (!res.Success) return BadRequest(res);
            return Ok(res);
        }

        [HttpPost("dat-cho")]
        public async Task<IActionResult> DatCho([FromBody] DatChoRequest request)
        {
            var res = await _phieuMuonService.DatChoAsync(request);
            if (!res.Success) return BadRequest(res);
            return Ok(res);
        }

        [HttpGet("user/{maBanDoc}")]
        public async Task<IActionResult> GetByMaBanDoc(string maBanDoc)
        {
            var result = await _phieuMuonService.GetByMaBanDocAsync(maBanDoc);
            return Ok(result);
        }
    }
}