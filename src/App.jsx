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
    const response = await window.puter.ai.chat(
      `Convert this code to ${targetLanguage}. Return ONLY raw code, no markdown.\n${inputCode}`
    );

    console.log(response);

    let reply = "";

    if (typeof response === "string") {
      reply = response;
    } 
    else if (Array.isArray(response?.message?.content)) {
      reply = response.message.content[0]?.text || "";
    } 
    else if (response?.message?.content) {
      reply = response.message.content;
    } 
    else {
      reply = JSON.stringify(response);
    }

    const cleanReply = String(reply)
      .replace(/```[\w]*\n?/g, "")
      .replace(/```/g, "")
      .trim();

    if (!cleanReply) {
      throw new Error("Empty Response From AI");
    }

    setOutPutCode(cleanReply);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-10 relative overflow-hidden container">
      <h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-[#aabbf7] via-violet-400 to-[#eff3fe] bg-clip-text text-transparent text-center drop-shadow-lg relative">
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
        <button onClick={handleConvert} disabled={!aiReady || loading} className="relative curosr-pointer flex items-center px-4 py-2 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group">
          <span
              className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-mr-4 group-hover:-mt-4"
            >
            <span
              className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"
            >  
            </span>
          </span>
          <span
            className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-ml-4 group-hover:-mb-4"
          >
            <span
              className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"
            >

            </span>
          </span>
          <span
            className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-indigo-600 rounded-md group-hover:translate-x-0"
          >
          </span>
          <span
          className="relative w-full gap-2 flex text-left align-center items-center justify-center text-white transition-colors duration-200 ease-in-out group-hover:text-white"
            >
            {
              loading? (
                <Loader2 className="w-5 h-5 animate-spin"/>
              ) : (
                <Play className="w-5 h-5" />
              )
            }
            {
              loading?"Please Wait..":"Convert" 
            }
          </span>
          </button>
          <button onClick={handleReset} disabled={loading} className="cursor-pointer inline-block rounded-md font-medium border-2 border-rose-500 text-rose-500 hover:border-rose-600 hover:bg-rose-400 hover:bg-opacity-10 hover:text-rose-600 focus:border-rose-700 focus:text-rose-700 active:border-rose-800 active:text-rose-800 dark:border-rose-300 dark:text-rose-300 dark:hover:hover:bg-rose-300 px-4 py-2 uppercase leading-normal transition duration-150 ease-in-out focus:outline-none focus:ring-0">
              <div
                role="status"
                className="inline-block align-[-0.125em]"
              >
                <RotateCcw className="w-5 h-5"/>
                <span
                  className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >
                  Loading...
                </span>
              </div>
              Reset
          </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl relative z-10">
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
                <button onClick={handleCopy} disabled={!outPutCode} className="pointer cursor-pointer" >
                  <Clipboard className="w-5 h-5 text-cyan-400" /> 
                </button>
          </div>
          <CodeMirror value={outPutCode} height="420px" extensions={[javascript({jsx:true})]}
          theme={dracula} editable={false} />
        </div>
      </div>
      {
        feedBack && (
          <div className="card">
            <svg className="wave" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
                fill-opacity="1"
              ></path>
            </svg>

            <div className="icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="0"
                fill="currentColor"
                stroke="currentColor"
                className="icon"
              >
                <path
                  d="M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z"
                ></path>
                <path
                  d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z"
                ></path>
              </svg>
            </div>
            <div className="message-text-container">
              <p className="message-text">status message</p>
              <p className={
            feedBack.includes("Successful")
              ? "subtext_sucsecs"
              : "subtext_error"
          }>{feedBack}</p>
            </div>
          </div>
        )
      }
      {
        !aiReady && (
          <div className="card">
            <svg className="wave" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
                fill-opacity="1"
              ></path>
            </svg>

            <div className="icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="0"
                fill="currentColor"
                stroke="currentColor"
                className="icon"
              >
                <path
                  d="M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z"
                ></path>
                <path
                  d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z"
                ></path>
              </svg>
            </div>
            <div className="message-text-container">
              <p className="message-text">status message</p>
              <p className="sub-text">Initialzing AI plrease Wait ...</p>
            </div>
          </div>

        )
      }
    </div>
  );
}

export default App;
