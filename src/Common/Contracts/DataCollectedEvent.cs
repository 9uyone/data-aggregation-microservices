using Common.Models;

namespace Common.Contracts;

public record DataCollectedEvent(
	string Source,
	string DataType,
	string Value,
	Dictionary<string, string>? Metadata = null
): BaseEntity;