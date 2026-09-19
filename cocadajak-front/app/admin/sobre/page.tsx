"use client";

import { useEffect, useState, FormEvent } from "react";
import { getAbout, updateAbout, About } from "@/lib/api";

export default function AdminSobrePage() {
  const [about, setAbout] = useState<About | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [camera, setCamera] = useState("");
  const [lenses, setLenses] = useState("");
  const [lighting, setLighting] = useState("");
  const [editing, setEditing] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);
    const data = await getAbout();
    setAbout(data.about);
    setPhotoUrl(data.photo_url);
    setBio(data.about?.bio ?? "");
    setCamera(data.about?.camera ?? "");
    setLenses(data.about?.lenses ?? "");
    setLighting(data.about?.lighting ?? "");
    setEditing(data.about?.editing ?? "");
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("camera", camera);
    formData.append("lenses", lenses);
    formData.append("lighting", lighting);
    formData.append("editing", editing);
    if (file) formData.append("photo", file);

    await updateAbout(formData);
    setFile(null);
    await loadData();
    setSaving(false);
  }

  if (loading) return <p className="text-muted">Carregando...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl italic">Página Sobre</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
        {photoUrl && (
            <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${photoUrl}`}
                alt="Foto atual"
                className="h-32 w-32 rounded-full object-cover"
            />
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted">
            Nova foto {photoUrl && "(deixe em branco pra manter a atual)"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm text-muted"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted">Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="resize-none border-b border-border bg-transparent py-2 outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted">Câmera</label>
          <input
            type="text"
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted">Lentes</label>
          <input
            type="text"
            value={lenses}
            onChange={(e) => setLenses(e.target.value)}
            className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted">Iluminação</label>
          <input
            type="text"
            value={lighting}
            onChange={(e) => setLighting(e.target.value)}
            className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted">Edição</label>
          <input
            type="text"
            value={editing}
            onChange={(e) => setEditing(e.target.value)}
            className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 w-fit border border-accent px-6 py-2 text-accent transition-colors hover:bg-accent hover:text-background disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}