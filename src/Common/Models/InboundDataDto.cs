using Common.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Common.Models;

public class InboundDataDto {
	public string Id { get; init; } = Guid.NewGuid().ToString();
	public string ParserName { get; set; } // e.g. OpenWeatherMapParser
	public string UserId { get; set; } // Who requested the data
	public required string Source { get; set; } // e.g. api.openweathermap.org

	public string Metric { get; set; }      // "USD_UAH", "AirTemperature"
	public decimal? Value { get; set; } = null; // Numeric value (if applicable)
	public string? RawContent { get; set; } // Text content (if applicable)

	[BsonRepresentation(BsonType.String)]
	public required DataType Type { get; set; } // "Price", "Temperature", "Stock"
	public DateTime Timestamp { get; set; } = DateTime.UtcNow;

	public Dictionary<string, string>? Metadata { get; set; } = new(); // Additional data
}