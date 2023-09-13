import Header from "./Header";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />

      <main className="relative my-10 flex h-full justify-center ">
        {children}
      </main>
    </>
  );
};

export default PageLayout;
