import Image from "next/image";

const activities = [
    {
      title: "Upcoming",
      content: (
        <div>
           <h3 className="font-headline text-2xl font-bold text-foreground mb-4">
                Tech for Humanity Hackathon
            </h3>
          <p className="mb-8 text-sm font-normal text-muted-foreground">
            A 24-hour hackathon focused on developing innovative solutions for local community problems. Teams collaborated to build prototypes addressing challenges in healthcare, education, and environmental sustainability.
          </p>
          <Image
            src="https://placehold.co/600x400.png"
            alt="Tech for Humanity Hackathon"
            width={500}
            height={500}
            className="h-auto w-full rounded-lg object-cover shadow-lg"
            data-ai-hint="hackathon event"
            />
        </div>
      ),
    },
    {
      title: "2023 Q4",
      content: (
        <div>
            <h3 className="font-headline text-2xl font-bold text-foreground mb-4">
                Renewable Energy Workshop
            </h3>
            <p className="mb-8 text-sm font-normal text-muted-foreground">
            An interactive workshop where participants learned to build small-scale solar and wind energy systems. The event aimed to promote sustainable energy practices within the community.
            </p>
            <Image
                src="https://placehold.co/600x400.png"
                alt="Renewable Energy Workshop"
                width={500}
                height={500}
                className="h-auto w-full rounded-lg object-cover shadow-lg"
                data-ai-hint="workshop renewable energy"
            />
        </div>
      ),
    },
    {
      title: "2023 Q3",
      content: (
        <div>
            <h3 className="font-headline text-2xl font-bold text-foreground mb-4">
            E-Waste Collection Drive
            </h3>
            <p className="mb-8 text-sm font-normal text-muted-foreground">
            A campus-wide collection drive for electronic waste. We partnered with a certified recycling facility to ensure responsible disposal and raise awareness about the environmental impact of e-waste.
            </p>
            <Image
                src="https://placehold.co/600x400.png"
                alt="E-Waste Collection Drive"
                width={500}
                height={500}
                className="h-auto w-full rounded-lg object-cover shadow-lg"
                data-ai-hint="e-waste collection"
            />
        </div>
      ),
    },
    {
        title: "2023 Q2",
        content: (
          <div>
            <h3 className="font-headline text-2xl font-bold text-foreground mb-4">
                Introduction to Humanitarian Tech
            </h3>
            <p className="mb-8 text-sm font-normal text-muted-foreground">
                A seminar for first-year students introducing the concepts of humanitarian technology and the role of engineers in social development. Featured guest speakers from leading NGOs.
            </p>
            <Image
                src="https://placehold.co/600x400.png"
                alt="Introduction to Humanitarian Tech"
                width={500}
                height={500}
                className="h-auto w-full rounded-lg object-cover shadow-lg"
                data-ai-hint="seminar presentation"
            />
          </div>
        ),
      },
  ];

const TimelineItem = ({ title, content, isLast }: { title: string, content: React.ReactNode, isLast: boolean }) => (
    <div className="relative pl-8 sm:pl-12">
        <div className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
            <div className="h-2 w-2 rounded-full bg-primary-foreground" />
        </div>
        {!isLast && <div className="absolute left-3 top-8 w-px bg-border h-full" />}
        <div className="mb-10">
            <h2 className="bg-secondary text-secondary-foreground rounded-full text-base w-fit px-4 py-2 mb-4 font-semibold">
                {title}
            </h2>
            <div className="text-sm prose prose-sm dark:prose-invert">
                {content}
            </div>
        </div>
    </div>
);


export default function ActivitiesSection() {
  return (
    <section id="activities" className="bg-background py-20 lg:py-32">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">Activities & Initiatives</h2>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                    Follow our journey of making a difference through technology-driven projects and community engagement.
                </p>
            </div>
            <div className="max-w-2xl mx-auto antialiased pt-4 relative">
                {activities.map((item, index) => (
                    <TimelineItem
                        key={`content-${index}`}
                        title={item.title}
                        content={item.content}
                        isLast={index === activities.length - 1}
                    />
                ))}
            </div>
        </div>
    </section>
  );
}
