import {useState, useEffect} from "react"
import {
  Code,Play, RotateCcw, CheckCircle, Clipboard, Loader2 
} from "lucide-react"
import CodeMirror from "@uiw/react-codemirror"
import {javascript} from "@codemirror/lang-javascript"
import {dracula} from "@uiw/codemirror-theme-dracula"

function App() {
  const [aiReady, setAiReady] = useState(false); 
  const [inputCode, setInputCode] = useState(`function helloWorld(){\n  console.log("Hello World!")\n}`); 
  const [outPutCode, setOutPutCode] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Python");
  const [loading, setLoading] = useState(false); 
  const [feedBack, setFeedBack] = useState(""); 
  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.puter?.ai?.chat) {
        setAiReady(true);
        clearInterval(checkReady);
      }
    }, 300);
    return () => clearInterval(checkReady);
  }, []);

  const handleConvert = async () => {
    if (!inputCode.trim()) {
      setFeedBack("Please Enter Some Code To Convert!!");
      return;
    } 
    if (!aiReady) {
      setFeedBack("AI Is Not Available!!");
      return;
    }
    
    setLoading(true); 
    setFeedBack(""); 
    setOutPutCode("");
  
    try {
      // ۲. اصلاح فراخوانی API به window.puter.ai.chat
      const response = await window.puter.ai.chat(
      `Convert this code to ${targetLanguage}. Return only raw code.\n${inputCode}`
    );

      console.log(response);

      if (typeof response === "string") {
        reply = response;
      } else if (response?.message?.content) {
        reply = response.message.content;
      } else if (response?.content) {
        reply = response.content;
      } else {
        reply = JSON.stringify(response);
      }

      if (!String(reply).trim()) {
        throw new Error("Empty response from AI");
      }

      const cleanReply = String(reply)
        .replace(/```[\w]*\n?/g, "")
        .replace(/```/g, "")
        .trim();

      setOutPutCode(cleanReply);
      
      // اصلاح مدیریت پاسخ هوش مصنوعی
      const reply = typeof response === "string" ? response : response?.message?.content || "";
      
      if (!reply.trim()) throw new Error("Empty Response From AI");
      console.log("AI response:", response);
      console.log(typeof response); 
      setOutPutCode(reply.trim()); 
      setFeedBack("Conversion Was Successful!");
    } catch (error) {
      console.error(error);
      setFeedBack(`Error: ${error.message}`);
    }
    setLoading(false);
  }; 

  const handleReset = () => {
    setInputCode(`function helloWorld(){\n  console.log("Hello World!")\n}`);
    setFeedBack("");
    setOutPutCode("");
  };

  const handleCopy = async () => {
    if (outPutCode) {
      try {
        // ۳. اصلاح غلط املایی writeText
        await navigator.clipboard.writeText(outPutCode);
        setFeedBack("Code Copied to The Clipboard!");
      } catch (err) {
        setFeedBack("Failed to copy code.");
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 flex flex-col items-center justify-center p-6 gap-10 relative overflow-hidden">
      <h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent text-center drop-shadow-lg relative">
        AI Code Converter
      </h1>
      <div className="flex gap-4 justify-center items-center flex-col sm:flex-row relative z-10">
        <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}
        className="bg-slate-900/80 text-white px-4 py-2 rounded-xl border border-slate-700 shadow-lg background-blur-md cursor-pointer"  >
          {[
            "TypeScript", "Python", "JavaScript"
          ].map((language) =>(
            <option value={language} key={language}>{language}</option>
          ))}
        </select>
        <button onClick={handleConvert} disabled={!aiReady || loading} className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 hover:opacity-80 active:scale-95 text-white font-semibold rounded-2xl transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg cursor-pointer">
          {
            loading? (
              <Loader2 className="w-5 h-5 animate-spin"/>
            ) : (
              <Play className="w-5 h-5 " />
            )
          }
          {
            loading?"Please Wait..":"Convert" 
          }
          </button>
          <button onClick={handleReset} disabled={loading} className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:opacity-80 active:scale-95 text-white font-semibold rounded-2xl transition-all flex items-center gap-2 shadow-lg cursor-pointer">
            <RotateCcw className="w-5 h-5"/>Reset
          </button>
      </div>
      <div className="grid grid-cols-1 lg:grod-cols-2 gap-8 w-full max-w-7xl relative z-10">
        <div className="bg-slate-900/80 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="bg-slate-800/80 py-3 border-b border-slate-700  flex flex-col gap-2">
            <div className="flex items-center gap-2 px-4">
              <Code className="w-5 h-5 text-cyan-400" /> 
              <span className="text-white font-semibold">Input Code</span>
            </div>
              <CodeMirror value={inputCode} height="420px" extensions={[javascript({jsx:true})]} theme={dracula}
              onChange={(userCode)=>setInputCode(userCode)}/>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="bg-slate-800/80 py-3 border-b border-slate-700 px-4 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-semibold">Converted Code to ({targetLanguage})</span>
            </div>
            <button onClick={handleCopy} disabled={!outPutCode} className="flex items-center gap-1 text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg disabled:opacity-50">
              <Clipboard className="w-4 h-4" />
            </button>
          </div>
          <CodeMirror value={outPutCode} height="420px" extensions={[javascript({jsx:true})]}
          theme={dracula} editable={false} />
        </div>
      </div>
      {
        feedBack && (
          <p className={`text-center font-semibold text-white drop-shadow-md relative z-10 ${
            feedBack.includes("Succesful" || "ClipBoard") ? `text-emerald-300` : `text-rose-300`
          }`}></p>
        )
      }
      {
        !aiReady && (
          <p className="text-sm text-slate-400 relative z-10 ">Initalizing AI Please Wait...</p>
        )
      }
    </div>
  );
}

export default App;
