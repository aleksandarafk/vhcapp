declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
  }
}

  interface SpeechRecognitionEvent extends Event {
    results: any;
    resultIndex: number;
  }

export {};

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Paperclip, Bell, Menu, MessageSquare, X } from "lucide-react";
import { motion } from "framer-motion";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
const API_KEY = ""; // replace with your API key

async function fetchAssistantReply(messages: { role: string, content: string }[]) {
  const response = await fetch("https://api.portkey.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`, // replace with valid key
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 150,
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.error?.message || "Unknown error";
    throw new Error(`API request failed: ${errorMsg}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

const suggestions = [
  "Schedule Suggestion",
  "Project Ideas",
  "Daily Summary",
  "Task Overview",
  "Next Steps",
  "Check Deadlines",
  "Routine Advice",
  "Study Tips"
];

export default function VirtualCoach() {
  const [currentPage] = useState<"virtual-coach" | "personal-planner" | "study-jam" | "profile">("virtual-coach");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true; // Keep listening until stopped manually
    recognition.interimResults = true; // Show partial (interim) results

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update input state with combined final + interim transcript
      setInput(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition error:", event.error);
      // Stop recording on error
      setIsRecording(false);
      recognition.stop();
    };

    recognition.onend = () => {
      // Automatically stop recording when recognition ends (e.g. user stops talking)
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

const toggleRecording = () => {
  if (!recognitionRef.current) {
    alert("Speech Recognition not supported in this browser.");
    return;
  }

  if (isRecording) {
    recognitionRef.current.stop();
    setIsRecording(false);
  } else {
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("SpeechRecognition start error", err);
    }
  }
};


  const [conversations, setConversations] = useState([
    [{ role: "assistant", content: "Hi! How can I help you today?" }],
  ]);
  
  const [titles, setTitles] = useState(["Virtual Coach"]);
  const [currentConvIndex, setCurrentConvIndex] = useState(0);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToModify, setChatToModify] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [showAchievement, setShowAchievement] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New state: chat open or closed
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("ServiceWorker registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("ServiceWorker registration failed: ", registrationError);
          });
      });
    }
  }, []);

const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!input.trim()) return;

  const userMessage = { role: "user", content: input };

  // Optimistically add user's message
  setConversations((prev) => {
    const updated = [...prev];
    updated[currentConvIndex] = [...updated[currentConvIndex], userMessage];
    return updated;
  });

  setTitles((prev) => {
    const updated = [...prev];
    if (updated[currentConvIndex].startsWith("Hi! How can I help")) {
      updated[currentConvIndex] = input.length > 30 ? input.slice(0, 30) + "..." : input;
    }
    return updated;
  });

  setInput("");
  setLoading(true);

  try {
    // Pass the entire conversation so far (user + assistant messages)
    const currentMessages = [
        {
    role: "system",
    content: 
`You are a virtual human coach who who gives brief, concise, and clear answers, ideally under 75 words. You always responds in a friendly, supportive, and professional manner without using markdown formatting such as **bold** or _italic_. Use plain text. You act like a helpful coach or teacher focused specifically on planning and organization skills. You provide guidance, advice, and encouragement, but you do not perform tasks for the user.
If the user asks about extremely serious, triggering, or mental health issues, respond politely that such topics are beyond your scope and suggest they seek appropriate professional help.
Always keep the conversation focused on planning, organization, and study habits, and encourage the user to take active steps themselves.`,

  },
      ...conversations[currentConvIndex],
      userMessage,
    ];

    const assistantReply = await fetchAssistantReply(currentMessages);

    const assistantResponse = { role: "assistant", content: assistantReply };

    setConversations((prev) => {
      const updated = [...prev];
      updated[currentConvIndex] = [...updated[currentConvIndex], assistantResponse];
      return updated;
    });{loading && <p>Loading...</p>}


    if (!hasSentFirstMessage) {
      setHasSentFirstMessage(true);
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 4000);
    }
  } catch (error) {
    console.error("Error fetching assistant reply:", error);
    const errorResponse = {
      role: "assistant",
      content: "Sorry, I couldn't process your request. Please try again later.",
    };
    setConversations((prev) => {
      const updated = [...prev];
      updated[currentConvIndex] = [...updated[currentConvIndex], errorResponse];
      return updated;
    });
  } finally {
    setLoading(false);
  }
};

const handleSuggestionClick = async (suggestion: string) => {
  // Add user message to conversation
  const userMessage = { role: "user", content: suggestion };

  setConversations((prev) => {
    const updated = [...prev];
    updated[currentConvIndex] = [...updated[currentConvIndex], userMessage];
    return updated;
  });

  // Fetch assistant reply
  try {
    const assistantReply = await fetchAssistantReply([
      ...conversations[currentConvIndex],
      userMessage,
    ]);

    const assistantMessage = { role: "assistant", content: assistantReply };

    setConversations((prev) => {
      const updated = [...prev];
      updated[currentConvIndex] = [...updated[currentConvIndex], assistantMessage];
      return updated;
    });
  } catch (error) {
    console.error("Error fetching assistant reply:", error);
  }
};

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);
    const isImage = file.type.startsWith("image/");
    
    const userMessage = {
      role: "user",
      content: isImage
        ? `<a href="${fileURL}" target="_blank" rel="noopener noreferrer"><img src="${fileURL}" alt="${file.name}" style="max-width: 200px; max-height: 200px; border-radius: 8px;" /></a>`
        : `<a href="${fileURL}" download="${file.name}" target="_blank" rel="noopener noreferrer">📎 ${file.name}</a>`
    };

    const assistantResponse = {
      role: "assistant",
      content: "Thanks for the file! I'll take a look at it.",
    };

    setConversations((prev) => {
      const updated = [...prev];
      updated[currentConvIndex] = [...updated[currentConvIndex], userMessage, assistantResponse];
      return updated;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
};

  const createNewConversation = () => {
    setConversations((prev) => [...prev, [{ role: "assistant", content: "Hi! How can I help you today?" }]]);
    setTitles((prev) => [...prev, "Hi! How can I help you today?"]);
    setCurrentConvIndex(conversations.length);
    setSidebarOpen(false);
  };

  const [showSuggestions, setShowSuggestions] = useState(true);
  useEffect(() => {
    setShowSuggestions(true);
  }, []);

  return (
    <main className="relative flex flex-col h-screen w-full max-w-md mx-auto bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b relative z-20">
        <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold truncate max-w-[60%]">
          {currentPage === "virtual-coach"
            ? titles[currentConvIndex] || `Chat ${currentConvIndex + 1}`
            : currentPage.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>
        <div className="relative">
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="icon"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setHasUnreadNotifications(false);
            }}
          >
            <Bell className="w-5 h-5 cursor-pointer" />
            {hasUnreadNotifications && <span className="absolute top-1 right-1 block w-2 h-2 bg-[#FD6555] rounded-full" />}
          </Button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 border shadow-md rounded-md z-20 p-2 text-sm">
              <p className="text-black dark:text-white">🔔 You have 1 new message</p>
              <p className="text-xs text-muted-foreground mt-1">Welcome back! This is your dummy notification.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar overlay and drawer */}
      {sidebarOpen && (
        <NavigationMenu
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          conversations={conversations}
          setCurrentConvIndex={setCurrentConvIndex}
          currentConvIndex={currentConvIndex}
          titles={titles}
          activeMenuIndex={activeMenuIndex}
          setActiveMenuIndex={setActiveMenuIndex}
          setRenameModalOpen={setRenameModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          setChatToModify={setChatToModify}
          setNewTitle={setNewTitle}
          createNewConversation={createNewConversation}
        />
      )}
      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 w-80 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-black dark:text-white">Rename Conversation</h2>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New conversation name"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  setRenameModalOpen(false);
                  setChatToModify(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => {
                  if (chatToModify !== null) {
                    const updatedTitles = [...titles];
                    updatedTitles[chatToModify] = newTitle;
                    setTitles(updatedTitles);
                  }
                  setRenameModalOpen(false);
                  setChatToModify(null);
                }}
              >
                Rename
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 w-80 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-[#FD6555]">Delete Conversation</h2>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this conversation? <br />
              <strong>This action is irreversible.</strong>
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setChatToModify(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="cursor-pointer bg-[#FD6555]"
                onClick={() => {
                  if (chatToModify !== null && conversations.length > 1) {
                    const updatedConvs = conversations.filter((_, i) => i !== chatToModify);
                    const updatedTitles = titles.filter((_, i) => i !== chatToModify);
                    setConversations(updatedConvs);
                    setTitles(updatedTitles);
                    setCurrentConvIndex((prev) =>
                      prev === chatToModify ? 0 : prev > chatToModify ? prev - 1 : prev
                    );
                  }
                  setDeleteModalOpen(false);
                  setChatToModify(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {currentPage === "virtual-coach" && (
        <>
          {/* Floating toggle chat button */}
                  <button
          aria-label={chatOpen ? "Close Chat" : "Open Chat"}
          onClick={() => setChatOpen((open) => !open)}
          className={`fixed z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#8F88FD] text-white shadow-lg hover:bg-[#7a73e7] transition-colors
            ${chatOpen ? "bottom-38 right-6" : "bottom-6 right-6"}`}
        >
          {chatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>

          {/* Fullscreen chat or iframe container */}
          <div className="flex flex-col flex-1 overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>
            {chatOpen ? (
              <>
                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
                  {conversations[currentConvIndex].map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`w-fit max-w-xs text-sm rounded-2xl px-4 py-2 shadow ${
                        msg.role === "assistant" ? "bg-muted text-left" : "bg-[#8F88FD] text-white self-end ml-auto"
                      }`}
                    >
                      <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                    </motion.div>
                  ))}
                </div>

          {showAchievement && (
            <div
  className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 w-[350px] rounded-xl backdrop-blur-md text-sm text-white shadow-xl z-50"
  style={{
    backgroundColor: 'rgba(255, 255, 255, 0.49)',       // 49% opacity background
    border: '1px solid rgba(0, 0, 0, 0.54)',       // 54% opacity stroke/border
  }}
>               
<div className="flex items-center gap-3">
  <img src="completedtaskrecord.png" className="w-8 h-8" alt="achievement" />
  <div className="text-sm text-black">
    <div className="font-semibold">Achievement Unlocked: Chatty</div>
    <div className="text-xs text-[#242424] mt-1">You successfully sent your first message.</div>
  </div>
</div>

            </div>
          )}
{showSuggestions && (
  <div className="flex gap-2 overflow-x-auto p-4 pb-2">
    {suggestions.slice(0, 5).map((suggestion, idx) => (
      <div
        key={idx}
        onClick={() => handleSuggestionClick(suggestion)}
        className="cursor-pointer flex-shrink-0 bg-zinc-200 dark:bg-zinc-700 rounded-md p-2 text-xs w-36 text-center font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
      >
        {suggestion}
        <p className="text-xs font-normal">for your projects</p>
      </div>
    ))}
  </div>
)}
              <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t bg-background">
                <Button variant="ghost" className="rounded-full border shadow-sm cursor-pointer" size="icon" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button
                variant={isRecording ? "destructive" : "ghost"}
                size="icon"
                className={`p-2 rounded-full ${isRecording ? "bg-[#FD6555] text-white" : "border shadow-sm cursor-pointer"}`}
                onClick={toggleRecording}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
                title={isRecording ? "Stop recording" : "Start recording"}
              >
                <Mic className="w-5 h-5" />
              </Button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about your routine..."
                  autoFocus
                />
                <Button
                  type="submit"
                  className="cursor-pointer bg-black text-white rounded-full p-2 hover:bg-[#8F88FD] transition-colors duration-300"
                  variant="default"
                  size="icon"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>

              </>
            ) : (
              /* When chat is closed, show iframe filling the area */
              <iframe
              // the address is set up using cloudflare tunnel more in the README of the repository
                //src="https://jvc-gabriel-corner-high.trycloudflare.com/"
                className="flex-grow w-full border-0"
                title="Virtual Coach iframe"
              />
            )}
          </div>
        </>
      )}
    </main>
  );
}
