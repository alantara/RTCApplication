import { withSessionSsr } from "../../../lib/sessionHandler";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from 'next/router';
import style from '../index.module.css'

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        const user = req.session.user;
        if (user?.id) {
            return {
                redirect: {
                    destination: "/user"
                }
            }
        }
        return {
            props: {

            }
        }
    }
);

export default function SsrProfile({

}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const router = useRouter();

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
            time += 1000
        }
        setTimeout(() => {
            router.push(href)
        }, time);
    }

    async function SignUp({ username, email, password, cpassword }) {
        let errText = document.getElementsByClassName(style.show)
        Array.from(errText).map((el) => {
            el.classList.remove(style.show)
        })

        if (!username) document.getElementById("usernamereq").classList.add(style.show)
        if (!email) document.getElementById("emailreq").classList.add(style.show)
        if (!password) document.getElementById("passreq").classList.add(style.show)
        if (!cpassword) return document.getElementById("cpassreq").classList.add(style.show)
        if (password != cpassword) return document.getElementById("passwordnotmatch").classList.add(style.show)

        let signRes = await fetch("../api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ email: email, password: password, username: username })

        })
        if (signRes.status == 201) {
            Redirect("/user", true)
        }
    }

    return (
        <div className={style.body} >
            <div id="container" className={`${style.container}`}>
                <div className={style.header}>
                    <h2 className={`${style.textAnimationSet} ${style.a1} ${style.textAnimation}`}>Welcome</h2>
                    <h4 className={`${style.textAnimationSet} ${style.a2} ${style.textAnimation}`}>Create an account with your email</h4>
                </div>
                <div className={style.form}>
                    <input id="username" className={`${style["form-field"]} ${style.textAnimationSet} ${style.a3} ${style.textAnimation}`} placeholder="Username"></input>
                    <p style={{ color: "red" }} id="usernamereq" className={`${style.hidden}`}>Input Required</p>
                    <input id="email" className={`${style["form-field"]} ${style.textAnimationSet} ${style.a4} ${style.textAnimation}`} placeholder="Email Address"></input>
                    <p style={{ color: "red" }} id="emailreq" className={`${style.hidden}`}>Input Required</p>
                    <input type="password" id="password" className={`${style["form-field"]} ${style.textAnimationSet} ${style.a5} ${style.textAnimation}`} placeholder="Password"></input>
                    <p style={{ color: "red" }} id="passreq" className={`${style.hidden}`}>Input Required</p>
                    <input type="password" id="cpassword" className={`${style["form-field"]} ${style.textAnimationSet} ${style.a6} ${style.textAnimation}`} placeholder="Confirm Password"></input>
                    <p style={{ color: "red" }} id="cpassreq" className={`${style.hidden}`}>Input Required</p>
                    <p style={{ color: "red" }} id="passwordnotmatch" className={`${style.hidden}`}>Password not match</p>
                    <p className={`${style.textAnimationSet} ${style.a7} ${style.textAnimation}`}>Already Have An Account? <a onClick={() => Redirect("/auth/login", false)}>Log In</a></p>
                    <button className={`${style.textAnimationSet} ${style.a8} ${style.textAnimation}`} onClick={() => SignUp({ email: document.getElementById("email").value, username: document.getElementById("username").value, password: document.getElementById("password").value, cpassword: document.getElementById("cpassword").value })}>SIGNUP</button>
                </div>
            </div>
            <div className={style.right}></div>
        </div >
    )
}