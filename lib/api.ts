import fetchHandler from "./fetchHandler";  

const API_BASE_URL = "http://127.0.0.1:5001/api";

interface HistoryParams {
    date?: string;
    from?: string;
    to?: string;
    sort?: 'asc' | 'desc';
    min_entries?: number;
    max_entries?: number;
}

export const api ={
    stats: {
        summary: async () => fetchHandler(`${API_BASE_URL}/stats/summary`),
        dailyAvg : async (month?: string) => fetchHandler(`${API_BASE_URL}/stats/daily-avg`, {searchParams:{month}}),
        peak: async (n?: number) => fetchHandler(`${API_BASE_URL}/stats/peak`, {searchParams:{n}}),
        trend: async (days?: number) => fetchHandler(`${API_BASE_URL}/stats/trend`, {searchParams:{days}}),
    },
    history: async (params: HistoryParams) => fetchHandler(`${API_BASE_URL}/history`, {searchParams: params})
}

