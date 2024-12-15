"use client"
import { useState } from "react";
import AddModal from "../components/AddModal";

const Home = () => {
    const [isBtnHovered, setIsBtnHovered] = useState<boolean>(false);
    const [addModal, setAddModal] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    return (
        <div className="h-[100vh] flex flex-col items-center p-5 md:p-10">
            {addModal ? <AddModal suggestions={suggestions} setSuggestions={setSuggestions} setAddModal={setAddModal}/> : <></>}
            <div className="flex flex-col items-center gap-2 mt-[7rem]">
                <h1 className="text-[#F0BB78] font-semibold text-2xl md:text-3xl text-center">Centralized Link Management</h1>
                <p className="text-left w-[90%] text-[12px] md:text-[14px] md:w-auto">Organize and maintain your bookmarks efficiently with easy-to-use tools for saving, categorizing, and accessing your favorite websites.</p>
            </div>

            <div className="mt-[3rem] md:mt-[5rem] flex flex-col items-center gap-[5rem] w-[90%] md:w-[70%]">
                <button
                onMouseEnter={() => setIsBtnHovered(true)} 
                onMouseLeave={() => setIsBtnHovered(false)} 
                onClick={() => setAddModal(true)}
                className="flex items-center gap-2 rounded-lg p-4 md:p-5 hover:bg-[#F0BB78] transition-colors duration-200"
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" className={`w-7 ${isBtnHovered ? 'fill-[#543A14]' : 'fill-[#F0BB78]'} transition-colors duration-200`} >
                        <path d="M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 110-20 10 10 0 010 20z" />
                    </svg>
                    <p className={`text-[12px] md:text-lg ${isBtnHovered ? 'text-[#131010]' : 'text-[#F0BB78]'} transition-colors duration-200`}>Add Bookmark</p>
                </button>
            </div>
        </div>
    )
}

export default Home;
