import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const Home = () => {
  const user = useUser();

  return (
    <div className="h-full w-full text-center md:max-w-6xl">
      <section className="flex flex-col justify-center align-middle ">
        <h1 className="flex flex-wrap items-center justify-center text-center text-6xl">
          <span className="font-bold text-white sm:text-xl md:text-4xl">
            Welcome to{" "}
          </span>
          <span className="animate-bg ml-4 rounded-md bg-purple-800 p-3 font-bold text-yellow-400 transition-all">
            VibeSplit:
          </span>
        </h1>
        <h1 className="text-center sm:text-xl md:text-4xl">
          where every song finds its{" "}
          <span className="font-bold text-yellow-400">home</span>
          <br />
          through the power of{" "}
          <span className="font-bold text-yellow-400">AI</span>.
        </h1>
      </section>
      <section className="mt-12">
        <div className="grid grid-flow-row grid-cols-4 grid-rows-2 text-center align-middle">
          <p className="flex items-center self-center sm:col-span-2 sm:text-2xl md:col-span-3 md:text-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget
            egestas. Aliquet enim tortor at auctor urna nunc id. Cum sociis
            natoque penatibus et magnis dis parturient montes nascetur.
          </p>
          <div className="sm:col-span-2 md:col-span-1">
            <Image
              className="hexagon h-full w-full"
              src={"/phoneScreen.png"}
              layout="responsive"
              alt="test_image"
              width={200}
              height={200}
            />
          </div>
          <div className="sm:col-span-2 md:col-span-1">
            <Image
              className="hexagon h-full w-full"
              src={"/test.png"}
              layout="responsive"
              alt="test_image"
              width={100}
              height={100}
            />
          </div>
          <p className="flex h-full items-center self-center sm:col-span-2 sm:text-2xl md:col-span-3 md:text-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget
            egestas. Aliquet enim tortor at auctor urna nunc id. Cum sociis
            natoque penatibus et magnis dis parturient montes nascetur.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
