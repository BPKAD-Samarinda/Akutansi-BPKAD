import AddUserForm from "./AddUserForm";
import type { AddUserFormValues } from "../../hooks/add-user/types";

type AddUserModalProps = {
  isOpen: boolean;
  form: AddUserFormValues;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onRoleChange: (value: AddUserFormValues["role"]) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function AddUserModal({
  isOpen,
  form,
  onChange,
  onRoleChange,
  onSubmit,
  onClose,
}: AddUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg">
        <AddUserForm
          form={form}
          onChange={onChange}
          onRoleChange={onRoleChange}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
