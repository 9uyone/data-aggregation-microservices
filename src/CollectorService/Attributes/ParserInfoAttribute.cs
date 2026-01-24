namespace CollectorService.Attributes;

[AttributeUsage(AttributeTargets.Class)]
public class ParserInfoAttribute(string name, string dataType): Attribute {
	public string Name { get; } = name;
	public string DataType { get; } = dataType;
}
