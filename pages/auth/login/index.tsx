import Link from 'next/link'
import style from './index.module.css'
import { useRouter } from 'next/router';



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
        <div className={style.container}>
            <div className={style.left}>
                <div className={style.header}>
                    <h2 className={`${style.animation} ${style.a1}`}>Welcome Back</h2>
                    <h4 className={`${style.animation} ${style.a2}`}>Log in to your account using email and password</h4>
                </div>
                <div className={style.form}>
                    <input id='email' type="email" className={`${style["form-field"]} ${style.animation} ${style.a3}`} placeholder="Email Address"></input>
                    <input id='password' type="password" className={`${style["form-field"]} ${style.animation} ${style.a4}`} placeholder="Password"></input>
                    <p className={`${style.animation} ${style.a5}`}><a href="#">Forgot Password</a></p>
                    <button className={`${style.animation} ${style.a6}`} onClick={() => LogIn({ email: document.getElementById("email").value, password: document.getElementById("password").value })}>LOGIN</button>
                </div>
            </div>
            <div className={style.right}></div>
        </div>
    )
}