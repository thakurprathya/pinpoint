import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from "next/link";

const Header = () => {
    return (
        <header className="fixed top-2 mx-auto w-full body-font z-20">
            <div className="bg-[#543A14] bg-opacity-50 container mx-auto w-[85%] flex flex-wrap p-5 px-10 rounded-[2rem] items-center justify-between"
                style={{ backdropFilter: 'blur(10px)', filter: 'brightness(70%)' }}>
                <Link href="/"
                    className="flex title-font font-medium items-center md:mb-0 cursor-pointer">
                    <img src="/favicon.svg" alt="logo" className="w-12" />
                    <span className="ml-3 text-xl">PinPoint</span>
                </Link>

                <div className='flex items-center justify-center'>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="inline-flex items-center bg-[#F0BB78] border-0 py-2 px-4 text-[#543A14] focus:outline-none hover:bg-[#d4a469] rounded-lg">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </header>
    )
}

export default Header;
