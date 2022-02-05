import { withSessionSsr } from "../../lib/sessionHandler";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from 'next/router'
import style from "./profile.module.css"



export default function SsrProfile({
    user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    let router = useRouter()

    async function Logout(window) {
        await fetch("api/auth/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
        })
        router.push("/auth/login");
    }

    return (<>
        <div className={style.body} >
            <div id="container" className={`${style.container}`}>

            </div>
            <div id="profile" className={`${style.profile} ${style.slideAnimSet} ${style.slideAnim}`}>
                <div className={style.header}>
                    <img src={user.profilePic} />
                    <h2>{user.username}</h2>
                    <h4>{user.email}</h4>
                    <button onClick={() => Logout(window)}>LogOut</button>
                </div>
            </div>
            <div className={style.right}></div>
        </div>

    </>)
}

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        const user = req.session.user;
        if (!user?.username) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/auth/login"
                }
            }
        }

        return {
            props: {
                user: req.session.user
            },
        };
    }
);

