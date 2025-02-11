import React from "react";
import Image from "next/image";

type LogoProps = {
  size?: number;
};

export default function Logo({ size = 64 }: LogoProps) {
  return (
    <div className={`w-[${size}px] h-[${size}px] transition-transform duration-300 hover:scale-110`}>
      <Image 
        src="/logo/aqua-stark.png" 
        alt="Aqua Stark Logo" 
        width={size} 
        height={size} 
        priority
      />
    </div>
  );
}
