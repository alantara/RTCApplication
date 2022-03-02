//Essentials
import { InferGetServerSidePropsType } from "next";
import { withSessionSsr } from "../../../lib/sessionHandler";

//Mantine
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { TextInput, PasswordInput, Title, Button, createStyles } from '@mantine/core';

//React & Next.js
import { useState } from 'react';
import { useRouter } from 'next/router';

//Custom
import { ParseEmail, ParsePassword } from "../../../lib/argumentParse"


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
    const notifications = useNotifications();

    const [loading, setLoading] = useState(false);


    //Custom Functions
    async function LogIn(values) {
        setLoading(true)

        let logRes = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ email: values.email, password: values.password })

        })
        if (logRes.status == 200) {
            router.push("/user")
        }
        else {
            setLoading(false)
            let response = await logRes.json()
            console.log(response)
            notifications.showNotification({
                id: 'hello-there',
                disallowClose: true,
                onClose: () => console.log('unmounted'),
                onOpen: () => console.log('mounted'),
                autoClose: 5000,
                title: `Error ${logRes.status}`,
                message: `${response.message}`,
                color: 'red',
                className: 'my-notification-class',
                style: { backgroundColor: 'red' },
                loading: false,
            });
        }

    }

    const signForm = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validationRules: {
            email: (email) => ParseEmail(email),
            password: (password) => ParsePassword(password),
        },
        errorMessages: {
            email: "Invalid Email",
            password: "Invalid Password.",
        }
    });

    const { classes } = createStyles((theme) => ({
        root: {
            marginTop: "5px",
            borderLeft: "3px solid var(--secondary-tx-colorized)",
        },
        label: {
            paddingLeft: "12px",
        },
        input: {
            paddingLeft: "12px",
        },
        error: {
            paddingLeft: "12px",
            fontSize: "12px",
        }
    }))();

    return (
        <div className="grid h-full grid-cols-[440px_auto]" >
            <div className="bg-[color:var(--primary-bg-color)] flex flex-col items-left justify-center p-[20px_40px]">
                <div className="mb-[20px] cursor-default">
                    <Title order={2} className="text-[color:var(--secondary-tx-colorized)]">Welcome Back</Title>
                    <Title order={4} className="font-normal text-[15px]">Log in to your account using email and password</Title>
                </div>
                <form onSubmit={signForm.onSubmit((values) => LogIn(values))} className="flex flex-col gap-[10px_0] max-w-[80%]">
                    <TextInput classNames={classes} variant="unstyled" placeholder="youremail@gmail.com" label="Email" required {...signForm.getInputProps('email')} />
                    <PasswordInput classNames={classes} variant="unstyled" placeholder="VerySecretPassword" label="Password" required {...signForm.getInputProps('password')} />
                    <p className="text-[color:var(--secondary-tx-color)] mt-[10px] text-[14px] text-right cursor-default">Don't Have An Account?
                        <a className="text-[color:var(--secondary-tx-colorized)] hover:text-[color:var(--terciary-tx-colorized)] ease-in-out duration-500 cursor-pointer underline" onClick={() => router.push("/auth/signup")}>Log In</a>
                    </p>
                    <Button className="bg-[color:var(--secondary-tx-colorized)] hover:bg-[color:var(--terciary-tx-colorized)] ease-in-out duration-500" type='submit' color="violet" loading={loading}>LOGIN</Button>
                </form>
            </div>
            <div className="bg-[color:var(--secondary-bg-color)] bg-center bg-cover">

            </div>
        </div >
    )
}