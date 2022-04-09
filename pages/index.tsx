import { withSessionSsr } from "../lib/sessionHandler";
import { InferGetServerSidePropsType } from "next";

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        return {
            props: {
            }
        };
    }
);

export default function SsrProfile({

}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <button onClick={() => {
            fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                }
            })
        }}>Logout</button>
    )
}