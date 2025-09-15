import Image from "next/image";

const images = [
  { src: "/brands/1.png", link: "https://example.com/1" },
  { src: "/brands/2.png", link: "https://example.com/2" },
  { src: "/brands/3.png", link: "https://example.com/3" },
  { src: "/brands/4.png", link: "https://example.com/4" },
  { src: "/brands/5.png", link: "https://example.com/5" },
  { src: "/brands/6.png", link: "https://example.com/6" },
  { src: "/brands/7.png", link: "https://example.com/1" },
  { src: "/brands/8.png", link: "https://example.com/2" },
  { src: "/brands/9.png", link: "https://example.com/3" },
  { src: "/brands/10.png", link: "https://example.com/4" },
  { src: "/brands/11.png", link: "https://example.com/5" },
  { src: "/brands/12.png", link: "https://example.com/6" },
  { src: "/brands/13.png", link: "https://example.com/6" },

];

export default function ScrollingLogos() {
  return (
    <>
    <h1 className="text-center text-4xl font-bold mb-7">LOGO</h1>

    <div className="relative w-full overflow-hidden py-8">
      {/* Top Row - Moves Right to Left */}
      <div className="flex w-full overflow-hidden">
       
        <div className="flex animate-marquee-left space-x-6">
          {[...images, ...images].map((img, index) => ( // Duplicate images for smooth looping
            <a key={index} href={img.link} target="_blank" rel="noopener noreferrer">
              <div className="w-40 h-40 bg-white rounded-lg shadow-lg flex items-center justify-center object-contain ">
                <Image src={img.src} alt={`Logo ${index + 1}`} width={100} height={110} className="scale-[1.5]"/>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
