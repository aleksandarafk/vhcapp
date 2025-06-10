import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PersonalPlanner from "./PersonalPlanner/PPlanner";
import VirtualCoach from "./VirtualCoach/VirtualCoach";
import PPlannerTask from "./PersonalPlanner/PPlannerTask";
import StudyJam from "./StudyJam/StudyJam";
import JamOptions from "./StudyJam/JamOptions";
import JoinAJam from "./StudyJam/JoinAJam";
import Profile from "./Profile/Profile";
import StudyJamBiology from "./StudyJam/StudyJamBiology";
import LoginPage from "./Intro/LoginPage";
import RegisterPage from './Intro/RegisterPage';
import ForgottenPassword from "./Intro/ForgotPasswordPage";
import Achievements from "./Profile/Achievements";
import GroupBadges from "./Profile/GroupBadges";
import CreateAJam from "./StudyJam/CreateAJam";

export default function VHCApp() {
  // Shared jams state
  const [studyJams, setStudyJams] = useState([
    {
      id: 1,
      name: "Group #1 - Virtual Humans",
      date: "Apr 02 - 04",
      time: "16:00PM",
      color: "bg-[#BC4b51]",
      code: "VH12345",
      description: "Creating a virtual assistant using Unreal Engine."
    },
    {
      id: 2,
      name: "Group #2 - Biology Project",
      date: "Apr 02 - 04",
      time: "16:00PM",
      color: "bg-[#8CB369]",
      code: "BI07890",
      description: "Working on the plant cell study module."
    }
  ]);

  // Handler to join a jam by code
  const joinJamByCode = (code: string) => {
    const normalized = code.trim().toUpperCase();

    // Check if the code is our special code
    if (normalized === "A1B1B") {
      const newJam = {
        id: Date.now(),
        name: "Group #3 - Literature Study",
        date: "June 20 - 26",
        time: "12:30AM",
        color: "bg-[#F4A259]",
        code: normalized,
        description: "Literature study for our exam on Shakespeare.",
      };
      setStudyJams(prev => [...prev, newJam]);
      return { success: true, message: `Successfully joined ${newJam.name}` };
    }

    const existingJam = studyJams.find((jam) => jam.code === normalized);
    if (existingJam) {
      return { success: true, message: `Already joined ${existingJam.name}` };
    }

    return { success: false, message: "Invalid Jam Code" };
  };

  // Handler to add a new jam
const addJam = (jamData: any) => {
  const newJam = {
    id: Date.now(),
    name: jamData.name,
    date: jamData.date, // Now properly formatted
    time: jamData.time,
    color: jamData.color,
    code: jamData.code,
    description: jamData.description
  };
  setStudyJams(prev => [...prev, newJam]);
};
    return (
        <Router>
            <Routes>
                <Route path="/groupbadges" element={<GroupBadges />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/forgotten-password" element={<ForgottenPassword/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/virtual-coach" element={<VirtualCoach />} />
                <Route path="/personal-planner" element={<PersonalPlanner setCurrentPage={() => {}} />} />
                <Route path="/study-jam" element={
                  <StudyJam 
                    jams={studyJams} 
                    onRemoveJam={(id) => setStudyJams(prev => prev.filter(jam => jam.id !== id))}
                  />
                } />
                <Route path="/join-study-jam" element={
                  <JoinAJam onJoinJam={joinJamByCode} />
                } />
                  <Route 
                    path="/create-study-jam" 
                    element={<CreateAJam addJam={addJam} />} 
                  />

                <Route path="/profile" element={<Profile/>} />
                <Route path="/jam-options" element={<JamOptions />} />
                <Route path="/studyjambiology" element={<StudyJamBiology/>} />
                <Route path="/personal-planner-task" element={<PPlannerTask />} />
            </Routes>
        </Router>
    );
}