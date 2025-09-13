import { useRef, forwardRef, useImperativeHandle } from "react";

const UpdateProfileImage = forwardRef(({ onUploadSuccess, onLoadingImage }, ref) => {
    const fileInputRef = useRef(null);


    useImperativeHandle(ref, () => ({
        triggerFileInput: () => {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        },
        resetFileInput: () => {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
    }));
    
    const baseURL = import.meta.env.VITE_DEV_URL;

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        onLoadingImage(true);
    
        const formData = new FormData();
        formData.append("uploaded-file", file);
    
        try {
            const response = await fetch(`${baseURL}/api/upload-file`, {
                method: "POST",
                body: formData,
                credentials: "include", // Ensures cookies (like access tokens) are sent
                headers: {
                    "Accept": "application/json",
                },
            });

            const responseData = await response.json(); // Parse JSON response

            if (!response.ok) {
                throw new Error(responseData.message || "Upload failed!");
            }


            // Call the callback function and send responseData back to the parent
            if (onUploadSuccess) {
                onUploadSuccess(responseData);
            }

            // Reset the file input after successful upload
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // alert("File uploaded successfully!");
        } catch (error) {
            console.error("❌ Upload Error:", error);
            alert("Error uploading file");
            // Reset the file input even on error to allow retry
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } finally {
            onLoadingImage(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </div>
    );
});

export default UpdateProfileImage;
