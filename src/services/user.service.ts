import { prisma } from "@/lib/db";
import { ApiResponse } from "@/types/api.type";
import { CreateUser, updateGoogleUserInfo, User } from "@/types/user.type";

export async function getUserById(id: string): Promise<ApiResponse<User | null>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        projects: {
          orderBy: { updatedAt: 'desc' },
        },
      },
    });
    return { success: true, data: user };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return { success: false, error, };
  }
}

export const getUserByEmail = async (email: string): Promise<ApiResponse<User | null>> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        projects: {
          select: { id: true },
          orderBy: { updatedAt: 'desc' },
          take: 5,
        },
      },
    });
    return { success: true, data: user };
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return { success: false, error };
  }
};

export const createUser = async (user: CreateUser): Promise<ApiResponse<User>> => {
  try {
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        image: user.image,
        updatedAt: new Date(),
        createdAt: new Date(),
      }
    });
    return { success: true, data: newUser };
  }
  catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error };
  }
};

export const updateLoggedInUserInfo = async (user: updateGoogleUserInfo): Promise<ApiResponse<User>> => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        email: user.email
      },
      data: {
        name: user.name,
        image: user.image,
        updatedAt: new Date()
      }
    })
    return { success: true, data: updatedUser };
  }
  catch (error) {
    console.error("Error updating Google user info:", error);
    return { success: false, error };
  }
}

export const deleteUser = async (id: string): Promise<ApiResponse<User>> => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id }
    })
    return { success: true, data: deletedUser }
  } catch (error) {
    console.error("Error deleting User", error)
    return { success: false, error }
  }
}