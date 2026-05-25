import { BackspaceIcon } from "@heroicons/react/24/solid";
import React from "react";
import VideoSection from "../components/VideoSection";
import {
  getMovieDetail,
  getMovies,
  getVideoKey,
} from "@/helpers/movieFunctions";
import Link from "next/link";

const MovieDetail = async ({ params: { movieId } }) => {
  // Sayfa verisi çekilirken hata oluşursa uygulamanın tamamen çökmesini engelliyoruz
  let videoKey = null;
  let movieDetails = null;

  try {
    videoKey = await getVideoKey(movieId);
    movieDetails = await getMovieDetail(movieId);
  } catch (error) {
    console.error(`MovieDetail (${movieId}) yüklenirken hata oluştu:`, error);
  }

  if (!movieDetails) {
    return (
      <div className="text-center text-white py-10">Film detayları yüklenemedi.</div>
    );
  }

  const { title } = movieDetails;
  
  return (
    <div className="md:container px-10 mx-auto py-5">
      <h1 className="text-center text-white text-3xl">{title}</h1>
      {videoKey && <VideoSection videoKey={videoKey} />}
      <div className="flex items-center mt-3 md:mt-4 gap-3">
        <Link
          href={"/movies"}
          className="bg-white rounded-md py-1 md:py-2 px-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-neutral-300 transition mt-2"
        >
          <BackspaceIcon className="w-4 md:w-7 text-black mr-1" />
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default MovieDetail;

export async function generateMetadata({ params: { movieId } }) {
  try {
    const movieDetails = await getMovieDetail(movieId);
    return {
      title: movieDetails?.title || "Movie Detail",
      description: movieDetails?.title ? `This is the page of ${movieDetails.title}` : "Movie description",
    };
  } catch (error) {
    return {
      title: "Movie Detail",
    };
  }
}

export async function generateStaticParams() {
  try {
    // Tüm istekleri paralel olarak atıyoruz
    const [movies1, movies2, movies3, movies4] = await Promise.all([
      getMovies("now_playing").catch(() => []),
      getMovies("popular").catch(() => []),
      getMovies("top_rated").catch(() => []),
      getMovies("upcoming").catch(() => []),
    ]);

    // Gelen verilerin dizi (array) olduğundan emin oluyoruz, null/undefined ise boş dizi kabul ediyoruz
    const allMovies = [
      ...(Array.isArray(movies1) ? movies1 : []),
      ...(Array.isArray(movies2) ? movies2 : []),
      ...(Array.isArray(movies3) ? movies3 : []),
      ...(Array.isArray(movies4) ? movies4 : []),
    ];

    // Eğer hiçbir film dönmediyse build'ın çökmesini engellemek için boş array dönüyoruz
    if (allMovies.length === 0) {
      console.warn("generateStaticParams: Hiçbir film verisi çekilemedi. Çevre değişkenlerini kontrol edin!");
      return [];
    }

    // movie.id değerinin varlığını kontrol ederek map'liyoruz
    return allMovies
      .filter(movie => movie && movie.id)
      .map((movie) => ({
        movieId: movie.id.toString(),
      }));

  } catch (error) {
    console.error("generateStaticParams genel hata:", error);
    return []; // Hata durumunda build'ın durmaması için boş array dönüyoruz
  }
}