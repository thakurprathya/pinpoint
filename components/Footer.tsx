import Link from "next/link";

const Footer = () => {
    return (
        <footer className="w-full bg-[#543A14] bg-opacity-50" style={{ backdropFilter: 'blur(10px)', filter: 'brightness(70%)' }}>
            <div className="container px-10 py-8 mx-auto flex items-center sm:flex-row flex-col">
                <Link href="/" className="flex title-font font-medium items-center md:justify-start justify-center cursor-pointer">
                    <img src="/favicon.svg" alt="logo" className="w-12" />
                    <span className="ml-3 text-xl">PinPoint</span>
                </Link>
                <p className="text-sm sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2024 PinPoint —
                    <a href="https://github.com/thakurprathya" className="text-[#F0BB78] ml-1" rel="noopener noreferrer" target="_blank">@thakurprathya</a>
                </p>
            </div>
        </footer>
    )
}

export default Footer;
