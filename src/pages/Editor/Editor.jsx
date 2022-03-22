//internal imports
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/images/code-sync.png";
import Client from "../../components/Client";
import EditorComponent from "../../components/Editor";
import { initSocket } from "../../client/socket";
const Editor = () => {
  const [clients, setClients] = useState([
    { sockedId: 1, username: "Aamir Amin" },
    { sockedId: 2, username: "Ali Aslam" },
  ]);

  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
    };
    init();
  }, []);

  return (
    <div className="mainWrap">
      <aside className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src={Logo} alt="logo" />
          </div>
          <h3>Connected</h3>
          <section className="clientsList">
            {clients.map((client) => (
              <Client key={client.sockedId} username={client.username} />
            ))}
          </section>
        </div>

        <button className="btn copyBtn">Copy ROOM ID</button>
        <button className="btn leaveBtn">Leave</button>
      </aside>
      <main className="editorWrap">
        <EditorComponent />
      </main>
    </div>
  );
};

export default Editor;
