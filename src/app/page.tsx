import Link from "next/link";
import "./style/Game.module.css";
import Navigation from "./Component/Navigation";
export default function Home() {
  return (
    <div className="">
        <Navigation/>
      <Link
        href="/Home"
        className="text-black flex justify-center items-center align-middle h-screen "
      >
        <button className="bg-blue-500 text-white px-4 rounded">
          take me to Game loobby
        </button>
      </Link>
    </div>
  );
}
