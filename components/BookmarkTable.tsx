import { useState } from "react";

interface Props {
    tags: string[]
    bookmarks: Object | null
    setBookmarks: React.Dispatch<React.SetStateAction<Object[]>>
    isSignedIn: boolean
};

const BookmarkTable = ({ tags, bookmarks, setBookmarks, isSignedIn } : Props) => {
    const [activeTag, setActiveTag] = useState<String>(tags?.[0]);

    const capitalize = (str: string): string => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };
    
    return (
        <div className={`bg-[#543A14] bg-opacity-50 rounded-md border border-[#543A14] w-full p-3 md:p-5`} style={{ backdropFilter: 'blur(10px)', filter: 'brightness(70%)' }}>
            {!isSignedIn ?
                <p>No User Found</p>
            :
            tags.length === 0 ?
                <p>Add a Bookmark to see magic!!</p>
            :
                <>
                    {/* Tabs Component */}
                    <ul className="flex text-sm md:text-md font-medium text-center border-b border-[#F0BB78] overflow-scroll">
                        {tags.map((tag, index) => 
                            <li key={index+tag+'#'} className="me-2">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTag(tag);
                                    }}
                                    className={`inline-block p-4 text-[#F0BB78] rounded-t-lg ${activeTag === tag ? 'bg-[#543A14]' : ''} hover:bg-[#543A14] hover:opacity-80`}
                                >
                                    {capitalize(tag)}
                                </button>
                            </li>
                        )}
                    </ul>

                    {/* Table Component */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-sm text-left rtl:text-right">
                            <thead className="w-full text-xs uppercase bg-[#543A14] bg-opacity-70 text-[#F0BB78]">
                                <tr>
                                    <th scope="col" className="p-3 text-center w-[5%]"></th>
                                    <th scope="col" className="p-3 text-left w-[25%]">Link</th>
                                    <th scope="col" className="p-3 text-center w-[25%]">Title</th>
                                    <th scope="col" className="p-3 text-center w-[25%]">Tags</th>
                                    <th scope="col" className="p-3 text-center w-[20%]">Actions</th>
                                </tr>
                            </thead>
                            {/* <tbody>
                                {bookmarks && bookmarks[activeTag as keyof typeof bookmarks]?.length > 0 && bookmarks[activeTag as keyof typeof bookmarks]?.map((bookmark, index) =>
                                    <tr key={bookmark.link+index} className={`w-full ${(index+1 === bookmarks[activeTag as keyof typeof bookmarks]?.length) ? '' : 'border-b border-[#F0BB78] border-opacity-30'}`}>
                                        <td className="p-3 text-center w-[5%]">{index + 1}</td>
                                        <td className="p-3 w-[25%] break-all"><a href={bookmark.link} className="text-left underline hover:text-[#F0BB78] cursor-pointer break-all" target="_blank">{bookmark.link}</a></td>
                                        <td className="p-3 text-center w-[25%] break-words">{bookmark.title}</td>
                                        <td className="p-3 w-[25%]">
                                            <div className="flex flex-wrap gap-1 justify-center">
                                                {bookmark.tags.map((tag, i) => (
                                                    <div key={i+tag+'('} className="bg-[#543A14] px-2 py-1 rounded-md text-[#F0BB78]">
                                                        {capitalize(tag)}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-3 w-[20%]">
                                            <div className="flex items-center justify-center gap-5 h-full">
                                                <button className="flex items-center justify-center">
                                                    <svg viewBox="0 0 24 24" className="w-5 fill-[#F0BB78]">
                                                        <path d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/>
                                                    </svg>
                                                </button>
                                                <button className="flex items-center justify-center">
                                                    <svg viewBox="0 0 24 24" className="w-5 fill-red-500">
                                                    <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody> */}
                        </table>
                    </div>
                </>
            }
        </div>
    )
}

export default BookmarkTable
