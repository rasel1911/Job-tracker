"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pencil, X, User } from "lucide-react";
import Input from "@/components/about/ui/input";
import Academic from "./academic";
import Skill from "./skill";
import Experience from "./experience";

// -----------------------------
// Types
// -----------------------------
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
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

export default function PersonalInfo() {
  const [personal, setPersonal] = useState<PersonalInfo>({
    fullName: "sheikh rasel",
    email: "sheikh.rasel@email.com",
    phone: "+01910600634",
    address: "Dhaka, Bangladesh",
  });
  const [personalModal, setPersonalModal] = useState(false);
  // Form states
  const [personalForm, setPersonalForm] = useState<PersonalInfo>(personal);
  // Handlers
  const handlePersonalSave = () => {
    setPersonal(personalForm);
    setPersonalModal(false);
  };
  return (
    <>
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
        <Academic />
        <Skill />
        <Experience />
      </motion.div>
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
            <Button variant="secondary" onClick={() => setPersonalModal(false)}>
              Cancel
            </Button>
            <Button onClick={handlePersonalSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
