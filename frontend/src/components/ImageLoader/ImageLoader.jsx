import React, { useRef, useState } from 'react';
import './ImageLoader.css';
import images from  '../../../public/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg'

const ImageLoader = ({ onImageChange }) => {
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                if (onImageChange) onImageChange(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="image-upload-container">
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleImageChange}
            />
            <div className="profile-pic-container">
                <img
                    src={image || images}
                    alt="Profile"
                    className="profile-pic"
                />
                <button
                    className="upload-button"
                    type="button"
                    onClick={handleButtonClick}
                >
                    <span className="camera-icon"></span>
                </button>
            </div>
        </div>
    );
};

export default ImageLoader;