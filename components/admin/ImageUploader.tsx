"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Upload failed");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Could not reach the server");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Image</label>

      {value && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-black/10 mb-2">
          <Image src={value} alt="Preview" fill className="object-cover" />
        </div>
      )}

      <label className="flex items-center justify-center gap-2 border border-dashed border-black/20 rounded-lg py-3 text-sm text-zinc-600 hover:border-primary/40 hover:text-primary cursor-pointer transition-colors">
        {uploading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={16} />
            {value ? "Replace image" : "Upload image"}
          </>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
      </label>

      {error && <p className="text-sm text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}