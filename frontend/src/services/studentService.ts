import axios from "axios";
import type { StudentFormData, ApiResponse } from "../types/Student";

const API_URL = `${import.meta.env.VITE_API_URL}/students`;

export const createStudent = async (
  data: StudentFormData,
): Promise<ApiResponse> => {
  const response = await axios.post<ApiResponse>(API_URL, {
    ...data,
    age: Number(data.age),
  });

  return response.data;
};
