import type { Context, Request } from "netlify:edge"
import * as Ably from "https://esm.sh/ably/promises"
// import * as Ably from "https://cdn.ably.com/lib/ably.min-1.js"

export default async (request: Request, context: Context) => {
    const ablyApiKey = Deno.env.get('ABLY_API_KEY')
    if (!ablyApiKey) {
        return new Response('Missing API_KEY environment variable.', {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    const url = new URL(request.url)
    const clientId = url.searchParams.get('client') || Deno.env.get('DEFAULT_CLIENT_ID') || 'NO_CLIENT_ID'
    console.log(clientId)
    const client = new Ably.Rest({ key: ablyApiKey })
    const tokenRequestData = await client.auth.createTokenRequest({ clientId: clientId })

    return Response.json(tokenRequestData)
}