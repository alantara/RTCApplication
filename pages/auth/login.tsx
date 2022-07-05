//Essentials
import { InferGetServerSidePropsType } from "next";
import { withSessionSsr } from "../../lib/sessionHandler";

//React & Next.js
import { useState } from 'react';
import { useRouter } from 'next/router';

//CSS
import css from "./auth.module.css"
import { LibLogIn } from "../../lib/auth/index";

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        const sessionData = req.session.data;
        if (sessionData) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/"
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

    const router = useRouter();

    const [btnDisabled, setBtnDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function LoginForm(e) {
        e.preventDefault()
        setBtnDisabled(true)

        let getInput = document.getElementsByTagName("input")

        let getNowInvalid = document.getElementsByClassName("is-invalid")
        Array.from(getNowInvalid).forEach(input => {
            input.classList.remove("is-invalid")
        });

        let email = (document.getElementById("email") as HTMLInputElement).value
        let password = (document.getElementById("password") as HTMLInputElement).value

        let response = await LibLogIn(email, password)

        if (response.status === 200) return router.push("/")

        setBtnDisabled(false)

        switch ((await response.json()).message) {
            case "MISSING_ARGUMENTS":
                setErrorMessage("Please Fill All The Fields")
                Array.from(getInput).forEach(input => {
                    if (input.value !== "") return
                    input.classList.add("is-invalid")
                });
                break

            case "LOGIN_ERROR":
                setErrorMessage("Login Error. Try again later")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "password") return
                    input.classList.add("is-invalid")
                });
                break
            case "INVALID_CREDENTIALS":
                setErrorMessage("Mismatch Information. User Not Found!")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "password") return
                    input.classList.add("is-invalid")
                });
                break
            case "MULTIPLE_USERS":
                setErrorMessage("Multiple Accounts. Contact a Contributor")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "password") return
                    input.classList.add("is-invalid")
                });
                break
            case "API_ERROR":
                setErrorMessage("API Error. Contact a Contributor")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "password") return
                    input.classList.add("is-invalid")
                });
                break

            case "INVALID_PASSWORD":
                setErrorMessage("Please Insert A Valid Password")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "password") return
                    input.classList.add("is-invalid")
                });
                break
        }
    }

    return (
        <div className={`${css.bgContainer}`}>
            <div className={`col-xxl-5 col-xl-6 col-lg-8 col-md-8 col-sm-12 col-12 ${css.leftContainer}`}>
                <div className={`${css.titleContainer}`}>
                    <h2 className={`${css.title}`}>Welcome Back!</h2>
                    <p>Log in using your email and password</p>
                </div>

                <form className={`${css.formContainer}`} onSubmit={(e) => { LoginForm(e) }}>
                    <div className="w-75 form-floating mb-4">
                        <input id="email" type="text" className={`border-0 form-control ${css.input}`} placeholder="Email" aria-label="Email" />
                        <label htmlFor="email" className={`${css.label}`}>Email address</label>
                        <div className="invalid-feedback">{errorMessage}</div>
                    </div>

                    <div className="w-75 form-floating mb-4">
                        <input id="password" type="password" className={`border-0 form-control ${css.input}`} placeholder="Password" aria-label="Password" />
                        <label htmlFor="password" className={`${css.label}`}>Password</label>
                        <div className="invalid-feedback">{errorMessage}</div>
                    </div>

                    <p className="w-100 px-5 text-end">Don't Have An Account?<span> </span><a className={`${css.link}`} onClick={() => router.push("/auth/signup")}>SignUp</a></p>

                    <button type="submit" disabled={btnDisabled} className={`w-75 btn fw-bolder ${css.button}`}>LogIn</button>
                </form>
            </div>
        </div>
    )
}