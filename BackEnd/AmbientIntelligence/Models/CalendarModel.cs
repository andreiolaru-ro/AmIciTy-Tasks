namespace AmbientIntelligence.Models
{
    public class CalendarModel : BaseModel
    { 
        public string User;

        public CalendarModel(string user) : base(user)
        {
            User = user;
        }
    }
} 