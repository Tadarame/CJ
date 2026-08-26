const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
    id : number;
    name: string;
    email : string;
}

export interface Category 
{
    id : number;
    name : string;
}
export interface Photo {
    id: number;
    title: string;
    description: string | null;
    image_path: string;
    category_id: number;
    category?: Category;
}

async function getCsrfCookie(): Promise<void> {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const xsrfToken = getCookie('XSRF-TOKEN');

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Erro na requisição');
  }

  if (response.status === 204) return null as T;
  return response.json();
}

export async function login(email: string, password: string): Promise<{ user: User }> {
  await getCsrfCookie();
  return apiFetch<{ user: User }>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<null> {
  return apiFetch<null>('/api/logout', { method: 'POST' });
}

export async function getUser(): Promise<{ user: User }> {
  return apiFetch<{ user: User }>('/api/user');
}

export async function getPortfolio(categoryId?: number): Promise<{ photos: Photo[] }> {
  const query = categoryId ? `?category_id=${categoryId}` : '';
  const response = await fetch(`${API_URL}/api/portfolio${query}`, {
    cache: 'no-store',
  });

  if (!response.ok) throw new Error('Erro ao carregar o portfólio');
  return response.json();
}