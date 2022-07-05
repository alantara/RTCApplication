import { withSessionSsr } from "../lib/sessionHandler";
import { InferGetServerSidePropsType } from "next";

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        const sessionData = req.session.data
        if (sessionData) {
            return {
                redirect: {
                    destination: "/guild",
                    permanent: false
                }
            }
        }

        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            }
        };
    }
);

export default function SsrProfile({

}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <p>Await Redirect</p>

            <p>if not redirected <a href="/auth/login">Click Me</a>!</p>
        </>
    )
}