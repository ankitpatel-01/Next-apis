export const UserSchemas = {
    type: "object",
    properties: {
        name: {
            type: "string",
            description: "The user's name.",
            example: "John Doe",
        },
        email: {
            type: "string",
            description: "The user's email.",
            example: "john@example.com",
        },
        username: {
            type: "string",
            description: "The user's username.",
            example: "johndoe",
        },
        password: {
            type: "string",
            description: "The user's password.",
            example: "password123",
        },
    },
    required: ["name", "email", "username", "password"],
};
