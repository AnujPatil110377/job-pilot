import { Palette, Code, Megaphone, Video, Music, LineChart, Stethoscope, Database } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const categories = [
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Graphics & Design",
    positions: "357 Open position",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Code & Programming",
    positions: "312 Open position",
  },
  {
    icon: <Megaphone className="w-6 h-6" />,
    title: "Digital Marketing",
    positions: "297 Open position",
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Video & Animation",
    positions: "247 Open position",
  },
  {
    icon: <Music className="w-6 h-6" />,
    title: "Music & Audio",
    positions: "204 Open position",
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: "Account & Finance",
    positions: "167 Open position",
  },
  {
    icon: <Stethoscope className="w-6 h-6" />,
    title: "Health & Care",
    positions: "125 Open position",
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Data & Science",
    positions: "57 Open position",
  },
];

const PopularCategories = () => {
  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Popular category</h2>
        <a href="#" className="text-primary hover:underline">
          View All →
        </a>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Card 
            key={index}
            className="group hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.positions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories;