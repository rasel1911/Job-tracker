"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Select from "@/components/about/ui/select";
import { Plus, Pencil, X, Award } from "lucide-react";
import Input from "@/components/about/ui/input";

interface Skill {
  id: string;
  userId?: string;
  name: string;
  proficiency?: string; // e.g., Beginner, Intermediate, Expert
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

// Skills Component
interface SkillsSectionProps {
  skills: Skill[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-red-100 text-red-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-blue-100 text-blue-800";
      case "Expert":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SectionCard
      title="Skills"
      icon={<Award className="w-5 h-5 text-purple-600" />}
      action={
        <Button variant="secondary" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      }
    >
      {skills.length === 0 ? (
        <p className="text-gray-500 text-sm">No skills added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white dark:bg-gray-700 shadow-sm"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {skill.name}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSkillLevelColor(
                  skill.proficiency || "",
                )}`}
              >
                {skill.proficiency}
              </span>
              <div className="hidden group-hover:flex absolute -top-1 -right-1 gap-1">
                <button
                  onClick={() => skill.id && onEdit(skill.id)}
                  className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => skill.id && onDelete(skill.id)}
                  className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
};
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

export default function Skill() {
  const [skills, setSkills] = useState<Skill[]>([]); // Start with empty array
  const [skillModal, setSkillModal] = useState(false);
  const [skillForm, setSkillForm] = useState<Skill>({
    id: "",
    name: "",
    proficiency: "",
  });

  // Fetch skills on mount
  useEffect(() => {
    fetch(`/api/skills`)
      .then((res) => res.json())
      .then((data) => setSkills(Array.isArray(data) ? data : []));
  }, []);

  // Skill CRUD
  const handleSkillSave = async () => {
    if (skillForm.id) {
      // Edit
      const res = await fetch("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillForm),
      });
      const updated = await res.json();
      setSkills((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } else {
      // Create
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: skillForm.name,
          proficiency: skillForm.proficiency,
        }),
      });
      const created = await res.json();
      setSkills((prev) => [...prev, created]);
    }
    setSkillForm({ id: "", name: "", proficiency: "" });
    setSkillModal(false);
  };

  const handleSkillDelete = async (id: string) => {
    await fetch("/api/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <>
      <SkillsSection
        skills={skills}
        onAdd={() => {
          setSkillForm({ id: "", name: "", proficiency: "" });
          setSkillModal(true);
        }}
        onEdit={(id) => {
          const skill = skills.find((s) => s.id === id);
          if (skill) {
            setSkillForm(skill);
            setSkillModal(true);
          }
        }}
        onDelete={handleSkillDelete}
      />
      <Modal
        isOpen={skillModal}
        onClose={() => setSkillModal(false)}
        title={skillForm.id ? "Edit Skill" : "Add Skill"}
      >
        <div className="space-y-4">
          <Input
            label="Skill Name"
            value={skillForm.name}
            onChange={(value) =>
              setSkillForm((prev) => ({ ...prev, name: value }))
            }
            required
          />
          <Select
            label="Proficiency"
            value={skillForm.proficiency || ""}
            onChange={(value) =>
              setSkillForm((prev) => ({
                ...prev,
                proficiency: value as Skill["proficiency"],
              }))
            }
            options={[
              { value: "Beginner", label: "Beginner" },
              { value: "Intermediate", label: "Intermediate" },
              { value: "Advanced", label: "Advanced" },
              { value: "Expert", label: "Expert" },
            ]}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setSkillModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSkillSave}>
              {skillForm.id ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
