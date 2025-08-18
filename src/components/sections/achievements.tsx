import { FileText, Lightbulb, Trophy, Users } from "lucide-react";
import { BentoGrid, BentoGridItem } from "../ui/aceternity/bento-grid";

export default function AchievementsSection() {
  const items = [
    {
      title: "Best SIGHT Group Award 2023",
      description: "Recognized by the IEEE Kerala Section for outstanding contributions to humanitarian technology.",
      header: <SkeletonCard />,
      className: "md:col-span-2",
      icon: <Trophy className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Project 'Jyothi'",
      description: "Successfully implemented a solar-powered lighting solution for 50 rural households.",
      header: <SkeletonCard />,
      className: "md:col-span-1",
      icon: <Lightbulb className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Digital Literacy Workshop",
      description: "Trained over 200 students in basic computer skills and online safety.",
      header: <SkeletonCard />,
      className: "md:col-span-1",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Published Research Paper",
      description: "Authored a paper on sustainable technology models, featured in an international conference.",
      header: <SkeletonCard />,
      className: "md:col-span-2",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <section id="achievements" className="py-20 lg:py-32 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Impact & Achievements</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            We are proud of the positive change we've driven. Here are some of our key accomplishments.
          </p>
        </div>
        <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={item.className}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

const SkeletonCard = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
