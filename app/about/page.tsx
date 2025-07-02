"use client";

import React, { useState, ChangeEvent } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { IconPlus, IconPencil, IconX } from "@tabler/icons-react";

// -----------------------------
// Typings
// -----------------------------
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

type AcademicRecord = {
  institute: string;
  degree: string;
  year: string;
};

type Skill = {
  name: string;
  level: string;
};

type Experience = {
  company: string;
  role: string;
  duration: string;
};

type Training = {
  title: string;
  institution: string;
  year: string;
};

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: "cv" | "photo" | "other";
}

// -----------------------------
// Helper Components
// -----------------------------
function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl bg-white dark:bg-neutral-900 shadow p-6 space-y-4 animate-fade-in"
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {children}
    </motion.div>
  );
}

function FileCard({
  file,
  onRemove,
}: {
  file: UploadedFile;
  onRemove: () => void;
}) {
  const isImage = file.type === "photo";
  return (
    <div className="relative group border rounded-lg p-3 shadow hover:shadow-lg transition-shadow duration-200">
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={file.url}
          alt={file.name}
          className="h-32 w-full object-cover rounded"
        />
      ) : (
        <div className="h-32 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded text-sm">
          {file.name}
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 rounded-full bg-red-500/90 hover:bg-red-600 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <IconX size={16} />
      </button>
    </div>
  );
}

