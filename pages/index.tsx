import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import Router from 'next/router'
import Link from 'next/link'

async function Logout(window) {
    await fetch("api/logout", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
    })
    Router.reload(window.location.pathname);
}

export default function SsrProfile({
    user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (<>
        <div>{user == false ? <>
            <Link href="/auth/login">
                <button>Log In</button>
            </Link>
            <Link href="/auth/signup">
                <button>SignUp</button>
            </Link>
        </> :
            <><h1>{user.id}</h1><br></br>
                <img src={user.profilePic}></img>
                <button onClick={() => Logout(window)}>Logout</button></>}</div>
    </>)
}

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const user = req.session.user;
        if (!user?.id) {
            return {
                props: {
                    user: false,
                },
            };
        }

        return {
            props: {
                user: req.session.user
            },
        };
    },
    {
        cookieName: "authcookie",
        password: "UPsYAQivZL1CTZ2pohnJFcPVyDFR1Xeh0Wn",
        // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
        cookieOptions: {
            secure: false,
        },
    },
);

