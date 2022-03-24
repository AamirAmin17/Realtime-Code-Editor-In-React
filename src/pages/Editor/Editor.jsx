//internal imports
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/images/code-sync.png";
import Actions from "../../constants/actions/Actions";
import Client from "../../components/Client";
import EditorComponent from "../../components/Editor";
import { initSocket } from "../../client/socket";
import "./Editor.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Editor = () => {
  const [clients, setClients] = useState([]);

  const location = useLocation();
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const codeRef = useRef(null);

  const reactNavigate = useNavigate();

  function handleErrors(e) {
    toast.error(`socket connection failed error: ${e}`);
    reactNavigate("/");
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));
      socketRef.current.emit(Actions.JOIN, {
        roomId,
        username: location.state,
      });

      //Listening for joined event
      socketRef.current.on(
        Actions.JOINED,
        ({ clients, username, socketId }) => {
          toast.success(`${username} joined the room`);
          setClients(clients);
          socketRef.current.emit(Actions.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      //Listening for disconnected clients

      socketRef.current.on(Actions.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };

    init();

    return () => {
      socketRef.current.off(Actions.JOINED);
      socketRef.current.off(Actions.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied");
    } catch (error) {
      toast.error("Could not copy the Room ID please try again later");
      console.log("error", error);
    }
  }
  function leaveRoom() {
    reactNavigate("/");
  }

  return (
    <div className='mainWrap'>
      <aside className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img className='logoImage' src={Logo} alt='logo' />
          </div>
          <h3>Connected</h3>
          <section className='clientsList'>
            {clients.map((client) => (
              <Client key={client.sockedId} username={client.username} />
            ))}
          </section>
        </div>

        <button className='btn copyBtn' onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className='btn leaveBtn' onClick={leaveRoom}>
          Leave
        </button>
      </aside>
      <main className='editorWrap'>
        <EditorComponent
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </main>
    </div>
  );
};

export default Editor;
