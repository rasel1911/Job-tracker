"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, X, Briefcase } from "lucide-react";
import Input from "@/components/about/ui/input";

interface Experience {
  id?: string;
  userId?: number;
  company: string;
  title: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  description?: string;
}

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  children,
  action,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      {action}
    </div>
    {children}
  </motion.div>
);
// Experience Component
interface ExperienceSectionProps {
  experiences: Experience[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  onAdd,
  onEdit,
  onDelete,
}) => (
  <SectionCard
    title="Work Experience"
    icon={<Briefcase className="w-5 h-5 text-orange-600" />}
    action={
      <Button variant="secondary" size="sm" onClick={onAdd}>
        <Plus className="w-4 h-4 mr-1" />
        Add
      </Button>
    }
  >
    {experiences.length === 0 ? (
      <p className="text-gray-500 text-sm">No work experience added yet.</p>
    ) : (
      <div className="space-y-3">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {exp.title} at {exp.company}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {exp.startDate} - {exp.endDate}
              </p>
              {exp.description && (
                <p className="text-sm text-gray-500 mt-1">{exp.description}</p>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => exp.id && onEdit(exp.id)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => exp.id && onDelete(exp.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </SectionCard>
);

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [experienceModal, setExperienceModal] = useState(false);
  const [experienceForm, setExperienceForm] = useState<Experience>({
    id: "",
    company: "",
    title: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  // Experience CRUD
  const handleExperienceSave = async () => {
    const userId = 1; // Replace with actual userId logic
    if (!userId) return;
    if (experienceForm.id) {
      const res = await fetch("/api/experiences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...experienceForm,
          id: experienceForm.id,
          userId,
        }),
      });
      const updated = await res.json();
      setExperiences((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } else {
      const res = await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...experienceForm, userId }),
      });
      const created = await res.json();
      setExperiences((prev) => [...prev, created]);
    }
    setExperienceForm({
      id: "",
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setExperienceModal(false);
  };

  const handleExperienceDelete = async (id: string) => {
    await fetch("/api/experiences", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };
  return (
    <>
      <ExperienceSection
        experiences={experiences}
        onAdd={() => {
          setExperienceForm({
            id: "",
            company: "",
            title: "",
            startDate: "",
            endDate: "",
            description: "",
          });
          setExperienceModal(true);
        }}
        onEdit={(id) => {
          const exp = experiences.find((e) => e.id === id);
          if (exp) {
            setExperienceForm(exp);
            setExperienceModal(true);
          }
        }}
        onDelete={handleExperienceDelete}
      />

      <Modal
        isOpen={experienceModal}
        onClose={() => setExperienceModal(false)}
        title={experienceForm.id ? "Edit Experience" : "Add Experience"}
      >
        <div className="space-y-4">
          <Input
            label="Company"
            value={experienceForm.company}
            onChange={(value) =>
              setExperienceForm((prev) => ({ ...prev, company: value }))
            }
            required
          />
          <Input
            label="Title"
            value={experienceForm.title}
            onChange={(value) =>
              setExperienceForm((prev) => ({ ...prev, title: value }))
            }
            required
          />
          <Input
            label="Start Date"
            type="date"
            value={experienceForm.startDate}
            onChange={(value) =>
              setExperienceForm((prev) => ({ ...prev, startDate: value }))
            }
            required
          />
          <Input
            label="End Date"
            type="date"
            value={experienceForm.endDate}
            onChange={(value) =>
              setExperienceForm((prev) => ({ ...prev, endDate: value }))
            }
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              rows={3}
              value={experienceForm.description || ""}
              onChange={(e) =>
                setExperienceForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description of your role and achievements"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setExperienceModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleExperienceSave}>
              {experienceForm.id ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
