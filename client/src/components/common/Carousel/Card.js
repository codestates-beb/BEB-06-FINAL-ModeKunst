export default function Card({ imageUrl }) {
  return (
    <div className="w-48 h-64 mx-auto">
      <div className="rounded-md h-full">
        <img
          alt="user_pic"
          src={imageUrl}
          className="inline-block w-full h-full"
        />
      </div>
    </div>
  );
}
