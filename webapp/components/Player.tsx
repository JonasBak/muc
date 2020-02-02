import { Track } from "utils/gqlTypes";
import { useContext } from "react";
import { StoreContext, PlayerState, Dispatchers } from "utils/context";
import PlayPauseButton from "components/PlayPauseButton";
import theme from "utils/theme";

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
          color: ${theme.colors.fontalt};
        }
      `}</style>
    </div>
  );
};

const Player = () => {
  const {
    state: { playerState },
    dispatchers: { togglePlaying, nextTrack }
  } = useContext(StoreContext);

  return (
    <div className="wrapper">
      <div className="title">muc</div>
      <div className="audio">
        {playerState && (
          <TrackText playerState={playerState} handleClick={togglePlaying} />
        )}
      </div>
      <style jsx>{`
        .wrapper {
          background-color: ${theme.colors.header};
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .title {
          color: ${theme.colors.dark2};
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
