import { CreateProject, Project, UpdateProject } from "@/types/project.type";

const API_BASE = '/api/projects';

// 獲取用戶的專案列表
export const getUserProjects = async (params?: {
  visibility?: 'PRIVATE' | 'UNLISTED' | 'PUBLIC';
  page?: number;
  limit?: number;
}): Promise<{
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> => {
  const searchParams = new URLSearchParams();

  if (params?.visibility) {
    searchParams.append('visibility', params.visibility);
  }

  if (params?.page) {
    searchParams.append('page', params.page.toString());
  }

  if (params?.limit) {
    searchParams.append('limit', params.limit.toString());
  }

  const response = await fetch(`${API_BASE}?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch projects');
  }

  const result = await response.json();
  return result.data;
};

// 獲取單個專案
export const getProject = async (id: string): Promise<Project> => {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch project');
  }

  const result = await response.json();
  return result.data;
};

// 創建新專案
export const createProject = async (data: CreateProject): Promise<Project> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create project');
  }

  const result = await response.json();
  return result.data;
};

// 更新專案
export const updateProject = async (id: string, data: UpdateProject): Promise<Project> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update project');
  }

  const result = await response.json();
  return result.data;
};

// 刪除專案
export const deleteProject = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete project');
  }
};

// 檢查用戶是否有權限編輯專案
export const checkProjectPermission = async (projectId: string): Promise<boolean> => {
  try {
    await getProject(projectId);
    return true; // 如果能獲取到專案，說明有權限
  } catch (error) {
    return false;
  }
};

// 獲取公開專案（用於瀏覽）
export const getPublicProjects = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> => {
  const searchParams = new URLSearchParams();
  searchParams.append('visibility', 'PUBLIC');

  if (params?.page) {
    searchParams.append('page', params.page.toString());
  }

  if (params?.limit) {
    searchParams.append('limit', params.limit.toString());
  }

  const response = await fetch(`${API_BASE}?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch public projects');
  }

  const result = await response.json();
  return result.data;
};