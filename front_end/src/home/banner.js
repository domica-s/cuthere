import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "./banner.css"

const slideImages = [
  "/banner/banner1.jpg",
  "/banner/banner2.jpg",
  "/banner/banner3.jpg",
];

const properties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true,
};

const Banner = () => {
    let path1 = "featured/ctg-basketball";
    let path2 = "featured/ctg-running";
    let path3 = "featured/ctg-drinking";
  return (
    <Slide {...properties}>
      <div className="each-slide">
        <div>
            <a href={path1}>
                <img src={slideImages[0]} style={{maxWidth: "100%", maxHeight: "300px"}} />
            </a>
        </div>
      </div>
      <div className="each-slide">
        <div>
            <a href={path2}>
                <img src={slideImages[1]} style={{maxWidth: "100%", maxHeight: "300px"}} />
            </a>
        </div>
      </div>
      <div className="each-slide">
        <div>
            <a href={path3}>
                <img src={slideImages[2]} style={{maxWidth: "100%", maxHeight: "300px"}} />
            </a>
        </div>
      </div>
    </Slide>
  );
};

export default Banner