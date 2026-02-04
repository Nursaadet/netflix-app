"use client";
import { useRouter } from "next/navigation";

//? next.js olmayan route'lar deafult 404 sayfası sunmaktadır. Default 404 sayfasını "not-found.js" ile override edebiliriz
const NotFound = () => {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <img src="/images/404-page-not-found.png" alt="" />
      <button
        onClick={() => router.back()}
        className="text-gray-100 bg-gray-800 hover:bg-gray-950 font-semibold py-2 px-4 rounded shadow mt-4 "
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;