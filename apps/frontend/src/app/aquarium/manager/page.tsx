"use client";

import React, { useState } from "react";
import Aquarium from "~/components/aquarium/aquarium";
import StatusBar from "~/components/aquarium/status-bar";
import AquariumMenu from "~/components/aquarium/aquarium-menu";
import SideMenu from "~/components/aquarium/side-menu";
import FloatingControls from "~/components/aquarium/floating-controls";

const initialAquariums = [
  { id: "1", name: "My First Aquarium" },
  { id: "2", name: "Second Aquarium", locked: true }
];

export default function AquariumManagerPage() {
  const [aquariums, setAquariums] = useState(initialAquariums);
  const [activeAquarium, setActiveAquarium] = useState(initialAquariums[0].id);

  return (
    <div className="w-screen h-screen flex flex-col bg-blue-200">
      <StatusBar />
      <div className="flex-grow flex items-center justify-center relative">
        <Aquarium aquariumId={activeAquarium} />
        <SideMenu />
      </div>
      <AquariumMenu aquariums={aquariums} setActiveAquarium={setActiveAquarium} />
      <FloatingControls />
    </div>
  );
}
