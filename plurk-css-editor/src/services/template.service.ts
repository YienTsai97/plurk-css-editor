import { CreateStyleTemplate, StyleTemplateType, UpdateStyleTemplate } from "@/types/style-template.type";

const API_BASE = '/api/templates';

// 獲取模板列表
export const getTemplates = async (params?: {
  categoryId?: string;
  isOfficial?: boolean;
  visibility?: 'PRIVATE' | 'UNLISTED' | 'PUBLIC';
  page?: number;
  limit?: number;
}): Promise<{
  templates: StyleTemplateType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> => {
  const searchParams = new URLSearchParams();

  if (params?.categoryId) {
    searchParams.append('categoryId', params.categoryId);
  }

  if (params?.isOfficial !== undefined) {
    searchParams.append('isOfficial', params.isOfficial.toString());
  }

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
    throw new Error(error.error || 'Failed to fetch templates');
  }

  const result = await response.json();
  return result.data;
};

// 獲取單個模板
export const getTemplate = async (id: string): Promise<StyleTemplateType> => {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch template');
  }

  const result = await response.json();
  return result.data;
};

// 創建新模板
export const createTemplate = async (data: CreateStyleTemplate): Promise<StyleTemplateType> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create template');
  }

  const result = await response.json();
  return result.data;
};

// 更新模板
export const updateTemplate = async (id: string, data: UpdateStyleTemplate): Promise<StyleTemplateType> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update template');
  }

  const result = await response.json();
  return result.data;
};

// 刪除模板
export const deleteTemplate = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete template');
  }
};

// 獲取官方模板
export const getOfficialTemplates = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{
  templates: StyleTemplateType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> => {
  return getTemplates({
    ...params,
    isOfficial: true,
    visibility: 'PUBLIC'
  });
};

// 獲取分類模板
export const getTemplatesByCategory = async (categoryId: string, params?: {
  page?: number;
  limit?: number;
}): Promise<{
  templates: StyleTemplateType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> => {
  return getTemplates({
    ...params,
    categoryId
  });
};
