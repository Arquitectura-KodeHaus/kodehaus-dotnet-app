using backend.Custom;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DbContext _context;
        private readonly Utils _utils;
        public AuthController(DbContext dbContext, Utils utils)
        {
            _context = dbContext;
            _utils = utils;
        }
    }
}
