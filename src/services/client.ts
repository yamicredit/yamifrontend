const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_BASE_URL is not set — API calls will fail.');
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token, headers, body, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new ApiError(response.status, message || response.statusText);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
