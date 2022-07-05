//React
import { useState } from "react"

//Create Functions
import { LibGuildCreate } from "../../../../../lib/guild/create";
import { LibFetchImage } from "../../../../../lib/image/fetch";

//CSS
import css from "./modal.module.css"

function GuildCreateModal({ user, guildsHolderState, modalMethods }) {

  const [guildIcon, setGuildIcon] = useState(null)
  const [guildName, setGuildName] = useState("My Super Guild")
  const [modalMessage, setModalMessage] = useState("")

  async function GuildCreateForm(e) {
    e.preventDefault()

    let guildIconFetch = await LibFetchImage(guildIcon)

    if (guildIconFetch.status !== 201) return setModalMessage("Invalid File. Be sure to add a .jpg, .jpeg, .png or .gif format file!\n If the problem persists, contact an Contributor")
    let guildIconFilename = (await guildIconFetch.json()).FILENAME

    let response = await LibGuildCreate(user.id, guildName, guildIconFilename)

    if (response.status === 201) {
      let responseJSON = (await response.json()).CREATE_GUILD[0]
      guildsHolderState.set([...guildsHolderState.data, responseJSON])
      return modalMethods("create", "hide")
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

  const closeModal = () => {
    modalMethods("create", "hide")

    setGuildIcon(null)
    setGuildName("My Super Guild")
    setModalMessage("")
  }

  const changeModal = (next: string) => {
    modalMethods("create", "hide")
    modalMethods(next, "show")

    setGuildIcon(null)
    setGuildName("My Super Guild")
    setModalMessage("")
  }

  return (
    <div id="createModal" className="modal fade" tabIndex={-1} data-bs-backdrop="static">
      <div className="modal-dialog">

        <div className={`modal-content ${css.background}`}>

          <div className="modal-header border-dark">
            <h5 id="createModal" className="modal-title">Create Guild</h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={closeModal}></button>
          </div>

          <div className="modal-body">

            <form onSubmit={(e) => { GuildCreateForm(e) }}>

              <div className={`${css.inputContainer}`}>

                <div className={`form-floating ${css.nameInputContainer}`}>
                  <input id="guildName" type="text" placeholder="Guild Name" className="form-control" value={guildName} onChange={(e) => setGuildName(e.target.value)} />
                  <label htmlFor="guildName" className={`${css.label}`}>Guild Name</label>
                </div>

                <div className={`${css.fileInputContainer}`}>
                  <label htmlFor="guildIcon" style={{ border: guildIcon ? "none" : "2px dashed #dddddd90", backgroundImage: guildIcon ? `url(${URL.createObjectURL(guildIcon)})` : "none" }}>
                    <input type="file" id="guildIcon" style={{ display: "none" }} onChange={(e) => { setGuildIcon(e.target.files[0]) }} />
                    <i className="bi bi-file-earmark-image" style={{ fontSize: "50px", opacity: guildIcon ? 0 : 1 }}></i>
                  </label>
                </div>
              </div>

              <div>
                {modalMessage ? <p>{modalMessage}</p> : <></>}
              </div>

              <div className="text-center">
                <button type="submit" className={`btn ${css.submitButton}`}>Create</button>
              </div>

            </form>

          </div>

          <div className="modal-footer border-dark">
            <button type="button" className={`btn ${css.footerButtons}`} onClick={() => changeModal("join")}>Join</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuildCreateModal;