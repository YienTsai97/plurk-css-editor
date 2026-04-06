import { Project } from "@/types/project.type";

const API_BASE = '/api/fork';

// 從模板或專案創建新專案
export const forkToProject = async (params: {
  targetType: 'PROJECT' | 'TEMPLATE';
  targetId: string;
  name: string;
  description?: string;
  visibility?: 'PRIVATE' | 'UNLISTED' | 'PUBLIC';
}): Promise<{
  project: Project;
  message: string;
}> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fork');
  }

  const result = await response.json();
  return result.data;
};

// 從模板創建專案
export const forkTemplateToProject = async (templateId: string, params: {
  name: string;
  description?: string;
  visibility?: 'PRIVATE' | 'UNLISTED' | 'PUBLIC';
}): Promise<{
  project: Project;
  message: string;
}> => {
  return forkToProject({
    targetType: 'TEMPLATE',
    targetId: templateId,
    ...params
  });
};

// 從專案創建新專案
export const forkProjectToProject = async (projectId: string, params: {
  name: string;
  description?: string;
  visibility?: 'PRIVATE' | 'UNLISTED' | 'PUBLIC';
}): Promise<{
  project: Project;
  message: string;
}> => {
  return forkToProject({
    targetType: 'PROJECT',
    targetId: projectId,
    ...params
  });
};
