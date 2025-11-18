export async function onRequestPost(context) {
    try {
        const { token } = await context.request.json();

        // Use environment variable instead of hardcoding
        const secret = context.env.TURNSTILE_SECRET_KEY || "0x4AAAAAACBjgDzX2JiTFHtPs0fri2Y5aU8";

        const body = new URLSearchParams();
        body.append("secret", secret);
        body.append("response", token);

        const result = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                body
            }
        );

        const outcome = await result.json();

        return new Response(JSON.stringify({ 
            success: outcome.success,
            // Optionally include error codes for debugging
            ...(outcome['error-codes'] && { errors: outcome['error-codes'] })
        }), {
            status: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });

    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            error: err.toString()
        }), {
            status: 500,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
}

// Handle OPTIONS request for CORS
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}
