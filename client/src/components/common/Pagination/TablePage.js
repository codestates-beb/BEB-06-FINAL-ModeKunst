import "./style.css";
import Pagination from "react-js-pagination";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function Notice({ arr, section }) {
  console.log(arr);
  const [pageNum, setPageNum] = useState(1);
  const POSTS_PER_PAGE = 8;
  const pagesVisited = (pageNum - 1) * POSTS_PER_PAGE;
  const handleChangePage = selected => setPageNum(selected);

  const [selectedId, setSelectedId] = useState(0);
  const [selectedNickname, setSelectedNickname] = useState("");

  const SelectNickname = e => {
    setSelectedId(e.target.name);
    setSelectedNickname(arr[selectedId].nickname);
  };

  const PenaltyHandler = async () => {
    console.log(selectedNickname);
    try {
      axios
        .post(`http://localhost:8000/admin/penaltycancel/${selectedNickname}`, {
          withCredentials: true,
        })
        .then(result => {
          const data = result.data;
          Swal.fire({
            icon: "success",
            text: `${data.message}`,
          });
        });
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "warning",
        text: "정지할 수 없습니다",
      });
    }
    setSelectedId("");
    setSelectedNickname("");
  };

  const PenaltyCancelHandler = async () => {
    console.log(selectedNickname);
    try {
      axios
        .post(`http://localhost:8000/admin/penalty/${selectedNickname}`, {
          withCredentials: true,
        })
        .then(result => {
          const data = result.data;
          Swal.fire({
            icon: "success",
            text: `${data.message}`,
          });
        });
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "warning",
        text: "정지할 수 없습니다",
      });
    }
    setSelectedId("");
    setSelectedNickname("");
  };

  const showNotices = arr
    .slice(pagesVisited, pagesVisited + POSTS_PER_PAGE)
    .map((item, idx) => (
      <tr>
        <td className="w-20 h-16 font-title">{idx + 1}</td>
        <td className="w-72 font-content font-light hover:font-extrabold cursor-pointer">
          <Link to={`/notice/${item.id}`}>{item.title}</Link>
        </td>
        <td className="w-24 font-content font-light">{item.server_nickname}</td>
      </tr>
    ));

  const showNFTs = arr
    .slice(pagesVisited, pagesVisited + POSTS_PER_PAGE)
    .map((item, idx) => (
      <div className="relative w-full transition-all duration-75 ease-in hover:scale-105 cursor-pointer">
        <img
          alt="nft_image"
          src={item.image}
          className="object-contain rounded-lg shadow-xl block"
        />
        <div className="text-xs text-white font-semibold px-4 py-2 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 rounded-b-lg flex justify-between">
          <span>{item.title}</span>
        </div>
      </div>
    ));

  const showReports = arr
    .slice(pagesVisited, pagesVisited + POSTS_PER_PAGE)
    .map((item, idx) => (
      <tr>
        <td className="w-24 h-16 font-title">{idx + 1}</td>
        <td className="w-36 font-content font-light">{item.nickname}</td>
        <td className="w-24 font-content font-light">{item.report_count}</td>
        <td>
          <button
            name={idx}
            onClick={e => {
              SelectNickname(e);
              setTimeout(() => {
                Swal.fire({
                  icon: "question",
                  text: "해당 이용자의 1일 정지를 진행하시겠습니까?",
                  showCancelButton: true,
                  confirmButtonText: "정지",
                  cancelButtonText: `취소`,
                }).then(result => {
                  if (result.isConfirmed) {
                    PenaltyHandler(selectedNickname);
                  }
                });
              }, 3000);
            }}
            className="font-title text-xs bg-black rounded-full px-2 py-1 text-white hover:bg-yellow-500"
          >
            정지
          </button>
          <button
            name={idx}
            onClick={e => {
              SelectNickname(e);
              Swal.fire({
                icon: "question",
                text: "해당 이용자의 신고 내역을 삭제하시겠습니까?",
                showCancelButton: true,
                confirmButtonText: "삭제",
                cancelButtonText: `삭제 안 함`,
              }).then(result => {
                if (result.isConfirmed) {
                  PenaltyCancelHandler(selectedNickname);
                }
              });
            }}
            className="ml-2 font-title text-xs bg-black rounded-full px-2 py-1 text-white hover:bg-yellow-500"
          >
            취소
          </button>
        </td>
      </tr>
    ));

  return (
    <>
      {section === "notice" && <div>{showNotices}</div>}
      {section === "nft" && (
        <div className="my-2 grid grid-cols-2 gap-8">{showNFTs}</div>
      )}
      {section === "report" && <div>{showReports}</div>}
      <Pagination
        activePage={pageNum}
        itemsCountPerPage={POSTS_PER_PAGE}
        totalItemsCount={arr.length}
        pageRangeDisplayed={10}
        onChange={handleChangePage}
      />
    </>
  );
}
