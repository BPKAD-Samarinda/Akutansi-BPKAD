export type UserRole = "Admin Akuntansi" | "Staff Akuntansi";

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
