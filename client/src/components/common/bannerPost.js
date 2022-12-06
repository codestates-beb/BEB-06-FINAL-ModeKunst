export default function BannerPost({ post }) {
  return (
    <div
      onClick={() => {
        window.open(`http://${post.url}`);
      }}
      className="hover:cursor-pointer flex justify-center"
    >
      <img src={post.image} alt="banner_image" className="w-4/5" />
    </div>
  );
}
