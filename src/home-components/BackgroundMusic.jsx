import { useEffect } from "react";

export default function BackgroundMusic() {
  useEffect(() => {
    const audio = new Audio("/bee-bg.mp3");
    audio.loop = true;
    audio.volume = 0.4;

    const playAudio = () => {
      audio.play().catch(() => {});
    };

    playAudio();

    const resumeOnInteraction = () => {
      playAudio();
      document.removeEventListener("click", resumeOnInteraction);
      document.removeEventListener("scroll", resumeOnInteraction);
    };

    document.addEventListener("click", resumeOnInteraction);
    document.addEventListener("scroll", resumeOnInteraction);


    return () => {
      audio.pause();
      document.removeEventListener("click", resumeOnInteraction);
      document.removeEventListener("scroll", resumeOnInteraction);
    };
  }, []);

  return null;
}
