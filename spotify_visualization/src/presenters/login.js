import React, { useState, useEffect } from "react";
import { SPOTIFY_LOGIN_URL } from "../Constants";

export default function Login() {
  const [userToken, setUserToken] = useState();
  const [error, setError] = useState();
  const [name, setName] = useState("");

  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    let errorMessage = urlParams.get("error");
    if (errorMessage) {
      console.log("Error:");
      console.log(errorMessage);
      setError(errorMessage);
    } else {
      let access_token = urlParams.get("access_token");
      console.log("access_token");
      console.log(access_token);
      if (access_token) {
        setUserToken(urlParams.get("access_token"));
      }
    }
  }, []);

  function getData() {
    console.log(userToken);
    if (userToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + userToken },
      })
        .then((response) => response.json())
        .then((data) => {
          setName(data.display_name);
          console.log(data);
        });
    }
  }

  return (
    <div>
      <h1>{name}</h1>

      {userToken ? (
        <div>
          <p> Your usertoken: {userToken}</p>
          <button onClick={() => getData()}>Get Data</button>
        </div>
      ) : (
        <div>
          <p>Login</p>
          <button
            onClick={() => {
              window.location = SPOTIFY_LOGIN_URL;
            }}
          >
            Login to Spotify
          </button>
        </div>
      )}
    </div>
  );
}
