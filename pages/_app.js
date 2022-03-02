import '../public/styles/global.css'
import '../public/styles/tailwind.css'
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {

    return (
        <MantineProvider theme={{
            colorScheme: 'dark',
            fontFamily: 'Rubik, sans-serif',
            headings: { fontFamily: 'Rubik, sans-serif', },
        }}>
            <NotificationsProvider>
                <Component {...pageProps} />
            </NotificationsProvider>
        </MantineProvider>
    )
}
