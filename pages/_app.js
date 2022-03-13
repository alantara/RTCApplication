import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import '../public/styles/global.css'

import Head from "next/head";
import { useEffect } from 'react';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {

    useEffect(() => {
        const bootstrap = require('bootstrap')
    })

    return (
        <>
            <Head>
                <title>月(Tsuki) - A Simple Chat App</title>
                <link rel="icon" type="image/png" sizes="32x32" href="/d_images/favicon.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Component {...pageProps} />

        </>
    )
}
