"use client";

// components/UploadForm.tsx
export default function UploadForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const publicUrl = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });
    console.log(publicUrl);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        name="file"
        accept="image/*,application/pdf"
        required
      />
      <button type="submit">Upload</button>
    </form>
  );
}
