// types are generated automatically if we use an ORM such as Prisma.

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  contact: string;
  user_role: string;
  address: string;
  image_url: string;
  created_at: string;
};

export type Revenue = {
  month: string;
  revenue: number;
  year: number;
};

export type UserTable = {
  id: string;
  name: string;
  email: string;
  contact: number;
  user_role: string;
  address: string;
  image_url: string;
};

export type BranchesTable = {
  id: string;
  branch_name: string;
  address: string;
  manager: {
    id: string;
    name: string;
    email: string;
    contact: string;
    user_role: string;
    image_url: string;
    created_at: string;
  };
};

export type OfficeForm = {
  id: string;
  office_name: string;
  address: string;
  manager: string;
  contact: string;
  bin: string;
};






