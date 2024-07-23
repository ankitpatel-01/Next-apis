import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Types } from "mongoose";
import User from "@/lib/models/users";
import Note from "@/lib/models/notes";

/**
 * @swagger
 * /notes/{noteId}:
 *   get:
 *     tags:
 *       - notes
 *     summary: Get a specific note by ID
 *     description: Fetches a note that belongs to a specific user.
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         description: The ID of the note to fetch.
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         description: The ID of the user who owns the note.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of the note.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Invalid or missing userId or noteId.
 *       404:
 *         description: User not found or note does not belong to the user.
 *       500:
 *         description: Internal server error.
 */
export const GET = async (request: Request, context: { params: any }) => {
    const noteId = context.params.id;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        if (!noteId || !Types.ObjectId.isValid(noteId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing note ID" }),
                { status: 400 }
            );
        }

        await connect();

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });
        }

        // Fetch the note and ensure it belongs to the user
        const note = await Note.findOne({ _id: noteId, user: userId });
        if (!note) {
            return new NextResponse(
                JSON.stringify({
                    message: "Note not found or does not belong to the user",
                }),
                { status: 404 }
            );
        }

        return new NextResponse(JSON.stringify(note), { status: 200 });
    } catch (error) {
        return new NextResponse("Error in fetching note " + error, {
            status: 500,
        });
    }
};
