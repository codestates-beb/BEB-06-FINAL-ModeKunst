import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TablePage from "../../components/common/Pagination/TablePage";

function NFTList() {
  //🟠nft 상태관리
  const [nft, setNft] = useState([]);

  // 공지 및 래플 정보(리뷰 제외) 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:8000/admin/nftlist`, {
        withCredentials: true,
      })
      .then(result => {
        const data = result.data.nfts;
        setNft(data.filter((item, idx) => idx % 10 == 0));
        console.log(data);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  console.log(nft);

  return (
    <div className="h-full space-y-10 items-center flex flex-col">
      <div className="mt-40 text-center font-title text-3xl">발행한 NFT</div>
      <div className="self-center w-4/5 bg-slate-100 rounded-md text-center px-10 py-6 drop-shadow-sm">
        <div className="space-y-5 flex flex-col items-center">
          <TablePage arr={nft} section="nft" />
        </div>
      </div>
      <button className="font-title bg-black rounded-full px-2 py-1 text-white hover:bg-yellow-500">
        <Link to="/admin/nft/mint">nft 발행하기</Link>
      </button>
      <div className="mb-36" />
    </div>
  );
}

export { NFTList };
