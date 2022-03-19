//Essentials
import { InferGetServerSidePropsType } from "next";
import { withSessionSsr } from "../../../lib/sessionHandler";

//React & Next.js
import { useState } from 'react';
import { useRouter } from 'next/router';

//CSS
import css from "./signup.module.css"


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

            }
        }
    }
);


export default function SsrProfile({

}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    async function SignUp(e) {
        e.preventDefault()

        setLoading(true)

        let username = e.target.elements.username.value
        let email = e.target.elements.email.value
        let password = e.target.elements.password.value
        let cpassword = e.target.elements.cpassword.value

        if (password != cpassword) return

        let signRes = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ username: username, email: email, password: password })

        })
        if (signRes.status == 201) {
            router.push("/user")
        }
        else {
            setLoading(false)
            let response = await signRes.json()

        }
    }

    return (

        <div className="h-100 w-100 m-0 p-0 grid row overflow-hidden">
            <div className={`h-100 px-3 col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-8 d-flex flex-column align-items-center justify-content-center overflow-auto ${css.containerBackground}`}>
                <div className="w-100 px-4 mb-3 justify-content-left">
                    <h2 className={`${css.title}`}>
                        Welcome Back
                    </h2>
                    <h6>
                        Log in using your email and password
                    </h6>
                </div>
                <form onSubmit={(e) => { SignUp(e) }} className="w-100 h-auto px-4 d-flex flex-column gap-2 align-items-center">

                    <div className="w-100 h-100 d-flex mb-4">
                        <div className="w-100 h-100 form-floating me-auto">
                            <input id="username" type="text" className={`w-100 h-100 px-2 border-0 form-control ${css.input}`} placeholder="Username" aria-label="Username" />
                            <label htmlFor="username" className={`${css.label}`}>
                                Username
                            </label>
                        </div>
                    </div>

                    <div className="h-100 w-100 form-floating mb-4">
                        <input id="email" type="text" className={`w-100 h-100 border-0 form-control ${css.input}`} placeholder="Email" aria-label="Email" />
                        <label htmlFor="email" className={`${css.label}`}>
                            Email address
                        </label>
                    </div>

                    <div className="h-100 w-100 form-floating mb-4">
                        <input id="password" type="password" className={`w-100 h-100 border-0 form-control ${css.input}`} placeholder="Password" aria-label="Password" />
                        <label htmlFor="password" className={`${css.label}`}>
                            Password
                        </label>
                    </div>
                    <div className="h-100 w-100 form-floating mb-4">
                        <input id="cpassword" type="password" className={`w-100 h-100 border-0 form-control ${css.input}`} placeholder="Confirm Password" aria-label="Confirm Password" />
                        <label htmlFor="password" className={`${css.label}`}>
                            Confirm Password
                        </label>
                    </div>
                    <p className="w-100 text-end">Don't Have An Account?
                        <a className={`${css.link}`} onClick={() => router.push("/auth/login")}>Log In</a>
                    </p>
                    <button disabled={loading} type="submit" className={`w-100 btn fw-bolder ${css.button}`}>Submit</button>
                </form>
            </div>
            <div className={`h-100 col bg-image ${css.background}`}></div>
        </div>
    )
}