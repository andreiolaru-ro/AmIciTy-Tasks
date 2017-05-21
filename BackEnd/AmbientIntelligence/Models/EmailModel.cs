using System.Text;

namespace AmbientIntelligence.Models
{
    public class EmailModel 
    {
        public string To { get; set; }
        public string From { get; set; }
        public string Content { get; set; }

        public EmailModel()
        {
        }
    }
  
}