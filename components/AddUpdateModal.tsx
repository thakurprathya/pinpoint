import { useEffect, useState } from "react"
import { getEncryptedItem, setEncryptedItem } from "../lib/encryption"

interface Bookmark {
    _id: string;
    user: string;
    link: string;
    title: string;
    description?: string;
    favicon?: string;
    tags: string[];
    createdAt?: Date;
    updatedAt?: Date;
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
    bookmarkToUpdate: Bookmark | null;
    pageWidth: number;
};

const AddUpdateModal = ({ tags, setTags, bookmarks, setBookmarks, setAddModal, bookmarkToUpdate, pageWidth } : Props) => {
    const [isModalHovered, setIsModalHovered] = useState<boolean>(false);
    const [isRequestSuccess, setIsRequestSuccess] = useState<boolean>(true);
    const [linkTags, setLinkTags] = useState<string[]>([]);
    const [link, setLink] = useState<string>('');
    const [tag, setTag] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [inputFocused, setInputFocused] = useState<boolean>(false);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState<boolean>(false);
    const [suggestionsHovered, setSuggestionsHovered] = useState<boolean>(false);

    const filteredSuggestions = tags.filter(suggestion => 
        tag === '' || suggestion.toLowerCase().includes(tag.toLowerCase())
    );

    useEffect(() => {
        setSelectedIndex(-1);
    }, [tag]);

    const setDefaultStates = () => {
        setIsModalHovered(false);
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

    const HandleAddTag = (newTag: string) => {
        if (!linkTags.includes(newTag.trim().toLowerCase())) {
            setLinkTags(prev => [...prev, newTag.trim().toLowerCase()]);
        }
        setTag('');
        setSelectedIndex(-1);
        setInputFocused(false);
        setIsSuggestionsVisible(false);
        document.getElementById('tag-input')?.blur(); 
    };

    const ShouldRemoveTag = (tag: string, updatedBookmarks: BookmarkMap) => {
        if (!updatedBookmarks[tag]) return true;
        return updatedBookmarks[tag].length === 0;
    };

    const HandleModalSave = async () => {
        if(link === ""){
            alert('Link is required!!!');
            return;
        }
        if(linkTags.length === 0){
            alert('Atleast One tag is required!!!');
            return;
        }

        const userObj = getEncryptedItem('user');
        setIsRequestSuccess(false);
        try {
            const endpoint = bookmarkToUpdate 
                ? '/api/bookmarks/updateBookmark'
                : '/api/bookmarks/createBookmark';
                
            const method = bookmarkToUpdate ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userObj?._id,
                    bookmarkId: bookmarkToUpdate?._id,
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

            const bookmark = await response.json();
            
            // Update bookmarks state
            const updatedBookmarks = { ...(bookmarks || {}) };
            const tagsToRemove: string[] = [];
            
            // If updating, remove old bookmark and check for unused tags
            if (bookmarkToUpdate) {
                bookmarkToUpdate.tags.forEach(tag => {
                    if (updatedBookmarks[tag]) {
                        updatedBookmarks[tag] = updatedBookmarks[tag].filter(
                            b => b._id !== bookmarkToUpdate._id
                        );
                        // Check if this tag should be removed after filtering
                        if (ShouldRemoveTag(tag, updatedBookmarks)) {
                            delete updatedBookmarks[tag];
                            tagsToRemove.push(tag);
                        }
                    }
                });
            }

            // Add new/updated bookmark
            linkTags.forEach(tag => {
                if (!updatedBookmarks[tag]) {
                    updatedBookmarks[tag] = [];
                }
                updatedBookmarks[tag].push({
                    ...bookmark,
                    tags: linkTags
                });
            });

            // Update both states
            let updatedTags = tags.filter(t => !tagsToRemove.includes(t));
            
            // Add any new tags
            const newTags = linkTags.filter(tag => !updatedTags.includes(tag));
            updatedTags = [...updatedTags, ...newTags];

            setBookmarks(updatedBookmarks);
            setEncryptedItem('bookmarks', updatedBookmarks);
            
            setTags(updatedTags);
            setEncryptedItem('tags', updatedTags);
            
            setDefaultStates();
            setAddModal(false);
        } catch (err) {
            console.error('Error saving bookmark:', err);
            alert('Failed to save bookmark');
        } finally {
            setIsRequestSuccess(true)
        }
    }

    const HandleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const suggestions = tags.filter(suggestion => 
            tag === '' || suggestion.toLowerCase().includes(tag.toLowerCase())
        );

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setIsSuggestionsVisible(true);
            setInputFocused(false);
            setSelectedIndex(prev => {
                const nextIndex = prev < suggestions.length - 1 ? prev + 1 : prev;
                ScrollToItem(nextIndex);
                return nextIndex;
            });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setInputFocused(false);
            setSelectedIndex(prev => {
                const nextIndex = prev > 0 ? prev - 1 : 0;
                ScrollToItem(nextIndex);
                return nextIndex;
            });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                HandleAddTag(suggestions[selectedIndex]);
            } else if (tag.trim()) {
                HandleAddTag(tag);
            }
        } else {
            setInputFocused(true);
        }
    };

    const ScrollToItem = (index: number) => {
        const element = document.getElementById(`suggestion-${index}`);
        if (element) {
            element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    };

    const HandleSuggestionClick = (suggestion: string) => {
        HandleAddTag(suggestion);
        setSelectedIndex(-1);
        setSuggestionsHovered(false);
    };

    useEffect(() => {
        if (bookmarkToUpdate) {
            setLink(bookmarkToUpdate.link);
            setTitle(bookmarkToUpdate.title);
            setLinkTags(bookmarkToUpdate.tags);
        }
    }, [bookmarkToUpdate]);

    useEffect(()=>{
        if(pageWidth <= 768){
            setIsModalHovered(true);
        }
    },[pageWidth]);

    if(!isRequestSuccess) {
        return (
            <div className="z-40 bg-opacity-70 bg-black fixed top-0 left-0 flex items-center justify-center w-[100%] h-[100%]">
                <iframe src="/loader.html" className="w-20 h-20"></iframe>
            </div>
        );
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
                <h2 className="text-[#F0BB78] text-lg md:text-2xl">
                    {bookmarkToUpdate ? 'Update Bookmark' : 'Add Bookmark'}
                </h2>
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
                        id="tag-input"
                        type="text"
                        className={`bg-[#543A14] outline-none rounded-md p-2 px-4 text-sm md:text-md w-[300px] ${
                            inputFocused ? 'cursor-text' : 'cursor-default'
                        }`}
                        placeholder="Add Tags"
                        value={tag}
                        onChange={(e) => {
                            setTag(e.target.value);
                            setSelectedIndex(-1);
                            setIsSuggestionsVisible(true);
                        }}
                        onFocus={() => {
                            setInputFocused(true);
                            setIsSuggestionsVisible(true);
                        }}
                        onBlur={() => {
                            setTimeout(() => {
                                if (!suggestionsHovered) {
                                    setInputFocused(false);
                                    setIsSuggestionsVisible(false);
                                }
                            }, 100);
                        }}
                        onKeyDown={HandleKeyDown}
                    />
                    {isSuggestionsVisible && tags.length > 0 && (
                        <div 
                            className="absolute z-30 w-full bg-[#543A14] mt-1 rounded-md max-h-[10rem] overflow-y-auto border-[#F0BB78] border"
                            onMouseEnter={() => setSuggestionsHovered(true)}
                            onMouseLeave={() => setSuggestionsHovered(false)}
                        >
                            {filteredSuggestions.map((suggestion, index) => (
                                <div 
                                    id={`suggestion-${index}`}
                                    key={index+suggestion+'.'}
                                    className={`p-2 cursor-pointer transition-colors hover:bg-[#F0BB78] hover:text-[#2D1810] ${
                                        index === selectedIndex 
                                            ? 'bg-[#F0BB78] text-[#2D1810]' 
                                            : 'bg-[#543A14] text-[#F0BB78]'
                                    }`}
                                    onClick={() => HandleSuggestionClick(suggestion)}
                                >
                                    {capitalize(suggestion)}
                                </div>
                            ))}
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

export default AddUpdateModal;