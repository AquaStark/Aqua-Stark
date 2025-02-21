import Button from "@/components/ui/button"; 
import { ButtonColor } from "@/components/ui/button-large";

export default function SideMenu() {
  return (
    <div className="absolute right-4 top-20 flex flex-col space-y-2 md:right-8 md:top-24">
      {[
         { icon: "/textures/icons/Chest02.svg", label: "Library", color: "teal" },
        { icon: "/textures/icons/StarOrange.svg", label: "Security", color: "yellow", hasWhiteBg: true },
        { icon: "/textures/icons/Chat.svg", label: "Favorites", color: "red" },
        { icon: "/textures/icons/Book01.svg", label: "Messages", color: "green" },
       
      ].map((item, index) => (
        <div key={index} className="flex flex-col md:mt-7 mt-12 items-center">
        <Button color={item.color as ButtonColor} className="lg:w-13 lg:h-12 h-14 w-14 flex items-center justify-center">
        {item.hasWhiteBg ? (
              <div className="md:w-6 md:h-6 h-7 w-7 flex items-center justify-center rounded-full bg-white">
                <img src={item.icon} alt={item.label} className="md:w-5 md:h-5 w-6 h-6" />
              </div>
            ) : (
              <img src={item.icon} alt={item.label} className="md:w-6 md:h-6 w-6 h-6" />
            )}
</Button>

           </div>
      ))}
    </div>
  );
}
