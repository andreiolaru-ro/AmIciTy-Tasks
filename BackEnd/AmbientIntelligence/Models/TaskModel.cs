namespace AmbientIntelligence.Models
{
    public class TaskModel : BaseModel
    {
        public string User;
        public TaskModel(string user)  : base(user)
        {
            User = user;
        }
    }
}