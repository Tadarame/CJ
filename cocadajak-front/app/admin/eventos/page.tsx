"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Category,
  Event,
  EventVideo,
  getAdminEvents,
  getAdminCategories,
  createEvent,
  updateEvent,
  deleteEvent,
  deleteEventPhoto,
} from "@/lib/api";

export default function AdminEventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [existingVideos, setExistingVideos] = useState<EventVideo[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    const [eventsRes, categoriesRes] = await Promise.all([
      getAdminEvents(),
      getAdminCategories(),
    ]);
    setEvents(eventsRes.events);
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
    setEventDate("");
    setFiles([]);
    setExistingVideos([]);
    setVideoFiles([]);
  }

function startEdit(event: Event) {
  setEditingId(event.id);
  setTitle(event.title);
  setDescription(event.description ?? "");
  setCategoryId(String(event.category_id));
  setEventDate(event.event_date ? event.event_date.slice(0, 7) : "");

  setFiles([]);

  setExistingVideos(event.videos);
  setVideoFiles([]);

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

  if (eventDate) {
    formData.append("event_date", `${eventDate}-01`);
  }

  files.forEach((file) => {
    formData.append("images[]", file);
  });

  videoFiles.forEach((file) => {
    formData.append("videos[]", file);
  });

  try {
    if (editingId) {
      await updateEvent(editingId, formData);
    } else {
      await createEvent(formData);
    }

    resetForm();
    await loadData();
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Erro ao salvar o evento."
    );
  } finally {
    setSaving(false);
  }
}

  async function handleDeleteEvent(id: number) {
    if (!confirm("Excluir esse evento e TODAS as fotos dele? Essa ação não pode ser desfeita.")) return;
    await deleteEvent(id);
    await loadData();
  }

  async function handleDeletePhoto(eventId: number, photoId: number) {
    if (!confirm("Excluir essa foto do evento?")) return;
    await deleteEventPhoto(eventId, photoId);
    await loadData();
  }

  return (
    <div className="flex flex-col gap-16">
      <section>
        <h1 className="font-display text-3xl italic">
          {editingId ? "Editar evento" : "Novo evento"}
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
            <label className="text-sm text-muted">Mês/ano do evento (opcional)</label>
            <input
              type="month"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">
              {editingId ? "Adicionar mais fotos (opcional)" : "Fotos"}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              required={!editingId}
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="text-sm text-muted"
            />
            {files.length > 0 && (
              <span className="text-xs text-muted">{files.length} arquivo(s) selecionado(s)</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted">
              {editingId ? "Adicionar mais vídeos (opcional)" : "Vídeos (opcional)"}
            </label>

            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              multiple
              onChange={(e) =>
                setVideoFiles(Array.from(e.target.files ?? []))
              }
              className="text-sm text-muted"
            />

            {videoFiles.length > 0 && (
              <span className="text-xs text-muted">
                {videoFiles.length} vídeo(s) selecionado(s)
              </span>
            )}
        </div>
          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-fit border border-accent px-6 py-2 text-accent transition-colors hover:bg-accent hover:text-background disabled:opacity-50"
            >
              {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar evento"}
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
        <h2 className="font-display text-2xl italic">Eventos cadastrados</h2>

        {loading ? (
          <p className="mt-6 text-muted">Carregando...</p>
        ) : events.length === 0 ? (
          <p className="mt-6 text-muted">Nenhum evento cadastrado ainda.</p>
        ) : (
          <div className="mt-6 flex flex-col gap-10">
            {events.map((event) => (
              <div key={event.id} className="border-b border-border pb-8">
                <div className="flex items-baseline justify-between">
                  <div>
                    <h3 className="text-lg">{event.title}</h3>
                    <span className="text-sm text-muted">{event.category?.name}</span>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <button onClick={() => startEdit(event)} className="text-accent hover:underline">
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-400 hover:underline"
                    >
                      Excluir evento
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {event.photos.map((photo) => (
                    <div key={photo.id} className="group relative">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${photo.thumbnail_path ?? photo.image_path}`}
                        alt={event.title}
                        className="aspect-square w-full object-cover"
                      />
                      <button
                        onClick={() => handleDeletePhoto(event.id, photo.id)}
                        className="absolute right-1 top-1 bg-background/80 px-2 py-1 text-xs text-red-400 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        Excluir
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}