import { createSwaggerSpec } from "next-swagger-doc";
import { UserSchemas } from "./swaggerSchema/users";
import { NoteSchema } from "./swaggerSchema/note";

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: "app/api", // define api folder under app folder
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Next.Js API Example",
                version: "1.0.0",
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
                schemas: {
                    User: UserSchemas,
                    Note: NoteSchema
                },
            },
            security: [],
        },
    });
    return spec;
};