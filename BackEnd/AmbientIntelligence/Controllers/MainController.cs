using System.Collections.Generic;
using System.Web.Http;
using System.Web.Script.Serialization;
using AmbientIntelligence.Models;
using AmbientIntelligence.Util;

namespace AmbientIntelligence.Controllers
{
    public class MainController : ApiController
    {
        private string username = "anca";
        private string emailAddress = "antonie.anca@yahoo.com";


        [Route("api/main/getEmail")]
        [HttpGet]
        public List<EmailModel> GetEmail()
        {
            Email test = new Email();
            
            return test.RetriveEmails();
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