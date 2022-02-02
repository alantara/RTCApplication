import Link from 'next/link'
import style from './index.module.css'
import { useRouter } from 'next/router';
import { route } from 'next/dist/server/router';


export default function Home({ }) {

    const router = useRouter();

    async function SignUp(data) {

        let signRes = await fetch("../api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ email: data.email, password: data.password, username: data.username })

        })
        if (signRes.status == 201) {
            router.push("/")
        }
    }

    return (
        <body id={style.body}>
            <div className={style.background}>
                <div className={style.shape}></div>
                <div className={style.shape}></div>
            </div>
            <form id={style.form}>
                <h3>SignUp Here</h3>

                <label className={style.label}>Username</label>
                <input className={style.input} type="text" placeholder="Username" id="username" spellCheck="false" autoComplete='false'></input>

                <label className={style.label}>Email</label>
                <input className={style.input} type="text" placeholder="Email" id="email" spellCheck="false" autoComplete='false'></input>

                <label className={style.label}>Password</label>
                <input className={style.input} type="password" placeholder="Password" id="password" spellCheck="false" autoComplete='false'></input>

                <button type='button' id={style.button} onClick={() => SignUp({ username: document.getElementById("username").value, email: document.getElementById("email").value, password: document.getElementById("password").value })}>Sign Up</button>
                <Link href="/auth/login">
                    <button id={style.button}>Log In</button>
                </Link>
            </form>
        </body>
    )
}