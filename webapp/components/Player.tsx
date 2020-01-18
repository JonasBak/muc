import { useState, useEffect, useContext, useRef } from "react";
import { StoreContext } from "utils/context";
import { getPlayback } from "utils/req";
import { Playback } from "utils/gqlTypes";

const formatTime = (time: number): string => {
  return `${Math.floor(time / 60)}:${((time % 60) + "").padStart(2, "0")}`;
};

type PlayerState = {
  playing: boolean;
  duration: number;
  currentTime: number;
};

const Audio = ({ playback }: { playback: Playback }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    playing: false,
    duration: 0,
    currentTime: 0
  });

  useEffect(() => {
    audioRef!.current!.pause();
    audioRef!.current!.load();
  }, [playback]);
  return (
    <div>
      <div>
        {`${playback.track.title} - ${formatTime(
          playerState.currentTime
        )}/${formatTime(playerState.duration)}`}
        <span
          onClick={() =>
            playerState.playing
              ? audioRef!.current!.pause()
              : audioRef!.current!.play()
          }
        >
          {playerState.playing ? "⏸" : "▶"}
        </span>
      </div>
      <audio
        ref={audioRef}
        onPlay={() => {
          if (!playerState.playing)
            setPlayerState({ ...playerState, playing: true });
        }}
        onPause={() => {
          if (playerState.playing)
            setPlayerState({ ...playerState, playing: false });
        }}
        onCanPlay={() => {
          audioRef!.current!.play();
        }}
        onTimeUpdate={() => {
          const currentTime = Math.floor(audioRef!.current!.currentTime);
          const duration = Math.floor(audioRef!.current!.duration || 0);
          if (currentTime !== playerState.currentTime) {
            setPlayerState({ ...playerState, currentTime, duration });
          }
        }}
      >
        <source src={playback.url} type={`audio/${playback.filetype}`} />
      </audio>
    </div>
  );
};

const Player = () => {
  const [playback, setPlayback] = useState<Playback | null>(null);
  const {
    state: { currentTrack }
  } = useContext(StoreContext);

  useEffect(() => {
    const fetchPlayback = async (id: string) => {
      setPlayback(await getPlayback(id));
    };

    if (currentTrack == null) {
      setPlayback(null);
    } else {
      fetchPlayback(currentTrack);
    }
  }, [currentTrack]);

  return (
    <div className="wrapper">
      <div className="title">muc</div>
      <div className="audio">{playback && <Audio playback={playback} />}</div>

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
