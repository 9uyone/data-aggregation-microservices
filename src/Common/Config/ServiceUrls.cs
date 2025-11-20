namespace Common.Config;

public record ServiceUrls {
    int CollectorUrl { get; init; }
    int ProcessorUrl { get; init; }
}
