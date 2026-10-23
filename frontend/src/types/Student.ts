export interface StudentFormData {
  name: string;
  email: string;
  age: string;
  course: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  course: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  student?: Student;
}
