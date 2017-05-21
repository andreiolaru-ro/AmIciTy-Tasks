
namespace AmbientIntelligence.Models
{
    public class RSSModel : BaseModel
    {
        public string User;
        public RSSModel(string user) : base(user)
        {
            User = user;
        }
    }
}