import { useRouter } from "next/router"
import { useState } from "react"
import { LibGuildCreate } from "../../../../../lib/guild/create";
import { LibFetchImage } from "../../../../../lib/image/fetch";

import css from "./modal.module.css"

function GuildCreateModal({ user, guildsHolderState }) {

  const [guildIcon, setGuildIcon] = useState(null)
  const [modalMessage, setModalMessage] = useState("")

  async function GuildCreateForm(e) {
    e.preventDefault()

    let guildName = (document.getElementById("guildName") as HTMLInputElement).value

    let guildIconFetch = await LibFetchImage(guildIcon)

    if (guildIconFetch.status !== 201) return setModalMessage("Invalid File. Be sure to add a .jpg, .jpeg, .png or .gif format file!\n If the problem persists, contact an Contributor")
    let guildIconFilename = (await guildIconFetch.json()).FILENAME

    let response = await LibGuildCreate(user.id, guildName, guildIconFilename)

    if (response.status === 201) {
      let responseJSON = (await response.json()).CREATE_GUILD[0]
      guildsHolderState.addtoGuildsHolder([...guildsHolderState.guildsHolder, responseJSON])
      return setModalMessage("Guild Created!")
    }

    switch ((await response.json()).message) {
      case "MISSING_ARGUMENTS":
        setModalMessage("Please fill all the fields")
        break
      case "INVALID_GUILD_NAME":
        setModalMessage("Invalid Guild name")
        break

    }
  }

  return (
    <div id="createModal" className="modal fade" tabIndex={-1} aria-labelledby="createModal" aria-hidden="true">
      <div className="modal-dialog">
        <div className={`modal-content ${css.background}`}>

          <div className="modal-header border-0">
            <h5 id="createModal" className="modal-title">Create Guild</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalMessage("")}></button>
          </div>

          <div className="modal-body m-3 p-0 border-0 rounded d-flex flex-column">
            {
              modalMessage ?
                <>
                  {modalMessage}
                </>
                :
                <form className="p-2" onSubmit={(e) => { GuildCreateForm(e) }}>
                  <div className="p-2 col d-flex align-items-center justify-content-between">
                    <input type="text" id="guildName" className={`border-0 bg-transparent ${css.input}`} placeholder="My Super Guild" />

                    <label htmlFor="guildIcon" className="m-2 rounded d-flex flex-column align-items-center justify-content-center" style={{ height: "100px", width: "100px", border: guildIcon ? "none" : "2px dashed #dddddd90", cursor: "pointer", backgroundImage: guildIcon ? `url(${URL.createObjectURL(guildIcon)})` : "none", backgroundPosition: "center", backgroundSize: "cover" }}>
                      <input type="file" className="" id="guildIcon" style={{ display: "none" }} onChange={(e) => { setGuildIcon(e.target.files[0]) }} />
                      <i className="bi bi-file-earmark-image" style={{ fontSize: "50px", opacity: guildIcon ? 0 : 1 }}></i>
                    </label>
                  </div>

                  <div className="w-100 p-2 d-flex justify-content-center col">
                    <button type="submit" className="btn w-75" style={{ backgroundColor: "var(--primary-violet-bg)", color: "var(--primary-tx-color)" }}>Create</button>
                  </div>
                </form>
            }
          </div>

          <div className="modal-footer border-0">
            {
              modalMessage ? <button type="button" className="btn btn-secondary" onClick={() => { setModalMessage("") }}>Return</button> : <></>
            }

            <button type="button" className="btn btn-primary border-0" data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#joinModal" style={{ backgroundColor: "var(--primary-violet-bg)" }}>Join</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuildCreateModal;