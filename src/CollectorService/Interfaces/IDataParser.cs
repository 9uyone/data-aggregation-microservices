using Common.Models;

namespace Common.Interfaces;

public interface IDataParser {
	string Name { get; }
	Task<InboundDataDto> ParseAsync();
}
