export function ParseEmail(email) {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export function ParseUsername(username) {
    return username
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:!\s@"]+(\.[^<>()[\]\\.,;:!\s@"]+)*))$/
        );
}

export function ParsePassword(password) {
    return password
        .toLowerCase()
        .match(
            /^(([^() ]+(\.[^() ]+)*))$/
        );
}