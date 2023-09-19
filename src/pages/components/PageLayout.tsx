import Header from "./Header";
import HexagonGrid from "./HexagonGrid";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="h-full w-full">
      <Header />

      <main className=" my-10 flex h-full justify-center">{children}</main>
      {/* <HexagonGrid>
      </HexagonGrid> */}
    </div>
  );
};

export default PageLayout;
