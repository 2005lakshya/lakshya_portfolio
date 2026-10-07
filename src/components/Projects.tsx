import RecordCrate from "@/components/projects/crate/RecordCrate";
import SprayHeading from "@/components/site/SprayHeading";

const Projects = () => {
  return (
    <section id="projects" aria-label="Projects" className="relative bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-5 pb-4 pt-16 md:px-[70px] md:pt-10">
        <SprayHeading
          text="PROJECTS"
          size="clamp(56px, 7.2vw, 104px)"
          drips={[
            { x: 0.154, y: 0.962, h: 0.423, w: 0.048 },
            { x: 1.788, y: 0.904, h: 0.288, w: 0.038 },
            { x: 3.673, y: 0.788, h: 0.442, w: 0.048 },
          ]}
        />
      </div>
      <RecordCrate />
    </section>
  );
};

export default Projects;
