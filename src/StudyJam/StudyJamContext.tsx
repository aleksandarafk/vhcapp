import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface Jam {
  id: number;
  name: string;
  date: string;
  time: string;
  color: string;
  code: string;
  description: string;
}

interface StudyJamContextType {
  jams: Jam[];
  addJam: (jam: Omit<Jam, 'id'>) => void;
  removeJam: (id: number) => void;
  updateJam: (id: number, updatedJam: Partial<Jam>) => void;
}

const StudyJamContext = createContext<StudyJamContextType | undefined>(undefined);

export const StudyJamProvider = ({ children }: { children: ReactNode }) => {
  const [jams, setJams] = useState<Jam[]>([
        {
            id: 1,
            name: "Group #1 - Virtual Humans",
            date: "2025-04-02 - 2025-04-04",
            time: "16:00PM",
            color: "bg-[#9B2E2E]",
            code: "VH12345",
            description: "Creating a virtual assistant using Unreal Engine."
        },
        {
            id: 2,
            name: "Group #2 - Biology Project",
            date: "2025-04-02 - 2025-04-04",
            time: "16:00PM",
            color: "bg-[#2E7B57]",
            code: "BI07890",
            description: "Working on the plant cell study module."
        }
    ]);

  const addJam = (jam: Omit<Jam, 'id'>) => {
    const newJam = {
      ...jam,
      id: Math.max(0, ...jams.map(j => j.id)) + 1 // Generate new ID
    };
    setJams(prev => [...prev, newJam]);
  };

  const removeJam = (id: number) => {
    setJams(prev => prev.filter(jam => jam.id !== id));
  };

  const updateJam = (id: number, updatedJam: Partial<Jam>) => {
    setJams(prev => prev.map(jam => 
      jam.id === id ? { ...jam, ...updatedJam } : jam
    ));
  };

  return (
    <StudyJamContext.Provider value={{ jams, addJam, removeJam, updateJam }}>
      {children}
    </StudyJamContext.Provider>
  );
};

export const useStudyJamContext = () => {
  const context = useContext(StudyJamContext);
  if (!context) throw new Error("useStudyJamContext must be used within a StudyJamProvider");
  return context;
};

export default StudyJamContext;