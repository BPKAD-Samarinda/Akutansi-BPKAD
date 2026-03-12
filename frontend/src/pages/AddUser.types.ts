export type UserRole =
  | "Admin"
  | "Staff"
  | "Anak Magang"
  | "Anak PKL";

export type AddUserFormValues = {
  username: string;
  password: string;
  role: UserRole;
};

export type UserItem = {
  id: number;
  username: string;
  role: UserRole;
  createdAt: string;
};
