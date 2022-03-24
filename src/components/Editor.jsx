//internal imports
import React, { useEffect, useRef, useState } from "react";
//external imports
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import Actions from "../constants/actions/Actions";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const mirrorRef = useRef();
  const [srcDoc, setSrcDoc] = useState("");
  console.log("srcDoc", srcDoc);

  const getEditorValue = () => {
    setSrcDoc(`
  <html>
  <body></body>
  <style></style>
<script>${mirrorRef.current.getValue()}</script>
  </html>
  
  `);
  };

  useEffect(() => {
    async function init() {
      mirrorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      mirrorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);

        if (origin !== "setValue") {
          socketRef.current.emit(Actions.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    //listening code change (sync code) event
    if (socketRef.current) {
      socketRef.current.on(Actions.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          mirrorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(Actions.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div>
      {/* <button
        onClick={getEditorValue}
        className='bg-slate-600 text-white rounded my-3 p-3 transition-all duration-200 ease-in-out min-w-[100px] hover:bg-slate-700'>
        Run
      </button> */}
      <textarea id="realtimeEditor"></textarea>
      {/* <iframe
        srcDoc={srcDoc}
        title='output'
        sandbox='allow-scripts'
        width='100%'
        height='100%'
        placeholder='Output'
        className='text-white'
      /> */}
    </div>
  );
};

export default Editor;
