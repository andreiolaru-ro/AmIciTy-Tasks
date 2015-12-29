namespace AmbientIntelligence.Models
{
    public class ForumModel : BaseModel
    {
        public string User;

        public ForumModel(string user) : base(user)
        {
            User = user;
        }
    }
}