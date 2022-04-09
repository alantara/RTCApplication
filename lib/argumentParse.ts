// Argument parse snippet


export function LibParseEmail(email: string) {
    return email
        .toString()
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export function LibParseName(username: string) {
    return username
        .toString()
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:!@"]+(\.[^<>()[\]\\.,;:!@"]+)*))$/
        );
}

export function LibParsePassword(password: string) {
    return password
        .toString()
        .toLowerCase()
        .match(
            /^(([^() ]+(\.[^() ]+)*))$/
        );
}

export function LibParseOnlyNumbers(number: number) {
    return number
        .toString()
        .match(
            /^[0-9]+$/
        );
}