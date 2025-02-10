import { Navbar,NavbarBrand, 
    NavbarContent, 
    NavbarItem, 
} from "@nextui-org/navbar";
import Link from "next/link";



export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function App() {
  return (
  <div className="bar">
    <Navbar className="nb">     
      <NavbarBrand>
        <p className="ml-1 pb-2 mt-1 text-lg font-bold text-inherit">Auto-Bot</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem className="nvcontent" isActive>
          <Link color="foreground" href="/chat">
            Chat
          </Link>
        </NavbarItem>
        <NavbarItem className="nvcontent" isActive>
          <Link color="foreground" href="/vision">
            Image
          </Link>
        </NavbarItem>
        <NavbarItem className="nvcontent">
          <Link aria-current="page" href="#">
            Tools
          </Link>
        </NavbarItem>
        <NavbarItem className="nvcontent">
          <Link aria-current="page" href="/">
            API
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    </div>
  

  );
}
