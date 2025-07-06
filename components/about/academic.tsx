import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Plus, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Input from "@/components/about/ui/input";

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}

interface AcademicRecord {
  id?: string;
  userId?: string;
  degree: string;
  institution: string;
  subject?: string;
  field?: string;
  startYear?: number;
  endYear?: number;
  grade?: string;
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
// Academic Records Component
interface AcademicSectionProps {
  academics: AcademicRecord[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const AcademicSection: React.FC<AcademicSectionProps> = ({
  academics,
  onAdd,
  onEdit,
  onDelete,
}) => (
  <SectionCard
    title="Academic Information"
    icon={<GraduationCap className="w-5 h-5 text-green-600" />}
    action={
      <Button variant="secondary" size="sm" onClick={onAdd}>
        <Plus className="w-4 h-4 mr-1" />
        Add
      </Button>
    }
  >
    {academics.length === 0 ? (
      <p className="text-gray-500 text-sm">No academic records yet.</p>
    ) : (
      <div className="space-y-3">
        {academics.map((record) => (
          <div
            key={record.id}
            className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {record.degree} ({record.startYear} - {record.endYear})
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {record.institution}
              </p>
              {record.grade && (
                <p className="text-sm text-gray-500">Grade: {record.grade}</p>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => record.id && onEdit(record.id)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => record.id && onDelete(record.id)}
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

export default function Academic() {
  const [academics, setAcademics] = useState<AcademicRecord[]>([]);
  const [academicModal, setAcademicModal] = useState(false);
  const [academicForm, setAcademicForm] = useState<AcademicRecord>({
    id: "",
    degree: "",
    institution: "",
    subject: "",
    field: "",
    startYear: undefined,
    endYear: undefined,
    grade: "",
  });
  const userId = "e2c85be5-379e-4709-b2fd-dd13b1eb0250";
  // Fetch academic records on mount
  React.useEffect(() => {
    if (!userId) return;
    fetch(`/api/academic-records?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setAcademics(data));
  }, [userId]);

  // Academic CRUD
  const handleAcademicSave = async () => {
    if (!userId) return;
    if (academicForm.id) {
      // Edit
      const res = await fetch("/api/academic-records", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...academicForm, id: academicForm.id, userId }),
      });
      const updated = await res.json();
      setAcademics((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } else {
      // Create
      const res = await fetch("/api/academic-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...academicForm, userId }),
      });
      const created = await res.json();
      setAcademics((prev) => [...prev, created]);
    }
    setAcademicForm({
      id: "",
      degree: "",
      institution: "",
      subject: "",
      field: "",
      startYear: undefined,
      endYear: undefined,
      grade: "",
    });
    setAcademicModal(false);
  };

  const handleAcademicDelete = async (id: string) => {
    await fetch("/api/academic-records", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAcademics((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <>
      {/* Render academic information here */}
      <AcademicSection
        academics={academics}
        onAdd={() => {
          setAcademicForm({
            id: "",
            degree: "",
            institution: "",
            subject: "",
            field: "",
            startYear: undefined,
            endYear: undefined,
            grade: "",
          });
          setAcademicModal(true);
        }}
        onEdit={(id) => {
          const record = academics.find((a) => a.id === id);
          if (record) {
            setAcademicForm(record);
            setAcademicModal(true);
          }
        }}
        onDelete={handleAcademicDelete}
      />

      <Modal
        isOpen={academicModal}
        onClose={() => setAcademicModal(false)}
        title={academicForm.id ? "Edit Academic Record" : "Add Academic Record"}
      >
        <div className="space-y-4">
          <Input
            label="Institution"
            value={academicForm.institution}
            onChange={(value) =>
              setAcademicForm((prev) => ({ ...prev, institution: value }))
            }
            required
          />
          <Input
            label="Degree"
            value={academicForm.degree}
            onChange={(value) =>
              setAcademicForm((prev) => ({ ...prev, degree: value }))
            }
            required
          />
          <Input
            label="Subject"
            value={academicForm.subject || ""}
            onChange={(value) =>
              setAcademicForm((prev) => ({ ...prev, subject: value }))
            }
          />
          <Input
            label="Field"
            value={academicForm.field || ""}
            onChange={(value) =>
              setAcademicForm((prev) => ({ ...prev, field: value }))
            }
          />
          <Input
            label="Start Year"
            type="number"
            value={academicForm.startYear?.toString() || ""}
            onChange={(value) =>
              setAcademicForm((prev) => ({ ...prev, startYear: Number(value) }))
            }
            required
          />
          <Input
            label="End Year"
            type="number"
            value={academicForm.endYear?.toString() || ""}
            onChange={(value) =>
              setAcademicForm((prev) => ({ ...prev, endYear: Number(value) }))
            }
            required
          />
          <Input
            label="Grade (Optional)"
            value={academicForm.grade || ""}
            onChange={(value) =>
              setAcademicForm((prev) => ({ ...prev, grade: value }))
            }
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setAcademicModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAcademicSave}>
              {academicForm.id ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
