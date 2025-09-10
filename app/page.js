import Image from "next/image";
import CultureBoat from "../app/components/main"
import CustomCursor from "../app/components/custom-cursor";
import "@fortawesome/fontawesome-free/css/all.min.css";


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-bellota-light cursor-[none]">
      <CultureBoat />
    </div>
  );
}
