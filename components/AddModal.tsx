import { useState } from "react"
import { getEncryptedItem, setEncryptedItem } from "../lib/encryption"

interface Bookmark {
    link: string;
    title: string;
    tags: string[];
}

interface BookmarkMap {
    [key: string]: Bookmark[];
}

interface Props {
    tags: string[]
    setTags: React.Dispatch<React.SetStateAction<string[]>>
    bookmarks: BookmarkMap | null
    setBookmarks: React.Dispatch<React.SetStateAction<BookmarkMap | null>>
    setAddModal: React.Dispatch<React.SetStateAction<boolean>>
};

const AddModal = ({ tags, setTags, bookmarks, setBookmarks, setAddModal } : Props) => {
    const [isModalHovered, setIsModalHovered] = useState(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [linkTags, setLinkTags] = useState<string[]>([]);
    const [link, setLink] = useState<string>('');
    const [tag, setTag] = useState<string>('');
    const [title, setTitle] = useState<string>('');

    const setDefaultStates = () => {
        setIsModalHovered(false);
        setIsFocused(false);
        setLink('');
        setTitle('');
        setTag('');
        setLinkTags([]);
    }

    const capitalize = (str: string): string => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const HandleModalClose = () =>{
        setDefaultStates();
        setAddModal(false);
    }

    const HandleModalSave = async () =>{
        if(link === ""){
            alert('Link is required!!!');
            return;
        }
        if(linkTags.length === 0) setLinkTags(["General"]);

        const userObj = getEncryptedItem('user');

        const response = await fetch('/api/bookmarks/createBookmark', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userObj?._id,
                link,
                title,
                tags: linkTags
            })
        });

        if (!response.ok) {
            const error = await response.text();
            alert(error);
            return;
        }

        // First, filter out any duplicate tags
        const newTags = linkTags.filter(tag => !tags.includes(tag));
        const updatedTags = [...tags, ...newTags];
        setTags(updatedTags);
        setEncryptedItem('tags', updatedTags);

        const bookmark = await response.json();
        const newBookmark = {
            ...bookmark,
            tags: [...linkTags]
        };

        // Update bookmarks state
        const updatedBookmarks = bookmarks ? { ...bookmarks } : {};
        linkTags.forEach(tag => {
            if (!updatedBookmarks[tag]) updatedBookmarks[tag] = [];
            updatedBookmarks[tag].push(newBookmark);
        });

        console.log(updatedBookmarks)
        
        setBookmarks(updatedBookmarks);
        setEncryptedItem('bookmarks', updatedBookmarks);

        setDefaultStates();
        setAddModal(false);
    }

    return (
        <div 
        onClick={() => !isModalHovered && setAddModal(false)}
        className="z-20 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            {/* Input Component */}
            <div
            onMouseEnter={() => setIsModalHovered(true)} 
            onMouseLeave={() => setIsModalHovered(false)} 
            className="p-5 md:p-7 rounded-lg bg-[#2D1810] flex flex-col gap-4"
            >
                <h2 className="text-[#F0BB78] text-lg md:text-2xl">Add Bookmark</h2>
                <input
                    type="text"
                    className="bg-[#543A14] outline-none rounded-md p-2 px-4 text-sm md:text-md w-[300px]"
                    placeholder="Enter Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                <input
                    type="text"
                    className="bg-[#543A14] outline-none rounded-md p-2 px-4 text-sm md:text-md w-[300px]"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="relative">
                    <input
                        type="text"
                        className="bg-[#543A14] outline-none rounded-md p-2 px-4 text-sm md:text-md w-[300px]"
                        placeholder="Add Tags"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={(e) => setTimeout(() => setIsFocused(false), 200)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && tag.trim()) {
                                if(!linkTags.includes(tag.trim())) setLinkTags([...linkTags, tag.trim()]);
                                setTag('');
                                (e.target as HTMLInputElement).blur();
                                setIsFocused(false);
                            }
                        }}
                    />
                    {isFocused && tags.length > 0 && (
                        <div className={`absolute z-30 w-full bg-[#543A14] mt-1 rounded-md max-h-[10rem] overflow-y-auto ${tags.length > 0 ? 'border-[#F0BB78] border' : ''}`}>
                            {tags
                                .filter(suggestion => tag === '' || suggestion.toLowerCase().includes(tag.toLowerCase()))
                                .map((suggestion, index) => (
                                    <div 
                                        key={index+suggestion+'.'}
                                        className="p-2 hover:bg-[#644824] cursor-pointer"
                                        onClick={() => {
                                            if(!linkTags.includes(suggestion)) setLinkTags([...linkTags, suggestion]);
                                            setTag('');
                                            setIsFocused(false);
                                        }}
                                    >
                                        {capitalize(suggestion)}
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>
                <hr className="w-full border border-[#F0BB78]"/>

                <div className="flex flex-col items-start gap-4">
                    <div className="w-full max-w-[300px] flex flex-wrap gap-2">
                        <p className="text-[#F0BB78]">Link:</p>
                        <p className="break-all">{link}</p>
                    </div>
                    <div className="w-full max-w-[300px] flex flex-wrap gap-2">
                        <p className="text-[#F0BB78]">Title:</p>
                        <p className="break-all">{title}</p>
                    </div>
                    <div className="w-full max-w-[300px] flex flex-wrap gap-2">
                        <p className="text-[#F0BB78]">Tags:</p>
                        {linkTags.length > 0 && linkTags.map((tag, index) =>
                            <div 
                            key={index+tag+'*'}
                            className="text-sm p-1 pl-2 rounded-md bg-[#F0BB78] text-[#543A14] flex items-center gap-2"
                            >
                                <p>{capitalize(tag)}</p>
                                <button onClick={() => setLinkTags(linkTags.filter(t => t !== tag))}>
                                    <svg  viewBox="0 0 24 24"  fill="currentColor" className="w-5">
                                        <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12z" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <hr className="w-full border border-[#F0BB78]"/>

                {/* Buttons */}
                <div className="flex justify-between items-center">
                    <button className="w-[45%] p-3 px-5 bg-[#FFF0DC] text-[#543A14] hover:bg-[#F0BB78] rounded-md" onClick={HandleModalSave}>Save</button>
                    <button className="w-[45%] p-3 px-5 bg-[#FFF0DC] text-[#543A14] hover:bg-[#F0BB78] rounded-md" onClick={HandleModalClose}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default AddModal
