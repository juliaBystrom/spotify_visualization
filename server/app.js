require("dotenv").config();
let express = require("express");
let request = require("request");
let querystring = require("querystring");

let app = express();

let redirect_uri = process.env.REDIRECT_URI || "http://localhost:8888/callback";

let queryData = {
  client_id: process.env.CLIENT_ID,
  response_type: "code",
  state: "dummyState",
  redirect_uri: redirect_uri,
  scope: "user-read-private user-read-email",
};

app.get("/spotify_login", function (req, res) {
  res.redirect(
    "https://accounts.spotify.com/authorize?" + querystring.stringify(queryData)
  );
});

app.get("/callback", function (req, res) {
  let code = req.query.code || null;
  let error = req.query.error || null;

  // If an error is returned let the client know
  if (error) {
    console.log(`[Server] Error occured from spotify authorize:  ${error}`);

    let errorMessage =
      error === "access_denied" ? "access_denied" : "serverError";
    let uri = process.env.FRONTEND_URI || "http://localhost:3000";
    res.redirect(uri + "?error=" + errorMessage);

  } else {
    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(
            process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
          ).toString("base64"),
      },
      json: true,
    };
    request.post(authOptions, function (error, response, body) {
      var access_token = body.access_token;
      let uri = process.env.FRONTEND_URI || "http://localhost:3000";
      res.redirect(uri + "?access_token=" + access_token);
    });
  }
});

let port = process.env.PORT || 8888;
console.log(
  `Listening on port ${port}. Go /spotify_login to initiate authentication flow.`
);
app.listen(port);
