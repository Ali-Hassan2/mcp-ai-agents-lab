import {McpServer} from '@modelcontextprotocol/sdk'

const server = new McpServer({
    name: 'Weather Data Fetcher',
    version: '1.0.0',
})

server.tool('getWeatherDataByCityName',{
    city
})