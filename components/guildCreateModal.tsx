import { useState } from "react"

function GuildCreateModal({ newGuilds, setNewGuilds, user }) {

  const [btnDisabled, setBTNDisabled] = useState(false)
  const [guildIcon, setGuildIcon] = useState(null)
  const [guildBackground, setGuildBackground] = useState(null)

  async function GuildCreate(e, guildName) {
    e.preventDefault()
    setBTNDisabled(true)

    if (!guildName || !guildIcon || !guildBackground) return setBTNDisabled(false)


    const body = new FormData();
    body.append("guildName", guildName);
    body.append("guildIcon", guildIcon);
    body.append("guildBackground", guildBackground);

    let imgUp = await fetch("./imageUpload", {
      method: "POST",
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: body
    })
    if (imgUp.status !== 201) {
      setBTNDisabled(false)
    }

    let filenames = await imgUp.json()
    let guildCreate = await fetch("/api/guild/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        userID: user.id,
        guildName: filenames.guildName,
        guildImage: `/images/${filenames.guildIconFilename}`,
        guildBackground: `/images/${filenames.guildBackgroundFilename}`,
      })
    })
    if (guildCreate.status !== 201) {
      setBTNDisabled(false);
    }

    setNewGuilds([...newGuilds, { guildIcon: `/images/${filenames.guildIconFilename}`, guildID: (await guildCreate.json()).id }])
    setBTNDisabled(false)

  }

  return (
    <div id="createModal" className="modal fade" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content" style={{ backgroundColor: "var(--quaternary-black-bg)" }}>

          <div className="modal-header border-0">
            <h5 id="exampleModalLabel" className="modal-title" style={{ color: "var(--secondary-tx-colorized)" }}>Create Guild</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div className="modal-body m-3 p-0 border-0 rounded d-flex flex-column" style={{ backgroundImage: guildBackground ? `url(${URL.createObjectURL(guildBackground)})` : "none", backgroundPosition: "center", backgroundSize: "cover" }}>
            <form className="p-2" style={{ background: guildBackground ? "#00000050" : "#00000000" }} onSubmit={(e) => { GuildCreate(e, (document.getElementById("guildName") as HTMLInputElement).value) }}>
              <div className="p-2 col d-flex align-items-center justify-content-between">
                <input type="text" id="guildName" className="border-0 bg-transparent" placeholder="My Super Guild" style={{ height: "50px", width: "70%", outline: 0, color: "var(--primary-tx-color)", fontSize: "30px" }} />

                <label htmlFor="guildIcon" className="m-2 rounded d-flex flex-column align-items-center justify-content-center" style={{ height: "100px", width: "100px", border: guildIcon ? "none" : "2px dashed #dddddd90", cursor: "pointer", backgroundImage: guildIcon ? `url(${URL.createObjectURL(guildIcon)})` : "none", backgroundPosition: "center", backgroundSize: "cover" }}>
                  <input type="file" className="" id="guildIcon" style={{ display: "none" }} onChange={(e) => { setGuildIcon(e.target.files[0]) }} />
                  <i className="bi bi-file-earmark-image" style={{ fontSize: "50px", opacity: guildIcon ? 0 : 1 }}></i>
                </label>
              </div>

              <div className="w-100 col">
                <label htmlFor="guildBackground" className="rounded d-flex flex-column align-items-center justify-content-center" style={{ height: "100px", width: "100%", border: guildBackground ? "2px dashed #dddddd25" : "2px dashed #dddddd90", cursor: "pointer" }}>
                  <input type="file" className="w-100" id="guildBackground" style={{ opacity: 0 }} onChange={(e) => { setGuildBackground(e.target.files[0]) }} />
                  <i className="bi bi-image" style={{ fontSize: "50px", opacity: guildBackground ? 0 : 1 }}></i>
                </label>
              </div>

              <div className="w-100 p-2 d-flex justify-content-center col">
                <button type="submit" className="btn w-75" disabled={btnDisabled} onClick={() => { setBTNDisabled(true) }} style={{ backgroundColor: "var(--primary-violet-bg)", color: "var(--primary-tx-color)" }}>Create</button>
              </div>
            </form>
          </div>

          <div className="modal-footer border-0">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary border-0" data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#joinModal" style={{ backgroundColor: "var(--primary-violet-bg)" }}>Join</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuildCreateModal;