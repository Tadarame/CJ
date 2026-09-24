const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface EventPhoto {
  id: number;
  image_path: string;
  thumbnail_path: string | null;
  sort_order: number;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  event_date: string | null;
  category_id: number;
  category?: Category;
  photos: EventPhoto[];
}

export interface About {
  id: number;
  photo_path: string | null;
  bio: string | null;
  camera: string | null;
  lenses: string | null;
  lighting: string | null;
  editing: string | null;
}

async function getCsrfCookie(): Promise<void> {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const xsrfToken = getCookie("XSRF-TOKEN");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Erro na requisição");
  }

  if (response.status === 204) return null as T;
  return response.json();
}

async function apiFetchForm<T>(path: string, formData: FormData): Promise<T> {
  const xsrfToken = getCookie("XSRF-TOKEN");

  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Erro na requisição");
  }

  if (response.status === 204) return null as T;
  return response.json();
}

// --- Auth ---

export async function login(email: string, password: string): Promise<{ user: User }> {
  await getCsrfCookie();
  return apiFetch<{ user: User }>("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<null> {
  return apiFetch<null>("/api/logout", { method: "POST" });
}

export async function getUser(): Promise<{ user: User }> {
  return apiFetch<{ user: User }>("/api/user");
}

// --- Home / Portfólio / Categorias (público) ---

export interface HomeData {
  message: string;
  latest_events: Event[];
}

export async function getHome(): Promise<HomeData> {
  const response = await fetch(`${API_URL}/api/`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erro ao carregar a home");
  return response.json();
}

export async function getPortfolio(categoryId?: number): Promise<{ events: Event[] }> {
  const query = categoryId ? `?category_id=${categoryId}` : "";
  const response = await fetch(`${API_URL}/api/portfolio${query}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erro ao carregar o portfólio");
  return response.json();
}

export async function getCategories(): Promise<{ categories: Category[] }> {
  const response = await fetch(`${API_URL}/api/categories`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erro ao carregar categorias");
  return response.json();
}

export async function getAbout(): Promise<{ about: About | null; photo_url: string | null }> {
  const response = await fetch(`${API_URL}/api/about`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erro ao carregar a página sobre");
  return response.json();
}

// --- Contato ---

export async function sendContact(data: {
  name: string;
  email: string;
  message: string;
}): Promise<{ message: string }> {
  await getCsrfCookie();
  return apiFetch<{ message: string }>("/api/contato", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Admin: eventos ---

export async function getAdminEvents(): Promise<{ events: Event[] }> {
  return apiFetch<{ events: Event[] }>("/api/admin/events");
}

export async function createEvent(formData: FormData): Promise<{ event: Event }> {
  await getCsrfCookie();
  return apiFetchForm<{ event: Event }>("/api/admin/events", formData);
}

export async function updateEvent(id: number, formData: FormData): Promise<{ event: Event }> {
  await getCsrfCookie();
  formData.append("_method", "PUT");
  return apiFetchForm<{ event: Event }>(`/api/admin/events/${id}`, formData);
}

export async function deleteEvent(id: number): Promise<null> {
  return apiFetch<null>(`/api/admin/events/${id}`, { method: "DELETE" });
}

export async function deleteEventPhoto(eventId: number, photoId: number): Promise<null> {
  return apiFetch<null>(`/api/admin/events/${eventId}/photos/${photoId}`, {
    method: "DELETE",
  });
}

// --- Admin: categorias ---

export async function getAdminCategories(): Promise<{ categories: Category[] }> {
  return apiFetch<{ categories: Category[] }>("/api/admin/categories");
}

export async function createCategory(name: string): Promise<{ category: Category }> {
  await getCsrfCookie();
  return apiFetch<{ category: Category }>("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateCategory(id: number, name: string): Promise<{ category: Category }> {
  await getCsrfCookie();
  return apiFetch<{ category: Category }>(`/api/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

export async function deleteCategory(id: number): Promise<null> {
  return apiFetch<null>(`/api/admin/categories/${id}`, { method: "DELETE" });
}

// --- Admin: sobre ---

export async function updateAbout(formData: FormData): Promise<{ about: About }> {
  await getCsrfCookie();
  return apiFetchForm<{ about: About }>("/api/admin/about", formData);
}