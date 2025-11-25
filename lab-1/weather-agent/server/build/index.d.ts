export declare class MCPWeatherClient {
    private client;
    private transport;
    constructor();
    connect(): Promise<void>;
    getWeather(city: string): Promise<string>;
    close(): Promise<void>;
}
export declare const mcpWeatherClient: MCPWeatherClient;
//# sourceMappingURL=index.d.ts.map