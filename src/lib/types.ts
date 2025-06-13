export interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "technician";
}

export interface RepairRequest {
  id: string;
  clientId: string;
  clientName: string;
  deviceType: string;
  deviceModel: string;
  problem: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  estimatedCost?: number;
  photos?: string[];
}

export interface Component {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  minStock: number;
  description: string;
  specifications: Record<string, string>;
}

export type UserRole = "client" | "technician";
