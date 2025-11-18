export async function onRequestPost(context) {
    try {
        const { token } = await context.request.json();

        const secret = "0x4AAAAAACBjgDzX2JiTFHtPs0fri2Y5aU8";

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

        return new Response(JSON.stringify({ success: outcome.success }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            error: err.toString()
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
