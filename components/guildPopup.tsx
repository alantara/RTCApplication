//Mantine
import { Button, Modal, TextInput } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useForm } from "@mantine/hooks";
import { useNotifications } from '@mantine/notifications';

//React & Nextjs
import { useState } from "react";

//Custom
import { ParseName } from "../lib/argumentParse";


function GuildPopup({ userID, newGuilds, setNewGuilds, popOpened, setPopOpened }) {

  const [popPage, setPopPage] = useState("create");
  const [guildIcon, setGuildIcon] = useState(null);
  const [guildBackground, setGuildBackground] = useState(null);
  const [btnDisabled, setBtnDisabled] = useState(false)

  const notifications = useNotifications();

  //Mantine Form System
  const createGuildForm = useForm({
    initialValues: {
      guildName: '',
    },
    validationRules: {
      guildName: (guildName) => ParseName(guildName)
    },
    errorMessages: {
      guildName: "Invalid guildName.",
    }
  });

  async function CreateGuild(values) {

    if (!values.guildName || !guildIcon || !guildBackground) {
      setBtnDisabled(false);
      return notifications.showNotification({
        title: 'Guild Creation Failed',
        message: 'Make sure to add ALL atributes.',
        color: 'red',
        disallowClose: true,
      })
    }

    const body = new FormData();
    body.append("guildName", values.guildName);
    body.append("guildIcon", guildIcon);
    body.append("guildBackground", guildBackground);

    //ImageUpload Request
    let imgUp = await fetch("./imageUpload", {
      method: "POST",
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: body
    })
    if (imgUp.status !== 201) {
      setBtnDisabled(false);
      return notifications.showNotification({
        title: 'Image API Failed',
        message: 'Try again or contact the creator',
        color: 'red',
        disallowClose: true,
      })
    }

    let filenames = await imgUp.json()

    //GuildCreation Request
    let guildCreate = await fetch("/api/guild/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        userID: userID,
        guildName: filenames.guildName,
        guildImage: `/images/${filenames.guildIconFilename}`,
        guildBackground: `/images/${filenames.guildBackgroundFilename}`,
      })
    })
    if (guildCreate.status !== 201) {
      setBtnDisabled(false);
      return notifications.showNotification({
        title: 'Guild Creation Failed',
        message: 'Something went wrong! Contact the creator.',
        color: 'red',
        disallowClose: true,
      })
    }

    setNewGuilds([...newGuilds, { guildIcon: `/images/${filenames.guildIconFilename}`, guildID: (await guildCreate.json()).id }])
    setPopOpened(false)
    setPopPage("create")
    setBtnDisabled(false)
    setGuildBackground(null)
    setGuildIcon(null)
  }

  return (
    <Modal
      opened={popOpened}
      onClose={() => { setPopOpened(false); setPopPage("create"); setGuildIcon(null); setGuildBackground(null) }}
      title={popPage == "create" ? "Create a Guild" : "Join a Guild"}
      size={700}
      centered
    >
      {
        popPage == "create" ?
          <div>
            <div style={{ backgroundImage: guildBackground ? `url(${URL.createObjectURL(guildBackground)})` : "none" }} className="w-[100%] h-[100%] bg-cover bg-center">
              <form onSubmit={createGuildForm.onSubmit((values) => { setBtnDisabled(true); CreateGuild(values) })}>
                <div className="flex gap-5 content-center py-10 px-10">
                  <TextInput id="guildName" className="flex-1"
                    styles={{
                      root: {
                        alignSelf: "center",
                      },
                      input: {
                        fontSize: "35px",
                        height: "80px",
                      },
                      error: {
                        fontSize: "12px",
                      }
                    }}
                    variant="unstyled"
                    placeholder="MySuperGuildName"
                    {...createGuildForm.getInputProps('guildName')}
                  />
                  <Dropzone
                    onDrop={(files) => { setGuildIcon(files[0]) }}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={3 * 1024 ** 2}
                    accept={["image/png", "image/jpg", "image/jpeg"]}
                    className="w-[100px] h-[100px] rounded-[50px] bg-cover bg-center"
                    style={{ backgroundImage: guildIcon ? `url(${URL.createObjectURL(guildIcon)})` : "none" }}
                  >
                    {(status) => (
                      guildIcon ?
                        <></>
                        :
                        <div className="flex justify-center">
                          <h1 className="">Guild Icon</h1>
                        </div>
                    )}
                  </Dropzone>
                </div>
                <Dropzone
                  onDrop={(files) => { setGuildBackground(files[0]) }}
                  onReject={(files) => console.log('rejected files', files)}
                  maxSize={3 * 1024 ** 2}
                  accept={["image/png", "image/jpg", "image/jpeg"]}
                  className="w-[100%] h-[150px]"
                  style={{ opacity: guildBackground ? .25 : 1 }}
                >
                  {(status) => (<>
                    {
                      guildBackground ?
                        <></>
                        :
                        <div className="flex justify-center">
                          <h1 className="">Guild Background</h1>
                        </div>
                    }
                  </>
                  )}
                </Dropzone>
                <Button disabled={btnDisabled} className="w-[40%] h-[40px] mx-[30%] my-5 place-content-center bg-[color:var(--secondary-tx-colorized)] hover:bg-[color:var(--terciary-tx-colorized)] duration-200 rounded-[15px]" type="submit">Create Guild</Button>
              </form>
            </div>

            <Button className="w-[40%] h-[40px] mx-[30%] my-5 place-content-center bg-[color:var(--secondary-tx-colorized)] hover:bg-[color:var(--terciary-tx-colorized)] duration-200 rounded-[15px]" onClick={() => { setPopPage("join"); setGuildIcon(null), setGuildBackground(null) }}>Join Guild</Button>
          </div>
          :
          <div>
            <Button className="w-[40%] h-[40px] mx-[30%] my-5 place-content-center bg-[color:var(--secondary-tx-colorized)] hover:bg-[color:var(--terciary-tx-colorized)] duration-200 rounded-[15px]" onClick={() => { setPopPage("create") }}>Join Guild</Button>
          </div>
      }
    </Modal>
  )
}

export default GuildPopup;