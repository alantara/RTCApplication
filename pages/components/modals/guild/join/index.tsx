//React
import { useState } from "react"

//Join Functions
import { LibJoinGuild } from "../../../../../lib/guild/join"

//CSS
import css from "./modal.module.css"

function GuildCreateModal({ user, guildsHolderState, modalMethods }) {

  const [guildID, setGuildID] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  async function GuildJoinForm(e) {
    e.preventDefault()

    let response = await LibJoinGuild(user.id, parseInt(guildID))

    if (response.status === 201) {
      let responseJSON = (await response.json()).MEMBER_GUILD[0]
      guildsHolderState.set([...guildsHolderState.data, responseJSON])
      return setModalMessage("Guild Created!")
    }

    switch ((await response.json()).message) {
      case "MISSING_ARGUMENTS":
        setModalMessage("Please fill all the fields")
        break
      case "INVALID_GUILD_ID":
        setModalMessage("Invalid Guild ID")
        break
      case "MEMBER_GUILD_ERROR":
        setModalMessage("Guild ID probably is non existant")
        break
    }
  }

  const closeModal = () => {
    modalMethods("join", "hide")

    setGuildID("")
    setModalMessage("")
  }

  const changeModal = (next: string) => {
    modalMethods("join", "hide")
    modalMethods(next, "show")

    setGuildID("")
    setModalMessage("")
  }

  return (
    <div id="joinModal" className="modal fade" tabIndex={-1} data-bs-backdrop="static">
      <div className="modal-dialog">

        <div className={`modal-content ${css.background}`}>

          <div className="modal-header border-dark">
            <h5 id="joinModal" className="modal-title">Join Guild</h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={closeModal}></button>
          </div>

          <div className="modal-body">

            <form onSubmit={(e) => { GuildJoinForm(e) }}>

              <div className={`${css.inputContainer}`}>

                <div className={`form-floating ${css.nameInputContainer}`}>
                  <input id="guildID" type="text" placeholder="Guild ID" className="form-control" value={guildID} onChange={(e) => setGuildID(e.target.value)} />
                  <label htmlFor="guildID" className={`${css.label}`}>Guild ID</label>
                </div>
              </div>

              <div>
                {modalMessage ? <p>{modalMessage}</p> : <></>}
              </div>

              <div className="text-center">
                <button type="submit" className={`btn ${css.submitButton}`}>Join</button>
              </div>

            </form>

          </div>

          <div className="modal-footer border-dark">
            <button type="button" className={`btn ${css.footerButtons}`} onClick={() => changeModal("create")}>Create</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuildCreateModal;