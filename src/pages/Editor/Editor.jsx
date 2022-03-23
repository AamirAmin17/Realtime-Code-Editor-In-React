//internal imports
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/images/code-sync.png";
import Client from "../../components/Client";
import EditorComponent from "../../components/Editor";
import { initSocket } from "../../client/socket";
// import Actions from "../../constants/actions/actions";
import "./Editor.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
const Editor = () => {
  const [clients, setClients] = useState([
    { sockedId: 1, username: "Aamir Amin" },
    { sockedId: 2, username: "Ali Aslam" },
  ]);
  const location = useLocation();
  const { roomId } = useParams();
  const socketRef = useRef(null);

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
        username: location.state?.username,
      });
    };
    init();
  }, []);

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

        <button className='btn copyBtn'>Copy ROOM ID</button>
        <button className='btn leaveBtn'>Leave</button>
      </aside>
      <main className='editorWrap'>
        <EditorComponent />
      </main>
    </div>
  );
};

export default Editor;
