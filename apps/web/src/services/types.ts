export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type Role = "ADMIN" | "GESTOR" | "DIRETOR";
export type SchoolType = "URBAN" | "RURAL" | "INDIGENOUS" | "QUILOMBOLA";
export type ClassShift = "MORNING" | "AFTERNOON" | "NIGHT" | "FULL_TIME";

export interface School {
  id: string;
  name: string;
  inep: string;
  type: SchoolType;
  location: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Student {
  id: string;
  name: string;
  registration: string;
  cpf?: string;
  rg?: string;
  birthDate: string; // Component expects string
  gender?: string;
  motherName: string;
  fatherName?: string;
  address?: string;
  phone?: string;
  schoolId: string;
  school?: {
    id: string;
    name: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Teacher {
  id: string;
  name: string;
  registration: string;
  email?: string | null;
  phone?: string | null;
  schoolId: string;
  school?: {
    name: string;
  };
  userId?: string | null;
  user?: {
    email: string;
    role: Role;
  } | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  shift: ClassShift;
  year: number;
  capacity: number;
  schoolId: string;
  school?: {
    name: string;
  };
  studentCount?: number;
  vacancies?: number;
  students?: {
    student: Student;
  }[];
  teachers?: {
    teacher: Teacher;
    role?: string;
  }[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
