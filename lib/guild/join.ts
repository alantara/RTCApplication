// Guild join fetch to api/guild/join


export async function LibJoinGuild(userID: number, guildID: number) {

    let guildCreate = await fetch("/api/guild/join", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            userID: userID,
            guildID: guildID,
        })
    })

    return guildCreate
}
