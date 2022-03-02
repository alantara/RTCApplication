export function ParseEmail(email) {
    return email
        .toString()
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export function ParseName(username) {
    return username
        .toString()
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:!@"]+(\.[^<>()[\]\\.,;:!@"]+)*))$/
        );
}

export function ParsePassword(password) {
    return password
        .toString()
        .toLowerCase()
        .match(
            /^(([^() ]+(\.[^() ]+)*))$/
        );
}

export function ParseOnlyNumbers(number) {
    return number
        .toString()
        .match(
            /^[0-9]+$/
        );
}