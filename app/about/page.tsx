"use client";
import React, { useState, useCallback, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  X,
  Upload,
  User,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
} from "lucide-react";

// -----------------------------
// Types
// -----------------------------
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface AcademicRecord {
  id: string;
  institute: string;
  degree: string;
  year: string;
  gpa?: string;
}

interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description?: string;
}

interface Training {
  id: string;
  title: string;
  institution: string;
  year: string;
  duration?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: "cv" | "photo" | "other";
  size: number;
  uploadDate: Date;
}

// -----------------------------
// Utility Functions
// -----------------------------
const generateId = () => crypto.randomUUID();

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// -----------------------------
// UI Components
// -----------------------------
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      <option value="">Select...</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// -----------------------------
// Section Components
// -----------------------------
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

// Personal Information Component
interface PersonalInfoSectionProps {
  personal: PersonalInfo;
  onEdit: () => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  personal,
  onEdit,
}) => (
  <SectionCard
    title="Personal Information"
    icon={<User className="w-5 h-5 text-blue-600" />}
    action={
      <Button variant="secondary" size="sm" onClick={onEdit}>
        <Pencil className="w-4 h-4 mr-1" />
        Edit
      </Button>
    }
  >
    <div className="grid grid-cols-1 gap-3">
      <div>
        <span className="font-medium text-gray-600 dark:text-gray-400">
          Name:
        </span>
        <span className="ml-2 text-gray-900 dark:text-white">
          {personal.fullName}
        </span>
      </div>
      <div>
        <span className="font-medium text-gray-600 dark:text-gray-400">
          Email:
        </span>
        <span className="ml-2 text-gray-900 dark:text-white">
          {personal.email}
        </span>
      </div>
      <div>
        <span className="font-medium text-gray-600 dark:text-gray-400">
          Phone:
        </span>
        <span className="ml-2 text-gray-900 dark:text-white">
          {personal.phone}
        </span>
      </div>
      <div>
        <span className="font-medium text-gray-600 dark:text-gray-400">
          Address:
        </span>
        <span className="ml-2 text-gray-900 dark:text-white">
          {personal.address}
        </span>
      </div>
    </div>
  </SectionCard>
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
                {record.degree} ({record.year})
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {record.institute}
              </p>
              {record.gpa && (
                <p className="text-sm text-gray-500">GPA: {record.gpa}</p>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(record.id)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(record.id)}
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
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}
              >
                {skill.level}
              </span>
              <div className="hidden group-hover:flex absolute -top-1 -right-1 gap-1">
                <button
                  onClick={() => onEdit(skill.id)}
                  className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDelete(skill.id)}
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
                {exp.role} at {exp.company}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {exp.duration}
              </p>
              {exp.description && (
                <p className="text-sm text-gray-500 mt-1">{exp.description}</p>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(exp.id)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(exp.id)}
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

// File Upload Component
interface FileUploadProps {
  onFileSelect: (file: File, type: UploadedFile["type"]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: UploadedFile["type"],
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file, type);
      e.target.value = ""; // Reset input
    }
  };

  const uploadOptions = [
    {
      label: "Upload CV",
      type: "cv" as const,
      accept: ".pdf,.doc,.docx",
      icon: FileText,
    },
    {
      label: "Upload Photo",
      type: "photo" as const,
      accept: "image/*",
      icon: User,
    },
    {
      label: "Upload Other",
      type: "other" as const,
      accept: "*",
      icon: Upload,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Upload Files
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {uploadOptions.map((option) => {
          const Icon = option.icon;
          return (
            <label
              key={option.type}
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
            >
              <Icon className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {option.label}
              </span>
              <input
                type="file"
                className="hidden"
                accept={option.accept}
                onChange={(e) => handleFileChange(e, option.type)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};

// File Display Component
interface FileDisplayProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ files, onRemove }) => {
  const fileCategories = [
    {
      type: "cv" as const,
      title: "CV Files",
      files: files.filter((f) => f.type === "cv"),
    },
    {
      type: "photo" as const,
      title: "Photos",
      files: files.filter((f) => f.type === "photo"),
    },
    {
      type: "other" as const,
      title: "Other Files",
      files: files.filter((f) => f.type === "other"),
    },
  ];

  return (
    <div className="space-y-6">
      {fileCategories.map((category) => (
        <div key={category.type}>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            {category.title} ({category.files.length})
          </h4>
          {category.files.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No {category.title.toLowerCase()} uploaded.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.files.map((file) => (
                <div
                  key={file.id}
                  className="relative group border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  {file.type === "photo" ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md mb-2">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} •{" "}
                      {formatDate(file.uploadDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(file.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
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

// Tab Component
interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{ id: string; label: string; icon: React.ReactNode }>;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange, tabs }) => (
  <div className="flex justify-center mb-8">
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

// -----------------------------
// Main Dashboard Component
// -----------------------------
export default function UserDashboard() {
  // State
  const [activeTab, setActiveTab] = useState("overview");
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

  // Modal states
  const [personalModal, setPersonalModal] = useState(false);
  const [academicModal, setAcademicModal] = useState(false);
  const [skillModal, setSkillModal] = useState(false);
  const [experienceModal, setExperienceModal] = useState(false);
  const [fileModal, setFileModal] = useState<{
    open: boolean;
    file: File | null;
    type: UploadedFile["type"] | null;
    name: string;
  }>({ open: false, file: null, type: null, name: "" });

  // Form states
  const [personalForm, setPersonalForm] = useState<PersonalInfo>(personal);
  const [academicForm, setAcademicForm] = useState<AcademicRecord>({
    id: "",
    institute: "",
    degree: "",
    year: "",
    gpa: "",
  });
  const [skillForm, setSkillForm] = useState<Skill>({
    id: "",
    name: "",
    level: "Beginner",
  });
  const [experienceForm, setExperienceForm] = useState<Experience>({
    id: "",
    company: "",
    role: "",
    duration: "",
    description: "",
  });

  // Handlers
  const handlePersonalSave = () => {
    setPersonal(personalForm);
    setPersonalModal(false);
  };

  const handleAcademicSave = () => {
    if (academicForm.id) {
      setAcademics((prev) =>
        prev.map((item) => (item.id === academicForm.id ? academicForm : item)),
      );
    } else {
      setAcademics((prev) => [...prev, { ...academicForm, id: generateId() }]);
    }
    setAcademicForm({ id: "", institute: "", degree: "", year: "", gpa: "" });
    setAcademicModal(false);
  };

  const handleSkillSave = () => {
    if (skillForm.id) {
      setSkills((prev) =>
        prev.map((item) => (item.id === skillForm.id ? skillForm : item)),
      );
    } else {
      setSkills((prev) => [...prev, { ...skillForm, id: generateId() }]);
    }
    setSkillForm({ id: "", name: "", level: "Beginner" });
    setSkillModal(false);
  };

  const handleExperienceSave = () => {
    if (experienceForm.id) {
      setExperiences((prev) =>
        prev.map((item) =>
          item.id === experienceForm.id ? experienceForm : item,
        ),
      );
    } else {
      setExperiences((prev) => [
        ...prev,
        { ...experienceForm, id: generateId() },
      ]);
    }
    setExperienceForm({
      id: "",
      company: "",
      role: "",
      duration: "",
      description: "",
    });
    setExperienceModal(false);
  };

  const handleFileSelect = useCallback(
    (file: File, type: UploadedFile["type"]) => {
      setFileModal({
        open: true,
        file,
        type,
        name: file.name.replace(/\.[^/.]+$/, ""),
      });
    },
    [],
  );

  const handleFileUpload = () => {
    if (!fileModal.file || !fileModal.type) return;

    const newFile: UploadedFile = {
      id: generateId(),
      name: fileModal.name.trim() || fileModal.file.name,
      url: URL.createObjectURL(fileModal.file),
      type: fileModal.type,
      size: fileModal.file.size,
      uploadDate: new Date(),
    };

    setFiles((prev) => [...prev, newFile]);
    setFileModal({ open: false, file: null, type: null, name: "" });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <User className="w-4 h-4" /> },
    { id: "files", label: "Files", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your profile and documents
          </p>
        </motion.div>

        <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <PersonalInfoSection
              personal={personal}
              onEdit={() => {
                setPersonalForm(personal);
                setPersonalModal(true);
              }}
            />

            <AcademicSection
              academics={academics}
              onAdd={() => {
                setAcademicForm({
                  id: "",
                  institute: "",
                  degree: "",
                  year: "",
                  gpa: "",
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
              onDelete={(id) =>
                setAcademics((prev) => prev.filter((a) => a.id !== id))
              }
            />

            <SkillsSection
              skills={skills}
              onAdd={() => {
                setSkillForm({ id: "", name: "", level: "Beginner" });
                setSkillModal(true);
              }}
              onEdit={(id) => {
                const skill = skills.find((s) => s.id === id);
                if (skill) {
                  setSkillForm(skill);
                  setSkillModal(true);
                }
              }}
              onDelete={(id) =>
                setSkills((prev) => prev.filter((s) => s.id !== id))
              }
            />

            <ExperienceSection
              experiences={experiences}
              onAdd={() => {
                setExperienceForm({
                  id: "",
                  company: "",
                  role: "",
                  duration: "",
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
              onDelete={(id) =>
                setExperiences((prev) => prev.filter((e) => e.id !== id))
              }
            />
          </motion.div>
        )}

        {activeTab === "files" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <FileUpload onFileSelect={handleFileSelect} />
            <FileDisplay
              files={files}
              onRemove={(id) =>
                setFiles((prev) => prev.filter((f) => f.id !== id))
              }
            />
          </motion.div>
        )}

        {/* Modals */}
        <Modal
          isOpen={personalModal}
          onClose={() => setPersonalModal(false)}
          title="Edit Personal Information"
        >
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={personalForm.fullName}
              onChange={(value) =>
                setPersonalForm((prev) => ({ ...prev, fullName: value }))
              }
              required
            />
            <Input
              label="Email"
              type="email"
              value={personalForm.email}
              onChange={(value) =>
                setPersonalForm((prev) => ({ ...prev, email: value }))
              }
              required
            />
            <Input
              label="Phone"
              value={personalForm.phone}
              onChange={(value) =>
                setPersonalForm((prev) => ({ ...prev, phone: value }))
              }
              required
            />
            <Input
              label="Address"
              value={personalForm.address}
              onChange={(value) =>
                setPersonalForm((prev) => ({ ...prev, address: value }))
              }
              required
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setPersonalModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handlePersonalSave}>Save</Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={academicModal}
          onClose={() => setAcademicModal(false)}
          title={
            academicForm.id ? "Edit Academic Record" : "Add Academic Record"
          }
        >
          <div className="space-y-4">
            <Input
              label="Institution"
              value={academicForm.institute}
              onChange={(value) =>
                setAcademicForm((prev) => ({ ...prev, institute: value }))
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
              label="Year"
              value={academicForm.year}
              onChange={(value) =>
                setAcademicForm((prev) => ({ ...prev, year: value }))
              }
              required
            />
            <Input
              label="GPA (Optional)"
              value={academicForm.gpa || ""}
              onChange={(value) =>
                setAcademicForm((prev) => ({ ...prev, gpa: value }))
              }
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setAcademicModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAcademicSave}>
                {academicForm.id ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </Modal>

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
              label="Level"
              value={skillForm.level}
              onChange={(value) =>
                setSkillForm((prev) => ({
                  ...prev,
                  level: value as Skill["level"],
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
              label="Role"
              value={experienceForm.role}
              onChange={(value) =>
                setExperienceForm((prev) => ({ ...prev, role: value }))
              }
              required
            />
            <Input
              label="Duration"
              value={experienceForm.duration}
              onChange={(value) =>
                setExperienceForm((prev) => ({ ...prev, duration: value }))
              }
              placeholder="e.g., Jan 2020 - Dec 2022"
              required
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

        <Modal
          isOpen={fileModal.open}
          onClose={() =>
            setFileModal({ open: false, file: null, type: null, name: "" })
          }
          title={`Upload ${fileModal.type === "cv" ? "CV" : fileModal.type === "photo" ? "Photo" : "File"}`}
        >
          <div className="space-y-4">
            <Input
              label="File Name"
              value={fileModal.name}
              onChange={(value) =>
                setFileModal((prev) => ({ ...prev, name: value }))
              }
              placeholder="Enter a name for the file"
              required
            />
            {fileModal.file && (
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Selected File:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {fileModal.file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(fileModal.file.size)}
                </p>
              </div>
            )}
            <select>
              <option value="cv">CV</option>
              <option value="photo">Photo</option>
              <option value="file">File</option>
            </select>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() =>
                  setFileModal({
                    open: false,
                    file: null,
                    type: null,
                    name: "",
                  })
                }
              >
                Cancel
              </Button>
              <Button
                onClick={handleFileUpload}
                disabled={!fileModal.name.trim()}
              >
                Upload
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
