import { auth } from "@/auth";
import { Account, User } from "next-auth";
import { NextResponse } from "next/server";
import { createUser, getUserByEmail, updateLoggedInUserInfo } from "./user.service";


export const authGoogleSignIn = async (user: User, account: Account) => {
  try {
    if (!user.email) {
      return { success: false, message: "Auth-Service:User email is required" };
    }

    // check if DB user exists
    const checkUser = await getUserByEmail(user.email);
    if (!checkUser.data || !checkUser.success) {
      // create DB user
      const newUser = await createUser({
        name: user.name ?? "",
        email: user.email as string,
        image: user.image ?? "",
        locale: "zh" // 預設為中文
      });
      //check if user is successfully created (optional)
      if (newUser.success && newUser.data) {
        console.log("register:create new user", newUser.data.email);
        return { success: true, message: "Auth-Service:User created successfully" };
      } else {
        console.error("Auth-Service:Failed to create user:", newUser.error);
        return { success: false, message: "Auth-Service:Failed to create user" };
      }
    } else {
      //update DB user info
      const updatedUser = await updateLoggedInUserInfo({
        name: user.name ?? "",
        email: user.email as string,
        image: user.image ?? "",
        updatedAt: new Date()
      });
      //check if user is successfully updated(optional)
      if (updatedUser.success && updatedUser.data) {
        console.log("login:update user info", updatedUser.data.email);
        return { success: true, message: "Auth-Service:User updated successfully" };
      } else {
        console.error("Auth-Service:Failed to update user:", updatedUser.error);
        return { success: false, message: "Auth-Service:Failed to update user" };
      }
      // return { success: true, message: "Auth-Service:User authenticated successfully" };
    }
  } catch (error) {
    console.error("Auth-Service:error in handleGoogleSignIn", error);
    return {
      success: false,
      message: "Auth-Service:Failed to authenticate user"
    }
  }
}

type RequireAuthResult =
  | { success: false; response: NextResponse }
  | { success: true; userId: string; userEmail: string }

export const requireAuth = async (): Promise<RequireAuthResult> => {
  const session = await auth()
  const userEmail = session?.user?.email
  if (!userEmail) {
    return {
      success: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }
  // get user id from session
  let userId = session?.user?.id
  if (!userId) {
    // get user id from db if not in session
    const userInfo = await getUserByEmail(userEmail)
    if (!userInfo.success || !userInfo.data) {
      return {
        success: false,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }
    userId = userInfo.data.id
  }
  if (!userId) {
    return {
      success: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }
  return { success: true, userId, userEmail }
}