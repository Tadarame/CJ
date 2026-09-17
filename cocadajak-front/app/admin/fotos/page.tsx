"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Category,
  Photo,
  getAdminPhotos,
  getAdminCategories,
  createPhoto,
  updatePhoto,
  deletePhoto,
} from "@/lib/api";

export default function AdminFotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado do formulário (serve tanto pra criar quanto pra editar)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    const [photosRes, categoriesRes] = await Promise.all([
      getAdminPhotos(),
      getAdminCategories(),
    ]);
    setPhotos(photosRes.photos);
    setCategories(categoriesRes.categories);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategoryId("");
    setFile(null);
  }

  function startEdit(photo: Photo) {
    setEditingId(photo.id);
    setTitle(photo.title);
    setDescription(photo.description ?? "");
    setCategoryId(String(photo.category_id));
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category_id", categoryId);
    if (file) formData.append("image", file);

    try {
      if (editingId) {
        await updatePhoto(editingId, formData);
      } else {
        await createPhoto(formData);
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar a foto.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Excluir essa foto? Essa ação não pode ser desfeita.")) return;
    await deletePhoto(id);
    await loadData();
  }

  return (
    <div className="flex flex-col gap-16">
      <section>
        <h1 className="font-display text-3xl italic">
          {editingId ? "Editar foto" : "Nova foto"}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">Título</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">Descrição (opcional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none border-b border-border bg-transparent py-2 outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">Categoria</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
            >
              <option value="" disabled>
                Selecione
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-background">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">
              Imagem {editingId && "(deixe em branco pra manter a atual)"}
            </label>
            <input
              type="file"
              accept="image/*"
              required={!editingId}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm text-muted"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-fit border border-accent px-6 py-2 text-accent transition-colors hover:bg-accent hover:text-background disabled:opacity-50"
            >
              {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar foto"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-fit border border-border px-6 py-2 text-muted transition-colors hover:text-foreground"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-2xl italic">Fotos cadastradas</h2>

        {loading ? (
          <p className="mt-6 text-muted">Carregando...</p>
        ) : photos.length === 0 ? (
          <p className="mt-6 text-muted">Nenhuma foto cadastrada ainda.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id} className="flex flex-col gap-2">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${photo.image_path}`}
                  alt={photo.title}
                  className="aspect-square w-full object-cover"
                />
                <div className="flex items-baseline justify-between text-sm">
                  <span>{photo.title}</span>
                  <span className="text-muted">{photo.category?.name}</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => startEdit(photo)}
                    className="text-accent hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="text-red-400 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}