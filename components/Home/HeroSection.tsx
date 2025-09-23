"use client";

import React from "react";
import { ThreeDMarquee } from "../../components/ui/3d-marquee";
import d1 from "@/assets/3d/3d1.png";
import d2 from "@/assets/3d/3d2.jpg";
import d3 from "@/assets/3d/3d3.jpg";
import d4 from "@/assets/3d/3d4.jpg";
import d5 from "@/assets/3d/3d5.jpg";
import d6 from "@/assets/3d/3d6.jpg";
import d7 from "@/assets/3d/3d7.jpg";
import d8 from "@/assets/3d/3d8.jpg";
import d9 from "@/assets/3d/3d9.jpg";
import d10 from "@/assets/3d/3d10.jpg";
import { FlipWords } from "../../components/ui/flip-words";
import Button from "../common/Button";
import { FaSpotify } from "react-icons/fa";
import BlackButton from "../common/BlackButton";
import { MoveRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { data } from "framer-motion/client";

const HeroSection = () => {
  const images = [
    d4.src,
    d3.src,
    d2.src,
    d8.src,
    d5.src,
    d10.src,
    d3.src,
    d6.src,
    d7.src,
    d9.src,
    d5.src,
    d4.src,
    d3.src,
    d1.src,
    d9.src,
    d7.src,
    d8.src,
    d9.src,
    d10.src,
    d3.src,
    d2.src,
    d1.src,
    d5.src,
    d6.src,
    d4.src,
    d1.src,
  ];

  const words = ["Love", "Enjoy", "Feel", "Live"];
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className="relative flex items-center bg-secondaryBg justify-center w-full min-h-screen px-6">
      <div className="w-full  relative z-20 items-center justify-center text-center max-w-5xl mx-auto">
        <h1 className="text-textColor text-2xl md:text-5xl font-primary font-bold uppercase">
          Built for People Who
          <span className="text-muzupColor">
            <FlipWords words={words} />
          </span>
          Music
        </h1>
        <p className="text-white/95 mt-5 text-sm md:text-lg">{`Whether you’re a fan or an artist, Muzup lets you discover people who feel the music the way you do. Chat. Share. Vibe.
Because music isn’t just sound — it’s a way of finding your people.`}</p>
        <div className="flex items-center justify-center mt-6 gap-3">
          <Button
            primary
            text="Add Spotyify"
            Icon={FaSpotify}
            IconColor="muzupColor"
            IconLeft={true}
            onClick={() => signIn("spotify")}
          />
          <BlackButton text="I am an artist" Icon={MoveRight} primary />
        </div>
      </div>
      <div className="absolute inset-0 z-10 h-full w-full bg-black/75" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 min-h-screen h-full w-full"
        images={images}
      />
    </div>
  );
};

export default HeroSection;
