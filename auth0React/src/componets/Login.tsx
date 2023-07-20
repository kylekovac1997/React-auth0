import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import React from "react";

function Login() {
  const { loginWithRedirect, getAccessTokenSilently } = useAuth0();

  function callApi() {
    axios
      .get("http://localhost:4000/")
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error.message));
  }

  async function callProtectedApi() {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get("http://localhost:4000/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    // axios
    //   .get("http://localhost:4000/protected")
    //   .then((response) => console.log(response.data))
    //   .catch((error) => console.log(error.message));
  }

  return (
    <>
      <div>
        <button onClick={() => loginWithRedirect()}>login in</button>
      </div>
      <ul>
        <li>
          <button onClick={callApi}>call api route</button>
        </li>
        <li>
          <button onClick={callProtectedApi}>call protected api route</button>
        </li>
      </ul>
    </>
  );
}

export default Login;
