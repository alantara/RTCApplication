import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import './global.css'

import Head from "next/head";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {

    return (
        <>
            <Head>
                <title>Tony Chopper - im a reindeer</title>
                <link rel="icon" type="image/png" sizes="32x32" href="/images/chopper" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Component {...pageProps} />

        </>
    )
}
