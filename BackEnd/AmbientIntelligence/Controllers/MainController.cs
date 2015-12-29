using System.Web.Http;
using AmbientIntelligence.Models;

namespace AmbientIntelligence.Controllers
{
    public class MainController : ApiController
    {
        private string username = "anca";
        private string emailAddress = "antonie.anca@yahoo.com";


        [Route("api/main/getEmail")]
        [HttpGet]
        public EmailModel GetEmail()
        {
            return new EmailModel(emailAddress, username);
        }

        [HttpGet]
        [Route("api/main/getCalendar")]
        public CalendarModel GetCalendar()
        {
            return new CalendarModel(username);
        }

        [HttpGet]
        [Route("api/main/getForum")]
        public ForumModel GetForum()
        {
            return new ForumModel(username);
        }
        [HttpGet]
        [Route("api/main/getRSS")]
        public RSSModel GetRSS()
        {
            return new RSSModel(username);
        }
        [HttpGet]
        [Route("api/main/getTask")]
        public TaskModel GetTask()
        {
            return new TaskModel(username);
        }

    }
}