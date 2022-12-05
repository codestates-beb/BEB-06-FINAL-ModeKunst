import Card from "./Carousel/Card";
import {Link} from "react-router-dom";

export default function Banner(banners) {
    console.log(banners.banners)
  return (
    <div className="relative my-32 px-10 pt-2 pb-16 rounded-2xl tablet:pt-6 tablet:pb-20 tablet:rounded-t-3xl desktop:px-20 desktop:pb-24">
      <div className="absolute top-0 left-0 right-0 mx-auto w-2/5 border-t-4 border-t-red-700" />
      <h3 className="pt-6 text-xl text-center font-bold font-title tablet:pt-10 tablet:text-3xl desktop:pt-14 desktop:text-4xl">
        배너
      </h3>
        {
            banners?.banners
            ? banners.banners.map((e, i) => {
                return(
                    <a href={e.url}><Card key={i} imageUrl={e.image}></Card></a>
                )
                })
                : null
        }
    </div>
  );
}
