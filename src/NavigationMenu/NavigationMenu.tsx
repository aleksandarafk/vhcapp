import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoreVertical, LogOut } from "lucide-react";

interface NavigationMenuProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conversations: any[]; // you can replace `any` with your actual conversation type
  setCurrentConvIndex: React.Dispatch<React.SetStateAction<number>>;
  currentConvIndex: number;
  titles: string[];
  activeMenuIndex: number | null;
  setActiveMenuIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setRenameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setChatToModify: React.Dispatch<React.SetStateAction<number | null>>;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  createNewConversation: () => void;
}

export default function NavigationMenu({
  sidebarOpen,
  setSidebarOpen,
  conversations,
  setCurrentConvIndex,
  currentConvIndex,
  titles,
  activeMenuIndex,
  setActiveMenuIndex,
  setRenameModalOpen,
  setDeleteModalOpen,
  setChatToModify,
  setNewTitle,
  createNewConversation,
}: NavigationMenuProps) {
  const navigate = useNavigate();

  if (!sidebarOpen) return null;

  return (
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
            {[
              { label: "Virtual Coach", short: "VC", path: "/virtual-coach" },
              { label: "Personal Planner", short: "PA", path: "/personal-planner" },
              { label: "Study Jam", short: "SJ", path: "/study-jam" },
              { label: "Profile", short: "PR", path: "/profile" },
            ].map(({ label, short, path }) => (
              <div
                key={path}
                className="flex items-center gap-2 text-sm font-medium text-black dark:text-white cursor-pointer hover:opacity-80"
                onClick={() => {
                  navigate(path);
                  setSidebarOpen(false);
                }}
              >
                <div className="w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center text-white font-bold">{short}</div>
                <span>{label}</span>
              </div>
            ))}
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
          <Button onClick={createNewConversation} className="w-full text-sm mt-3 cursor-pointer hover:bg-[#8F88FD] transition-colors duration-300" style={{ fontFamily: 'Tecna, sans-serif' }}>
            + New Chat
          </Button>
        </div>

        {/* Profile block at bottom */}
        <div className="border-t pt-4 mt-4 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center text-white font-bold"><img
            src="Profile.png"
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          /></div>
            <span className="font-medium">George Fiddlenan</span>
          </div>
          <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => navigate("/login")}>
            <LogOut className="w-4 h-4"/>
          </Button>
        </div>
      </div>
    </>
  );
}
