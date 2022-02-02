import Link from 'next/link'
import style from './index.module.css'
import { useRouter } from 'next/router';
import { Router } from 'express';



export default function Home({ }) {
    let router = useRouter()
    async function LogIn(data) {



        fetch("../api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ email: data.email, password: data.password })

        }).then((req) => {
            router.push("/")
        })

    }
    return (
        <div id={style.body}>
            <div className={style.background}>
                <div className={style.shape}></div>
                <div className={style.shape}></div>
            </div>
            <form id={style.form}>
                <h3>LogIn Here</h3>

                <label className={style.label}>E-mail</label>
                <input className={style.input} type="text" placeholder="Email or Phone" id="email"></input>

                <label className={style.label}>Password</label>
                <input className={style.input} type="password" placeholder="Password" id="password"></input>

                <button type='button' id={style.button} onClick={() => LogIn({ email: document.getElementById("email").value, password: document.getElementById("password").value })}>Log In</button>
                <Link href="/auth/signup">
                    <button id={style.button}>Sign Up</button>
                </Link>
            </form>
        </div>
    )
}