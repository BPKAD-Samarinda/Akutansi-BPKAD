import axios from "axios";
import { Document } from "../types";

// Impor ikon dipindahkan dari file service ini.
// Komponen yang menampilkan data akan bertanggung jawab untuk menampilkan ikon.

/**
 * Mendefinisikan tipe data untuk respons login yang berhasil.
 */
export interface LoginResponse {
  message: string;
  token: string;
}

// Membuat instance axios dengan URL dasar yang sudah ditentukan untuk backend kita.
const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
});

/**
 * Mengekspor fungsi untuk mengambil data dokumen dari backend.
 * @returns Promise yang akan resolve dengan array of Document.
 */
export const getDocuments = async (): Promise<Document[]> => {
  try {
    const response = await apiClient.get("/documents");

    return response.data.map((item: any) => ({
      id: item.id,
      nama_sppd: item.nama_sppd,
      tanggal_sppd: item.tanggal_sppd,
      kategori: item.kategori,
      file_path: item.file_path,
      created_at: item.created_at,
    }));
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data dokumen:", error);
    return [];
  }
};

/**
 * Mengirim permintaan login ke backend.
 * @param username Nama pengguna.
 * @param password Kata sandi pengguna.
 * @returns Promise yang resolve dengan data LoginResponse.
 */
export const login = async (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Lemparkan kembali error dengan pesan dari backend agar bisa ditangkap di komponen
      throw new Error(
        error.response.data.message || "Terjadi kesalahan saat mencoba login.",
      );
    }
    // Untuk error lainnya yang tidak terduga
    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};
