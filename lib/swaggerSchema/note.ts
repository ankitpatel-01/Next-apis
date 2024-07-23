export const NoteSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            description: "The title of the note.",
            example: "Shopping List",
        },
        description: {
            type: "string",
            description: "A detailed description of the note.",
            example: "Buy milk, eggs, and bread.",
        },
        user: {
            type: "string",
            description: "The ID of the user who created the note.",
            example: "60c72b2f4f1a2c001c8e4b44",
        },
    },
    required: ["title"],
};
