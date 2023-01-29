import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "./../utils/APIRoute";
import { AvatarContainer } from "../styled-componet/AvatarContainer";

export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOption = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOption);
    } else {
      const user = JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      console.log(data);
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar.Please try again.", toastOption);
      }
    }
  };

  const avatarFetch = async () => {
    const data = [];
    for (let i = 0; i < 3; i++) {
      const image = await axios.get(
        ` ${api}/${Math.round(Math.random() * 1000)}`
      );
      const buffer = new Buffer(image.data);
      data.push(buffer.toString("base64"));
    }
    setAvatars(data);
    setIsLoading(false);
  };

  useEffect(() => {
    avatarFetch();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      {isLoading && (
        <AvatarContainer>
          <img src={loader} alt="loader" className="loader" />
        </AvatarContainer>
      )}
      <AvatarContainer>
        <div className="title-container">
          <h1>Pick an avatar as your profile picture 🤭 </h1>
        </div>
        <div className="avatars">
          {avatars.map((avatar, index) => {
            return (
              <div
                className={`avatar ${selectedAvatar === index && "selected"}`}
                key={index}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  onClick={() => setSelectedAvatar(index)}
                />
              </div>
            );
          })}
        </div>
        <button className="submit-btn" onClick={() => setProfilePicture()}>
          Set as Profile Picture
        </button>
      </AvatarContainer>
      <ToastContainer />
    </>
  );
}
