async function SignUp(data) {
    fetch("api/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ data })

    })
}

export default function Home({ data }) {
    return (
        <>

            <input id="username"></input>
            <input id="password"></input>
            <button onClick={() => SignUp({ username: document.getElementById("username").value, password: document.getElementById("password").value })}>Send</button>

        </>)
}