/**
 * @swagger
 * /api/echo:
 *   get:
 *     tags:
 *       - ping
 *     description: Echoes back the provided message
 *     parameters:
 *       - in: query
 *         name: msg
 *         schema:
 *           type: string
 *         required: false
 *         description: Message to echo back
 *     responses:
 *       200:
 *         description: The echoed message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad Request, missing message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const msg = searchParams.get('msg');

    if (!msg) {
        return new Response(JSON.stringify({
            error: "Bad Request: 'msg' query parameter is required",
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return new Response(JSON.stringify({
        message: msg,
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
