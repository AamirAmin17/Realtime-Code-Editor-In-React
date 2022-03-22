//internal imports
import React, { useState } from "react";
import "./Home.scss";
import Logo from "../../assets/images/code-sync.png";

//external imports
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Create a new room");
  };

  const joinRoom = () => {
    if (!roomId || !username)
      return toast.error("Room ID & username is requireds");

    //Redirect

    navigate(`/editor/${roomId}`, {
      state: username,
    });
  };

  const enterFunction = (e) => {
    if (e.code === "Enter") return joinRoom();
  };
  return (
    <div className="homePageWrapper">
      <header className="formWrapper">
        <img src={Logo} alt="code-sync-logo" className="homePageLogo" />
        <h4 className="mainLabel">Paste Invitation ROOM ID</h4>

        <main className="inputGroup">
          <input
            type="text"
            className="inputBox"
            value={roomId}
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={enterFunction}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={enterFunction}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          &nbsp;
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a href="" className="createNewBtn" onClick={createNewRoom}>
              new room
            </a>
          </span>
        </main>
      </header>
      <footer>
        <h4>
          Built by &nbsp;
          <a href="https://github.com/AamirAmin17/Realtime-Code-Editor-In-React">
            Aamir Muhammad Amin
          </a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
