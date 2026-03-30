import axios from "axios";
import type {PostUsers,CreateProductPayload,CreateRecyclePayload,} from "../types/types";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
});

export async function postUser(data: PostUsers, imageFile?: File): Promise<any> {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await api.post("/authorise/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Regisztrációs hiba:", error);
    throw error;
  }
}
export async function confirmDelivery(
  transactionId: number,
  token: string
): Promise<any> {
  try {
    const response = await api.patch(
      `/transactions/${transactionId}/confirm-delivery`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Átvétel visszaigazolási hiba:", error);
    throw error;
  }
}

export async function getMe(token: string): Promise<any> {
  try {
    const response = await api.get("/authorise/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Aktuális user lekérési hiba:", error);
    throw error;
  }
}

export async function getAllProducts(): Promise<any> {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Termékek lekérési hiba:", error);
    throw error;
  }
}

export async function getMyProducts(token: string): Promise<any> {
  try {
    const response = await api.get("/products/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Saját hirdetések lekérési hiba:", error);
    throw error;
  }
}

export async function createProduct(
  data: CreateProductPayload,
  imageFile: File,
  token: string
): Promise<any> {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("condition", data.condition);
  formData.append("category", data.category);
  formData.append("brand", data.brand);
  formData.append("model", data.model);
  formData.append("price_recoin", String(data.price_recoin));
  formData.append("image", imageFile);

  try {
    const response = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Hirdetés létrehozási hiba:", error);
    throw error;
  }
}

export async function deleteProduct(id: number, token: string): Promise<any> {
  try {
    const response = await api.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Hirdetés törlési hiba:", error);
    throw error;
  }
}

export async function buyProduct(
  data: { product_id: number; shipping_address: string },
  token: string
): Promise<any> {
  try {
    const response = await api.post("/transactions", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Vásárlási hiba:", error);
    throw error;
  }
}

export async function getMyTransactions(token: string): Promise<any> {
  try {
    const response = await api.get("/transactions/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Tranzakciók lekérési hiba:", error);
    throw error;
  }
}

export async function createRecycle(
  data: CreateRecyclePayload,
  token: string,
  imageFile?: File
): Promise<any> {
  const formData = new FormData();

  formData.append("product_type", data.product_type);
  formData.append("condition", data.condition);
  formData.append("category", data.category);
  formData.append("brand", data.brand);
  formData.append("model", data.model);
  formData.append("description", data.description);

  if (data.note) {
    formData.append("note", data.note);
  }

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await api.post("/recycles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Újrahasznosítás létrehozási hiba:", error);
    throw error;
  }
}

export async function getMyRecycles(token: string): Promise<any> {
  try {
    const response = await api.get("/recycles/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Saját újrahasznosítások lekérési hiba:", error);
    throw error;
  }
}

export async function getAdminRecycles(
  token: string,
  status: "PENDING" | "APPROVED" | "REJECTED" = "PENDING"
): Promise<any> {
  try {
    const response = await api.get(`/admin/recycles?status=${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Admin recycle lista lekérési hiba:", error);
    throw error;
  }
}

export async function approveRecycle(id: number, token: string): Promise<any> {
  try {
    const response = await api.patch(
      `/admin/recycles/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Recycle elfogadási hiba:", error);
    throw error;
  }
}

export async function rejectRecycle(id: number, token: string): Promise<any> {
  try {
    const response = await api.patch(
      `/admin/recycles/${id}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Recycle elutasítási hiba:", error);
    throw error;
  }
}

export async function getAdminProducts(
  token: string,
  status: "PENDING" | "AVAILABLE" | "REJECTED" | "SOLD" = "PENDING"
): Promise<any> {
  try {
    const response = await api.get(`/admin/products?status=${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Admin hirdetés lista lekérési hiba:", error);
    throw error;
  }
}

export async function approveProductAdmin(id: number, token: string): Promise<any> {
  try {
    const response = await api.patch(
      `/admin/products/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Hirdetés elfogadási hiba:", error);
    throw error;
  }
}

export async function rejectProductAdmin(id: number, token: string): Promise<any> {
  try {
    const response = await api.patch(
      `/admin/products/${id}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Hirdetés elutasítási hiba:", error);
    throw error;
  }
}