// -----------------------------
// Main Page Component
// -----------------------------
export default function AboutPage() {
  // State management
  const [personal, setPersonal] = useState<PersonalInfo>({
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+8801XXXXXXXXX",
    address: "Dhaka, Bangladesh",
  });

  const [academics, setAcademics] = useState<AcademicRecord[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  // Upload dialog state
  const [uploadDialog, setUploadDialog] = useState<{
    open: boolean;
    type: UploadedFile["type"] | null;
    fileName: string;
    file: File | null;
  }>({
    open: false,
    type: null,
    fileName: "",
    file: null,
  });

  // Handle file selection
  function handleFileSelect(
    e: ChangeEvent<HTMLInputElement>,
    type: UploadedFile["type"],
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set the dialog state with the selected file
    setUploadDialog({
      open: true,
      type,
      fileName: file.name.replace(/\.[^/.]+$/, ""), // Remove extension from filename
      file,
    });

    // Reset the input value to allow selecting the same file again
    e.target.value = "";
  }

  // Handle file upload confirmation
  function handleUpload() {
    if (!uploadDialog.file || !uploadDialog.type) return;

    const url = URL.createObjectURL(uploadDialog.file);
    const fileName = uploadDialog.fileName.trim() || uploadDialog.file.name;

    setFiles((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: fileName,
        url,
        type: uploadDialog.type as UploadedFile["type"],
      },
    ]);

    // Close the dialog
    setUploadDialog({ open: false, type: null, fileName: "", file: null });
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  // Personal info dialog controls
  const [openPersonalDialog, setOpenPersonalDialog] = useState(false);
  const [personalDraft, setPersonalDraft] = useState<PersonalInfo>(personal);

  function savePersonal() {
    setPersonal(personalDraft);
    setOpenPersonalDialog(false);
  }

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-8 text-center">User Dashboard</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex justify-center gap-4 mb-6">
          <TabsTrigger
            value="overview"
            className="px-4 py-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="files"
            className="px-4 py-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Files
          </TabsTrigger>
        </TabsList>

        {/* ---------------- Overview Tab ---------------- */}
        <TabsContent value="overview" asChild>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Personal Info */}
            <SectionCard title="Personal Information">
              <p>
                <span className="font-medium">Name:</span> {personal.fullName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {personal.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {personal.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span> {personal.address}
              </p>
              <button
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                onClick={() => {
                  setPersonalDraft(personal);
                  setOpenPersonalDialog(true);
                }}
              >
                <IconPencil size={16} /> Edit
              </button>
            </SectionCard>

            {/* Academic */}
            <SectionCard title="Academic Information">
              {academics.length === 0 && (
                <p className="text-sm text-neutral-500">No records yet.</p>
              )}
              {academics.map((a, idx) => (
                <div key={idx} className="mb-2">
                  <p className="font-medium">
                    {a.degree} ({a.year})
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {a.institute}
                  </p>
                </div>
              ))}
              {/* Add functionality */}
              {/* ... */}
            </SectionCard>

            {/* Skills */}
            <SectionCard title="Skills">
              {skills.length === 0 && (
                <p className="text-sm text-neutral-500">No skills yet.</p>
              )}
              <ul className="flex flex-wrap gap-2">
                {skills.map((s, idx) => (
                  <li
                    key={idx}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs"
                  >
                    {s.name} - {s.level}
                  </li>
                ))}
              </ul>
            </SectionCard>

            {/* Experience */}
            <SectionCard title="Experience">
              {experiences.length === 0 && (
                <p className="text-sm text-neutral-500">No experience yet.</p>
              )}
              {experiences.map((e, idx) => (
                <div key={idx} className="mb-2">
                  <p className="font-medium">
                    {e.company} - {e.role}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {e.duration}
                  </p>
                </div>
              ))}
            </SectionCard>

            {/* Training */}
            <SectionCard title="Training Experience">
              {trainings.length === 0 && (
                <p className="text-sm text-neutral-500">No training yet.</p>
              )}
              {trainings.map((t, idx) => (
                <div key={idx} className="mb-2">
                  <p className="font-medium">
                    {t.title} ({t.year})
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {t.institution}
                  </p>
                </div>
              ))}
            </SectionCard>
          </div>
        </TabsContent>

        {/* ---------------- Files Tab ---------------- */}
        <TabsContent value="files" asChild>
          <div className="md:flex md:gap-8">
            {/* ---------------- Upload Column ---------------- */}
            <div className="md:w-1/3 space-y-6 mb-8 md:mb-0">
              <h2 className="text-lg font-semibold">Upload Files</h2>
              <div className="flex flex-col gap-4">
                {[
                  {
                    label: "Add CV",
                    type: "cv" as const,
                    accept: ".pdf,.doc,.docx",
                  },
                  {
                    label: "Add Photo",
                    type: "photo" as const,
                    accept: "image/*",
                  },
                  {
                    label: "Add Other File",
                    type: "other" as const,
                    accept: "*",
                  },
                ].map((input) => (
                  <label
                    key={input.label}
                    className="flex flex-col justify-center items-center h-36 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <IconPlus className="text-primary" />
                    <span className="mt-2 text-sm">{input.label}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, input.type)}
                      accept={input.accept}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* ---------------- Files Display Column ---------------- */}
            <div className="md:w-2/3 space-y-10">
              {/* CV Files */}
              <div>
                <h3 className="text-lg font-semibold mb-4">CV Files</h3>
                {files.filter((f) => f.type === "cv").length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    No CV files uploaded.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files
                      .filter((f) => f.type === "cv")
                      .map((f) => (
                        <FileCard
                          key={f.id}
                          file={f}
                          onRemove={() => removeFile(f.id)}
                        />
                      ))}
                  </div>
                )}
              </div>

              {/* Image Files */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Image Files</h3>
                {files.filter((f) => f.type === "photo").length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    No images uploaded.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files
                      .filter((f) => f.type === "photo")
                      .map((f) => (
                        <FileCard
                          key={f.id}
                          file={f}
                          onRemove={() => removeFile(f.id)}
                        />
                      ))}
                  </div>
                )}
              </div>

              {/* Other Files */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Other Files</h3>
                {files.filter((f) => f.type === "other").length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    No other files uploaded.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files
                      .filter((f) => f.type === "other")
                      .map((f) => (
                        <FileCard
                          key={f.id}
                          file={f}
                          onRemove={() => removeFile(f.id)}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ---------------- Personal Info Dialog ---------------- */}
      <Dialog.Root
        open={openPersonalDialog}
        onOpenChange={setOpenPersonalDialog}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 animate-fade-in" />
          <Dialog.Content asChild>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-[90vw] max-w-md p-6 space-y-4"
            >
              <Dialog.Title className="text-lg font-semibold">
                Edit Personal Information
              </Dialog.Title>
              <div className="space-y-3">
                {(
                  [
                    { label: "Full Name", key: "fullName" },
                    { label: "Email", key: "email" },
                    { label: "Phone", key: "phone" },
                    { label: "Address", key: "address" },
                  ] as const
                ).map(({ label, key }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-sm font-medium">{label}</label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-neutral-800"
                      value={personalDraft[key] as string}
                      onChange={(e) =>
                        setPersonalDraft({
                          ...personalDraft,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Dialog.Close asChild>
                  <button
                    className="px-4 py-2 rounded-md border"
                    onClick={() => setOpenPersonalDialog(false)}
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  className="px-4 py-2 rounded-md bg-primary text-white"
                  onClick={savePersonal}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ---------------- Upload File Dialog ---------------- */}
      <Dialog.Root
        open={uploadDialog.open}
        onOpenChange={(open) =>
          !open &&
          setUploadDialog({ open: false, type: null, fileName: "", file: null })
        }
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 animate-fade-in" />
          <Dialog.Content asChild>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-[90vw] max-w-md p-6 space-y-4"
            >
              <Dialog.Title className="text-lg font-semibold">
                {uploadDialog.type === "cv" && "Upload CV"}
                {uploadDialog.type === "photo" && "Upload Photo"}
                {uploadDialog.type === "other" && "Upload File"}
              </Dialog.Title>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    File Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-neutral-800"
                    value={uploadDialog.fileName}
                    onChange={(e) =>
                      setUploadDialog((prev) => ({
                        ...prev,
                        fileName: e.target.value,
                      }))
                    }
                    placeholder="Enter a name for the file"
                  />
                </div>

                {uploadDialog.file && (
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md">
                    <p className="text-sm font-medium">Selected File:</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 truncate">
                      {uploadDialog.file.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {(uploadDialog.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Dialog.Close asChild>
                  <button
                    className="px-4 py-2 rounded-md border"
                    onClick={() =>
                      setUploadDialog({
                        open: false,
                        type: null,
                        fileName: "",
                        file: null,
                      })
                    }
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  className="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-50"
                  onClick={handleUpload}
                  disabled={!uploadDialog.fileName.trim()}
                >
                  Upload
                </button>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// Tailwind CSS custom primary color via className `bg-primary` etc.
// Ensure you have configured tailwind.config.js theme.extend.colors.primary as desired.
