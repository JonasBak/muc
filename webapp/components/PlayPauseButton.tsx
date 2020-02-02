import theme from "utils/theme";

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
          box-shadow: 0px 0px 3px 0px ${theme.colors.light1};
          background-color: ${theme.colors.dark1};
        }
      `}</style>
    </div>
  );
};

export default PlayPauseButton;
