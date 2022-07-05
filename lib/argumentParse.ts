// Argument parse snippet

//parse email argument with regex
export const LibParseEmail = (email: string) => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) return false;
    return true;
}

//parse password argument with regex
export const LibParsePassword = (password: string) => {
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) return false;
    return true;
}

//parse username argument with regex
export const LibParseUsername = (username: string) => {
    let usernameRegex = /^[a-zA-Z0-9]{3,}$/;
    if (!usernameRegex.test(username)) return false;
    return true;
}

//parse name argument with regex
export const LibParseName = (name: string) => {
    let nameRegex = /^[a-zA-Z0-9]{3,}$/;
    if (!nameRegex.test(name)) return false;
    return true;
}

//parse numberonly argument with regex
export const LibParseNumberOnly = (number: string) => {
    let numberRegex = /^[0-9]{1,}$/;
    if (!numberRegex.test(number)) return false;
    return true;
}