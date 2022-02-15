import { withSessionSsr } from "../lib/sessionHandler";
import { InferGetServerSidePropsType } from "next";

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        const user = req.session.user;
        if (!user?.username) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/auth/login"
                }
            };
        }

        return {
            redirect: {
                permanent: false,
                destination: "/user"
            }
        };
    }
);

export default function SsrProfile({

}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (<h1>Await For Redirect</h1>)
}



