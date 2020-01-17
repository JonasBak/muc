import { useState, useEffect, useContext } from "react";
import { StoreContext } from "utils/context";
import { getPlayback } from "utils/req";
import { Playback } from "utils/gqlTypes";

const Audio = ({ playback }: { playback: Playback }) => {
  return (
    <audio controls>
      <source src={playback.url} type={`audio/${playback.filetype}`} />
    </audio>
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
    <div>
      <h2>Player</h2>
      <div>{playback && <Audio playback={playback} />}</div>
    </div>
  );
};

export default Player;
