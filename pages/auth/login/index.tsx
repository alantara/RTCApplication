//Essentials
import { InferGetServerSidePropsType } from "next";
import { withSessionSsr } from "../../../lib/sessionHandler";

//React & Next.js
import { useState } from 'react';
import { useRouter } from 'next/router';

//CSS
import css from "./login.module.css"

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        const sessionData = req.session.data;
        if (sessionData) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/guild"
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function LogIn(e) {
        e.preventDefault()
        setLoading(true)

        let getNowInvalid = document.getElementsByClassName("is-invalid")
        Array.from(getNowInvalid).forEach(input => {
            input.classList.remove("is-invalid")
        });

        let email = e.target.elements.email.value
        let password = e.target.elements.password.value

        let logRes = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ email: email, password: password })

        })
        if (logRes.status == 200) {
            router.push("/user")
        }
        else {
            setLoading(false)
            let response = await logRes.json()

            let getInput = document.getElementsByTagName("input")

            switch (response.message) {
                case "MISSING_ARGUMENTS":
                    setError("Please Fill All The Fields")
                    Array.from(getInput).forEach(input => {
                        if (input.value != "") return
                        input.classList.add("is-invalid")
                    });
                    break
                case "INVALID_EMAIL":
                    setError("Please Insert A Valid Email")
                    Array.from(getInput).forEach(input => {
                        if (input.id != "email") return
                        input.classList.add("is-invalid")
                    });
                    break
                case "USER_NOT_FOUND":
                    setError("Mismatch Information. User Not Found!")
                    Array.from(getInput).forEach(input => {
                        if (input.id == "email") return
                        input.classList.add("is-invalid")
                    });
                    break
            }
        }
    }

    return (
        <div className="h-100 w-100 m-0 p-0 grid row overflow-hidden">
            <div className={`h-100 px-3 col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-8 d-flex flex-column align-items-center justify-content-center ${css.containerBackground}`}>
                <div className="w-100 px-4 mb-3 justify-content-left">
                    <h2 className={`${css.title}`}>
                        Welcome Back
                    </h2>
                    <p>
                        Log in using your email and password
                    </p>
                </div>
                <form onSubmit={(e) => { LogIn(e) }} className="w-100 h-auto px-4 d-flex flex-column gap-2 align-items-center">
                    <div className="h-100 w-100 form-floating mb-4">
                        <input id="email" type="text" className={`w-100 h-100 border-0 form-control ${css.input}`} placeholder="Email" aria-label="Email" />
                        <label htmlFor="email" className={`${css.label}`}>
                            Email address
                        </label>
                        <div className="invalid-feedback">
                            {error}
                        </div>
                    </div>

                    <div className="h-100 w-100 form-floating mb-4">
                        <input id="password" type="password" className={`w-100 h-100 border-0 form-control ${css.input}`} placeholder="Password" aria-label="Password" />
                        <label htmlFor="password" className={`${css.label}`}>
                            Password
                        </label>
                        <div className="invalid-feedback">
                            {error}
                        </div>
                    </div>

                    <p className="w-100 text-end">
                        Don't Have An Account?
                        <span> </span>
                        <a className={`${css.link}`} onClick={() => router.push("/auth/signup")}>
                            SignUp
                        </a>
                    </p>
                    <button type="submit" disabled={loading} className={`w-100 btn fw-bolder ${css.button}`}>
                        Submit
                    </button>
                </form>
            </div>
            <div className={`h-100 col bg-image ${css.background}`}></div>
        </div>
    )
}