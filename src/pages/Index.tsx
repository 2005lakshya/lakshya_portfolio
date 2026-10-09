// The site is just the 3D room for now. The old sections are commented out, not deleted,
// so they can come back.
// import Navbar from "@/components/Navbar";
// import Hero from "@/components/Hero";
import Room from "@/components/Room";
// import About from "@/components/About";
// import Skills from "@/components/Skills";
// import Projects from "@/components/Projects";
// import Experience from "@/components/Experience";
// import Achievements from "@/components/Achievements";
// import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="h-[100svh] overflow-hidden bg-black text-white selection:bg-white/20">
      {/* <Navbar /> */}
      <main id="home" className="relative">
        {/* <Hero /> */}
        <Room />
        {/* <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <Contact /> */}
      </main>
    </div>
  );
};

export default Index;
