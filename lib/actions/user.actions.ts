"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
};

// READ USER
export const getUserById = async (userId: string) => {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
};

// UPDATE USER
export const updateUser = async (clerkId: string, user: UpdateUserParams) => {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
};

// DELETE USER
export const deleteUser = async (clerkId: string) => {
  try {
    await connectToDatabase();

    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) throw new Error("User not found");

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(userToDelete)) : null;
  } catch (error) {
    handleError(error);
  }
};

// USE CREDITS
export const updateCredits = async (userId: string, creditFee: number) => {
  try {
    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true },
    );

    if (!updatedUserCredits) throw new Error("User not found");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
};

// GET CREDITS
export const getUserCredits = async (userId: string) => {
  try {
    await connectToDatabase();

    const user = await User.findOne(
      { clerkId: userId },
      { creditBalance: 1, _id: 0 },
    );

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user.creditBalance));
  } catch (error) {
    handleError(error);
  }
};
