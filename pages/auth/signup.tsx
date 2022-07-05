//Essentials
import { InferGetServerSidePropsType } from "next";
import { withSessionSsr } from "../../lib/sessionHandler";

//React & Next.js
import { useState } from 'react';
import { useRouter } from 'next/router';

//CSS
import css from "./auth.module.css"
import { LibSignUp } from "../../lib/auth/index";

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

    async function SignupForm(e) {
        e.preventDefault()
        setBtnDisabled(true)

        let getInput = document.getElementsByTagName("input")

        let getNowInvalid = document.getElementsByClassName("is-invalid")
        Array.from(getNowInvalid).forEach(input => {
            input.classList.remove("is-invalid")
        });

        let username = (document.getElementById("username") as HTMLInputElement).value
        let email = (document.getElementById("email") as HTMLInputElement).value
        let password = (document.getElementById("password") as HTMLInputElement).value
        let cpassword = (document.getElementById("cpassword") as HTMLInputElement).value

        if (password != cpassword) {
            setErrorMessage("Passwords Mismatch")
            Array.from(getInput).forEach(input => {
                if (input.id !== "cpassword") return
                input.classList.add("is-invalid")
            });
        }

        let response = await LibSignUp(username, email, password)

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

            case "USERNAME_TAKEN":
                setErrorMessage("Username Taken")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "username") return
                    input.classList.add("is-invalid")
                });
                break
            case "INVALID_USERNAME":
                setErrorMessage("Please Insert A Valid Username")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "username") return
                    input.classList.add("is-invalid")
                });
                break

            case "INVALID_EMAIL":
                setErrorMessage("Please Insert A Valid Email")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "email") return
                    input.classList.add("is-invalid")
                });
                break
            case "EMAIL_TAKEN":
                setErrorMessage("Email Taken")
                Array.from(getInput).forEach(input => {
                    if (input.id == "email") return input.classList.add("is-invalid")
                });
                break

            case "INVALID_PASSWORD":
                setErrorMessage("Please Insert A Valid Password")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "password") return
                    input.classList.add("is-invalid")
                });
                break

            case "EMAIL_SEARCH_ERROR":
                setErrorMessage("Failed To Verify Email Uniqueness. Try Again Later")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "cpassword") return
                    input.classList.add("is-invalid")
                });
                break
            case "USERNAME_SEARCH_ERROR":
                setErrorMessage("Failed To Verify Username Uniqueness. Try Again Later")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "cpassword") return
                    input.classList.add("is-invalid")
                });
                break
            case "INSERT_ACCOUNT_ERROR":
                setErrorMessage("Failed To Add Account to Database. Try Again Later")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "cpassword") return
                    input.classList.add("is-invalid")
                });
                break
            case "API_ERROR":
                setErrorMessage("API Error. Contact a Contributor")
                Array.from(getInput).forEach(input => {
                    if (input.id !== "cpassword") return
                    input.classList.add("is-invalid")
                });
                break
        }
    }

    return (
        <div className={`${css.bgContainer}`}>
            <div className={`col-xxl-5 col-xl-6 col-lg-8 col-md-8 col-sm-12 col-12 ${css.leftContainer}`}>
                <div className={`${css.titleContainer}`}>
                    <h2 className={`${css.title}`}>First Time Here?</h2>
                    <p>Sign Up using email and password</p>
                </div>

                <form className={`${css.formContainer}`} onSubmit={(e) => { SignupForm(e) }}>
                    <div className="w-75 form-floating mb-4">
                        <input id="username" type="text" className={`border-0 form-control ${css.input}`} placeholder="Username" aria-label="Username" />
                        <label htmlFor="email" className={`${css.label}`}>Username</label>
                        <div className="invalid-feedback">{errorMessage}</div>
                    </div>

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

                    <div className="w-75 form-floating mb-4">
                        <input id="cpassword" type="password" className={`border-0 form-control ${css.input}`} placeholder="Confirm Password" aria-label="Confirm Password" />
                        <label htmlFor="password" className={`${css.label}`}>Confirm Password</label>
                        <div className="invalid-feedback">{errorMessage}</div>
                    </div>

                    <p className="w-100 px-5 text-end">Already Have An Account?<span> </span><a className={`${css.link}`} onClick={() => router.push("/auth/login")}>LogIn</a></p>

                    <button type="submit" disabled={btnDisabled} className={`w-75 btn fw-bolder ${css.button}`}>SignUp</button>
                </form>
            </div>
        </div>
    )
}