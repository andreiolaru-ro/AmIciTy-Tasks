namespace AmbientIntelligence.Models
{
    public class EmailModel : BaseModel
    {
        public string User;
        public string Address;

        public EmailModel(string address, string user) : base(user)
        {
            Address = address;
            User = user;
        }
    }
  
}