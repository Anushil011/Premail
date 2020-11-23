require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//project credentials
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const refreshToken = process.env.REFRESH_TOKEN;
const user = process.env.USER;

app.post("/sendemail", (req, res) => {
  console.log("post sendmail");
  //creating oAuth2Client to get refresh token and access token later on
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  //getting refresh token
  oAuth2Client.setCredentials({ refresh_token: refreshToken });

  //function to send email
  const sendmail = async () => {
    try {
      //creating new accessToken
      const accessToken = await oAuth2Client.getAccessToken();

      //transporter
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: user,
          clientId: clientId,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
          accessToken: accessToken,
        },
      });

      //sending options
      const option = {
        from: user,
        to: req.body.email,
        subject: "test",
        text:
          "name: " +
          req.body.name +
          " email: " +
          req.body.email +
          "message: " +
          req.body.textMessage,
      };

      const result = await transport.sendMail(option);
      return result;
    } catch (error) {
      return error;
    }
  };

  //calling function to send the email
  const mail = setTimeout(() => {
    sendmail()
      .then((result) => {
        console.log("email sent ", result);
        clearTimeout(mail);
      })
      .catch((error) => console.log(error.message));
  }, req.body.time);
});

app.listen(5000, () => {
  console.log(`server is running on port 5000`);
});
