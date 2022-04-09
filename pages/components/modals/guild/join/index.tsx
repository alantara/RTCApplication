import { useState } from "react"
import { LibJoinGuild } from "../../../../../lib/guild/join"

import css from "./modal.module.css"

function GuildCreateModal({ user, guildsHolderState }) {

  const [modalMessage, setModalMessage] = useState("")

  async function GuildJoinForm(e) {
    e.preventDefault()

    let guildID = parseInt((document.getElementById("guildID") as HTMLInputElement).value)

    let response = await LibJoinGuild(user.id, guildID)

    if (response.status === 201) {
      let responseJSON = (await response.json()).MEMBER_GUILD[0]
      guildsHolderState.addtoGuildsHolder([...guildsHolderState.guildsHolder, responseJSON])
      return setModalMessage("Guild Created!")
    }

    switch ((await response.json()).message) {
      case "MISSING_ARGUMENTS":
        setModalMessage("Please fill all the fields")
        break
      case "INVALID_GUILD_ID":
        setModalMessage("Invalid Guild ID")
        break

    }
  }

  return (
    <div id="joinModal" className="modal fade" tabIndex={-1} aria-labelledby="joinModal" aria-hidden="true">
      <div className="modal-dialog">
        <div className={`modal-content ${css.background}`}>

          <div className="modal-header border-0">
            <h5 id="joinModal" className="modal-title">Join Guild</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalMessage("")}></button>
          </div>

          <div className="modal-body m-3 p-0 border-0 rounded d-flex flex-column">
            {
              modalMessage ?
                <>
                  {modalMessage}
                </>
                :
                <form className="p-2" onSubmit={(e) => { GuildJoinForm(e) }}>
                  <div className="p-2 col d-flex align-items-center justify-content-between">
                    <input type="text" id="guildID" className={`border-0 bg-transparent ${css.input}`} placeholder="GuildID" />
                  </div>

                  <div className="w-100 p-2 d-flex justify-content-center col">
                    <button type="submit" className="btn w-75" style={{ backgroundColor: "var(--primary-violet-bg)", color: "var(--primary-tx-color)" }}>Join</button>
                  </div>
                </form>
            }
          </div>

          <div className="modal-footer border-0">
            {
              modalMessage ? <button type="button" className="btn btn-secondary" onClick={() => { setModalMessage("") }}>Return</button> : <></>
            }

            <button type="button" className="btn btn-primary border-0" data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#createModal" style={{ backgroundColor: "var(--primary-violet-bg)" }}>Create</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuildCreateModal;