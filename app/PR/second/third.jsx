import Image from "next/image";

export default function CreativeConsultancy() {
  const portfolioItems = [
    {
      id: 1,
      image: "/PR4.svg",
      magazine: "ELLE",
      title: "SO EXTRA",
      subtitle: "",
      icons: ["anchor", "share", "info"],
    },
    {
      id: 2,
      image: "/PR3.svg",
      magazine: "ELLE",
      title: "COSMOPOLITAN",
      subtitle: "",
      icons: ["anchor", "share", "info"],
    },
    {
      id: 3,
      image: "/PR2.svg",
      magazine: "COSMOPOLITAN",
      title: "FEMINA",
      subtitle: "",
      icons: ["anchor", "share", "info"],
    },
    {
      id: 4,
      image: "/PR1.svg",
      magazine: "FEMINA",
      title: "",
      subtitle: "Pernia's Pop-Up Shop",
      icons: ["anchor", "share", "info"],
    },
  ];

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-white py-4 md:py-8 text-center">
        <h1 className="text-2xl md:text-3xl font-medium">Creative Consultancy</h1>
        <p className="text-lg md:text-xl italic font-light mt-1">Impactful PR Approach</p>
      </div>

      {/* Portfolio Section */}
      <div className="bg-white">
        <div className="max-w-8xl w-dvw mx-auto flex flex-col md:flex-row justify-start md:justify-around items-center overflow-auto gap-4 md:gap-20 px-4 md:px-0">
          {portfolioItems.map((item) => (
            <div key={item.id} className="relative flex flex-col items-center min-w-[45%] md:min-w-0">
              {/* Image */}
              <img
                src={item.image || "/placeholder.svg"}
                alt={`Portfolio item ${item.id}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="py-6 md:py-12"></div>
    </div>
  );
}