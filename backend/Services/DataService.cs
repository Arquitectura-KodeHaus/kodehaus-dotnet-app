using System.Collections.Generic;
using System.Linq;
using backend.Models;

namespace backend.Services
{
    public interface IDataService
    {
        List<SampleModel> GetSampleData();
    }

    public class DataService : IDataService
    {
        public List<SampleModel> GetSampleData()
        {
            return new List<SampleModel>
            {
                new SampleModel { Id = 1, Name = "Sample 1", Description = "Description 1" },
                new SampleModel { Id = 2, Name = "Sample 2", Description = "Description 2" },
                new SampleModel { Id = 3, Name = "Sample 3", Description = "Description 3" }
            };
        }
    }
}