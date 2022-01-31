import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import Router from 'next/router'


async function Send(window, data) {
    await fetch("api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ data })

    })
}

async function Logout(window) {
    await fetch("api/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ name: "Xarobil" })
    })
    Router.reload(window.location.pathname);
}

export default function SsrProfile({
    user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (<>
        <div>{user == false ? <><input id="username"></input><input id="password"></input><button onClick={() => Send(window, { username: document.getElementById("username").value, password: document.getElementById("password").value })}>Button</button></> : <><h1>{user.id}</h1><br></br><button onClick={() => Logout(window)}>Logout</button></>}</div>
    </>)
}

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const user = req.session.user;
        console.log(user)
        if (!user?.id) {
            return {
                props: {
                    user: false,
                },
            };
        }

        return {
            props: {
                user: req.session.user,
            },
        };
    },
    {
        cookieName: "myapp_cookiename",
        password: "UPsYAQivZL1CTZ2pohnJFcPVyDFR1Xeh0Wn",
        // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
        cookieOptions: {
            secure: false,
        },
    },
);

