using Microsoft.AspNetCore.Mvc;

namespace TestApi.Controllers
{
    [Route("/")]
    public class HomeController : Controller
    {
        // GET /
        [HttpGet]
        public string Home() => "Hi from home! " + System.DateTime.Now;
    }
}