import connect from "@/lib/db";
import User from "@/lib/models/users";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
const ObjectId = require("mongoose").Types.ObjectId;
/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error in fetching users
 */
export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error) {
        return new NextResponse("Error in fetching users" + error, { status: 500 });
    }
};

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is created"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Error in creating user
 */
export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();

        return new NextResponse(
            JSON.stringify({ message: "User is created", user: newUser }),
            { status: 201 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error in creating user",
                error,
            }),
            {
                status: 500,
            }
        );
    }
};

/**
 * @swagger
 * /api/users:
 *   patch:
 *     tags: [Users]
 *     summary: Update a user's username
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to update
 *                 example: "60c72b2f4f1a2c001c8e4b44"
 *               newUsername:
 *                 type: string
 *                 description: The new username for the user
 *                 example: "newusername"
 *     responses:
 *       200:
 *         description: Username updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Username updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: ID or new username are required or invalid userId
 *       500:
 *         description: Error updating username
 */
export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newUsername } = body;

        await connect();

        if (!userId || !newUsername) {
            return new NextResponse(
                JSON.stringify({ message: "ID or new username are required" }),
                {
                    status: 400,
                }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid userId" }), {
                status: 400,
            });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({
                    message: "User not found or didn't update user successfully.",
                }),
                {
                    status: 400,
                }
            );
        }

        return new NextResponse(
            JSON.stringify({
                message: "Username updated successfully",
                user: updatedUser,
            }),
            {
                status: 200,
            }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error updating username",
                error,
            }),
            {
                status: 500,
            }
        );
    }
};

/**
 * @swagger
 * /api/users:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: UserId is required or invalid userId
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */
export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "UserId is required" }),
                {
                    status: 400,
                }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid userId" }), {
                status: 400,
            });
        }

        await connect();

        const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

        if (!deletedUser) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });
        }

        return new NextResponse(
            JSON.stringify({
                message: "User deleted successfully",
            }),
            {
                status: 200,
            }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error deleting user",
                error,
            }),
            {
                status: 500,
            }
        );
    }
};
