import { Track } from "utils/gqlTypes";
import { useEffect, useContext, useRef } from "react";
import { StoreContext } from "utils/context";
import { PlayerState } from "utils/reducer";

const formatTime = (time: number): string => {
  return `${Math.floor(time / 60)}:${((time % 60) + "").padStart(2, "0")}`;
};

const TrackText = ({
  track,
  handleClick,
  playing,
  currentTime,
  duration
}: {
  track: Track;
  handleClick: () => void;
  playing: boolean;
  currentTime: number;
  duration: number;
}) => {
  return (
    <div>
      {`${track.title} - ${formatTime(currentTime)}/${formatTime(duration)}`}
      <span onClick={handleClick}>{playing ? "⏸" : "▶"}</span>
    </div>
  );
};

const Audio = ({
  playerState,
  setPlayerState
}: {
  playerState: PlayerState;
  setPlayerState: (newState: PlayerState) => void;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

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
    >
      <source
        src={playerState.playback.url}
        type={`audio/${playerState.playback.filetype}`}
      />
    </audio>
  );
};

const Player = () => {
  const {
    state: { playerState },
    dispatchers: { setPlayerState, togglePlaying }
  } = useContext(StoreContext);

  return (
    <div className="wrapper">
      <div className="title">muc</div>
      <div className="audio">
        {playerState && (
          <>
            <TrackText
              track={playerState.playback.track}
              handleClick={togglePlaying}
              playing={playerState.playing}
              currentTime={playerState.currentTime}
              duration={playerState.duration}
            />
            <Audio playerState={playerState} setPlayerState={setPlayerState} />
          </>
        )}
      </div>
      <style jsx>{`
        .wrapper {
          background-color: #0f0f0f;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .title {
          color: #2d2e2e;
          margin-left: 20px;
          font-size: 24px;
          font-weight: bold;
        }
        .audio {
          margin-right: 20px;
        }
      `}</style>
    </div>
  );
};

export default Player;
