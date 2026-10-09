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
  deleteEventVideo,
  deleteEventGuideImage,
} from "@/lib/api";

export default function AdminEventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPhotos, setEditingPhotos] = useState<Event["photos"]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [files, setFiles] = useState<File[]>([]);

  const [guideImageFile, setGuideImageFile] = useState<File | null>(null);
  const [existingGuideImage, setExistingGuideImage] = useState<string | null>(
    null,
  );

  const [existingVideos, setExistingVideos] = useState<EventVideo[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

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
    filePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    videoPreviews.forEach((preview) => URL.revokeObjectURL(preview));

    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategoryId("");
    setEventDate("");

    setFiles([]);
    setFilePreviews([]);

    setGuideImageFile(null);

    setExistingGuideImage(null);
    setExistingVideos([]);

    setVideoFiles([]);
    setVideoPreviews([]);

    setError("");
  }

  function startEdit(event: Event) {
    filePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    videoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setEditingPhotos(event.photos);

    setEditingId(event.id);
    setTitle(event.title);
    setDescription(event.description ?? "");
    setCategoryId(String(event.category_id));
    setEventDate(event.event_date ? event.event_date.slice(0, 7) : "");

    setFiles([]);
    setFilePreviews([]);

    setGuideImageFile(null);
    setExistingGuideImage(event.guide_image_path);

    setExistingVideos(event.videos);

    setVideoFiles([]);
    setVideoPreviews([]);

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function validateVideoFiles(files: File[]) {
    const maxSize = 60 * 1024 * 1024;

    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return `O vídeo "${file.name}" possui um formato não permitido. Use MP4, WebM ou MOV.`;
      }

      if (file.size > maxSize) {
        return `O vídeo "${file.name}" ultrapassa o limite de 60 MB.`;
      }
    }

    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");

    const videoError = validateVideoFiles(videoFiles);

    if (videoError) {
      setError(videoError);
      return;
    }

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

    if (guideImageFile) {
      formData.append("guide_image", guideImageFile);
    }

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
      setEditingPhotos([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar o evento.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEvent(id: number) {
    const event = events.find((item) => item.id === id);

    if (!event) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o evento "${event.title}"?\n\nEssa ação não pode ser desfeita e pode excluir todas as fotos e vídeos associados.`,
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteEvent(id);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao excluir o evento.",
      );
    }
  }

  async function handleDeletePhoto(eventId: number, photoId: number) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta foto?",
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteEventPhoto(eventId, photoId);

      setEditingPhotos((photos) =>
        photos.filter((photo) => photo.id !== photoId),
      );

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir a foto.");
    }
  }

  async function handleDeleteGuideImage() {
    if (!editingId || !existingGuideImage) return;

    if (!confirm("Excluir a imagem de guia deste evento?")) return;

    try {
      setError("");

      await deleteEventGuideImage(editingId);

      setExistingGuideImage(null);
      setGuideImageFile(null);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao excluir a imagem de guia.",
      );
    }
  }

  async function handleDeleteVideo(videoId: number) {
    if (!editingId) return;

    if (!confirm("Excluir esse vídeo do evento?")) return;

    try {
      setError("");

      await deleteEventVideo(editingId, videoId);

      setExistingVideos((videos) =>
        videos.filter((video) => video.id !== videoId),
      );

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir o vídeo.");
    }
  }

  return (
    <div className="flex flex-col gap-16">
      <section>
        <h1 className="font-display text-3xl italic">
          {editingId ? "Editar evento" : "Novo evento"}
        </h1>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
          <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-5">
            {/* Título */}
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

            {/* Descrição */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted">Descrição (opcional)</label>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none border-b border-border bg-transparent py-2 outline-none focus:border-accent"
              />
            </div>

            {/* Categoria */}
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

            {/* Data */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted">
                Mês/ano do evento (opcional)
              </label>

              <input
                type="month"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
              />
            </div>

            {/* FOTOS */}
            <div className="flex flex-col gap-3">
              <label className="text-sm text-muted">
                {editingId ? "Adicionar mais fotos (opcional)" : "Fotos"}
              </label>

              <label className="cursor-pointer border border-dashed border-border p-4 transition-colors hover:border-accent">
                {filePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {filePreviews.map((preview, index) => (
                      <div key={preview} className="relative overflow-hidden">
                        <img
                          src={preview}
                          alt={`Prévia ${index + 1}`}
                          className="aspect-square w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();

                            URL.revokeObjectURL(preview);

                            setFiles((current) =>
                              current.filter(
                                (_, fileIndex) => fileIndex !== index,
                              ),
                            );

                            setFilePreviews((current) =>
                              current.filter(
                                (_, previewIndex) => previewIndex !== index,
                              ),
                            );
                          }}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-background/80 text-lg text-foreground transition-colors hover:bg-red-500 hover:text-white"
                          aria-label={`Remover foto ${index + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <span className="text-2xl">＋</span>

                    <span className="text-sm text-foreground">
                      Selecionar fotos
                    </span>

                    <span className="text-xs text-muted">
                      Você pode selecionar várias imagens
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  required={!editingId}
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files ?? []);

                    setFiles(selectedFiles);

                    setFilePreviews(
                      selectedFiles.map((file) => URL.createObjectURL(file)),
                    );
                  }}
                  className="hidden"
                />
              </label>

              {files.length > 0 && (
                <span className="text-xs text-muted">
                  {files.length} arquivo(s) selecionado(s)
                </span>
              )}
            </div>

            {/* IMAGEM DE GUIA */}
            <div className="flex flex-col gap-3">
              <label className="text-sm text-muted">
                Imagem de guia (opcional)
              </label>

              {editingId && existingGuideImage && !guideImageFile && (
                <div className="flex flex-col gap-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${existingGuideImage}`}
                    alt="Imagem de guia do evento"
                    className="max-h-64 w-full object-contain border border-border bg-black"
                  />

                  <span className="text-xs text-muted">
                    Imagem de guia atual
                  </span>

                  <button
                    type="button"
                    onClick={handleDeleteGuideImage}
                    className="w-fit text-sm text-red-400 hover:text-red-300"
                  >
                    Excluir imagem de guia
                  </button>
                </div>
              )}

              <label className="cursor-pointer border border-dashed border-border p-4 transition-colors hover:border-accent">
                {guideImageFile ? (
                  <div className="relative flex flex-col gap-3">
                    <img
                      src={URL.createObjectURL(guideImageFile)}
                      alt="Prévia da imagem de guia"
                      className="max-h-80 w-full object-contain"
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setGuideImageFile(null);
                      }}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-background/80 text-lg text-foreground transition-colors hover:bg-red-500 hover:text-white"
                      aria-label="Remover imagem de guia"
                    >
                      ×
                    </button>

                    <span className="text-xs text-muted">
                      Nova imagem: {guideImageFile.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <span className="text-2xl">＋</span>

                    <span className="text-sm text-foreground">
                      Selecionar imagem de capa
                    </span>

                    <span className="text-xs text-muted">JPG, PNG ou WebP</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) =>
                    setGuideImageFile(e.target.files?.[0] ?? null)
                  }
                  className="hidden"
                />
              </label>
            </div>

            {/* VÍDEOS */}
            <div className="flex flex-col gap-3">
              <label className="text-sm text-muted">
                {editingId
                  ? "Adicionar mais vídeos (opcional)"
                  : "Vídeos (opcional)"}
              </label>

              {/* Upload de novos vídeos */}
              <label className="cursor-pointer border border-dashed border-border p-4 transition-colors hover:border-accent">
                {videoPreviews.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {videoPreviews.map((preview, index) => (
                      <div
                        key={preview}
                        className="relative overflow-hidden border border-border bg-black"
                      >
                        <video
                          src={preview}
                          controls
                          preload="metadata"
                          className="aspect-video w-full object-contain"
                        />

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();

                            URL.revokeObjectURL(preview);

                            setVideoFiles((current) =>
                              current.filter(
                                (_, fileIndex) => fileIndex !== index,
                              ),
                            );

                            setVideoPreviews((current) =>
                              current.filter(
                                (_, previewIndex) => previewIndex !== index,
                              ),
                            );
                          }}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-background/80 text-lg text-foreground transition-colors hover:bg-red-500 hover:text-white"
                          aria-label={`Remover vídeo ${index + 1}`}
                        >
                          ×
                        </button>

                        <div className="p-2">
                          <span className="text-xs text-muted">
                            Vídeo {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <span className="text-2xl">＋</span>

                    <span className="text-sm text-foreground">
                      Selecionar vídeos
                    </span>

                    <span className="text-xs text-muted">
                      MP4, WebM ou MOV • até 60 MB
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  multiple
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files ?? []);

                    setVideoFiles(selectedFiles);

                    setVideoPreviews(
                      selectedFiles.map((file) => URL.createObjectURL(file)),
                    );
                  }}
                  className="hidden"
                />
              </label>

              {/* Vídeos existentes */}
              {editingId && existingVideos.length > 0 && (
                <div className="mt-4 flex flex-col gap-3">
                  <span className="text-sm text-muted">Vídeos existentes</span>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {existingVideos.map((video) => (
                      <div
                        key={video.id}
                        className="overflow-hidden border border-border bg-black"
                      >
                        <video
                          src={`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video.video_path}`}
                          controls
                          preload="metadata"
                          className="w-full"
                        />

                        <div className="flex justify-end border-t border-border bg-background p-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteVideo(video.id)}
                            className="border border-border px-3 py-2 text-xs text-muted transition-colors hover:border-red-500 hover:text-red-500"
                          >
                            Excluir vídeo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {videoFiles.length > 0 && (
                <span className="text-xs text-muted">
                  {videoFiles.length} vídeo(s) selecionado(s)
                </span>
              )}
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            {/* Botões */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="w-fit border border-accent px-6 py-2 text-accent transition-colors hover:bg-accent hover:text-background disabled:opacity-50"
              >
                {saving
                  ? "Salvando..."
                  : editingId
                    ? "Salvar alterações"
                    : "Cadastrar evento"}
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

          {editingId && (
            <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-24">
              <div>
                <h2 className="font-display text-xl italic">Fotos do evento</h2>

                <p className="mt-1 text-sm text-muted">
                  {editingPhotos.length} foto(s) cadastrada(s)
                </p>
              </div>

              {editingPhotos.length === 0 ? (
                <p className="border border-border p-4 text-sm text-muted">
                  Nenhuma foto cadastrada neste evento.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {editingPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative min-w-0 overflow-hidden border border-border"
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${
                          photo.thumbnail_path ?? photo.image_path
                        }`}
                        alt={`Foto do evento ${title}`}
                        loading="lazy"
                        className="aspect-square w-full object-cover"
                      />

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleDeletePhoto(editingId, photo.id)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-background/90 text-lg text-red-400 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label="Excluir foto"
                        title="Excluir foto"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          )}
        </div>
      </section>

      {/* EVENTOS CADASTRADOS */}
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

                    <span className="text-sm text-muted">
                      {event.category?.name}
                    </span>
                  </div>

                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => startEdit(event)}
                      className="text-accent hover:underline"
                    >
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

                {/* Capa representativa do evento */}
                {(() => {
                  const cover = event.photos[0];

                  const coverSrc = event.guide_image_path
                    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${event.guide_image_path}`
                    : cover
                      ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${
                          cover.thumbnail_path ?? cover.image_path
                        }`
                      : null;

                  return (
                    <div className="mt-4 flex items-center gap-4">
                      {coverSrc ? (
                        <img
                          src={coverSrc}
                          alt={`Capa do evento ${event.title}`}
                          loading="lazy"
                          className="h-24 w-24 border border-border object-cover"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center border border-border text-xs text-muted">
                          Sem capa
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-foreground">
                          {event.photos.length} foto(s)
                        </span>

                        <span className="text-xs text-muted">
                          {event.videos.length} vídeo(s)
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
