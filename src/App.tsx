import { Nav } from "./components/Nav";
import { RouteRail } from "./components/RouteRail";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Network } from "./components/Network";
import { Showcase } from "./components/Showcase";
import { Download } from "./components/Download";
import { Team } from "./components/Team";
import { Footer } from "./components/Footer";

function App() {
  return (
    <>
      <Nav />
      <RouteRail />
      <main>
        <Hero />
        <About />
        <Network />
        <Showcase />
        <Download />
        <Team />
      </main>
      <Footer />
    </>
  );
}

export default App;
