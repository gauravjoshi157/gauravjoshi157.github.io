export async function onRequestPost(context) {
    const { token } = await context.request.json();

    const secret = "0x4AAAAAACBjgDzX2JiTFHtPs0fri2Y5aU8"; // <-- ONE LINE ONLY

    const formData = new FormData();
    formData.append("secret", secret);
    formData.append("response", token);

    const result = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        { method: "POST", body: formData }
    );

    const outcome = await result.json();

    return new Response(JSON.stringify({ success: outcome.success }), {
        headers: { "Content-Type": "application/json" }
    });
}
