'use client';
import React, { useRef,useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const HeroSection = () => {
  const imageRef = useRef();

  useEffect(() => {
    const imageElement = imageRef.current;
    const handleScroll = () => {
      const scrollPostion = window.scrollY;
      const threshold = 150;

      if (scrollPostion > threshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="px-5 md:px-14 lg:px-40">
      <div>
        <h1 className="text-9xl font-bold text-center gradient-to-b from-blue-800 to text-violet-500">
          Manage Finance <br /> with AI Intelligence
        </h1>
        <p className="text-xl font-semibold text-gray-800 text-center max-w-4xl mx-auto mt-8">
          SpendIQ is a personal finance management tool that helps you track
          your expenses, set budgets, and achieve your financial goals.
        </p>
        <div className="flex justify-center gap-5 mt-8">
         <Link href="/dashboard"> <Button className={"text-md rounded-sm"}>Get Started</Button></Link>
          <Button className={"text-md rounded-md"} variant="outline">
            Learn More
          </Button>
        </div>
      </div>
      <div className="mt-8 mx-auto hero-image-wrapper">
        <div ref={imageRef} className="hero-image">
          <Image
            src={"/banner.jpeg"}
            alt="img"
            width={1600}
            height={1500}
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
