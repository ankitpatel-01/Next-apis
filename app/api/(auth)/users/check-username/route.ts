import { NextResponse } from 'next/server';
import connect from "@/lib/db";
import User from '@/lib/models/users';

/**
 * @swagger
 * /api/users/check-username:
 *   get:
 *     tags: [Users]
 *     summary: Check if a username is available
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username to check for availability
 *     responses:
 *       200:
 *         description: Username availability status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Error checking username availability
 */
export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    try {
        await connect();
        const user = await User.findOne({ username });

        return NextResponse.json({ available: !user });
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ message: "Error checking username availability", error }),
            { status: 500 }
        );
    }
};
