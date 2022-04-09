// Guild create fetch to api/guild/create


export async function LibGuildCreate(userID: number, guildName: string, guildIcon: string) {

    let guildCreate = await fetch("/api/guild/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            userID: userID,
            guildName: guildName,
            guildImage: `/images/${guildIcon}`,
        })
    })

    return guildCreate
}
