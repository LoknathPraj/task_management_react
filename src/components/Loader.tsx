import React from "react";
import { Oval } from "react-loader-spinner";

type LoaderProps = {
  size?: number;
  color?: string;
};

const Loader: React.FC<LoaderProps> = ({ size = 60, color = "#69A8DF" }) => {
  return (
    <div style={styles.loaderContainer}>
      <Oval
        visible={true}
        height={size}
        width={size}
        strokeWidth={5}
        color={color}
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

const styles: { loaderContainer: React.CSSProperties } = {
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 9999,
  },
};

export default Loader;
