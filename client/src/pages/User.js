import { useParams } from "react-router-dom";
function User() {
  // 2) id 비교해서 로그인한 유저 id와 일치하는 경우에는 특정 버튼들 보이게 구성

  const { id } = useParams();
  return <h1>Page User {id}</h1>;
}

export { User };
