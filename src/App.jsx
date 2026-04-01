import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Match from './pages/Match';
import Workspace from './pages/Workspace';
import Milestones from './pages/Milestones';
import PitchDeck from './pages/PitchDeck';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -12 },
};

const pageTransition = { type: 'tween', ease: 'easeInOut', duration: 0.25 };

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/match" element={<Match />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/workspace/:workspaceId" element={<Workspace />} />
            <Route path="/milestones" element={<Milestones />} />
            <Route path="/pitch" element={<PitchDeck />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
