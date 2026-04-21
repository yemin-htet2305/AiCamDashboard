type QueryValue = string | number | boolean | null | undefined;

interface FetchOptions<T extends Record<string, any> = Record<string, QueryValue>> extends RequestInit {
    timeout?: number;
    searchParams?: T;
}

export default async function fetchHandler<
    TParams extends Record<string, any> = Record<string, QueryValue>
>(
    url: string,
    options: FetchOptions<TParams> = {}
){
    const {timeout = 5000,headers: customHeaders,searchParams, ...restOptions} = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    // ✅ Handle query params
    const urlObj = new URL(url);
    if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value !== undefined) {
                urlObj.searchParams.append(key, String(value));
            }
        });
    }

    url = urlObj.toString();

    const defaultHeaders ={
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }

    const config = {
        ...restOptions,
        headers: {...defaultHeaders, ...customHeaders},
        signal: controller.signal,
    };
    try {
        const response = await fetch(url, config);
        clearTimeout(id);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        return await response.json();
    }catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out');
        }else{
            return {error: error instanceof Error ? error.message : String(error) };
        }
    }
}