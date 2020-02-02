import { useState } from "react";
import theme from "utils/theme";

const Modal = ({
  Component,
  props,
  buttonText
}: {
  Component: any;
  props: any;
  buttonText: string;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="wrapper">
      <div onClick={() => setVisible(true)}>{buttonText}</div>
      {visible && (
        <div
          className="modal"
          onClick={() => setVisible(false)}
          style={{ display: "flex" }}
        >
          <div className="modalBody">
            <Component {...props} closeModal={() => setVisible(false)} />
          </div>
        </div>
      )}
      <style jsx>{`
        .wrapper {
          display: inline-block;
        }
        .modal {
          position: absolute;
          left: 0px;
          top: 0px;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          background-color: ${theme.colors.dark0}aa;
        }
        .modalBody {
          background-color: ${theme.colors.dark1};
          padding: 5px;
        }
      `}</style>
    </div>
  );
};

export default Modal;
