import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RepairRequest,
  Component,
  ApiResponse,
  PaginatedResponse,
} from "@/lib/types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("authToken");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Authentication
  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem("authToken", this.token);
    }

    return response;
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  // Repair Requests
  async getRepairRequests(
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<PaginatedResponse<RepairRequest>>> {
    return this.request<PaginatedResponse<RepairRequest>>(
      `/repair-requests?page=${page}&limit=${limit}`,
    );
  }

  async getRepairRequest(id: string): Promise<ApiResponse<RepairRequest>> {
    return this.request<RepairRequest>(`/repair-requests/${id}`);
  }

  async createRepairRequest(
    data: Partial<RepairRequest>,
  ): Promise<ApiResponse<RepairRequest>> {
    return this.request<RepairRequest>("/repair-requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRepairRequest(
    id: string,
    data: Partial<RepairRequest>,
  ): Promise<ApiResponse<RepairRequest>> {
    return this.request<RepairRequest>(`/repair-requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRepairRequest(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/repair-requests/${id}`, {
      method: "DELETE",
    });
  }

  // Components
  async getComponents(
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<PaginatedResponse<Component>>> {
    return this.request<PaginatedResponse<Component>>(
      `/components?page=${page}&limit=${limit}`,
    );
  }

  async getComponent(id: string): Promise<ApiResponse<Component>> {
    return this.request<Component>(`/components/${id}`);
  }

  async createComponent(
    data: Partial<Component>,
  ): Promise<ApiResponse<Component>> {
    return this.request<Component>("/components", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateComponent(
    id: string,
    data: Partial<Component>,
  ): Promise<ApiResponse<Component>> {
    return this.request<Component>(`/components/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteComponent(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/components/${id}`, {
      method: "DELETE",
    });
  }

  // File Upload
  async uploadFile(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<{ url: string }>("/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
}

export const apiService = new ApiService();
