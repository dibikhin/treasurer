using System;
using System.Threading.Tasks;
using System.Linq;

using Flurl;
using Flurl.Http;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace FuncTester
{
    internal static class Program
    {
        private static void Main()
        {
            PingForeverEvery(1000, "http://localhost:5000/").Wait();
        }

        private static async Task PingForeverEvery(int millisDelay, string url)
        {
            while (true)
            {
                System.Console.WriteLine("Running...");
                var resp = await url
                    .GetAsync()
                    .ReceiveString();

                Console.WriteLine(resp);
                await Task.Delay(millisDelay);
            }
        }
    }
}
