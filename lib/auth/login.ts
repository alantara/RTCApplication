// Login fetch to api/auth/login


export async function LibLogIn(email: string, password: string) {

    let logRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ email: email, password: password })
    })

    return logRes
}