import React, { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { GetProp, UploadProps } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

type MainImges = {
  mainImage: any;
  setMainImage: any;
};

const MainImages: React.FC<MainImges> = ({ mainImage, setMainImage }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
  }, []);

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      setLoading(false);
      setMainImage(info.file.response);
    }
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Upload
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action={`${import.meta.env.VITE_BASE_URL}/image/upload`}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {mainImage ? (
        <img
          src={mainImage?.url}
          alt="avatar"
          style={{ width: "60%" }}
          className="shadow-xl rounded-sm"
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default MainImages;
