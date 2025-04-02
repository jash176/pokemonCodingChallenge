import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Add token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

function getFullUrl(path: string): string {
  const baseUrl = "https://pokeapi.co/api/v2";
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: any,
  headers?: Record<string, string>
): Promise<Response> {
  let newHeaders = headers;
  if (!newHeaders) newHeaders = {};
  if (authToken) {
    newHeaders["Authorization"] = `Bearer ${authToken}`;
  }
  if(data instanceof FormData === false) {
    newHeaders["Content-Type"] = "application/json";
  }

  const fullUrl = getFullUrl(url);

  const res = await fetch(fullUrl, {
    method,
    headers: newHeaders,
    body: data ? data instanceof FormData ? data : JSON.stringify(data) : undefined,
    // credentials: "include",
  });

  // await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const fullUrl = getFullUrl(queryKey[0] as string);

    const res = await fetch(fullUrl, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
