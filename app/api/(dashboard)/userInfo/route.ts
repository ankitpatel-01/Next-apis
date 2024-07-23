import { NextRequest, NextResponse } from 'next/server';
import connect from "@/lib/db";
import User from '@/lib/models/users';

/**
 * @swagger
 * /api/userInfo:
 *   get:
 *     summary: Get user name
 *     responses:
 *       200:
 *         description: Successfully fetched user name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: johndoe
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Error fetching user info
 */
export async function GET(request: NextRequest) {
    try {
        await connect();

        const userId = request.cookies.get('userId')?.value;
        if (!userId) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ username: user.name });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching user info', error }, { status: 500 });
    }
}
