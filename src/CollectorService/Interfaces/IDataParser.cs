using Common.Models;

namespace Common.Interfaces;

public interface IDataParser {
	Task<InboundDataDto> ParseAsync(IDictionary<string, string>? parameters);
	Task<IEnumerable<string>> GetParameterLookupsAsync(string parameterName) =>
		Task.FromResult<IEnumerable<string>>(new List<string>());
}
