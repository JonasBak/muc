import { useContext } from "react";
import { StoreContext, PlayerState, Dispatchers } from "utils/context";
import PlayPauseButton from "components/PlayPauseButton";
import AlbumCover from "components/AlbumCover";

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

const PlaybackScreen = () => {
  const {
    state: { playerState, queue },
    dispatchers: { togglePlaying, nextTrack }
  } = useContext(StoreContext);

  if (!playerState) return <div>No track currently playing</div>;

  return (
    <div className="wrapper">
      <AlbumCover url={playerState.playback.track.album.url} size={600} />
      <TrackText playerState={playerState} handleClick={togglePlaying} />
      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default PlaybackScreen;
