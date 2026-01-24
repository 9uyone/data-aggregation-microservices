namespace CollectorService.Interfaces;

public interface IHttpRestClient {
	Task<T?> GetAsync<T>(string url);
}
