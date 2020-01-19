const PlayPauseButton = ({
  playing,
  handleClick
}: {
  playing: boolean;
  handleClick: () => void;
}) => {
  return (
    <div className="wrapper" onClick={handleClick}>
      {playing ? "⏸" : "▶"}
      <style jsx>{`
        .wrapper {
          display: inline-block;
          border-radius: 15px;
          line-height: 30px;
          text-align: center;
          height: 30px;
          width: 30px;
          font-size: 18px;
          box-shadow: 0px 0px 3px 0px #b0b0b0;
          background-color: #222222;
        }
      `}</style>
    </div>
  );
};

export default PlayPauseButton;
