using CollectorService.Interfaces;
using Common.Constants;
using Common.Enums;
using Common.Interfaces;
using Common.Models;

namespace CollectorService.Parsers.NbuUsd;

public class NbuUsdParser(IHttpRestClient httpClient, ILogger<NbuUsdParser> logger) : IDataParser {
	public string Name => "NBU_USD";

	public async Task<InboundDataDto> ParseAsync() {
		var rates = await httpClient.GetAsync<List<NbuRateModel>>("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json");
		var rate = rates?.FirstOrDefault();

		if (rate == null) throw new Exception("Failed to fetch NBU rate");

		return new InboundDataDto {
			Source = "bank.gov.ua",
			Metric = "USD_UAH",
			Value = rate.Rate,
			Type = DataType.Currency,
			Metadata = new Dictionary<string, string>
			{
				["ExchangeDate"] = rate.ExchangeDate,
				[MetadataKeys.Unit] = "UAH per USD",
				[MetadataKeys.Provider] = "National bank of Ukraine"
			}
		};
	}
}