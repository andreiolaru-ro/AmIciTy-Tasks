using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using AmbientIntelligence.Models;

namespace AmbientIntelligence.Util
{
    public class Email
    {
        private const string folderPath = @"E:\Poli\Master\Temp\maildir\allen-p\inbox";

        private List<EmailModel> emails = new List<EmailModel>();
        
        public List<EmailModel>  RetriveEmails()
        {
            string[] fileNames = Directory.GetFiles(folderPath);
            
            foreach (var file in fileNames)
            {
                Console.Write("Email path: " + Path.Combine(folderPath, file));
                string emailFilePath = Path.Combine(folderPath, file);
                EmailModel emailModel = new EmailModel();
                StringBuilder contentText = new StringBuilder();
                
                string[] emailContent = File.ReadAllLines(emailFilePath);
                bool content = false;
                foreach (var line in emailContent)
                {
                    if (line.StartsWith("To"))
                    {
                        emailModel.To = line.Substring(3);
                    }
                    if (line.StartsWith("From"))
                    {
                        emailModel.From = line.Substring(5);
                    }
                    if (content)
                    {
                        contentText.Append(line);
                    }
                    if (line.StartsWith("X-FileName"))
                    {
                        content = true;
                    }
                }
                emailModel.Content = contentText.ToString();
                
                emails.Add(emailModel);
            }
            return emails;
        }
    }
}