//Next & React
import { useEffect, useState } from "react";

function GuildJoinModal({ }) {

  const [guildIcon, setGuildIcon] = useState(null)
  const [guildBackground, setGuildBackground] = useState(null)

  return (
    <div id="joinModal" className="modal fade" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content" style={{ backgroundColor: "var(--quaternary-bg-color)" }}>

          <div className="modal-header border-0">
            <h5 id="exampleModalLabel" className="modal-title" style={{ color: "var(--secondary-tx-colorized)" }}>Join Guild</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div className="modal-body p-3 border-0 d-flex flex-column">
            <form className="p-2 rounded" style={{ backgroundImage: guildBackground ? `linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) , url(${URL.createObjectURL(guildBackground)}))` : "none", backgroundPosition: "center", backgroundSize: "cover" }}>

              <div className="p-2 col d-flex align-items-center justify-content-between">
                <input type="text" id="" className="border-0 bg-transparent" placeholder="My Super Guild" style={{ height: "50px", width: "70%", outline: 0, color: "var(--primary-tx-color)", fontSize: "30px" }} />

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
            </form>
          </div>

          <div className="modal-footer border-0">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#createModal">Create</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuildJoinModal;