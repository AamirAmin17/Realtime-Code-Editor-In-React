//internal imports
import React, { useEffect, useRef, useState } from "react";
//external imports
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

const Editor = () => {
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
    }
    init();
  }, []);

  return (
    <div>
      {/* <button
        onClick={getEditorValue}
        className='bg-slate-600 text-white rounded my-3 p-3 transition-all duration-200 ease-in-out min-w-[100px] hover:bg-slate-700'>
        Run
      </button> */}
      <textarea id='realtimeEditor'>Editor</textarea>
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
