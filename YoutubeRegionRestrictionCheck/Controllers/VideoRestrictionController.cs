using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace YoutubeRegionRestrictionCheck.Controllers
{
    [Route("api/[controller]")]
    public class VideoRestrictionController : Controller
    {
        private static readonly HttpClient Client = new HttpClient();

        [HttpGet("[action]")]
        public object GetVideoRestrictionStatus(string videoUrl)
        {
            Console.WriteLine("Video URL: " + videoUrl);
            var status = new VideoRestrictionStatus();
            if (videoUrl != "")
            {
                var responseString =
                    Client.GetStringAsync(
                        "https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=" +
                        videoUrl + "&key=AIzaSyDTEZLqkXT72SUUCj0GJkpLPG_IwxP2lbM");
                var result = JsonConvert.DeserializeObject<dynamic>(responseString.Result);
                status.Id = result.items[0].id;
                status.Title = result.items[0].snippet.title;
                status.RegionRestriction = result.items[0].contentDetails.regionRestriction.blocked;
            }
            else
            {
                // Return empty object
                status.Id = "";
                status.Title = "";
                status.RegionRestriction = null;
            }

            Console.WriteLine("Video ID: " + status.Id);
            Console.WriteLine("Video Title: " + status.Title);
            Console.WriteLine("Video Region Restriction: " + status.RegionRestriction);
            return status;
        }

        private class VideoRestrictionStatus
        {
            public string Id { get; set; }
            public string Title { get; set; }
            public object RegionRestriction { get; set; }
        }
    }
}