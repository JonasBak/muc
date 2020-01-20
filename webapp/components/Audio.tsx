import { useEffect, useContext, useRef } from "react";
import { StoreContext, PlayerState, Dispatchers } from "utils/context";

const Audio = ({ playerState }: { playerState: PlayerState }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    dispatchers: { setPlayerState, togglePlaying, nextTrack }
  } = useContext(StoreContext);

  useEffect(() => {
    audioRef!.current!.pause();
    audioRef!.current!.load();
  }, [playerState.playback]);

  useEffect(() => {
    playerState.playing
      ? audioRef!.current!.play()
      : audioRef!.current!.pause();
  }, [playerState.playing]);

  return (
    <audio
      ref={audioRef}
      onCanPlay={() => {
        setPlayerState({ ...playerState, playing: true });
      }}
      onTimeUpdate={() => {
        const currentTime = Math.floor(audioRef!.current!.currentTime);
        const duration = Math.floor(audioRef!.current!.duration || 0);
        if (currentTime !== playerState.currentTime) {
          setPlayerState({ ...playerState, currentTime, duration });
        }
      }}
      onEnded={nextTrack}
    >
      <source
        src={playerState.playback.url}
        type={`audio/${playerState.playback.filetype}`}
      />
    </audio>
  );
};

const AudioWrapper = () => {
  const {
    state: { playerState }
  } = useContext(StoreContext);

  if (playerState === null) {
    return <></>;
  }

  return <Audio playerState={playerState} />;
};

export default AudioWrapper;
