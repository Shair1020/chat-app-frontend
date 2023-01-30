import React, { useState, useEffect } from "react";
import { ChatContainer } from "../styled-componet/ChatContainer";
import Contact from "../components/Contact";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute } from "../utils/APIRoute";

const Chat = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
    }
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        getAllUser(currentUser);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [navigate, currentUser]);

  const getAllUser = async (currentUser) => {
    const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}}`);
    console.log(data, "🔥");
    setContacts(data.data);
  };
  return (
    <ChatContainer>
      <div className="container">
        <Contact contacts={contacts} currentUser={currentUser} />
      </div>
    </ChatContainer>
  );
};

export default Chat;
