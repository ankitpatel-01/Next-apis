/**
 * @swagger
 * /api/hello:
 *   get:
 *     tags:
 *       - ping
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                 message:
 *                   type: string
 */
export async function GET(_request: Request) {
    return new Response(JSON.stringify({
        message: "Hello World!",
    }), {
        status: 200,
    });
}