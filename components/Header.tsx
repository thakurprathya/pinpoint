import Link from "next/link";

const Header = () => {
    return (
        <header className="fixed top-2 mx-auto w-full body-font z-20">
            <div className="bg-[#543A14] bg-opacity-50 container mx-auto w-[85%] flex flex-wrap p-5 px-10 rounded-[2rem] flex-col md:flex-row items-center"
                style={{ backdropFilter: 'blur(10px)', filter: 'brightness(70%)' }}>
                <Link href="/"
                    className="flex title-font font-medium items-center md:mb-0 cursor-pointer">
                    <img src="/favicon.svg" alt="logo" className="w-12" />
                    <span className="ml-3 text-xl">PinPoint</span>
                </Link>
                {/* <nav
                    className="hidden md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 md:flex flex-wrap items-center text-base justify-center">
                    <a href="#" className="md:mr-5 hover:text-[#76ABAE] cursor-pointer scroll-link">
                        Upload
                    </a>
                </nav> */}
            </div>
        </header>
    )
}

export default Header;
