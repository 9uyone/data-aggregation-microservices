namespace CollectorService.Models;

public record ParameterDetailsDto(
	string Name,
	string Description,
	bool IsRequired,
	IEnumerable<string> Options);