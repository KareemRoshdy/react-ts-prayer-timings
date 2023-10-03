import img from "../assets/8.jpg";

type Props = {
  name: string;
  time: string;
};

const ImageCard = (props: Props) => {
  return (
    <div className="image-card">
      <img src={img} alt="img" />
      <div className="next-prayer">
        <p>متبقي علي صلاة {props.name}</p>
        <h1>{props.time}</h1>
      </div>
    </div>
  );
};

export default ImageCard;
