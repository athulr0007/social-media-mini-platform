import { createContext, useContext, useEffect, useState } from "react";
import { fetchActivities } from "../services/activityApi";
import { SocketContext } from "./SocketContext";
import { AuthContext } from "./AuthContext";

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const loadActivities = async () => {
    try {
      const data = await fetchActivities();
      setActivities(data || []);
    } catch (err) {
      console.error("Failed to load activities:", err);
      setActivities([]);
    }
  };

  // Load activities when user changes
  useEffect(() => {
    if (user) {
      loadActivities();
    } else {
      setActivities([]);
    }
  }, [user?._id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_activity", (activity) => {
      setActivities((prev) => [activity, ...prev]);
    });

    return () => socket.off("new_activity");
  }, [socket]);

  return (
    <ActivityContext.Provider value={{ activities, setActivities, loadActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);
