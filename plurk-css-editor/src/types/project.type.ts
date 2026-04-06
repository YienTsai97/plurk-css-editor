import { Project as PrismaProject } from "@/generated/prisma";

export type Project = PrismaProject;
export type ProjectWithoutContent = Omit<Project, 'cssContent'>;

// 用於 API 創建專案的類型
export type CreateProject = {
  name: string;
  description?: string | null;
  cssContent: string;
  visibility: 'PRIVATE' | 'UNLISTED' | 'PUBLIC';
  userId: string;
  slug?: string;
  thumbnailUrl?: string | null;
  importedFromTemplateId?: string | null;
  forkCount?: number;
  likeCount?: number;
};

// 用於 API 更新專案的類型
export type UpdateProject = Partial<Omit<Project, 'id' | 'createdAt' | 'userId'>>;

// 用於前端表單的類型
export type ProjectFormData = {
  name: string;
  description?: string;
  visibility: 'PRIVATE' | 'UNLISTED' | 'PUBLIC';
  storageType: 'local' | 'database';
};

