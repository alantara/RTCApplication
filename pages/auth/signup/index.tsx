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
import { ParseEmail, ParsePassword, ParseName } from "../../../lib/argumentParse"


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
    const notifications = useNotifications();

    const [loading, setLoading] = useState(false);


    //Custom Functions
    async function SignUp(values) {
        setLoading(true)

        let signRes = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ username: values.username, email: values.email, password: values.password })

        })
        if (signRes.status == 201) {
            router.push("/user")
        }
        else {
            setLoading(false)
            let response = await signRes.json()
            notifications.showNotification({
                id: 'hello-there',
                disallowClose: true,
                onClose: () => console.log('unmounted'),
                onOpen: () => console.log('mounted'),
                autoClose: 5000,
                title: `Error ${signRes.status}`,
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
            username: '',
            password: '',
            cpassword: '',
        },

        validationRules: {
            email: (email) => ParseEmail(email),
            username: (username) => ParseName(username),
            password: (password) => ParsePassword(password),
            cpassword: (cpassword, values) => ParsePassword(cpassword) && cpassword == values.password
        },
        errorMessages: {
            email: "Invalid Email",
            username: "Invalid Username.",
            password: "Invalid Password.",
            cpassword: "Passwords Not Matching",
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
                    <Title order={2} className="text-[color:var(--secondary-tx-colorized)]">Welcome</Title>
                    <Title order={4} className="font-normal text-[15px]">Create an account with your email</Title>
                </div>
                <form onSubmit={signForm.onSubmit((values) => SignUp(values))} className="flex flex-col gap-[10px_0] max-w-[80%]">
                    <TextInput classNames={classes} variant="unstyled" placeholder="example@gmail.com" label="Email" required {...signForm.getInputProps('email')} />
                    <TextInput classNames={classes} variant="unstyled" placeholder="User1234" label="Username" required {...signForm.getInputProps('username')} />
                    <PasswordInput classNames={classes} variant="unstyled" placeholder="VerySecretPassword" label="Password" required {...signForm.getInputProps('password')} />
                    <PasswordInput classNames={classes} variant="unstyled" placeholder="VerySecretPassword" label="Confirm Password" required {...signForm.getInputProps('cpassword')} />
                    <p className="text-[color:var(--secondary-tx-color)] mt-[10px] text-[14px] text-right cursor-default">Already Have An Account?
                        <a className="text-[color:var(--secondary-tx-colorized)] hover:text-[color:var(--terciary-tx-colorized)] ease-in-out duration-500 cursor-pointer underline" onClick={() => router.push("/auth/login")}>Log In</a>
                    </p>
                    <Button className="bg-[color:var(--secondary-tx-colorized)] hover:bg-[color:var(--terciary-tx-colorized)] ease-in-out duration-500" type='submit' loading={loading}>SIGNUP</Button>
                </form>
            </div>
            <div className="bg-[color:var(--secondary-bg-color)] bg-center bg-cover">

            </div>
        </div >
    )
}