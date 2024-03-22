import { LoadingOutlined, Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { ShowNotification } from "../../helpers/ShowNotification";

type LoadingType = {
  isLoading: boolean;
  setIsLoading: any;
  messageTimeout?: string
};

const Loading: React.FC<LoadingType> = ({ isLoading, setIsLoading, messageTimeout }) => {
  const [timeElapsed, setTimeElapsed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      // Set a timer for 5 seconds
      timer = setTimeout(() => {
        // After 5 seconds, update setIsLoading to false
        setIsLoading(false);
        // Update timeElapsed state to true
        
        setTimeElapsed(true);
        ShowNotification({
          message: "Cảnh báo",
          description: messageTimeout,
          type: "warning",
        })
      }, 5000);
    }

    // Clean up the timer when component unmounts or when isLoading becomes false
    return () => clearTimeout(timer);
  }, [isLoading, setIsLoading]);

  // If isLoading is false or 5 seconds have elapsed, render nothing
  if (!isLoading || timeElapsed) {
    return null;
  }

  return (
    <>
      {isLoading && (
        <div className="absolute top-0 left-0 bottom-0 right-0 flex justify-center  bg-slate-800 opacity-50">
          <Spin
            className="flex items-center"
            indicator={
              <Loading3QuartersOutlined style={{ fontSize: 40 }} spin />
            }
          />
        </div>
      )}
    </>
  );
};

export default Loading;
