/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Users]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60f7b0d8a1e1f0b0c8c8c8c8"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Error in logging in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error in logging in"
 */
import { NextResponse } from 'next/server';
import connect from "@/lib/db";
import User from '@/lib/models/users';

export const POST = async (request: Request) => {
    const { username, password } = await request.json();

    try {
        await connect();

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }

        // Check password
        const isMatch = password === user.password ? true : false;
        if (!isMatch) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid credentials" }),
                { status: 401 }
            );
        }

        // Create response
        const response = NextResponse.json({ id: user._id });

        // Set user ID in cookie
        response.cookies.set('userId', user._id.toString(), {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return response;
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ message: "Error in logging in", error }),
            { status: 500 }
        );
    }
};