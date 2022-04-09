// Signup fetch to api/auth/signup


export async function LibSignUp(username: string, email: string, password: string) {

    let signRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ username: username, email: email, password: password })
    })

    return signRes
}