"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Category,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api";

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    const { categories } = await getAdminCategories();
    setCategories(categories);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setName(category.name);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (editingId) {
        await updateCategory(editingId, name);
      } else {
        await createCategory(name);
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar a categoria.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Excluir essa categoria? As fotos dela também serão excluídas.")) return;
    await deleteCategory(id);
    await loadData();
  }

  return (
    <div className="flex flex-col gap-16">
      <section>
        <h1 className="font-display text-3xl italic">
          {editingId ? "Editar categoria" : "Nova categoria"}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 flex max-w-sm items-end gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm text-muted">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-b border-border bg-transparent py-2 outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="border border-accent px-5 py-2 text-accent transition-colors hover:bg-accent hover:text-background disabled:opacity-50"
          >
            {saving ? "Salvando..." : editingId ? "Salvar" : "Criar"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-border px-5 py-2 text-muted transition-colors hover:text-foreground"
            >
              Cancelar
            </button>
          )}
        </form>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </section>

      <section>
        <h2 className="font-display text-2xl italic">Categorias</h2>

        {loading ? (
          <p className="mt-6 text-muted">Carregando...</p>
        ) : categories.length === 0 ? (
          <p className="mt-6 text-muted">Nenhuma categoria cadastrada ainda.</p>
        ) : (
          <ul className="mt-6 flex max-w-sm flex-col divide-y divide-border">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between py-3">
                <span>{category.name}</span>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => startEdit(category)}
                    className="text-accent hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-400 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}