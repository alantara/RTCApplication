import style from './index.module.css'
import { useRouter } from 'next/router';

export default function Home({ }) {

    const router = useRouter();

    async function LogRedirect() {

        let textAnim = document.getElementsByClassName(style.animation)
        let i = 1
        Array.from(textAnim).map((el) => {
            let name = `a${i}reverse`
            el.classList.add(style[name])
            el.classList.add(style["animationreverse"])
            i++
        })
        let container = document.getElementById("left")
        container.classList.add(style.lefttoleft)
        setTimeout(() => {
            router.push("/auth/login")
        }, 3000);
    }

    async function SignUp(data) {

        if (data.password != data.cpassword) return

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
        <div className={style.container} >
            <div id="left" className={style.left}>
                <div className={style.header}>
                    <h2 className={`${style.animation} ${style.a1}`}>Welcome</h2>
                    <h4 className={`${style.animation} ${style.a2}`}>Create an account with your email</h4>
                </div>
                <div className={style.form}>
                    <input type="username" className={`${style["form-field"]} ${style.animation} ${style.a3}`} placeholder="Username"></input>
                    <input type="email" className={`${style["form-field"]} ${style.animation} ${style.a4}`} placeholder="Email Address"></input>
                    <input type="password" className={`${style["form-field"]} ${style.animation} ${style.a5}`} placeholder="Password"></input>
                    <input type="cpassword" className={`${style["form-field"]} ${style.animation} ${style.a6}`} placeholder="Confirm Password"></input>
                    <p className={`${style.animation} ${style.a7}`}>Already Have An Account? <a onClick={LogRedirect}>Log In</a></p>
                    <button className={`${style.animation} ${style.a8}`} onClick={() => SignUp({ email: document.getElementById("email").value, username: document.getElementById("username").value, password: document.getElementById("password").value, cpassword: document.getElementById("cpassword").value })}>SIGNUP</button>
                </div>
            </div>
            <div className={style.right}></div>
        </div >
    )
}