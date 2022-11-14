import { useParams } from "react-router-dom";

function ReadPost() {
  const { id } = useParams();

  return <h1>Page ReadPost {id}</h1>;
}

export { ReadPost };
