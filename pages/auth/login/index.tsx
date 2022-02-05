import style from '../index.module.css'
import { useRouter } from 'next/router';
import { withSessionSsr } from "../../../lib/sessionHandler";
import { InferGetServerSidePropsType } from "next";

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        const user = req.session.user;
        if (user?.id) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/user"
                }
            }
        }

        return {
            props: {

            },
        };
    }
);

export default function SsrProfile({

}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    let router = useRouter()

    async function Redirect(href, login) {
        let time = 1000
        let textAnim = document.getElementsByClassName(style.textAnimationSet)
        let i = 1
        Array.from(textAnim).map((el) => {
            el.classList.add(style[`a${i}Reverse`])
            el.classList.add(style.textAnimationReverse)
            i++
        })
        if (login) {
            let slideAnim = document.getElementById("container")
            slideAnim.classList.add(style.slideAnimReverse)
            time += 1500
        }
        setTimeout(() => {
            router.push(href)
        }, time);
    }

    async function LogIn({ email, password }) {
        let errText = document.getElementsByClassName(style.show)
        Array.from(errText).map((el) => {
            el.classList.remove(style.show)
        })

        if (!email) document.getElementById("emailreq").classList.add(style.show)
        if (!password) return document.getElementById("passreq").classList.add(style.show)

        fetch("../api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ email: email, password: password })

        }).then((req) => {
            if (req.status == 200) Redirect("/user", true)
        })

    }

    return (
        <div className={style.body}>
            <div id='container' className={`${style.container} ${style.slideAnimSet}`}>
                <div className={style.header}>
                    <h2 className={`${style.textAnimationSet} ${style.a1} ${style.textAnimation}`}>Welcome Back</h2>
                    <h4 className={`${style.textAnimationSet} ${style.a2} ${style.textAnimation}`}>Log in to your account using email and password</h4>
                </div>
                <div className={style.form}>
                    <input id='email' type="email" className={`${style["form-field"]} ${style.textAnimationSet} ${style.a3} ${style.textAnimation}`} placeholder="Email Address"></input>
                    <p style={{ color: "red" }} id="emailreq" className={`${style.hidden}`}>Input Required</p>
                    <input id='password' type="password" className={`${style["form-field"]} ${style.textAnimationSet} ${style.a4} ${style.textAnimation}`} placeholder="Password"></input>
                    <p style={{ color: "red" }} id="passreq" className={`${style.hidden}`}>Input Required</p>
                    <p className={`${style.textAnimationSet} ${style.a5} ${style.textAnimation}`}>Forgot Password? <a href="#">Restore it now</a></p>
                    <p className={`${style.textAnimationSet} ${style.a6} ${style.textAnimation}`}>Don't Have An Account? <a onClick={() => Redirect("/auth/signup", false)}>Sign Up</a></p>
                    <button className={`${style.textAnimationSet} ${style.a7} ${style.textAnimation}`} onClick={() => LogIn({ email: document.getElementById("email").value, password: document.getElementById("password").value })}>LOGIN</button>
                </div>
            </div>
            <div className={style.right}></div>
        </div>
    )
}