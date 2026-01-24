using Common.Enums;
using Common.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Common.Contracts;

public class DataCollectedEvent: BaseEntity {
	public string ParserName { get; set; } // e.g. OpenWeatherMapParser
	public string UserId { get; init; } // Who requested the data
	public string Source { get; set; } // e.g. api.openweathermap.org

	public decimal? Value { get; set; } = null; // Numeric value (if applicable)
	public string? RawContent { get; set; } // Text content (if applicable)

	[BsonRepresentation(BsonType.String)]
	public DataType Type { get; set; } // "Price", "Temperature", "Stock"

	public Dictionary<string, string>? Metadata { get; set; } = new(); // Additional data
};