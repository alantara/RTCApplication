import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { DBConnect } from "./dbconnect"

export default withIronSessionApiRoute(
    async function SignUp(req: NextApiRequest, res: NextApiResponse) {
        const knex = DBConnect()

        if (!req.body.username || !req.body.email || !req.body.password) return res.status(400).send("INPUT_BLANK")

        //PARSE EMAIL req.body.email

        knex.raw(`select credential from users where credential = "${req.body.email}"`)
            .then((response) => {
                let emailArray = response[0]
                if (emailArray.length != 0) {
                    res.status(401).send("EMAIL_TAKEN")
                }
            })
            .catch((err) => {
                console.log(`[Error] > Dir(/api/signup.ts)\n    ${err}`)
                res.status(500).send("DATABASE_ERROR")
            })

        //PARSE Username req.body.username

        knex.raw(`select username from users where username = "${req.body.username}"`)
            .then((response) => {
                let usernameArray = response[0]
                if (usernameArray.length != 0) {
                    res.status(401).send("USERNAME_TAKEN")
                }
            })
            .catch((err) => {
                console.log(`[Error] > Dir(/api/signup.ts)\n    ${err}`)
                res.status(500).send("DATABASE_ERROR")
            })

        //PARSE KEYWORD

        let profilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"

        await knex.raw(`insert into users (username, credential, keyword, createdAt, profileImage) values ('${req.body.username}', '${req.body.email}', '${req.body.password}', ${Date.now()}, "${profilePic}")`)
            .then(async () => {
                req.session.user = {
                    id: req.body.username,
                    profilePic: profilePic
                };
                await req.session.save();
                res.status(201).send({ message: "USER_CREATED" })
            })
            .catch((err) => {
                console.log(`[Error] > Dir(/api/signup.ts)\n    ${err}`)
                res.status(500).send("DATABASE_ERROR")
            })
    },
    {
        cookieName: "authcookie",
        password: "UPsYAQivZL1CTZ2pohnJFcPVyDFR1Xeh0Wn",
        // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
        cookieOptions: {
            secure: false,
        },
    },

)