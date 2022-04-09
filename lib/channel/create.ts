// Channel create fetch to api/channel/create


export async function LibChannelCreate(channelName: string, guildID: number, channelType: string) {

    let channelCreate = await fetch("/api/channels/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            guildID: guildID,
            channelName: channelName,
            channelType: channelType
        })

    })

    return channelCreate
}
