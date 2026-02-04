import React from "react";
import VideoSection from "./VideoSection";
import { getVideoKey } from "@/helpers/movieFunctions";

const HeroSection = async ({ id }) => {
  const videoKey = await getVideoKey(id);
  console.log(videoKey);
  return (
    <div className="relative h-[50vw]">
      <VideoSection videoKey={videoKey} />
    </div>
  );
};

export default HeroSection;