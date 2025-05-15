import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Paperclip, Bell, Menu, LogOut, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const replies = [
  "That's interesting, tell me more!",
  "Can you explain further?",
  "I see. What else would you like to discuss?",
  "I'm here to help you with anything you need.",
  "Let's explore that topic together."
];

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

export default function VHCApp() {
  const [currentPage, setCurrentPage] = useState<"virtual-coach" | "personal-planner" | "study-jam" | "profile">("virtual-coach");

  const [conversations, setConversations] = useState([
    [{ role: "assistant", content: "Hi! How can I help you today?" }],
  ]);
  const [titles, setTitles] = useState(["Hi! How can I help you today?"]);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const assistantResponse = {
      role: "assistant",
      content: replies[Math.floor(Math.random() * replies.length)],
    };
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
    if (!hasSentFirstMessage) {
      setHasSentFirstMessage(true);
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 4000);
    }
    setTimeout(() => {
      setConversations((prev) => {
        const updated = [...prev];
        updated[currentConvIndex] = [...updated[currentConvIndex], assistantResponse];
        return updated;
      });
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const userMessage = { role: "user", content: `📎 Uploaded file: ${file.name}` };
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

  const handleNavigationClick = (page: typeof currentPage) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  return (
    <main className="relative flex flex-col h-screen w-full max-w-md mx-auto bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b relative">
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
            {hasUnreadNotifications && <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full" />}
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
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-20" onClick={() => setSidebarOpen(false)} />
          <div
            className={`absolute top-0 left-0 w-64 h-full bg-white border-r shadow-lg z-30 p-4 flex flex-col justify-between transition-transform transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div>
              {/* Navigation menu */}
              <div className="space-y-4 mb-6">
                <div
                  className="flex items-center gap-2 text-sm font-medium text-black dark:text-white cursor-pointer hover:opacity-80"
                  onClick={() => handleNavigationClick("virtual-coach")}
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center text-white font-bold">VC</div>
                  <span>Virtual Coach</span>
                </div>
                <div
                  className="flex items-center gap-2 text-sm font-medium text-black dark:text-white cursor-pointer hover:opacity-80"
                  onClick={() => handleNavigationClick("personal-planner")}
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center text-white font-bold">PA</div>
                  <span>Personal Planner</span>
                </div>
                <div
                  className="flex items-center gap-2 text-sm font-medium text-black dark:text-white cursor-pointer hover:opacity-80"
                  onClick={() => handleNavigationClick("study-jam")}
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center text-white font-bold">SJ</div>
                  <span>Study Jam</span>
                </div>
                <div
                  className="flex items-center gap-2 text-sm font-medium text-black dark:text-white cursor-pointer hover:opacity-80"
                  onClick={() => handleNavigationClick("profile")}
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center text-white font-bold">PR</div>
                  <span>Profile</span>
                </div>
              </div>

              {/* Conversations ALWAYS visible */}
              <h2 className="text-md font-medium mb-2">Conversations</h2>
              {conversations.map((_, index) => (
                <div key={index} className="flex items-center justify-between w-full mb-1 group">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCurrentConvIndex(index);
                      setSidebarOpen(false);
                    }}
                    className="text-sm flex-1 justify-start truncate cursor-pointer rounded-r-none bg-white hover:bg-gray-100"
                    style={{ color: index === currentConvIndex ? "#000000" : "inherit" }}
                  >
                    <span className="block w-full truncate" title={titles[index]}>
                      {titles[index] || `Chat ${index + 1}`}
                    </span>
                  </Button>
                  <div className="relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setActiveMenuIndex(activeMenuIndex === index ? null : index)}
                      className="rounded-l-none border-l-0 bg-white hover:bg-gray-100 cursor-pointer"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                    {activeMenuIndex === index && (
                      <div
                        className="absolute right-0 mt-1 w-40 bg-white shadow-md rounded-md text-sm z-[1000] border"
                        style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                      >
                        <div
                          onClick={() => {
                            setRenameModalOpen(true);
                            setChatToModify(index);
                            setNewTitle(titles[index] || "");
                            setActiveMenuIndex(null);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          Rename
                        </div>
                        <div
                          onClick={() => {
                            alert("Share functionality coming soon!");
                            setActiveMenuIndex(null);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          Share
                        </div>
                        <div
                          onClick={() => {
                            setDeleteModalOpen(true);
                            setChatToModify(index);
                            setActiveMenuIndex(null);
                          }}
                          className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* New Chat button */}
                <Button
                  onClick={createNewConversation}
                  className="w-full text-sm mt-3 cursor-pointer">
                  + New Chat
                </Button>
            </div>

            {/* Profile block at bottom */}
            <div className="border-t pt-4 mt-4 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center text-white font-bold">
                  AK
                </div>
                <span className="font-medium">Aleksandar Karamirev</span>
              </div>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

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
      <h2 className="text-lg font-semibold text-red-600">Delete Conversation</h2>
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
          className="cursor-pointer"
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

      {/* Page content */}
      {(currentPage === "virtual-coach" || currentPage === "study-jam") && (
        <div className="w-full h-100 border-b">
          <iframe src="http://10.0.0.200/" title="Embedded Frame" className="w-full h-full border-none" />
        </div>
      )}

      {currentPage === "virtual-coach" ? (
        <>
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                {msg.content}
              </motion.div>
            ))}
          </div>

          {/* Achievements Popup */}
          {showAchievement && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[380px] p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-white/10 border border-white/20 flex items-center space-x-4 animate-popUp fadeInOut z-50">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div className="text-sm text-black">
                <div className="font-semibold">Achievement Unlocked</div>
                <div className="text-xs mt-1">Completed your first task in the app!</div>
                <div className="text-xs text-zinc-300 mt-1">You successfully sent your first message.</div>
              </div>
            </div>
          )}

          {/* Suggestion boxes */}
          {showSuggestions && (
            <div className="flex gap-2 overflow-x-auto p-4 pb-2">
              {suggestions.slice(0, 5).map((suggestion, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 bg-zinc-200 dark:bg-zinc-700 rounded-md p-2 text-xs w-36 text-center font-medium"
                >
                  {suggestion}
                  <p className="text-xs font-normal">for your projects</p>
                </div>
              ))}
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSubmit} className="sticky bottom-0 bg-background p-4 flex gap-2 items-center border-t">
            <input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" ref={fileInputRef} />
            <label htmlFor="file-upload">
              <Button size="icon" variant="ghost" className="rounded-full border shadow-sm cursor-pointer">
                <Paperclip className="w-4 h-4" />
              </Button>
            </label>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => alert("Voice input not yet implemented")}
              className="rounded-full border shadow-sm cursor-pointer"
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Input
              className="flex-1 rounded-full"
              placeholder="Ask me about your routine..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" size="icon" className="rounded-full cursor-pointer">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </>
      ) : (
        // Placeholder blank page for other pages without iframe
        <div className="flex-1 flex items-center justify-center text-2xl font-semibold text-gray-600">
          {currentPage.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </div>
      )}
    </main>
  );
}
