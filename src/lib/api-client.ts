export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

async function request<T>(path: string, token?: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message ?? `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export function registerRequest(email: string, password: string, name: string): Promise<AuthResult> {
  return request<AuthResult>('/auth/register', undefined, {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export function loginRequest(email: string, password: string): Promise<AuthResult> {
  return request<AuthResult>('/auth/login', undefined, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
