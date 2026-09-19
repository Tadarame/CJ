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
export interface Photo {
  id: number;
  title: string;
  description: string | null;
  event_date: string | null;
  image_path: string;
  thumbnail_path: string | null;
  category_id: number;
  category?: Category;
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

export async function getAbout(): Promise<{
  about: About | null;
  photo_url: string | null;
}> {
  const response = await fetch(`${API_URL}/api/about`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erro ao carregar a página sobre");
  return response.json();
}

export async function updateAbout(
  formData: FormData,
): Promise<{ about: About }> {
  await getCsrfCookie();
  return apiFetchForm<{ about: About }>("/api/admin/about", formData);
}

export async function getCsrfCookie(): Promise<void> {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
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

export async function login(
  email: string,
  password: string,
): Promise<{ user: User }> {
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

export async function getPortfolio(
  categoryId?: number,
): Promise<{ photos: Photo[] }> {
  const query = categoryId ? `?category_id=${categoryId}` : "";
  const response = await fetch(`${API_URL}/api/portfolio${query}`, {
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Erro ao carregar o portfólio");
  return response.json();
}
export interface HomeData {
  message: string;
  latest_photo: Photo[];
}

export async function getHome(): Promise<HomeData> {
  const response = await fetch(`${API_URL}/api/`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erro ao carregar a home");
  return response.json();
}
//contato

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

export async function getAdminPhotos(): Promise<{ photos: Photo[] }> {
  return apiFetch<{ photos: Photo[] }>("/api/admin/photos");
}

export async function getAdminCategories(): Promise<{
  categories: Category[];
}> {
  return apiFetch<{ categories: Category[] }>("/api/admin/categories");
}

export async function createPhoto(
  formData: FormData,
): Promise<{ photo: Photo }> {
  await getCsrfCookie();
  return apiFetchForm<{ photo: Photo }>("/api/admin/photos", formData);
}

export async function updatePhoto(
  id: number,
  formData: FormData,
): Promise<{ photo: Photo }> {
  await getCsrfCookie();
  // PHP não lê arquivos em requisições PUT/PATCH nativamente,
  // então mandamos como POST com esse campo "_method" - o Laravel
  // reconhece isso e trata como se fosse PUT de verdade.
  formData.append("_method", "PUT");
  return apiFetchForm<{ photo: Photo }>(`/api/admin/photos/${id}`, formData);
}

export async function deletePhoto(id: number): Promise<null> {
  return apiFetch<null>(`/api/admin/photos/${id}`, { method: "DELETE" });
}

export async function createCategory(
  name: string,
): Promise<{ category: Category }> {
  await getCsrfCookie();
  return apiFetch<{ category: Category }>("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateCategory(
  id: number,
  name: string,
): Promise<{ category: Category }> {
  await getCsrfCookie();
  return apiFetch<{ category: Category }>(`/api/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

export async function deleteCategory(id: number): Promise<null> {
  return apiFetch<null>(`/api/admin/categories/${id}`, { method: "DELETE" });
}

export async function getCategories(): Promise<{ categories: Category[] }> {
  const response = await fetch(`${API_URL}/api/categories`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Erro ao carregar categorias");
  return response.json();
}
