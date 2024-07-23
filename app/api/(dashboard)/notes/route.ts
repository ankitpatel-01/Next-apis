import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import { Types } from "mongoose";
import User from "@/lib/models/users";
import Note from "@/lib/models/notes";

/**
 * @swagger
 * /notes:
 *   get:
 *     tags:
 *       - notes
 *     summary: Get notes for a user
 *     description: Fetches notes belonging to a specific user with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *     responses:
 *       200:
 *         description: Successful retrieval of notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       400:
 *         description: Invalid or missing userId.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
export const GET = async (request: NextRequest) => {
    try {
        const userId = request.cookies.get('userId')?.value;

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        const page = parseInt(request.nextUrl.searchParams.get('page') as string) || 1;
        const limit = parseInt(request.nextUrl.searchParams.get('limit') as string) || 10;

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });
        }

        const totalNotesCount = await Note.countDocuments({ user: new Types.ObjectId(userId) });
        const totalPages = Math.ceil(totalNotesCount / limit);
        const skip = (page - 1) * limit;

        const notes = await Note.find({ user: new Types.ObjectId(userId) })
            .skip(skip)
            .limit(limit);

        return new NextResponse(
            JSON.stringify({
                notes,
                totalPages,
                currentPage: page,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ message: "Error in fetching notes", error }),
            { status: 500 }
        );
    }
};


/**
 * @swagger
 * /notes:
 *   post:
 *     tags:
 *       - notes
 *     summary: Create a new note
 *     description: Creates a new note for a specific user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created successfully.
 *       400:
 *         description: Invalid or missing userId.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
export const POST = async (request: NextRequest) => {
    try {
        const userId = request.cookies.get('userId')?.value; // Retrieve userId from cookies

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
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

        const body = await request.json();
        const { title, description } = body;

        const newNote = new Note({
            title,
            description,
            user: new Types.ObjectId(userId),
        });

        await newNote.save();
        return new NextResponse(
            JSON.stringify({ message: "Note created", note: newNote }),
            { status: 201 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error in creating note",
                error,
            }),
            { status: 500 }
        );
    }
};


/**
 * @swagger
 * /notes:
 *   patch:
 *     tags:
 *       - notes
 *     summary: Update an existing note
 *     description: Updates a specific note belonging to a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               noteId:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: The ID of the user updating the note.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note updated successfully.
 *       400:
 *         description: Invalid or missing userId or noteId.
 *       404:
 *         description: User or note not found.
 *       500:
 *         description: Internal server error.
 */
export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { noteId, title, description } = body;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!noteId || !Types.ObjectId.isValid(noteId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing noteId" }),
                { status: 400 }
            );
        }

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
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

        // Find the note and ensure it belongs to the user
        const note = await Note.findOne({ _id: noteId, user: userId });
        if (!note) {
            return new NextResponse(
                JSON.stringify({
                    message: "Note not found or does not belong to the user",
                }),
                {
                    status: 404,
                }
            );
        }

        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, description },
            { new: true }
        );

        return new NextResponse(
            JSON.stringify({ message: "Note updated", note: updatedNote }),
            { status: 200 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error in updating note",
                error,
            }),
            { status: 500 }
        );
    }
};

/**
 * @swagger
 * /notes:
 *   delete:
 *     tags:
 *       - notes
 *     summary: Delete a note
 *     description: Deletes a specific note belonging to a user.
 *     parameters:
 *       - in: query
 *         name: noteId
 *         required: true
 *         description: The ID of the note to delete.
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         description: The ID of the user deleting the note.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully.
 *       400:
 *         description: Invalid or missing userId or noteId.
 *       404:
 *         description: User or note not found.
 *       500:
 *         description: Internal server error.
 */
export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const noteId = searchParams.get("noteId");
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        if (!noteId || !Types.ObjectId.isValid(noteId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing noteId" }),
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

        // Check if the note exists and belongs to the user
        const note = await Note.findOne({ _id: noteId, user: userId });
        if (!note) {
            return new NextResponse(
                JSON.stringify({
                    message: "Note not found or does not belong to the user",
                }),
                {
                    status: 404,
                }
            );
        }

        await Note.findByIdAndDelete(noteId);

        return new NextResponse(
            JSON.stringify({ message: "Note deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error in deleting note",
                error,
            }),
            { status: 500 }
        );
    }
};
