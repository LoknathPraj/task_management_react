import React, { useState } from "react";

const ProfileImageUploader = ({}) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  //   const handleImageChange = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       setImage(file);
  //       setProfileImage(file);
  //       setPreviewUrl(URL.createObjectURL(file));
  //     }
  //   };

  //   const handleIconClick = () => {
  //     const fileInput = document.getElementById("file-input");
  //     fileInput.click();
  //   };

  return (
    <div>
      <div
        onClick={() => {}}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundImage: `url(/images/userProfileIcon.jpg)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile Preview"
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
        ) : (
          <div>
            <img
              src={"/userProfileIcon.jpg"}
              alt="Example"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          </div>
        )}
      </div>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={() => {}}
      />
    </div>
  );
};

export default ProfileImageUploader;
