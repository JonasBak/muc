import { Track } from "utils/gqlTypes";
import { useEffect, useContext, useRef } from "react";
import { StoreContext, PlayerState } from "utils/context";
import PlayPauseButton from "components/PlayPauseButton";

const formatTime = (time: number): string => {
  return `${Math.floor(time / 60)}:${((time % 60) + "").padStart(2, "0")}`;
};

const TrackText = ({
  playerState,
  handleClick
}: {
  playerState: PlayerState;
  handleClick: () => void;
}) => {
  const {
    playback: { track },
    playing,
    currentTime,
    duration
  } = playerState;
  return (
    <div className="wrapper">
      <div className="trackWrapper">
        <div className="title">{track.title}</div>
        <div className="artist">{track.album.artist.name}</div>
      </div>
      <div className="time">{`${formatTime(currentTime)}/${formatTime(
        duration
      )}`}</div>
      <PlayPauseButton playing={playing} handleClick={handleClick} />
      <style jsx>{`
        .wrapper {
          display: flex;
          align-items: center;
        }
        .time {
          padding: 0px 10px;
        }
        .trackWrapper {
          display: flex;
          flex-direction: column;
          text-align: center;
          padding: 2px;
        }
        .title {
          font-weight: bold;
        }
        .artist {
          color: #b0b0b0;
        }
      `}</style>
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
            <TrackText playerState={playerState} handleClick={togglePlaying} />
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
