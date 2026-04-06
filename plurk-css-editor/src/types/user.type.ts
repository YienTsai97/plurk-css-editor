import { User as PrismaUser } from "@/generated/prisma";

export type User = PrismaUser;
export type UserWithoutProjects = Omit<User, 'projects'>;
export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'projects' | 'styleTemplates'>;
export type updateGoogleUserInfo = Pick<User, 'email' | 'name' | 'image' | 'updatedAt'>

