// Login fetch to api/auth/login

export async function LibLogIn(email: string, password: string) {

    let logInRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ email: email, password: password })
    })

    return logInRes
}

// Logout fetch to api/auth/logout

export async function LibLogOut() {

    let logOutRes = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
    })

    return logOutRes
}

// Signup fetch to api/auth/signup

export async function LibSignUp(username: string, email: string, password: string) {

    let signUpRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ username: username, email: email, password: password })
    })

    return signUpRes
}