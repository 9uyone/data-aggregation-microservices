using Common.Models;

namespace Common.Contracts;

public class DataCollectedEvent: BaseEntity {
	public string Source { get; set; }
	public string DataType { get; set; }
	public string Value { get; set; }
	public Dictionary<string, string>? Metadata { get; set; } = null;
};